"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function FadeImage({ className = "", alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const markIfComplete = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  };

  return (
    <Image
      {...props}
      alt={alt}
      ref={markIfComplete}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}
