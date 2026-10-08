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
  metadataBase: new URL(siteConfig.url.endsWith('/') ? siteConfig.url : `${siteConfig.url}/`),
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: `${siteConfig.basePath}/media/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Bakhtiar Abid Laskar | Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.basePath}/media/og-image.png`],
  },
  icons: {
    icon: [
      { url: `${siteConfig.basePath}/favicon.ico` },
      { url: `${siteConfig.basePath}/icon.svg`, type: 'image/svg+xml' },
    ],
    apple: [
      { url: `${siteConfig.basePath}/apple-touch-icon.png` },
    ],
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: 'Full-Stack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'University of Science and Technology Meghalaya',
  },
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={archivo.className}>{children}</body>
    </html>
  );
}
