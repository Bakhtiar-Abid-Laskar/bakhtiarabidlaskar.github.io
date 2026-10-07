import type { MetadataRoute } from 'next';
import siteConfig from '@/config/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.endsWith('/')
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/styleguide/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
