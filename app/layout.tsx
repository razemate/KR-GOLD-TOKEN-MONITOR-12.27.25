import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Analytics from "@/components/Analytics";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Gold Token Monitor",
  description: "Katusa Research Market Intelligence Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning className={montserrat.variable}>
        <head>
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }} />
        </head>
      <body className={`${montserrat.className} antialiased overflow-x-hidden transition-colors duration-300 tracking-tight`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
