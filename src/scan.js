import Vue from 'vue'
import Scan from './wechat/scan.vue'
import  { LoadingPlugin, ToastPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Scan },
  template: '<Scan />'
})
