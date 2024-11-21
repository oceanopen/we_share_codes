declare module '*.vue' {
    import type { App, defineComponent } from 'vue';

    const component: ReturnType<typeof defineComponent> & {
        install: (app: App) => void;
    };
    export default component;
}

declare type ComponentSize = 'medium' | 'small';
