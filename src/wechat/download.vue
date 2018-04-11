<template>
  <div id="app">
    {{msg}}
  </div>
</template>

<script>
import { downloadFileForUrl } from 'hyj-func'

export default {
  name: 'Download',
  components: {},
  data () {
    return {
      msg: navigator.userAgent.indexOf('MicroMessenger')>-1?'微信不支持下载，请点击右上角，选择在浏览器中打开下载':'',
    }
  },
  methods: {},
  mounted: function(){
    if (navigator.userAgent.indexOf('MicroMessenger') === -1) {
      console.log(document.location.search.slice(1).split('=')[1])
      const downloadUrl = window.btoa(document.location.search.slice(1).split('=')[1])
      downloadFileForUrl(downloadUrl)
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
