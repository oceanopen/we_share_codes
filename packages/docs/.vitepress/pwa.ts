import type { PwaOptions } from '@vite-pwa/vitepress';

export const pwa: () => PwaOptions = () => {
  return {
    outDir: '../dist', // 输出目录
    registerType: 'autoUpdate', // 注册类型为自动更新
    includeManifestIcons: false, // 不包含清单图标
    workbox: {
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 6, // the default value is 2 MiB.
      // 仅预缓存 app shell，不缓存内容页面和静态资源
      globPatterns: ['assets/**/*.{js,css,woff2}'],
      runtimeCaching: [
        // HTML 页面：网络优先，离线回退缓存
        {
          urlPattern: /\.html$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'html-cache',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // 图片：缓存优先，长期缓存
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // 字体：缓存优先，长期缓存
        {
          urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'font-cache',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // JSON 数据文件：网络优先
        {
          urlPattern: /\.json$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'json-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 3 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    manifest: {
      name: 'Docs PWA',
      short_name: 'Docs PWA',
      theme_color: '#ffffff',
    },
  };
};
