import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { ThemeProvider } from "@/contexts/theme-context";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Invox — Automação de DMs no Instagram",
  description: "Responda DMs automaticamente, qualifique leads e venda 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${manrope.variable} h-full`}>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('invox-theme');if(t==='light')document.documentElement.classList.add('light');})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
