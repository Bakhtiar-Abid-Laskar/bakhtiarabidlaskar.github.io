import type { MetadataRoute } from 'next';
import siteConfig from '@/config/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bakhtiar Abid Laskar | Full-Stack Developer',
    short_name: 'Bakhtiar Abid Laskar',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: 'rgb(8, 8, 8)',
    theme_color: 'rgb(8, 8, 8)',
    icons: [
      {
        src: `${siteConfig.basePath}/favicon.ico`,
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: `${siteConfig.basePath}/icon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: `${siteConfig.basePath}/apple-touch-icon.png`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
