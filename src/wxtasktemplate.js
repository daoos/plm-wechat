import Vue from 'vue'
import Wxtasktemplate from './wechat/wxtasktemplate.vue'
import  { LoadingPlugin, ToastPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Wxtasktemplate },
  template: '<Wxtasktemplate />'
})
