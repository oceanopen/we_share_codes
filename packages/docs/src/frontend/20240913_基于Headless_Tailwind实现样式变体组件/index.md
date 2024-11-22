## 基于 Headless + Tailwind 实现样式变体组件

在现代前端开发中，我们经常需要根据不同的场景和需求来调整组件的样式。
而 `Tailwind CSS` 是一个非常强大的 `CSS` 框架，它提供了大量的预设样式和实用类，使得我们能够轻松地实现样式变体。

然而, `Tailwind CSS` 的预设样式并不能满足所有开发的需求，因此我们需要自定义一些样式。
基于 `Headless` + `Tailwind` 实现样式变体组件，我们可以利用 `Tailwind` 的预设样式和自定义样式的特性，实现一个具有样式变体的组件。

首先，我们需要创建一个组件，这个组件接受一些 props，这些 `props` 将决定组件的样式。
然后，我们可以在组件中使用 `Tailwind` 的预设样式和自定义样式，根据 `props` 的值来决定组件的样式。

接下来以一个 `Button` 组件为例，实现一个具有样式变体的 B`utton 组件。

### 1. 组件分析

一般 `Button` 组件有以下 `Props`:

| 属性     | 说明                                           | 类型    | 默认值 |
| -------- | ---------------------------------------------- | ------- | ------ |
| type     | 类型 可选 primary / success / warning / danger | String  | -      |
| size     | 尺寸 可选 large / medium / small               | String  | large  |
| round    | 是否圆角                                       | Boolean | false  |
| outline  | 是否轮廓风格                                   | Boolean | false  |
| inline   | 是否行内按钮                                   | Boolean | false  |
| disabled | 是否禁用                                       | Boolean | false  |
| loading  | 是否加载中状态                                 | Boolean | false  |

如果转为 `Taildwind CSS` 风格，可以归类为：

| 属性     | 说明                                                | 类型    | 默认值 |
| -------- | --------------------------------------------------- | ------- | ------ |
| variant  | 变体种类，可选 primary / success / warning / danger | String  | -      |
| size     | 尺寸，可选 large / medium / small                   | String  | large  |
| fill     | 填充样式，可选 solid / outline / text               | String  | false  |
| shape    | 形状，可选 square / pill / round                    | String  | false  |
| inline   | 是否行内按钮                                        | Boolean | false  |
| disabled | 是否禁用                                            | Boolean | false  |
| loading  | 是否加载中状态                                      | Boolean | false  |

简单分析一下，前四个都是对应按钮的不同`样式变体(variants)`，我们只需要给每种变体指定自己特有的样式即可。
而 `disabled` 和 `loading` 对应按钮的不同状态。而 `loading` 态也可以分解成一个 `loading-icon` + `disabled` 的组合。

那么，我们如何通过 `Tailwind CSS` 优雅的实现这样的需求呢？

### 3. 初步实现

我们会用到一个 `clsx` 库，它可以帮助我们更方便的通过条件去控制样式的变化。
我们先来看一下我们的 `Button` 组件的代码：

```vue
<!-- Button.vue -->

<template>
    <button :class="buttonVariants({ variant, size, fill, shape, inline })">
        <IconLoading v-if="loading" />
        <slot />
    </button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import clsx from 'clsx';
import IconLoading from './IconLoading.vue';

