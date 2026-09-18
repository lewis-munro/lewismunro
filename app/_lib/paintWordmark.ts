import type { PaintBase } from "./fluidReveal";

const stretchKeywords: [number, CanvasFontStretch][] = [
  [50, "ultra-condensed"],
  [62.5, "extra-condensed"],
  [75, "condensed"],
  [87.5, "semi-condensed"],
  [100, "normal"],
  [112.5, "semi-expanded"],
  [125, "expanded"],
  [150, "extra-expanded"],
  [200, "ultra-expanded"],
];

function toStretchKeyword(fontStretch: string) {
  const percent = parseFloat(fontStretch) || 100;
  return stretchKeywords.reduce((closest, candidate) =>
    Math.abs(candidate[0] - percent) < Math.abs(closest[0] - percent) ? candidate : closest,
  )[1];
}

function applyTextTransform(text: string, transform: string) {
  if (transform === "uppercase") return text.toUpperCase();
  if (transform === "lowercase") return text.toLowerCase();
  return text;
}

export function createWordmarkPainter(title: HTMLElement, surface: HTMLElement): PaintBase {
  return async (target, pixelRatio, canvasBounds) => {
    const titleStyle = getComputedStyle(title);
    const stretch = toStretchKeyword(titleStyle.fontStretch);
    const baseSize = parseFloat(titleStyle.fontSize);
    const trackingEm = titleStyle.letterSpacing === "normal" ? 0 : parseFloat(titleStyle.letterSpacing) / baseSize;
    const fontAt = (size: number) =>
      `${titleStyle.fontStyle} ${titleStyle.fontWeight} ${stretch} ${size}px ${titleStyle.fontFamily}`;
    const text = applyTextTransform(title.textContent ?? "", titleStyle.textTransform);

    await document.fonts.load(fontAt(baseSize), text);

    const surfaceBounds = surface.getBoundingClientRect();
    target.width = Math.round(canvasBounds.width * pixelRatio);
    target.height = Math.round(canvasBounds.height * pixelRatio);

    const context = target.getContext("2d");
    if (!context) return;

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      (surfaceBounds.left - canvasBounds.left) * pixelRatio,
      (surfaceBounds.top - canvasBounds.top) * pixelRatio,
    );
    context.fillStyle = getComputedStyle(surface).backgroundColor;
    context.fillRect(0, 0, surfaceBounds.width, surfaceBounds.height);

    context.fontStretch = stretch;
    context.textBaseline = "alphabetic";
    context.textAlign = "center";
    context.fillStyle = titleStyle.color;

    const setSize = (size: number) => {
      context.font = fontAt(size);
      context.letterSpacing = `${trackingEm * size}px`;
    };

    setSize(baseSize);
    const baseInk = context.measureText(text);
    const baseInkWidth = baseInk.actualBoundingBoxLeft + baseInk.actualBoundingBoxRight;
    setSize(baseSize * (surfaceBounds.width / baseInkWidth));

    const ink = context.measureText(text);
    context.fillText(
      text,
      surfaceBounds.width / 2 + (ink.actualBoundingBoxLeft - ink.actualBoundingBoxRight) / 2,
      surfaceBounds.height / 2 + (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2,
    );
  };
}
