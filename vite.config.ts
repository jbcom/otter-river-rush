import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/otter-river-rush/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Otter River Rush',
        short_name: 'OtterRush',
        description: 'An endless runner game featuring an adventurous otter',
        theme_color: '#1e3a8a',
        background_color: '#0f172a',
        display: 'standalone',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,mp3,ogg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
