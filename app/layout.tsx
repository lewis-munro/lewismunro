import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: "Lewis Munro",
    template: "%s — Lewis Munro",
  },
  description:
    "Lewis Munro is a fashion stylist and consultant, based in London, working internationally with a diverse client base spanning across editorial, commercial, and celebrity projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
