import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Arvancloud Challenge",
  description: "Blog management dashboard — Arvancloud Frontend Challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
