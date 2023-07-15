import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// @ts-ignore
// import 'fonts.css'
import 'normalize.css'

import VConsole from 'vconsole';

if (process.env.NODE_ENV === 'development') {
    const vConsole = new VConsole();
}

createApp(App).mount('#app')
