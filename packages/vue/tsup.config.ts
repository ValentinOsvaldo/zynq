import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  external: ['vue', 'vue-router'],
  treeshake: true,
  splitting: false,
  noExternal: ['@zynq/core'],
});
