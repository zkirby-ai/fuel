import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fuel',
    short_name: 'Fuel',
    description: 'A protein-forward food logger built for fast daily use.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f3ee',
    theme_color: '#f6f3ee',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
