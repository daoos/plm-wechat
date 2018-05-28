<template>
  <div id="app">
    <group>
      <x-button type="warn" @click.native="unBind">{{message}}</x-button>
    </group>
  </div>
</template>

<script>
import { XInput, Group, XButton } from 'vux'
import wx from 'weixin-js-sdk'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

let userWx = ''

try {
  userWx = window.location.href.split('?')[1].split('=')[1]
} catch (_) {}

export default {
  name: 'UnBindUser',
  components: {
    XInput,
    Group,
    XButton
  },
  data () {
    return {
      message: '确认解绑',
      isUnbinding: false
    }
  },
  methods: {
    unBind: function () {
      const tv = this
      tv.message = '解绑中...'
      tv.isUnbinding = true
      /*提交绑定信息*/
      const requestObj = {
        url: host + 'wxservice/userunbind',
        method: 'post',
        data: {
          userwxh: userWx
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function(data){
        tv.$vux.loading.hide()
        if( data.status === 200 && data.data.status === 'ok'){ 
          tv.message = '解绑成功'
          tv.$vux.toast.show({
            text: '解绑成功',
            time: 3000,
            onHide: wx.closeWindow()
          })
        } else {
          tv.message = '确认解绑'
          tv.$vux.toast.show({
            text: data.data.errormsg || '解绑失败'
          })
        }
      }).catch(function(error){
        console.log(error)
      })
    }
  },
  mounted: function(){}
}
</script>

<style>
#app {
  font-family: "Microsoft Yahei", "AvenirNext-Regular", "Helvetica Neue", "lucida grande", "PingFangHK-Light", "STHeiti", "Heiti SC", "Hiragino Sans GB", "Microsoft JhengHei", SimHei, "WenQuanYi Micro Hei", "Droid Sans", "Roboto", Helvetica, Tahoma, Arial, "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  padding: 0 10px;
}
</style>
