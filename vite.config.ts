import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'ESNext',
  },
  plugins: [
    react(),
    (monacoEditorPlugin as any).default({
      languageWorkers: ['json', 'editorWorkerService'],
      customWorkers: [
        {
          label: 'graphql',
          entry: 'monaco-graphql/dist/graphql.worker',
        },
      ],
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