interface Props {
    variant?: 'primary' | 'success' | 'danger' | 'warning';
    size?: 'small' | 'large' | 'middle';
    fill?: 'solid' | 'outline' | 'text';
    shape?: 'round' | 'square' | 'pill';
    inline?: boolean;
    loading?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

function buttonVariants({ variant, size, fill, shape, inline }) {
    return clsx(
        'inline-flex items-center justify-center rounded-lg ...',
        {
            'bg-primary ...': variant === 'primary',
            'bg-success ...': variant === 'success',
            'bg-danger ...': variant === 'danger',
            '!rounded-full': shape === 'round',
            'rounded-none': shape === 'square',
            'rounded-md': shape === 'pill',
        }
    );
}
</script>
```

以上代码基本实现了我们的需求，但是存在两个问题：

- `clsx` 中大量的条件判断代码，使代码看起来很臃肿，没有组织性，不利于代码的阅读与维护。
- 我们无法保证 `tailwind` 中 `class` 的优先级，我们无法保证写在后面的样式可以覆盖前面的样式，比如 `shape` 为 `round` 的情况下，
  我们希望 `rounded-full` 更够覆盖基本样式中 `rounded-lg`，但是我们无法保证这一点。
  只能通过 `!rounded-full` 来覆盖 `rounded-lg`，`!important` 的使用会导致样式的不可预测性，不利于代码的维护。

### 4. 使用 cva + tailwind-merge 改写

`cva` 是 `Class Variance Authority` 的缩写，`cva` 是一个用于管理样式变体的库，它可以帮助我们更好的组织样式变体，使得代码更加清晰，更加易于维护。
我们可以使用 `cva` 来重写我们的 `Button` 组件，使得代码更加清晰。

`tailwind-merge` 用来处理 `tailwind` 样式冲突问题，它可以让写在后面的样式覆盖前面的样式，这样我们就不需要使用 `!important` 来覆盖样式了。

以下是重构后的代码：

```vue
<!-- Button.vue -->

<template>
    <button :class="twMerge(buttonVariants({ variant, size, fill, shape, inline }), props.class)">
        <IconLoading v-if="loading" />
        <slot />
    </button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import IconLoading from './IconLoading.vue';

const props = withDefaults(defineProps<Props>(), {});

const buttonVariants = cva(
    'inline-flex rounded-lg items-center justify-center ...',
    {
        variants: {
            type: {
                primary: 'bg-primary text-primary border-primary',
                success: 'bg-success text-success border-success',
                danger: 'bg-danger text-danger border-danger',
            },
            shape: {
                round: 'rounded-full',
                square: 'rounded-lg',
            },
        },
        defaultVariants: {
            type: 'primary',
            shape: 'square',
        },
    }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    fill?: ButtonVariants['fill'];
    shape?: ButtonVariants['shape'];
    inline?: ButtonVariants['inline'];
    class?: HTMLAttributes['class'];
    loading?: boolean;
    disabled?: boolean;
}
</script>
```

可以看到，改写后的 `Button` 组件清晰简洁了很多，我们把`样式变体的定义`和`组件的实现`分离开来，使得代码更加清晰，更加易于维护。

使用 `twMerge` 来处理样式冲突问题，使得我们可以更加方便的控制样式的优先级。

### 5. 看下效果

基于 `vitepress` 创建一个文档项目。具体可以参考 `radix-vue` 文档演示目录。

#### 5.1 准备工作

文档启动之前，要先对 `components` 进行构建：

```bash
pnpm run ui:build
```

构建后会生成 `dist` 文件夹，里面包含了所有组件的打包文件。

#### 5.2 文档配置

```json
// docs/package.json
{
    // ...
    "dependencies": {
        "components": "workspace:*"
    }
    // ...
}
```

这样文档中就可以直接引用本地组件库了。

#### 5.3 文档开发

```md
<!-- packages/docs/content/components/button.md -->
<ComponentPreview name="Button_Variant" />
```

```vue
<!-- packages/docs/components/demo/Button_Variant/tailwind/index.vue -->

<template>
    <div class="flex flex-wrap flex-col gap-5 justify-start w-full">
        <Button variant="primary" @click="handleClick">
            Primary
        </Button>
        <Button variant="success" @click="handleClick">
            Success
        </Button>
        <Button variant="warning" @click="handleClick">
            Warning
        </Button>
        <Button variant="danger" @click="handleClick">
            Danger
        </Button>
        <Button @click="handleClick">
            Default
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from 'components';
import 'components/dist/index.css';

function handleClick(e: MouseEvent) {
    console.log('[Button.Variant] handleClick, e:', e);
}
</script>
```

#### 5.4 启动文档

```bash
pnpm run ui:docs:dev
```

### 6. 开发者体验优化-实时预览

在开发过程中，我们经常需要实时查看组件的效果，以便进行调试和优化。
目前每次改动组件后，想看效果，需要有以下步骤：

```bash
# 组件重新构建
pnpm run ui:build

# 启动文档
pnpm run ui:docs:dev
```

这样是比较影响开发效率的，怎么做呢?
分析一下，我们知道，想实现实时预览，就需要 `components/dist` 目录下的文件实时更新，而 `components/src` 目录下的文件实时编译。

所以，我们只需要增加以下命令即可：

```json
// packages/components/package.json
{
    "scripts": {
        "watch": "vite build --watch"
    }
}
```

```json
// package.json
{
    "scripts": {
        "ui:build:watch": "rimraf packages/components/dist && pnpm run --filter components watch"
    }
}
```

经过测试，我们发现，在 `components/src` 目录下更新文件，文档也会实时更新了。

### 7. 开发者体验优化-状态实时展示

`headless` 理念官方是比较推荐的做法是，有状态组件，元素最好能实时反馈出当前的变体控制状态，以便后续更多扩展，原文如下：

`When components are stateful, their state will be exposed in a data-state attribute. For example, when an Accordion Item is opened, it includes a data-state="open" attribute.`

那么这样一来，不仅状态的反馈方式也是非常直观的，用户可以很容易地知道当前组件的状态。

组件优化代码如下：

```vue
<template>
    <ButtonRoot
        :class="cn(buttonVariants({ variant, size, fill, shape, inline }), props.class)"
        :disabled="disabled || loading"
        :data-variant="variant"
        :data-size="size"
        :data-fill="fill"
        :data-shape="shape"
        :data-inline="inline"
        :data-disabled="disabled"
        :data-loading="loading"
    >
        <IconLoading v-if="loading" />
        <slot />
    </ButtonRoot>
</template>
```

### 8. 增加前缀标识

如果是应用开发，那么基于默认的 `tailwind` 配置就可以了。但如果是做组件开发，默认配置是不够的。
查看以上生成的组件元素，我们发现，`class` 是很容易和项目自身的命名有重叠的，区分度不够。
比如项目里面可能也会有 `text-primary` 等类名，这样很容易导致样式冲突。

为了解决这个问题，我们可以给组件添加前缀标识。比如，我们命名为 `ui-`。

```js
// packages/uiComponents/tailwind.config.js
module.exports = {
    prefix: 'ui-',
};
```

我们给定的 `class` 名称也要同步修改：

```vue
<script lang="ts">
const buttonVariants = cva('ui-inline-flex ui-rounded-lg ui-items-center ui-justify-center ...', {
    variants: {
        type: {
            primary: 'ui-bg-primary ui-text-primary ui-border-primary',
            success: 'ui-bg-success ui-text-success ui-border-success',
            danger: 'ui-bg-danger ui-text-danger ui-border-danger',
        },
        shape: {
            round: 'ui-rounded-full',
            square: 'ui-rounded-lg',
        },
    },
    defaultVariants: {
        type: 'ui-primary',
        shape: 'ui-square',
    },
});
</script>
```

修改后，再预览，就会发现和之前的效果一致了。
但细心排查，会发现 `class` 去重功能失效了。比如会出现 `ui-rounded-lg ui-rounded-full` 的情况。
那么就是 `tailwind-merge` 没有生效。

根据 [Is 'prefix' supported for tailwind-merge?](https://github.com/dcastil/tailwind-merge/discussions/77)
指引，修改如下：

```js
// 修改前
// import { twMerge } from "tailwind-merge";

// 修改后
import { extendTailwindMerge } from 'tailwind-merge';
export const twMerge = extendTailwindMerge({ prefix: 'ui-' });
```

修改后，再预览，就会发现和之前的效果一致了。

### 9. 更多

目前的 `css` 变量定义方式为：

```css
/* assets/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --ui-background: 0 0% 100%;
    --ui-foreground: 222.2 84% 4.9%;

    --ui-primary: 220 100% 58%;
    --ui-primary-foreground: 0 0% 98%;
  }

  .dark {
    /* to surpoort */
  }
}
```

Tailwind CSS 配置为：

```js
// taildwind.config.js

const animate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: 'ui-',
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--ui-border))',
                text: 'hsl(var(--ui-text))',
                background: 'hsl(var(--ui-background))',
                foreground: 'hsl(var(--ui-foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--ui-primary))',
                    foreground: 'hsl(var(--ui-primary-foreground))',
                },
            },
        },
    },
};
```

目前有体验不好的地方，在于：

- 颜色不直观，需要通过变量名且熟悉变量名，才能找到对应的颜色值。
- 按钮相关的 `class` 不够聚合。

计划方案如下：

- 文档增加颜色变量的直观说明和展示。
- 组件 `class` 调研下能否通过更友好的方式维护。

### 10. 参考

- [radix-vue](https://www.radix-vue.com/)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [tailwindcss](https://tailwindcss.com/docs/installation)
- [iconpark](https://iconpark.oceanengine.com/official)
- [Tailwind CSS + cva 实现样式变体组件](https://juejin.cn/post/7290802328722276352)
- [clsx](https://github.com/lukeed/clsx)
- [cva](https://cva.style/docs)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [Is 'prefix' supported for tailwind-merge?](https://github.com/dcastil/tailwind-merge/discussions/77)
