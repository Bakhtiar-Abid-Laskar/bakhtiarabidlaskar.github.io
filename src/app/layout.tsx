import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/tokens.css';
import siteConfig from '@/config/site';
import projects from '@/content/projects';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: 'rgb(8, 8, 8)',
  colorScheme: 'dark',
};

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: '%s | Bakhtiar Abid Laskar',
  },
  description: siteConfig.description,
  applicationName: 'Bakhtiar Abid Laskar Portfolio',
  authors: [{ name: siteConfig.name, url: siteConfig.canonicalUrl }],
  generator: 'Next.js',
  keywords: siteConfig.keywords,
  referrer: 'origin-when-cross-origin',
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.canonicalUrl),
  alternates: {
    canonical: siteConfig.canonicalUrl,
    languages: {
      'en-US': siteConfig.canonicalUrl,
      'en': siteConfig.canonicalUrl,
      'x-default': siteConfig.canonicalUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.canonicalUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'profile',
    images: [
      {
        url: `${siteConfig.canonicalUrl}media/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Bakhtiar Abid Laskar | Full-Stack Developer & Software Engineer Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@BakhtiarAbid',
    images: [`${siteConfig.canonicalUrl}media/og-image.png`],
  },
  icons: {
    icon: [
      { url: `${siteConfig.basePath}/favicon.ico` },
      { url: `${siteConfig.basePath}/icon.svg`, type: 'image/svg+xml' },
    ],
    apple: [{ url: `${siteConfig.basePath}/apple-touch-icon.png` }],
  },
  verification: {
    google: 'google1f1be3d6683a2066',
  },
  other: {
    'geo.region': siteConfig.geo.region,
    'geo.placename': siteConfig.geo.placename,
    'geo.position': `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    'ICBM': `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
    'profile:first_name': 'Bakhtiar',
    'profile:last_name': 'Laskar',
    'profile:username': 'Bakhtiar-Abid-Laskar',
    'classification': 'Portfolio, Technology, Software Engineering',
    'rating': 'General',
  },
};

const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteConfig.canonicalUrl}#person`,
      name: siteConfig.name,
      givenName: 'Bakhtiar',
      additionalName: 'Abid',
      familyName: 'Laskar',
      alternateName: siteConfig.alternateNames,
      description: siteConfig.description,
      jobTitle: siteConfig.jobTitle,
      url: siteConfig.canonicalUrl,
      image: `${siteConfig.canonicalUrl}media/og-image.png`,
      email: siteConfig.links.email,
      telephone: siteConfig.links.phone,
      gender: 'Male',
      nationality: 'Indian',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Silchar',
        addressRegion: 'Assam',
        addressCountry: 'IN',
      },
      alumniOf: [
        {
          '@type': 'EducationalOrganization',
          name: 'University of Science and Technology Meghalaya',
          sameAs: 'https://www.ustm.ac.in/',
        },
        {
          '@type': 'EducationalOrganization',
          name: 'Narsing HS School Silchar',
        },
        {
          '@type': 'EducationalOrganization',
          name: 'M.A.C. Memorial Academy',
        },
      ],
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        'https://bakhtiar-abid-laskar.github.io/bakhtiarabidlaskar.github.io/',
        'https://bakhtiarabidlaskar.github.io/',
        siteConfig.canonicalUrl,
      ],
      knowsAbout: [
        'Next.js',
        'React',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'HTML5',
        'CSS3',
        'Node.js',
        'Supabase',
        'PostgreSQL',
        'REST APIs',
        'Python',
        'Microsoft Power BI',
        'Expo',
        'React Native',
        'Full-Stack Web Development',
        'Software Architecture',
        'Cloud Deployment',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.canonicalUrl}#website`,
      url: siteConfig.canonicalUrl,
      name: 'Bakhtiar Abid Laskar | Portfolio',
      alternateName: [
        'Bakhtiar Abid Laskar',
        'Bakhtiar Abid',
        'Bakhtiar Laskar',
        'Bakhtiar Portfolio',
        'Bakhtiar Abid Laskar Developer Website',
      ],
      description: siteConfig.description,
      publisher: {
        '@id': `${siteConfig.canonicalUrl}#person`,
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteConfig.canonicalUrl}#profilepage`,
      url: siteConfig.canonicalUrl,
      name: 'Bakhtiar Abid Laskar - Full-Stack Developer & Software Engineer Profile',
      isPartOf: {
        '@id': `${siteConfig.canonicalUrl}#website`,
      },
      mainEntity: {
        '@id': `${siteConfig.canonicalUrl}#person`,
      },
      about: {
        '@id': `${siteConfig.canonicalUrl}#person`,
      },
      primaryImageOfPage: `${siteConfig.canonicalUrl}media/og-image.png`,
    },
    {
      '@type': 'ItemList',
      '@id': `${siteConfig.canonicalUrl}#projects`,
      name: 'Selected Projects by Bakhtiar Abid Laskar',
      description: 'Production web platforms and software engineering systems engineered by Bakhtiar Abid Laskar.',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: project.name,
          description: project.summary,
          applicationCategory: 'WebApplication',
          operatingSystem: 'All',
          author: {
            '@id': `${siteConfig.canonicalUrl}#person`,
          },
          url: project.links.live || project.links.source,
        },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}