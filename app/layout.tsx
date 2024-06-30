import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'dnd inventory',
  description: 'A customizable inventory management system for D&D campaigns.',
  metadataBase: new URL('https://dnd-inventory.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
