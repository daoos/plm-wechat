import Vue from 'vue'
import UnBindUser from './wechat/unBind.vue'
import  { LoadingPlugin, ToastPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { UnBindUser },
  template: '<UnBindUser />'
})
