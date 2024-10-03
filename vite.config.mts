import { defineConfig } from 'vite';

export default defineConfig({
  base: '/meshtastic-configurator/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'  // Use the modern Sass API
      }
    }
  }
});
