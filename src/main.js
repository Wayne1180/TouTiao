import '@/utils/console'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js 设置根标签字体大小
import 'highlight.js/styles/default.css' // 代码高亮的样式
import directiveObj from './utils/directive'
import './VueComponent' // vant组件注册，单独的分离成一个js文件，让main.js更清晰

Vue.config.productionTip = false

Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
