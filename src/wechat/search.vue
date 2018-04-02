<template>
  <div class="app">
    <popup v-model="httpError.show" :popup-style="{zIndex: '6001'}" position="top" :show-mask="false">
      <div class="httpError">
        {{httpError.msg}}
      </div>
    </popup>
    <div v-if="currentStatus === 'search'">
      <tab v-model="activeTab">
        <tab-item :value="0" selected>文档</tab-item>
        <tab-item :value="1">物料</tab-item>
        <tab-item :value="2">变更申请</tab-item>
        <tab-item :value="3">变更任务</tab-item>
      </tab>
      <group v-if="activeTab === 0">
        <x-input label-width="80px" title="编码:" v-model="searchForm.doc.docNum"></x-input>
        <x-input label-width="80px" title="名称:" v-model="searchForm.doc.docName"></x-input>
        <x-input label-width="80px" title="创建人:" v-model="searchForm.doc.docCreatePerson"></x-input>
        <datetime
          v-model="searchForm.doc.docCreateTime"
          format="YYYY-MM-DD"
          title="创建时间:"></datetime>
      </group>
      <group v-if="activeTab === 1">
        <x-input label-width="80px" title="编码:" v-model="searchForm.matter.materailNum"></x-input>
        <x-input label-width="80px" title="名称:" v-model="searchForm.matter.materailName"></x-input>
        <x-input label-width="80px" title="创建人:" v-model="searchForm.matter.materailCreatePerson"></x-input>
        <datetime
          v-model="searchForm.matter.materailCreateTime"
          format="YYYY-MM-DD"
          title="创建时间:"></datetime>
      </group>
      <group v-if="activeTab === 2">
        <x-input label-width="80px" title="编码:" v-model="searchForm.apply.chgApplyNum"></x-input>
        <x-input label-width="80px" title="名称:" v-model="searchForm.apply.chgApplyName"></x-input>
        <x-input label-width="80px" title="创建人:" v-model="searchForm.apply.chgApplyCreatePerson"></x-input>
        <datetime
          v-model="searchForm.apply.chgApplyCreateTime"
          format="YYYY-MM-DD"
          title="创建时间:"></datetime>
      </group>
      <group v-if="activeTab === 3">
        <x-input label-width="80px" title="名称:" v-model="searchForm.task.chgTaskName"></x-input>
        <x-input label-width="80px" title="执行人:" v-model="searchForm.task.chgTaskExecutePerson"></x-input>
        <x-input label-width="80px" title="创建人:" v-model="searchForm.task.chgTaskCreatePerson"></x-input>
        <datetime
          v-model="searchForm.task.chgTaskCreateTime"
          format="YYYY-MM-DD"
          title="创建时间:"></datetime>
        <x-input label-width="80px" title="任务状态:" v-model="searchForm.task.chgTaskStatus"></x-input>
      </group>
      <x-button type="warn" class="searchBtn"  @click.native="formCheck">查询</x-button>
    </div>
    
    <div v-if="currentStatus === 'searchResult'">
      <div class="backbtn" @click="backUp('search')"></div>
      <SearchResult :goDetail="goDetail" :lists="searchResultData" :resultType="activeTabIndex[activeTab]" />
    </div>
    <div v-if="currentStatus === 'details'">
      <div class="backbtn" @click="backUp('searchResult')"></div>
      <Details :detailType="activeTabIndex[activeTab]" :detailInfo="detailsData" />
      <div style="padding: 10px;"><x-button v-if="activeTab === 0" type="warn"  @click.native="fileDownload">下载</x-button></div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Group, XButton, XInput, Datetime, Popup } from 'vux'
