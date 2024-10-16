import type { Metadata } from "next";
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const font = JetBrains_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixie",
  description: "Just a tasks app...but with strange ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${font.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-w-3xl mx-auto p-4 sm:pt-20 h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
