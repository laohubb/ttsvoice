import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// @ts-ignore
// import 'fonts.css'
import 'normalize.css'

import VConsole from 'vconsole';
// @ts-ignore
if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    const vConsole = new VConsole();
}

createApp(App).mount('#app')
