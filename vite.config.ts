import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.svg'],
      manifest: {
        name: 'Lighting Tree POS',
        short_name: 'Lighting Tree',
        description: 'Point of Sale & Partner Ledger for Lighting Tree, Thanamalwila',
        theme_color: '#166443',
        background_color: '#0f402d',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/favicon.svg',
            sizes: '48x48 72x72 96x96 128x128 256x256',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'node',
  }
} as any)