import DocMixin from '../mixin/docMixin'
import SearchResult from '../components/searchResult'
import TimeLineBox from '../components/TimeLineBox'
import Details from '../components/details'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'Search',
  components: {
    Tab,
    TabItem,
    Group,
    XButton,
    XInput,
    Datetime,
    Popup,
    SearchResult,
    Details,
    TimeLineBox
  },
  mixins: [DocMixin],
  data () {
    return {
      httpError: { //popup 展示网络请求数据错误
        show: false,
        msg: ''
      },
      currentStatus: 'search', // 类型切换: search searchResult details
      activeTab: 0, // 类型切换: 查询类型切换
      searchForm: {// 查询数据
        doc: {
          docNum: '',
          docName: '',
          docCreatePerson: '',
          docCreateTime: ''
        },
        matter: {
          materailNum: '',
          materailName: '',
          materailCreatePerson: '',
          materailCreateTime: ''
        },
        apply: {
          chgApplyNum: '',
          chgApplyName: '',
          chgApplyCreatePerson: '',
          chgApplyCreateTime: ''
        },
        task: {
          chgTaskName: '',
          chgTaskExecutePerson: '',
          chgTaskCreatePerson: '',
          chgTaskCreateTime: '',
          chgTaskStatus: ''
        }
      },
      activeTabIndex: { // post tabIndex 获取源
        0: 'doc',
        1: 'matter',
        2: 'apply',
        3: 'task'
      },
      searchResultData: [], // 查询结果列表页
      detailsData: {} // 当前展示查询结果列表一项详细数据
    }
  },
  methods: {
    /* 执行查询 */
    submit: function () {
      const tv = this
      /* 提交查询信息 */
      const requestObj = {
        url: host + 'wxservice/wxsearchquery',
        method: 'post',
        data: {
          index: 1,
          myObj: JSON.stringify(tv.searchForm[tv.activeTabIndex[tv.activeTab]]),
          tabIndex: tv.activeTab
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        tv.$vux.loading.hide()
        if (data.status === 200 && Array.isArray(data.data)) {
          tv.searchResultData = data.data
          tv.backUp('searchResult')
        } else {
          tv.httpError = {
            show: true,
            msg: '获取数据失败'
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* before submit: 查询数据检查 */
    formCheck: function () {
      /* this.backUp('searchResult')
      return ; */
      /* 用户输入合法检测与必填项验证 */
      const tv = this
      let empty = true
      Object.keys(tv.searchForm[tv.activeTabIndex[tv.activeTab]]).forEach(item => {
        if (tv.searchForm[tv.activeTabIndex[tv.activeTab]][item].length > 0) {
          empty = false
        }
      })
      if (empty) {
        tv.$vux.toast.show('查询条件为空')
      } else {
        tv.submit()
      }
    },
    /* 跳转控制 */
    backUp: function (type) {
      this.currentStatus = type
    },
    /* 
     * 进入查询项目详情
     * @require key 当前选中查询项目id
     */
    goDetail: function (key) {
      const tv = this
      let numver
      switch (tv.activeTab) {
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
    }
  },
  mounted: function () {},
  watch: {
    activeTab (val) {
      console.log(val)
    },
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
.app {
  font-family: "Microsoft Yahei", "AvenirNext-Regular", "Helvetica Neue", "lucida grande", "PingFangHK-Light", "STHeiti", "Heiti SC", "Hiragino Sans GB", "Microsoft JhengHei", SimHei, "WenQuanYi Micro Hei", "Droid Sans", "Roboto", Helvetica, Tahoma, Arial, "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.backbtn {
  position: fixed;
  top: 15px;
  left: 5px;
  padding: 0;
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
a {
  text-decoration: none;
}
/* 重写 vux 样式 */
.vux-x-input .weui-label {
  text-align: right;
  padding-right: 5px;
}
.vux-datetime>div:first-of-type {
  word-wrap: break-word;
  word-break: break-all;
  text-align: right;
  padding-right: 5px;
  width: 80px;
}
.searchBtn {
  margin-top: 20px;
}
/* http error */
.httpError {
  background-color: #ffe26d;
  color: #000;
  text-align: center;
  padding: 15px;
  overflow: hidden;
}
</style>
