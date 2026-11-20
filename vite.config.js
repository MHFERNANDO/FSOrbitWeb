import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Vendor aparte del codigo del sitio: react/router y gsap/lenis
        // cambian solo al actualizar dependencias, asi que un deploy que
        // toca contenido o estilos no invalida su cache en el navegador.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/ },
            { name: 'scroll', test: /node_modules[\/](gsap|lenis)[\/]/ },
          ],
        },
      },
    },
  },
});
