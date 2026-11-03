import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';
import fs from 'fs';

function syncPreloadCjs() {
  const src = path.resolve(__dirname, 'electron/preload.cjs');
  const destDir = path.resolve(__dirname, 'dist-electron');
  const destCjs = path.resolve(destDir, 'preload.cjs');
  const destJs = path.resolve(destDir, 'preload.js');
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, destCjs);
      fs.copyFileSync(src, destJs);
    }
  } catch (err) {
    console.error('Failed to sync preload files:', err);
  }
}

// Ensure preload.cjs is in place immediately
syncPreloadCjs();

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-preload-cjs',
      buildStart() {
        syncPreloadCjs();
      },
      closeBundle() {
        syncPreloadCjs();
      },
    },
    electron([
      {
        entry: 'electron/main.ts',
        onstart(options) {
          syncPreloadCjs();
          options.startup();
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
