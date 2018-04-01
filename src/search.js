import Vue from 'vue'
import Search from './wechat/search.vue'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Search },
  template: '<Search />'
})
