import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Arvancloud Challenge",
  description: "Blog management dashboard — Arvancloud Frontend Challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-neutral-bg2 text-neutral-fg1">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
