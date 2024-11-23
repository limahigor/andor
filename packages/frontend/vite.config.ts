import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      global: 'window',
      'process.env': env,
    },
    resolve: {
      alias: {
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'window',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    css: {
      preprocessorOptions: {
        css: {
          additionalData: '@import "font-awesome/css/font-awesome.min.css";',
        },
      },
    },
    build: {
      rollupOptions: {
        external: ['font-awesome/css/font-awesome.min.css'], // Exclui explicitamente do build
      },
    },
  };
});
