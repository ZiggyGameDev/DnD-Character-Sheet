import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs/site',
    emptyOutDir: true,
  },
  plugins: [react()],
});
