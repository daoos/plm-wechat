import Vue from 'vue'
import SignaturePad from './wechat/SignaturePad.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { SignaturePad },
  template: '<SignaturePad />'
})

// register service workers here
