import type { MetadataRoute } from 'next';
import siteConfig from '@/config/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.canonicalUrl.endsWith('/')
    ? siteConfig.canonicalUrl.slice(0, -1)
    : siteConfig.canonicalUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/styleguide/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot'],
        allow: '/',
      },
      {
        // Generative AI and Answer Engines (GEO - Generative Engine Optimization)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'cohere-ai',
        ],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
