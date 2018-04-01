import Vue from 'vue'
import VueTouch from 'vue-touch'
import  { LoadingPlugin, ToastPlugin } from 'vux'
// import HelloWorld from './components/HelloWorld.vue'
import TaskList from './wechat/taskList.vue'

Vue.config.productionTip = false
Vue.use(VueTouch, {name: 'v-touch'})

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { TaskList },
  template: '<TaskList />'
})


