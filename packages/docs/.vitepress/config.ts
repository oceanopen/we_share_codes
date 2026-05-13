import path from 'node:path';
import process from 'node:process';

import { withPwa } from '@vite-pwa/vitepress';
import { defineConfig } from 'vitepress';
import { navbar, sidebar } from './configs';
import { pwa } from './pwa';

const BASE_URL = process.env.BASE_URL ? `${process.env.BASE_URL}` : '/';
console.log('[vitepress.config] BASE_URL:', BASE_URL);

export default withPwa(
  defineConfig({
    pwa: pwa(),

    base: BASE_URL,
    title: 'Docs',
    description: '技术文档',
    lastUpdated: true,
    srcDir: './src',
    outDir: './dist',

    vite: {
      resolve: {
        alias: [],
      },
      build: {
        rollupOptions: {
          external: ['vue/server-renderer'],
        },
        // 是本地搜索方案的固有特征——将全站内容预构建为一个 JS 文件以支持离线搜索，无法通过 manualChunks 拆分。
        // 默认 500KB
        chunkSizeWarningLimit: 2500,
      },
    },

    head: [['link', { rel: 'icon', href: path.resolve(BASE_URL, 'vitepress-logo-mini.svg') }]],

    // https://vitepress.dev/reference/default-theme-config
    themeConfig: {
      logo: '/vitepress-logo-mini.svg',

      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/oceanopen/we_share_codes',
        },
        {
          icon: 'gitee',
          link: 'https://gitee.com/ocean-open/we_share_codes',
        },
      ],

      nav: navbar.zh,
      sidebar: sidebar.zh,

      outline: {
        level: 'deep',
        label: '本页目录',
      },

      search: {
        provider: 'local',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2020-present',
      },
    },

  }),
);
