// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: 'standalone',
  }),
  env: {
    schema: {
      HOST: envField.string({
        context: 'server',
        access: 'public',
        default: 'http://localhost:4321',
      }),
    },
  },
});
