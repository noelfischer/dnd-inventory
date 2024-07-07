import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { ThemeProvider } from "next-themes";
import ToggleDarkMode from './ui/darkmode-toggle';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'dnd inventory',
  description: 'A customizable inventory management system for D&D campaigns.',
  metadataBase: new URL('https://dnd-inventory.vercel.app/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class">
          <ToggleDarkMode />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>

    </html>
  );
}
