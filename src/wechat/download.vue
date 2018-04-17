<template>
  <div id="app">
    {{msg}}
  </div>
</template>

<script>
import { downloadFileForUrl } from 'hyj-func'
import { Base64 } from 'js-base64'

export default {
  name: 'Download',
  components: {},
  data () {
    return {
      msg: navigator.userAgent.indexOf('MicroMessenger')>-1?'微信不支持下载，请点击右上角，选择在浏览器中打开下载':''
    }
  },
  methods: {
    b64DecodeUnicode: function(str) {
      return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    }
  },
  mounted: function(){
    if (navigator.userAgent.indexOf('MicroMessenger') === -1) {
      const downloadUrl = document.location.search.slice(1).split('=')[1]
      console.log(downloadUrl)
      downloadFileForUrl(this.b64DecodeUnicode(decodeURIComponent(downloadUrl)))
    }
  }
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
