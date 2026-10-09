export interface SiteConfig {
  name: string;
  alternateNames: string[];
  title: string;
  headline: string;
  description: string;
  url: string;
  canonicalUrl: string;
  basePath: string;
  locale: string;
  jobTitle: string;
  alumniOf: string[];
  location: string;
  geo: {
    region: string;
    placename: string;
    latitude: string;
    longitude: string;
  };
  keywords: string[];
  links: {
    github: string;
    linkedin: string;
    email: string;
    phone: string;
  };
}

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
// Normalize basePath so it doesn't end with a trailing slash if non-empty
const basePath = rawBasePath.endsWith('/') ? rawBasePath.slice(0, -1) : rawBasePath;
const canonicalOrigin = process.env.NEXT_PUBLIC_CANONICAL_URL || 'https://www.bakhtiarabidlaskar.tech';
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || canonicalOrigin;

export const siteConfig: SiteConfig = {
  name: 'Bakhtiar Abid Laskar',
  alternateNames: [
    'Bakhtiar Abid',
    'Bakhtiar Laskar',
    'Abid Laskar',
    'Bakhtiar',
    'bakhtiarabidlaskar',
    'Bakhtiar Abid Laskar USTM',
    'Bakhtiar Abid Laskar Developer',
    'Bakhtiar Abid Laskar Portfolio',
  ],
  title: 'Bakhtiar Abid Laskar | Full-Stack Developer & Software Engineer',
  headline: 'I Design. I Engineer. I Deliver.',
  description:
    'Official portfolio of Bakhtiar Abid Laskar (Bakhtiar Abid, Bakhtiar Laskar) — Full-Stack Developer and Computer Science Engineering student building production web applications, cross-platform mobile systems, and scalable digital platforms.',
  url: `${siteOrigin}${basePath}`,
  canonicalUrl: `${canonicalOrigin}/`,
  basePath,
  locale: 'en_US',
  jobTitle: 'Full-Stack Developer & Software Engineer',
  alumniOf: [
    'University of Science and Technology Meghalaya',
    'Narsing HS School Silchar',
    'M.A.C. Memorial Academy',
  ],
  location: 'Silchar, Assam / Ri-Bhoi, Meghalaya, India',
  geo: {
    region: 'IN-AS',
    placename: 'Silchar, Assam / Ri-Bhoi, Meghalaya, India',
    latitude: '24.8333',
    longitude: '92.7789',
  },
  keywords: [
    'Bakhtiar Abid Laskar',
    'Bakhtiar Abid',
    'Bakhtiar Laskar',
    'Abid Laskar',
    'Bakhtiar',
    'bakhtiarabidlaskar',
    'Bakhtiar Abid Laskar portfolio',
    'Bakhtiar Abid Laskar website',
    'Bakhtiar Abid Laskar developer',
    'Bakhtiar Abid Laskar software engineer',
    'Bakhtiar Abid Laskar USTM',
    'Bakhtiar Abid Laskar GitHub',
    'Bakhtiar Abid Laskar LinkedIn',
    'Bakhtiar Abid Laskar resume',
    'Bakhtiar Abid Laskar contact',
    'Full-Stack Developer India',
    'Software Engineer Assam Meghalaya',
    'Next.js Developer India',
    'React TypeScript Developer',
    'University of Science and Technology Meghalaya',
    'USTM Computer Science',
    'Silchar Developer',
    'Assam Web Developer',
    'Avalin Laboratories',
    'Nilakshith Enterprises',
    'South City Hospital',
    'Production Web Applications',
    'React Native Mobile Developer',
  ],
  links: {
    github: 'https://github.com/Bakhtiar-Abid-Laskar',
    linkedin: 'https://www.linkedin.com/in/bakhtiar-abid-laskar/',
    email: 'mailto:bakhtiarabidlaskar1@gmail.com',
    phone: 'tel:+919101607353',
  },
};

export default siteConfig;
