import Vue from 'vue'
import BindUser from './wechat/bindUser.vue'
import  { LoadingPlugin, ToastPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { BindUser },
  template: '<BindUser />'
})
