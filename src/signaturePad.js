import Vue from 'vue'
import SignaturePad from './wechat/SignaturePad.vue'
import vueSignature from "vue-signature"


Vue.config.productionTip = false

Vue.use(vueSignature)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { SignaturePad },
  template: '<SignaturePad />'
})
