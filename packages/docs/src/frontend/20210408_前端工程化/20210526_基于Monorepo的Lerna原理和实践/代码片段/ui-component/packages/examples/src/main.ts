import UIComponent from 'ui-component';
import { createApp } from 'vue';

import App from './App.vue';

const app = createApp(App);

app.use(UIComponent);

app.mount('#app');
