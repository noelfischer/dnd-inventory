import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster"
import '@/app/ui/global.css';
import { getDictFromParams, Locale } from './dictionaries';
import DictionaryProvider from './DictionaryProvider';


export const metadata: Metadata = {
  title: 'dnd inventory',
  description: 'A customizable inventory management system for D&D campaigns.',
  metadataBase: new URL('https://dnd-inventory.vercel.app/'),
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      }
    ]
  }
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'de' }];
}

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: Locale }> }) {
  const dictionary = await getDictFromParams(params);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-bg/50 dark:bg-dark-bg/70`}>
        <ThemeProvider attribute="class">
          <DictionaryProvider dictionary={dictionary}>
            {children}
          </DictionaryProvider>
          <Toaster />
        </ThemeProvider>
      </body>

    </html>
  );
}
