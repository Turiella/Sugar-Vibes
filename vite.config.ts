import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Configuración de Vite
export default defineConfig({
  base: './', // Asegura que las rutas sean relativas a la raíz del proyecto
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
    open: true, // Abre automáticamente el navegador
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});