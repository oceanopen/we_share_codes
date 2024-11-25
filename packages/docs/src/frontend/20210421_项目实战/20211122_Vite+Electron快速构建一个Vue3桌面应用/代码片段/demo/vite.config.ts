import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: path.resolve(__dirname, './dist/'),
    plugins: [vue()],
});
