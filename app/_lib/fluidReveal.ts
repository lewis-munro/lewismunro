import {
  CanvasTexture,
  Color,
  HalfFloatType,
  LinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  NearestFilter,
  NoBlending,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
  type MagnificationTextureFilter,
} from "three";
import {
  advectionFragment,
  divergenceFragment,
  gradientSubtractFragment,
  maskFragment,
  pressureFragment,
  quadVertex,
  splatFragment,
} from "./fluidShaders";

const settings = {
  simResolution: 256,
  dyeResolution: 512,
  velocityDissipation: 0.962,
  dyeDissipation: 0.988,
  scrolledDyeDissipation: 0.97,
  pressureIterations: 20,
  splatRadius: 1.2e-3,
  splatForce: 5900,
  revealSize: 3.9,
  edgeSoftness: 0.5,
  edgeWidth: 0.01,
  rimWidth: 0.3,
  autopilotDye: 0.22,
  autopilotForce: 0.2,
  autopilotRadius: 0.55,
  autopilotSpeed: 1,
  autopilotIdle: 1500,
  autopilotSpanX: 0.45,
  autopilotSpanY: 0.05,
  maxPixelRatio: 2,
  rebakeDelay: 120,
};

export type PaintBase = (target: HTMLCanvasElement, pixelRatio: number, canvasBounds: DOMRect) => Promise<void>;

type FluidRevealOptions = {
  area: HTMLElement;
  canvas: HTMLCanvasElement;
  paintBase: PaintBase;
  rimColor: string;
  revealColor: string;
  autopilot: boolean;
  onReady: () => void;
};

type PingPong = {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
  swap: () => void;
};

function createTarget(size: number, filter: MagnificationTextureFilter) {
  return new WebGLRenderTarget(size, size, {
    minFilter: filter,
    magFilter: filter,
    format: RGBAFormat,
    type: HalfFloatType,
    depthBuffer: false,
    stencilBuffer: false,
  });
}

function createPingPong(size: number, filter: MagnificationTextureFilter): PingPong {
  const pair: PingPong = {
    read: createTarget(size, filter),
    write: createTarget(size, filter),
    swap: () => {
      [pair.read, pair.write] = [pair.write, pair.read];
    },
  };
  return pair;
}

