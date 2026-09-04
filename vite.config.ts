import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: true,
    allowedHosts: ['ner-landslide-monitor-pj1l.onrender.com', '.onrender.com'],
  },
  server: {
    host: true,
    allowedHosts: ['ner-landslide-monitor-pj1l.onrender.com', '.onrender.com'],
  },
});