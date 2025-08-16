import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: process.env.APP_NAME ?? "Our Cute Journal",
  description: "A private, adorable journal for two ♥",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>
        <header className="bg-candy-cream/80 backdrop-blur sticky top-0 z-10 border-b">
          <div className="container-cute flex items-center justify-between py-3">
            <Link href="/" className="text-xl font-bold">
              🐻🍓 {process.env.APP_NAME ?? "Our Cute Journal"}
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/timeline" className="hover:underline">Timeline</Link>
              <Link href="/moments/new" className="hover:underline">Add Moment</Link>
              <Link href="/setup" className="hover:underline">Setup</Link>
            </nav>
          </div>
        </header>
        <main className="container-cute py-6">{children}</main>
        <footer className="container-cute py-10 text-center text-xs text-gray-500">
          Made with ♥ just for us.
        </footer>
      </body>
    </html>
  );
}
