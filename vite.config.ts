import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: true, // Allows all external hosts (including Render)
    host: true,
    port: 4173,
  },
  server: {
    allowedHosts: true,
    host: true,
  },
});