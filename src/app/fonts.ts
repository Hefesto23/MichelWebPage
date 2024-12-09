import localFont from "next/font/local";

export const roboto = localFont({
  src: "../../public/fonts/roboto/Roboto-Regular.ttf",
  variable: "--font-roboto",
  weight: "400",
  style: "normal",
});

export const robotoSlab = localFont({
  src: "../../public/fonts/roboto-slab/RobotoSlab-ExtraBold.ttf",
  style: "normal",
});

export const robotoItalic = localFont({
  src: "../../public/fonts/roboto/Roboto-Italic.ttf",
  variable: "--font-roboto-italic",
  weight: "400",
  style: "italic",
});

export const robotoThin = localFont({
  src: "../../public/fonts/roboto/Roboto-ThinItalic.ttf",
  variable: "--font-roboto-thin",
  weight: "100",
  style: "normal",
});

export const robotoBold = localFont({
  src: "../../public/fonts/roboto/Roboto-Bold.ttf",
  variable: "--font-roboto-bold",
  weight: "700",
  style: "normal",
});

export const caveat = localFont({
  src: "../../public/fonts/caveat/Caveat-Bold.ttf",
  variable: "--font-caveat",
  weight: "400",
  style: "normal",
});
