import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import '@/styles/tokens.css';
import siteConfig from '@/config/site';

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
  axes: ['wdth'],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className={archivo.className}>{children}</body>
    </html>
  );
}
