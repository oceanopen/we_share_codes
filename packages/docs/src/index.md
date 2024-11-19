---
layout: home
title: Docs

hero:
    name: Docs
    tagline: 技术文档
    image:
        src: /vitepress-logo-large.webp
        alt: VitePress
    actions:
        - text: 快速开始
          link: /guide/getting-started.html
          theme: brand
        - text: 项目简介
          link: /guide/
          theme: alt
features:
    - icon: 📝
      title: 深度专业内容
      details: 本网站提供从基础到高级的全面文章，深度解析框架库的生命周期、插件化机制等核心概念。涵盖前端，后台，部署，安全等领域。
    - icon: 🚀
      title: 前瞻性技术探索
      details: 关注最新技术趋势，积极分享 Vue 3、Vite、Gin 等技术的应用和实践。在这里，可以及时获取最新的技术信息，保持技术视野处于行业前沿。
    - icon: 🏹
      title: 优质的用户体验
      details: 本网站致力于提供最佳的用户体验。清晰的分类和标签、丰富的示例代码、详细的解释，以及活跃的社区。
---

<style>
:root {
  /* 标题 */
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  /* 图标背景 */
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}
.VPHero .VPImage.image-src {
  max-width: 180px;
  max-height: 180px;
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }

  .VPHero .VPImage.image-src {
    max-width: 200px;
    max-height: 200px;
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
  .VPHero .VPImage.image-src {
    max-width: 200px;
    max-height: 200px;
  }
}
</style>
