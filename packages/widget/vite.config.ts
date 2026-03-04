import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: 'src/widget.ts',
      name: 'ScreenFlow',
      formats: ['iife'],
      fileName: () => 'screenflow-widget.js',
    },
    outDir: 'dist',
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 100000,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
