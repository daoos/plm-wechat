<template>
  <div id="app">
    <div v-if="currentStatus === 'error'">
      扫码不合要求
    </div>
    <div v-if="currentStatus === 'searchResult'">
      <SearchResult :goDetail="backUp" :lists="searchResultData" :resultType="searchType" />
    </div>
    <div v-if="currentStatus === 'details'">
      <Button type="error" @click="backUp('searchResult')">返回查询结果</Button>
      <Details />
    </div>
    <div v-if="currentStatus === 'onlyDetails'">
      <Details />
    </div>
  </div>
</template>

<script>
/*
 * @currentStatus
 * error: 二维码信息获取错误展示
 * searchResult: 查询结果列表展示
 * details: 通过查询结果列表进入的结果详情
 * onlyDetails: 通过扫码进入的任务详情
 * designer: heyunjiang
 * time: 2018.3.22
 */
import { Form, FormItem, Input, Button, Select, Option,
  CheckboxGroup, Checkbox, Tabs, TabPane, DatePicker, Message, Spin } from 'iview'
import { urlGetParamsForObject } from 'hyj-func'
import SearchResult from '../components/searchResult'
import Details from '../components/details'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'Scan',
  components: {
    Form,
    FormItem,
    Input,
    Button,
    Select,
    Option,
    CheckboxGroup,
    Checkbox,
    Tabs,
    TabPane,
    DatePicker,
    Message,
    SearchResult,
    Details,
    Spin
  },
  data () {
    return {
      currentStatus: '', // 用于切换界面
      searchType: 'doc', // 待查询类型，用于 post 传递 tabIndex
      scanEnterInfo: {},    // 当前扫码基础信息
      searchTypeIndex: { // post 传递的 tabIndex
        doc: 0,
        matter: 1,
        apply: 2,
        task: 3
      },
      searchResultData: [],
      detailsData: {}
    }
  },
  methods: {
    /*
     * 入口一: 进入查询结果列表页
     * 提交查询信息, 并进入查询结果界面
     * @require obj 查询信息
     */
    getResultList: function (obj) {
      const tv = this
      const requestObj = {
        url: host + 'wxservice/wxsearchquery',
        method: 'post',
        data: {
          index: 1,
          myObj: JSON.stringify(obj),
          tabIndex: tv.searchTypeIndex[tv.searchType]
        }
      }
      Spin.show();
      request(requestObj).then(function (data) {
        console.log(data)
        if (data.status === 200) {
          tv.searchResultData = data.data
          tv.currentStatus = 'searchResult'
        }
        Spin.hide();
      }).catch(function (error) {
        console.log(error)
      })
    },
    /*
     * 入口二: 进入任务详情
     * 包含: 文档审批、变更申请审批、变更审批、常规项目任务
     * 注意: 不包含设计BOM审批
     * @require obj 任务概略信息
     */
    getDetails: function(obj){
      /* 单纯获取任务详情信息, 不控制进入查询结果界面 */
      const tv = this
      const requestObj = {
        url: host + 'wxservice/wxsearchquery',
        method: 'post',
        data: {}
      }
      Spin.show();
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          Spin.hide();
          console.log(data.data)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 跳转控制 */
    backUp: function(type) {
      this.currentStatus = type
    }
  },
  mounted: function () {
    const obj = urlGetParamsForObject(window.location.href)
    const tv = this
    tv.scanEnterInfo = obj
    if (typeof(obj.rettype) === 'undefined') {
      tv.currentStatus = 'error'
    }
    switch(obj.rettype) {
      case 'doc': tv.searchType = 'doc';
                  if (+(obj.signing) === 0) {
                    tv.getResultList(obj)
                  } else {
                    tv.currentStatus = 'onlyDetails'
                    tv.getDetails(obj)
                  }
                  break;
      case 'mat': tv.searchType = 'matter';
                  tv.getResultList(obj)
                  break;
      case 'apply': tv.searchType = 'apply';
                    tv.currentStatus = 'onlyDetails';
                    tv.getDetails(obj)
                    break;
      case 'task': tv.searchType = 'task';
                   tv.currentStatus = 'onlyDetails';
                   tv.getDetails(obj)
                   break;
      defalut: tv.searchType = 'error';tv.currentStatus = 'error';
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
  margin-top: 20px;
  padding: 0 10px;
}
</style>
