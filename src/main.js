import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js 设置根标签字体大小
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Col, Row, Badge, Search, Image as VanImage, Divider, CellGroup, Tag, Dialog, DatetimePicker } from 'vant'

Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Popup)
Vue.use(Col)
Vue.use(Row)
Vue.use(Badge)
Vue.use(Search)
Vue.use(VanImage)
Vue.use(Divider)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(DatetimePicker)

Vue.config.productionTip = false

// 封装中间件函数插件
const directiveObj = {
  install(Vue) {
    Vue.directive('focu', {
      // 指令所在标签，被插入到真实DOM时才触发，如果标签用display：none隐藏再出现，不会再触发inserted的
      inserted(el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框，尝试往里获取一下
          let theInput = el.querySelector('input')
          let theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      },
      update(el) {
        // 指令所在标签，被更新时触发
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框，尝试往里获取一下
          let theInput = el.querySelector('input')
          let theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      }
    })
  }
}
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
