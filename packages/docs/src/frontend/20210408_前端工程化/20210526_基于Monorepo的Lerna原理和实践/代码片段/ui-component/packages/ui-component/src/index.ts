import type { App } from 'vue';
import Button from './components/button/index';

const components = [Button];

const install = function (app: App) {
    components.forEach((component) => {
        app.component(component.name as string, component);
    });
};

export default {
    install,
    Button,
};
