# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 VitePress 构建的中文技术分享网站，涵盖前端、后端、算法、运维、安全、AI 和工具等内容。采用 pnpm workspaces 管理的 monorepo 结构。

## 常用命令

```bash
pnpm install                  # 安装依赖
pnpm docs:dev                 # 本地开发服务器
pnpm docs:build:local         # 本地构建
pnpm docs:build:prod          # 生产构建（base URL: /docs/）
pnpm docs:preview:local       # 本地构建 + 预览
pnpm docs:preview:prod        # 生产构建 + 预览
pnpm lint                     # ESLint 自动修复
pnpm release                  # 版本升级（bumpp）
pnpm changelog                # 生成更新日志
```

## 架构

**Monorepo 结构** — 唯一的 workspace 包 `packages/docs` 包含整个 VitePress 站点。

```
packages/docs/
  .vitepress/
    config.ts                  # VitePress 主配置（PWA、搜索、主题）
    configs/
      navbar/zh.ts             # 顶部导航
      sidebar/                 # 每个分类一个配置文件（frontend.ts、tools.ts 等）
  src/
    guide/                     # 项目介绍
    tools/                     # Git、Mac、Node、VSCode 等
    frontend/                  # 工程化、JS、CSS、TS、Vue、Node.js
    backend/                   # 数据库、Go、Docker、架构
    algorithm/                 # 数据结构、排序、数学
    operation/                 # Nginx、CDN、浏览器、Docker、云服务器
    security/                  # Web 安全（XSS、CSRF、CSP）
    ai/                        # Ollama、LLM、LangChain
    other/                     # 非技术文章
```

**内容规范：** 文章目录命名格式 `YYYYMMDD_标题/`，包含 `index.md`，可选 `images/` 目录和可运行的代码片段。支持嵌套子文章（如 `20210408_前端工程化/20210508_前端模块化的发展历程/`）。

**侧边栏** 手动配置 — 在 `.vitepress/configs/sidebar/` 下每个分类一个 TypeScript 文件，导出 `{ text, link }` 对象数组，支持可折叠分组。

## 规范

- **包管理器：** pnpm (v8.15.5)，Node >= 20
- **镜像源：** npmmirror.com
- **提交信息：** 中文 conventional commits — `<type>(<scope>): <中文描述>`（类型：feat、fix、docs、style、refactor、test、chore、revert、release、build、ci）
- **代码格式化：** 仅使用 ESLint（Prettier 已禁用），`@antfu/eslint-config` 预设
- **代码风格：** 2 空格缩进、单引号、必须分号、末尾逗号
- **Git 钩子：** pre-commit 运行 lint-staged，commit-msg 运行 commitlint（simple-git-hooks）
- **部署：** 推送到 `main` 分支触发 GitHub Actions → SSH/rsync 到腾讯云 CVM
- **版本管理：** bumpp 同时更新根目录和 docs 的 package.json；推送 tag 触发 GitHub Release

## CI 工作流

- `deploy-docs.yml` — `main` 分支 `packages/docs/**` 变更时自动部署
- `gitee-mirror.yml` — 推送到 `main` 时同步镜像到 Gitee
- `release-tag.yml` — 推送 `v*` 标签时创建 GitHub Release
