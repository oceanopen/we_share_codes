import type { App } from 'vue';
import type { SFCWithInstall } from '../utils/types';
import Button from './src/button.vue';

Button.install = (app: App): void => {
    app.component(Button.name as string, Button);
};

const _Button: SFCWithInstall<typeof Button> = Button as SFCWithInstall<typeof Button>;

export default _Button;
