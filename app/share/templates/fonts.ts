import { Archivo, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

// Fonts only used by the share templates, so they load on the share page only
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const SHARE_FONT_VARIABLES = `${archivo.variable} ${jetbrainsMono.variable} ${bricolage.variable}`;
