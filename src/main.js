import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入自己的UI插件组件库
import UI from '@/components/library'

// 重置样式的库
import 'normalize.css'
// 自己项目的重置文件和公共样式
import '@/assets/styles/common.less'

// mockjs
import '@/mock'

createApp(App).use(store).use(router).use(UI).mount('#app')

