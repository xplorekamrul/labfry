import NavBar from "@/components/Navbar";
import "./globals.css";
import { Providers } from "@/store";
export const metadata = { title: "Labfry Auth" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <NavBar/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
