# 快速开始

<script setup>
import { withBase } from 'vitepress'
</script>

## 依赖环境

首先得有 [Node.js](https://nodejs.org/)，并确保 node 版本是 12.13 或以上。

```bash
# 打印 node 版本
node -v
# v20.11.1
```

推荐使用 [pnpm](https://pnpm.io/installation) 管理 npm 依赖

```bash
# 全局安装 pnpm
npm i pnpm -g
```

## 项目启动

::: code-group

```bash [pnpm]
# 安装依赖
pnpm i

# 本地调试
pnpm docs:dev

# 生产构建
pnpm docs:build

# 本地构建 + 预览
pnpm docs:build && pnpm docs:preview
```

:::
