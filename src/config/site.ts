export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  basePath: string;
  locale: string;
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
const siteOrigin = 'https://bakhtiar-abid-laskar.github.io';

export const siteConfig: SiteConfig = {
  name: 'Bakhtiar Abid Laskar',
  title: 'Bakhtiar Abid Laskar | Developer Portfolio',
  description:
    'Full-stack and software developer building production web platforms, cross-platform mobile systems, and data dashboards.',
  url: `${siteOrigin}${basePath}`,
  basePath,
  locale: 'en',
  links: {
    github: 'https://github.com/Bakhtiar-Abid-Laskar',
    linkedin: 'https://www.linkedin.com/in/bakhtiar-abid-laskar/',
    email: 'mailto:bakhtiarabidlaskar1@gmail.com',
    phone: 'tel:+919101607353',
  },
};

export default siteConfig;
