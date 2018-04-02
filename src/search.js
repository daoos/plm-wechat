import Vue from 'vue'
import Search from './wechat/search.vue'
import  { LoadingPlugin, ToastPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Search },
  template: '<Search />'
})
