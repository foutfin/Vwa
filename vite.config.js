import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({ registerType: 'autoUpdate' ,
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    },
    manifest: {
      name: 'Vwa',
      short_name: 'Vwa',
      description: 'Extracts Video Streams',
      icons: [
        {
          src: 'vite.svg',
          sizes: '192x192',
          type: 'image/svg'
        },
        {
          src: 'vite.svg',
          sizes: '512x512',
          type: 'image/scg'
        }
      ]

  }})
  ],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg','@ffmpeg/util']
  }
})
