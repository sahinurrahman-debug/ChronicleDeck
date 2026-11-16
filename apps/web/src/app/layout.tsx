import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/shell/footer";
import { Navbar } from "@/components/shell/navbar";
import { THEME_INIT_SCRIPT } from "@/lib/use-theme";
import "./globals.css";

// Two families only: a serif for headings and your story's text, a sans for everything else.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Lora({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ChronicleDeck: write long stories without losing the plot", template: "%s · ChronicleDeck" },
  description:
    "A writing companion that remembers every character, place and rule in your world, and gently flags anything that doesn't fit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary px-5 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
