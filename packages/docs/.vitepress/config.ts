import process from 'node:process';

import { defineConfig } from 'vitepress';
import { navbar, sidebar } from './configs';

const BASE_URL = process.env.BASE ? `/${process.env.BASE}/` : '/';

export default defineConfig({
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
    },

    head: [['link', { rel: 'icon', href: `/vitepress-logo-mini.svg` }]],

    // https://vitepress.dev/reference/default-theme-config
    themeConfig: {
        logo: '/vitepress-logo-mini.svg',
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

});
