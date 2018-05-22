<template>
  <div id="app">
    <popup v-model="httpError.show" :popup-style="{zIndex: '6001'}" position="top" :show-mask="false">
      <div class="httpError">
        {{httpError.msg}}
      </div>
    </popup>
    <div v-if="currentStatus === 'error'">
      {{scanDefaultInfo.content}}
    </div>
    <div v-if="currentStatus === 'searchResult'">
      <SearchResult :goDetail="goDetail" :submit="getResultList" :lists="searchResultData" :resultType="searchType" />
    </div>
    <div v-if="currentStatus === 'details'">
      <div class="backbtn" @click="backUp('searchResult')"></div>
      <Details :detailType="searchType" :detailInfo="detailsData" />
      <div style="padding: 10px;"><x-button v-if="searchType === 'doc'" type="warn"  @click.native="fileDownload">下载</x-button></div>
    </div>
    <div v-if="currentStatus === 'onlyDetails'">
      <Details :detailType="detailType" :detailInfo="detailsData" />
      <TimeLineBox :workFlowInfo="workFlowInfo" />
      <div class="detailFooterBtn">
        <x-button type="primary" v-if="downloadFileInfo.code === 'S'" @click.native="fileDownload(downloadFileInfo)">下载{{downloadFileInfo.message}}</x-button>
        <x-button type="primary" v-if="detailType === 'CHECK_CHG_TASK'" @click.native="_getChgNotifyList(detailsData)">变更通知</x-button>
        <x-button type="primary" v-if="detailType === 'CHECK_BOM_TASK'" @click.native="_getbomstructuretable(detailsData)">结构</x-button>
        <x-button type="primary" v-if="detailType === 'CHECK_CHGAPP_TASK'" @click.native="_getChgApplyBook(detailsData)">变更申请书</x-button>
        <x-button type="warn" v-if="detailType.indexOf('CHECK') > -1" @click.native="goCheckModal">审批</x-button>
      </div>
    </div>

    <div v-if="currentStatus === 'chgNotifyDetails'">
      <div class="backbtn" @click="backUp('onlyDetails')"></div>
      <Details detailType="chgNotifyDetails" :detailInfo="chgNotifyListDetail" />
      <div class="detailFooterBtn">
        <x-button type="primary" v-if="chgDownloadFileInfo.code === 'S'" @click.native="fileDownload(chgDownloadFileInfo)">下载{{chgDownloadFileInfo.message}}</x-button>
      </div>
    </div>
    <div v-if="currentStatus === 'chgApplyBookDetails'">
      <div class="backbtn" @click="backUp('onlyDetails')"></div>
      <Details detailType="chgNotifyDetails" :detailInfo="chgApplyBookDetail" />
      <div class="detailFooterBtn">
        <x-button type="primary" v-if="chgDownloadFileInfo.code === 'S'" @click.native="fileDownload(chgDownloadFileInfo)">下载{{chgDownloadFileInfo.message}}</x-button>
      </div>
    </div>
    <x-dialog
        v-model="modalStatus.checkModalStatus"
        title="执行审批"
        :dialog-style="{width: '90%', maxWidth: '90%', padding: '10px'}">
        <TaskCheck :modalCancel="modalCancel" :goDoTransfor="goDoTransfor" :userAuthority="userAuthority" :submitTask="submitTask" />
    </x-dialog>
    <x-dialog
        v-model="modalStatus.doTransfor"
        title="执行转发"
        :dialog-style="{width: '90%', maxWidth: '90%', padding: '10px'}">
        <Transfer :modalCancel="modalCancel" :doTransforModal="modalStatus.doTransfor" :transforPersonList="transforPersonList" :submitTrans="submitTrans" />
        <div slot="footer"></div>
    </x-dialog>
    <x-dialog
        v-model="bomStructureModalStatus"
        class="bomStructureModal"
        hide-on-blur
        title="BOM结构">
        <div v-if="bomStructuresDatas.length>0" class="bomStructureXTable" style="padding:60px 2px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料版本</th>
                <th>物料名称</th>
                <th>BOM数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in bomStructuresDatas">
                <td>{{item.freeitem2}}</td>
                <td>{{item.freeitem3}}</td>
                <td>{{item.freeitem1}}</td>
                <td>{{item.freeitem4}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <div v-if="bomStructuresDatas.length === 0" class="detailXTable" style="padding:0 15px;">
          数据为空
        </div>
    </x-dialog>
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
import { Group, Popup, Icon, XButton, XDialog, XTable } from 'vux'
import { urlGetParamsForObject } from 'hyj-func'
import TimeLineBox from '../components/TimeLineBox'
import SearchResult from '../components/searchResult'
import Details from '../components/details'
import CheckMixin from '../mixin/checkMixin'
import TaskCheck from '../components/TaskCheck'
import Transfer from '../components/Transfer'
import DocMixin from '../mixin/docMixin'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'Scan',
  components: {
    SearchResult,
    Details,
    Group,
    Popup,
    Icon,
    XButton,
    XDialog,
    TimeLineBox,
    TaskCheck,
    Transfer,
    XTable
  },
  mixins: [CheckMixin, DocMixin],
  data () {
    return {
      scanDefaultInfo: {
        content: '扫码不合要求'
      },
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
      searchPage: 1,//当前查询页
      searchResultData: [],
      detailType: '', // 详情类型
      selectedTasks: [], // 选中任务简要信息列表，如果单一任务，则 length = 1
      detailsData: {} // 单一任务详细信息
    }
  },
  methods: {
    /*
     * 入口一: 进入查询结果列表页
     * 提交查询信息, 并进入查询结果界面
     */
    getResultList: function () {
      const tv = this
      const requestObj = {
        url: host + 'wxservice/wxsearchquery',
        method: 'post',
        data: {
          index: tv.searchPage,
          myObj: JSON.stringify(tv.scanEnterInfo),
          tabIndex: tv.searchTypeIndex[tv.searchType]
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        tv.$vux.loading.hide()
        if (data.status === 200 && Array.isArray(data.data)) {
          if (data.data.length > 0) {
            tv.searchResultData = tv.searchResultData.concat(data.data)
            tv.searchPage += 1
          }
          //首次加载，跳转到列表页
          if (tv.searchPage === 2 && data.data.length > 0) {tv.backUp('searchResult')}
          if (data.data.length === 0) {
            tv.httpError = {
              show: true,
              msg: '数据已加载完全'
            }
          }
          if (data.data.length < 1) {
            tv.scanDefaultInfo = {
              content: '数据获取失败'
            }
          }
        } else {
          tv.httpError = {
            show: true,
            msg: '数据获取失败'
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /*
     * 入口二: 进入任务详情
     * 包含: 文档审批、变更申请审批、变更审批、项目任务、发放文档、变更通知
     * 注意: 不包含设计BOM审批
     * @require obj 任务概略信息 4个必要字段
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
          taskType: obj.tasktype
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200 && typeof(data.data) === 'object' && data.data !== null) {
          tv.detailsData = data.data
          tv.detailType = data.data.taskTypes
          const arr = []
          arr.push(obj)
          tv.selectedTasks = arr
          switch(data.data.taskTypes) {
            case 'CHECK_DOC_TASK':tv.getdocworkflow({
                                    activeid: obj.activeid,
                                    ...data.data
                                  })
                                  tv.downloadvalidate(data.data)
                                  break;
            case 'CHECK_BOM_TASK':tv.getbomdesignworkflow({
                                    activeid: obj.activeid,
                                    ...data.data
                                  })
                                  break;
            case 'CHECK_CHG_TASK':tv.getchgworkflow({
                                    activeid: obj.activeid,
                                    ...data.data
                                  })
                                  break;
            case 'CHECK_CHGAPP_TASK':tv.getchgapplyworkflow({
                                      activeid: obj.activeid,
                                      ...data.data
                                    })
                                    break;
            case 'FAFANG_NOTICE':tv.downloadvalidate(data.data);break;
            case 'CHANGE_LISTENER':tv.downloadvalidate(data.data);break;
            default:  tv.workFlowInfo = {
                        code: 'F',
                        list: []
                      }
                      tv.$vux.loading.hide()
          }
        } else {
          tv.$vux.loading.hide()
          tv.$vux.toast.show({
             text: '服务器返回数据格式错误',
             onHide: tv.goTaskList(),
             time: 2000,
             type: 'warn'
          })
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
      console.log('before downloadvalidate------', tv.searchType)
      if (tv.searchType === 'doc') {
        console.log('do downloadvalidate')
        tv.downloadvalidate(tv.detailsData)
      }
      tv.backUp('details')
    },
    /* 前往任务列表 */
    goTaskList: function () {
      window.location.href = host + "redirectToTaskList?userWxh=" + urlGetParamsForObject(window.location.href).userWxh
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
                    tv.getResultList()
                  } else {
                    tv.currentStatus = 'onlyDetails'
                    tv.getDetails(obj)
                  }
                  break;
      case 'mat': tv.searchType = 'matter';
                  tv.getResultList()
                  break;
      case 'apply': tv.searchType = 'apply';
                    tv.getResultList()
                    /*tv.currentStatus = 'onlyDetails';
                    tv.getDetails(obj)*/
                    break;
      case 'task': tv.searchType = 'task';
                   tv.getResultList()
                   /*tv.currentStatus = 'onlyDetails';
                   tv.getDetails(obj)*/
                   break;
      case 'proj': tv.currentStatus = 'onlyDetails';
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
/* http error */
.httpError {
  background-color: #ffe26d;
  color: #000;
  text-align: center;
  padding: 15px;
  overflow: hidden;
}
.bomStructureModal .weui-dialog {
  width: 100%;
  max-width: 100%;
}
</style>
