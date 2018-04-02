<template>
  <div id="app">
    <popup v-model="httpError.show" :popup-style="{zIndex: '6001'}" position="top" :show-mask="false">
      <div class="httpError">
        {{httpError.msg}}
      </div>
    </popup>
    <div v-if="currentStatus === 'error'">
      扫码不合要求
    </div>
    <div v-if="currentStatus === 'searchResult'">
      <SearchResult :goDetail="goDetail" :lists="searchResultData" :resultType="searchType" />
    </div>
    <div v-if="currentStatus === 'details'">
      <div class="backbtn" @click="backUp('searchResult')"></div>
      <Details :detailType="searchType" :detailInfo="detailsData" />
      <div style="padding: 10px;"><x-button v-if="activeTab === 0" type="warn"  @click.native="fileDownload">下载</x-button></div>
    </div>
    <div v-if="currentStatus === 'onlyDetails'">
      <Details :detailType="detailType" :detailInfo="detailsData" />
      <TimeLineBox :workFlowInfo="workFlowInfo" />
      <div class="detailFooterBtn">
        <x-button type="primary" v-if="detailType === 'CHECK_DOC_TASK'" @click.native="fileDownload">下载{{downloadFileInfo.message}}</x-button>
        <x-button type="primary" mini v-if="detailType === 'CHECK_CHG_TASK'" @click.native="getchgnotifylist" disabled>变更通知</x-button>
        <x-button type="primary" mini v-if="detailType === 'CHECK_BOM_TASK'" @click.native="fileDownload" disabled>结构</x-button>
        <x-button type="warn" v-if="detailType.indexOf('CHECK') > -1" @click.native="goCheckModal">审批</x-button>
      </div>
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
import { urlGetParamsForObject } from 'hyj-func'
import SearchResult from '../components/searchResult'
import Details from '../components/details'
import CheckMixin from '../mixin/checkMixin'
import DocMixin from '../mixin/docMixin'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'Scan',
  components: {
    SearchResult,
    Details
  },
  mixins: [CheckMixin, DocMixin],
  data () {
    return {
      httpError: { //popup 展示网络请求数据错误
        show: false,
        msg: ''
      },
      currentStatus: '', // 用于切换界面
      searchType: 'doc', // 查询类型
      scanEnterInfo: {},    // 当前扫码基础信息
      searchTypeIndex: { // post 传递的 tabIndex
        doc: 0,
        matter: 1,
        apply: 2,
        task: 3
      },
      searchResultData: [],
      detailType: '', // 审签任务类型
      selectedTasks: [], // 选中任务简要信息列表，如果单一任务，则 length = 1
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
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        tv.$vux.loading.hide()
        if (data.status === 200 && Array.isArray(data.data)) {
          tv.searchResultData = data.data
          tv.currentStatus = 'searchResult'
        }
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
        url: host + 'wxservice/gettaskdetail',
        method: 'post',
        data: {
          date: new Date(),
          activeid: obj.activeid,
          receivetime: obj.receivetime,
          taskId: obj.taskid,
          taskType: obj.tasktype,
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.detailsData = data.data
          tv.detailType = data.data.taskTypes
          tv.selectedTasks.push(data.data) //这里采用push，因为这个方法在每次扫码，只会调用一次
          if (data.data.taskTypes === 'CHECK_DOC_TASK') {
            //文档审批
            tv.getdocworkflow({
              activeid: obj.activeid,
              ...data.data
            })
            tv.downloadvalidate(data.data)
          } else if (data.data.taskTypes === 'CHECK_CHG_TASK') {
            //变更申请审批
            tv.getchgworkflow({
              activeid: obj.activeid,
              ...data.data
            })
            tv.getbomstructuretable(data.data)
          } else if (data.data.taskTypes === 'CHECK_BOM_TASK') {
            //变更申请审批
            tv.getbomdesignworkflow({
              activeid: obj.activeid,
              ...data.data
            })
          } else {
            tv.workFlowInfo = {
              code: 'F',
              list: []
            }
            tv.$vux.loading.hide()
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 跳转控制 */
    backUp: function(type) {
      this.currentStatus = type
    },
    /* 
     * 进入查询项目详情
     * @require key 当前选中查询项目id
     */
    goDetail: function (key) {
      const tv = this
      let numver
      switch (tv.searchTypeIndex[tv.searchType]) {
        case 0: numver = key.split('_')
                tv.searchResultData.every(item => {
                  if (item.docNum === numver[0] && item.docVer === numver[1]) {
                    tv.detailsData = item
                    return false;
                  }
                  return true
                })
                break;
        case 1: numver = key.split('_')
                tv.searchResultData.every(item => {
                  if (item.materialNum === numver[0] && item.materialVer === numver[1]) {
                    tv.detailsData = item
                    return false;
                  }
                  return true
                })
                break;
        case 2: tv.searchResultData.every(item => {
                  if (item.chgApplyId === key) {
                    tv.detailsData = item
                    return false;
                  }
                  return true
                })
                break;
        case 3: tv.searchResultData.every(item => {
                  if (item.chgAppId === key) {
                    tv.detailsData = item
                    return false;
                  }
                  return true
                })
                break;
      }
      if (tv.activeTab === 0) {
        tv.downloadvalidate(tv.detailsData)
      }
      tv.backUp('details')
    },
    /* 
     * 3.2 获取变更申请流程详情
     * @require obj 任务详细信息 + activeid
     * 通过任务详情，获取对应流程详情
     */
    getchgworkflow: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/getchgworkflow',
        method: 'post',
        data: {
          activeid: obj.activeid,
          workid: obj.taskid,
        }
      }
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.workFlowInfo = data.data
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 3.3 获取BOM审批流程详情
     * @require obj 任务详细信息 + activeid
     * 通过任务详情，获取对应流程详情
     */
    getbomdesignworkflow: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/getbomdesignworkflow',
        method: 'post',
        data: {
          activeid: obj.activeid,
          bomname: obj.bomname,
          bomver: obj.bomver,
          partid: obj.partid,
          partver: obj.partver,
          workid: obj.taskid,
        }
      }
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.workFlowInfo = data.data
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 3.3.1 获取BOM结构
     * 通过任务详情，获取对应变BOM结构
     */
    getbomstructuretable: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/getbomstructuretable',
        method: 'post',
        data: {
          bomname: obj.bomname,
          bomver: obj.bomver,
          partid: obj.partid,
          partver: obj.partver
        }
      }
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.bomStructure = data.data
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
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
  },
  watch: {
    httpError (val) {
      if (val.show) {
        setTimeout(() => {
          this.httpError = {
            show: false,
            msg: ''
          }
        }, 1000)
      }
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
.backbtn {
  position: fixed;
  top: 15px;
  left: 5px;
  padding: 0 5px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  z-index: 101;
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 15px;
  text-align: center;
}
.backbtn:before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #ccc;
  border-width: 1px 0 0 1px;
  transform: rotate(315deg);
  top: 8px;
  left: 11px;
}
</style>
