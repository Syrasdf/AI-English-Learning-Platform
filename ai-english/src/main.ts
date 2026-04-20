import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'animate.css'
import './permission'

import SvgIcon from '@/components/SvgIcon.vue'

import './assets/styles/index.css'
import 'ant-design-vue/dist/reset.css'
// @ts-ignore
import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(router).use(Antd)
app.component('svg-icon', SvgIcon)
app.mount('#app')
