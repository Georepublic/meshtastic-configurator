import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/meshtastic-configurator/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  }
});
