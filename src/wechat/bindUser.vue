<template>
  <div id="app">
    <group>
      <popup-picker :show-name="true" title="省" :data="formItem.provinces" v-model="formItem.provinceid" placeholder="请选择省" @on-change="getCities"></popup-picker>
    </group>
    <group>
      <popup-picker :show-name="true" title="市" :popup-style="{}" :data="formItem.cities" v-model="formItem.cityid" placeholder="请选择市"@on-change="getEnterprises"></popup-picker>
    </group>
    <group>
      <popup-picker :show-name="true" title="企业" :popup-style="{}" :data="formItem.enterprises" v-model="formItem.enterpriseid" placeholder="请选择企业"></popup-picker>
    </group>
    <group>
      <x-input v-model="formItem.username" placeholder="请输入用户名"></x-input>
    </group>
    <group>
      <x-input v-model="formItem.passwd" type="password" placeholder="请输入密码"></x-input>
    </group>
    <group>
      <x-button type="warn" @click.native="formCheck">绑定</x-button>
    </group>
    <div style="text-align: right;padding: 20px 10px;"><img :src="Logo" alt="logo"></div>
  </div>
</template>

<script>
import { XInput, Group, XButton, PopupPicker } from 'vux'
import wx from 'weixin-js-sdk'
import request from '../utils/request.js'
import {host} from '../utils/config.js'
import Logo from '../img/logo.png'

let userWx = ''

try {
  userWx = window.location.href.split('?')[1].split('=')[1]
} catch (_) {}

export default {
  name: 'BindUser',
  components: {
    XInput,
    Group,
    XButton,
    PopupPicker
  },
  data () {
    return {
      Logo,
      formItem: {
        provinceid: [],
        cityid: [],
        enterpriseid: [],
        provinces: [],
        cities: [],
        enterprises: [],
        username: '',
        passwd: ''
      }
    }
  },
  methods: {
    submit: function () {
      const tv = this
      const {provinceid, cityid, enterpriseid, username, passwd} = tv.formItem
      /* 提交绑定信息 */
      const requestObj = {
        url: host + 'wxservice/userbind',
        method: 'post',
        data: {
          provinceid: provinceid[0],
          cityid: cityid[0],
          enterpriseid: enterpriseid[0],
          username,
          passwd,
          userwxh: userWx
        }
      }
      tv.$vux.loading.show({
        text: '绑定中'
      })
      request(requestObj).then(function(data){
        tv.$vux.loading.hide()
        if (data.status === 200 && data.data.status === 'ok'){
          tv.$vux.toast.show({
            text: '绑定成功',
            time: 3000,
            onHide: wx.closeWindow()
          })
        } else {
          tv.$vux.toast.show({
            text: data.data.errormsg || '绑定失败',
            type: 'cancel'
          })
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    getCities: function(){
      const tv = this
      tv.formItem.cities = []
      /* 获取市 */
      const requestObj = {
        url: host + 'wxservice/city?userWxh=' + userWx + '&provinceid=' + tv.formItem.provinceid[0],
        method: 'get'
      }
      tv.$vux.loading.show()
      request(requestObj).then(function(data){
        tv.$vux.loading.hide()
        if (data.status === 200){
          let arr = []
          arr.push(data.data.cities.map(item => {
            return {
              name: item.cityname,
              value: item.cityid+''
            }
          }))
          tv.formItem.cities = arr
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    getEnterprises: function(){
      const tv = this
      tv.formItem.enterprises = []
      /* 获取企业 */
      const requestObj = {
        url: host + 'wxservice/customers?userWxh=' + userWx + '&provinceid=' + tv.formItem.provinceid[0] + '&cityid=' + tv.formItem.cityid[0],
        method: 'get'
      }
      tv.$vux.loading.show()
      request(requestObj).then(function(data){
        tv.$vux.loading.hide()
        if (data.status === 200){
          let arr = []
          const brr = data.data.enterprises.map(item => {
            return {
              name: item.enterprisename,
              value: item.id
            }
          })
          brr.length>0?arr.push(brr):''
          tv.formItem.enterprises = arr
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    formCheck: function() {
      /* 用户输入合法检测与必填项验证 */
      const tv = this
      let errorMeg = ''
      if (tv.formItem.enterpriseid.length === 0) {
        errorMeg = '请选择企业'
      }
      if (tv.formItem.cityid.length === 0) {
        errorMeg = '请选择市'
      }
      if (tv.formItem.provinceid.length === 0) {
        errorMeg = '请选择省'
      }
      if (errorMeg.length > 0) {
        tv.$vux.toast.show({
          text: errorMeg,
          type: 'warn'
        })
        return ;
      }
      if (tv.formItem.username.length === 0) {
        errorMeg = '输入用户名'
      }
      if (tv.formItem.passwd.length === 0) {
        errorMeg = '输入密码'
      }
      if (errorMeg.length > 0) {
        tv.$vux.toast.show({
          text: errorMeg,
          type: 'warn'
        })
        return ;
      }
      tv.submit()
    }
  },
  mounted: function() {
    const tv = this
    /* 获取省 */
    const requestObj = {
      url: host + 'wxservice/provinces?userWxh=' + userWx,
      method: 'get'
    }
    tv.$vux.loading.show()
    request(requestObj).then(function(data){
      tv.$vux.loading.hide()
      if (data.status === 200){
        let arr = []
        arr.push(data.data.provinces.map(item => {
          return {
            name: item.provincename,
            value: item.provinceid+''
          }
        }))
        tv.formItem.provinces = arr
        console.log(arr)
      }
    })
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
