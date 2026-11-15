import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/shell/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChronicleDeck",
  description: "A narrative intelligence studio: typed, versioned canon with evidence-backed lint.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-x-hidden p-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
