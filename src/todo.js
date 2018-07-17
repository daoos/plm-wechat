// pwa todo list app
import Vue from 'vue'
import Todo from './wechat/todo.vue'
import  { LoadingPlugin, ToastPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Todo },
  template: '<Todo />'
})
