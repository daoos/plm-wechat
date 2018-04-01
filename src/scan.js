import Vue from 'vue'
import Scan from './wechat/scan.vue'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Scan },
  template: '<Scan />'
})
