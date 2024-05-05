import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  // external: ['#ui-lib'],
  dts: true,
  clean: true,
});