function createPass(fragmentShader: string, uniforms: ShaderMaterial["uniforms"]) {
  return new ShaderMaterial({
    vertexShader: quadVertex,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
}

function createRenderer(canvas: HTMLCanvasElement) {
  try {
    return new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
}

export function createFluidReveal({ area, canvas, paintBase, rimColor, revealColor, autopilot, onReady }: FluidRevealOptions) {
  const renderer = createRenderer(canvas);
  if (!renderer) return null;

  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, settings.maxPixelRatio);
  renderer.setPixelRatio(pixelRatio);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);

  const velocity = createPingPong(settings.simResolution, LinearFilter);
  const dye = createPingPong(settings.dyeResolution, LinearFilter);
  const pressure = createPingPong(settings.simResolution, NearestFilter);
  const divergence = createTarget(settings.simResolution, NearestFilter);

  const simTexel = new Vector2(1 / settings.simResolution, 1 / settings.simResolution);
  const dyeTexel = new Vector2(1 / settings.dyeResolution, 1 / settings.dyeResolution);

  const advection = createPass(advectionFragment, {
    uVelocity: { value: null },
    uSource: { value: null },
    uTexelSize: { value: simTexel },
    uDt: { value: 1 },
    uDissipation: { value: settings.velocityDissipation },
  });
  const splat = createPass(splatFragment, {
    uTarget: { value: null },
    uAspectRatio: { value: 1 },
    uPoint: { value: new Vector2() },
    uColor: { value: new Vector3() },
    uRadius: { value: settings.splatRadius },
  });
  const divergencePass = createPass(divergenceFragment, {
    uVelocity: { value: null },
    uTexelSize: { value: simTexel },
  });
  const pressurePass = createPass(pressureFragment, {
    uPressure: { value: null },
    uDivergence: { value: null },
    uTexelSize: { value: simTexel },
  });
  const gradientSubtract = createPass(gradientSubtractFragment, {
    uPressure: { value: null },
    uVelocity: { value: null },
    uTexelSize: { value: simTexel },
  });

  let baseTexture: CanvasTexture | null = null;

  const mask = new ShaderMaterial({
    vertexShader: quadVertex,
    fragmentShader: maskFragment,
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uBaseTexture: { value: baseTexture },
      uDye: { value: dye.read.texture },
      uRevealSize: { value: settings.revealSize },
      uEdgeSoftness: { value: settings.edgeSoftness },
      uEdgeWidth: { value: settings.edgeWidth },
      uRimWidth: { value: settings.rimWidth },
      uRimColor: { value: new Color().setStyle(rimColor, LinearSRGBColorSpace) },
      uRevealColor: { value: new Color().setStyle(revealColor, LinearSRGBColorSpace) },
    },
  });

  const quad = new Mesh(geometry, mask);
  scene.add(quad);

  const pointer = { x: 0, y: 0, previousX: 0, previousY: 0, moved: false, tracking: false };
  const brush = { x: 0, y: 0, previousX: 0, previousY: 0, started: false };
  const size = { width: 1, height: 1 };

  let disposed = false;
  let ready = false;
  let visible = true;
  let frame = 0;
  let bakeVersion = 0;
  let rebakeTimer: ReturnType<typeof setTimeout> | undefined;
  let lastTouch = -Infinity;

  const renderPass = (material: ShaderMaterial, target: WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
  };

  const bake = async () => {
    const version = ++bakeVersion;
    const target = document.createElement("canvas");
    await paintBase(target, pixelRatio, canvas.getBoundingClientRect());
    if (disposed || version !== bakeVersion) return;

    const nextTexture = new CanvasTexture(target);
    nextTexture.minFilter = LinearFilter;
    nextTexture.magFilter = LinearFilter;
    nextTexture.generateMipmaps = false;
    baseTexture?.dispose();
    baseTexture = nextTexture;
    mask.uniforms.uBaseTexture.value = baseTexture;

    if (!ready) {
      ready = true;
      onReady();
    }
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    size.width = Math.max(1, bounds.width);
    size.height = Math.max(1, bounds.height);
    renderer.setSize(size.width, size.height, false);
  };

  const scheduleRebake = () => {
    clearTimeout(rebakeTimer);
    rebakeTimer = setTimeout(bake, settings.rebakeDelay);
  };

  const scrollFade = () => {
    const bounds = area.getBoundingClientRect();
    return Math.min(1, Math.max(0, -bounds.top / (bounds.height || 1)));
  };

  const addSplat = (
    x: number,
    y: number,
    deltaX: number,
    deltaY: number,
    force: number,
    amount: number,
    radiusScale = 1,
  ) => {
    if (Math.hypot(deltaX, deltaY) === 0 || force <= 0.001) return;

    const areaHeight = area.getBoundingClientRect().height || size.height;
    const areaScale = areaHeight / size.height;
    splat.uniforms.uAspectRatio.value = size.width / size.height;
    splat.uniforms.uRadius.value =
      settings.splatRadius * radiusScale * Math.min(1, size.width / areaHeight) * areaScale * areaScale;
    splat.uniforms.uPoint.value.set(x, y);

    splat.uniforms.uTarget.value = velocity.read.texture;
    splat.uniforms.uColor.value.set(deltaX * settings.splatForce * force, deltaY * settings.splatForce * force, 0);
    renderPass(splat, velocity.write);
    velocity.swap();

    splat.uniforms.uTarget.value = dye.read.texture;
    splat.uniforms.uColor.value.set(amount, amount, amount);
    renderPass(splat, dye.write);
    dye.swap();
  };

  const moveBrush = (time: number) => {
    const areaBounds = area.getBoundingClientRect();
    const canvasBounds = canvas.getBoundingClientRect();
    const phase = (time / 1000) * settings.autopilotSpeed;
    const areaX = 0.5 + settings.autopilotSpanX * Math.sin(phase * 1.1);
    const areaY = 0.5 + settings.autopilotSpanY * Math.sin(phase * 2.3);
    brush.x = (areaBounds.left + areaX * areaBounds.width - canvasBounds.left) / canvasBounds.width;
    brush.y = 1 - (areaBounds.top + areaY * areaBounds.height - canvasBounds.top) / canvasBounds.height;
    if (!brush.started) {
      brush.previousX = brush.x;
      brush.previousY = brush.y;
      brush.started = true;
    }
  };

  const step = (time: number) => {
    const fade = scrollFade();
    const strength = 1 - fade * fade;
    const scrolled = fade * fade;

    if (pointer.moved) {
      addSplat(pointer.x, pointer.y, pointer.x - pointer.previousX, pointer.y - pointer.previousY, strength, strength);
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      pointer.moved = false;
    }

    if (autopilot && time - lastTouch > settings.autopilotIdle) {
      moveBrush(time);
      addSplat(
        brush.x,
        brush.y,
        brush.x - brush.previousX,
        brush.y - brush.previousY,
        strength * settings.autopilotForce,
        strength * settings.autopilotDye,
        settings.autopilotRadius,
      );
      brush.previousX = brush.x;
      brush.previousY = brush.y;
    }

    advection.uniforms.uVelocity.value = velocity.read.texture;
    advection.uniforms.uSource.value = velocity.read.texture;
    advection.uniforms.uTexelSize.value = simTexel;
    advection.uniforms.uDissipation.value = settings.velocityDissipation;
    renderPass(advection, velocity.write);
    velocity.swap();

    advection.uniforms.uVelocity.value = velocity.read.texture;
    advection.uniforms.uSource.value = dye.read.texture;
    advection.uniforms.uTexelSize.value = dyeTexel;
    advection.uniforms.uDissipation.value =
      settings.dyeDissipation + (settings.scrolledDyeDissipation - settings.dyeDissipation) * scrolled;
    renderPass(advection, dye.write);
    dye.swap();

    divergencePass.uniforms.uVelocity.value = velocity.read.texture;
    renderPass(divergencePass, divergence);

    renderer.setRenderTarget(pressure.read);
    renderer.clear();
    pressurePass.uniforms.uDivergence.value = divergence.texture;
    for (let iteration = 0; iteration < settings.pressureIterations; iteration++) {
      pressurePass.uniforms.uPressure.value = pressure.read.texture;
      renderPass(pressurePass, pressure.write);
      pressure.swap();
    }

    gradientSubtract.uniforms.uPressure.value = pressure.read.texture;
    gradientSubtract.uniforms.uVelocity.value = velocity.read.texture;
    renderPass(gradientSubtract, velocity.write);
    velocity.swap();

    mask.uniforms.uDye.value = dye.read.texture;
    renderer.setRenderTarget(null);
    renderer.clear();
    renderPass(mask, null);
  };

  const animate = (time: number) => {
    if (disposed || !visible) return;
    frame = requestAnimationFrame(animate);
    if (ready) step(time);
  };

  const trackPointer = (clientX: number, clientY: number) => {
    const areaBounds = area.getBoundingClientRect();
    const insideArea =
      clientX >= areaBounds.left && clientX <= areaBounds.right && clientY >= areaBounds.top && clientY <= areaBounds.bottom;
    if (!insideArea) {
      pointer.tracking = false;
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    pointer.x = (clientX - bounds.left) / bounds.width;
    pointer.y = 1 - (clientY - bounds.top) / bounds.height;
    if (!pointer.tracking) {
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      pointer.tracking = true;
    }
    pointer.moved = true;
  };

  const onMouseMove = (event: MouseEvent) => trackPointer(event.clientX, event.clientY);
  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    lastTouch = performance.now();
    brush.started = false;
    trackPointer(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => {
    pointer.tracking = false;
  };
  const onResize = () => {
    resize();
    scheduleRebake();
  };

  const resizeObserver = new ResizeObserver(onResize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) frame = requestAnimationFrame(animate);
  });

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  resizeObserver.observe(canvas);
  visibilityObserver.observe(canvas);

  resize();
  bake();
  frame = requestAnimationFrame(animate);

  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(rebakeTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      [velocity, dye, pressure].forEach((pair) => {
        pair.read.dispose();
        pair.write.dispose();
      });
      divergence.dispose();
      geometry.dispose();
      [advection, splat, divergencePass, pressurePass, gradientSubtract, mask].forEach((material) => material.dispose());
      baseTexture?.dispose();
      renderer.dispose();
    },
  };
}
