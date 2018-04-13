<template>
  <div id="app">
    <popup v-model="httpError.show" :popup-style="{zIndex: '6001'}" position="top" :show-mask="false">
      <div class="httpError">
        {{httpError.msg}}
      </div>
    </popup>
    <div v-if="currentStatus === 'error'">
      {{errorDefaultInfo.content}}
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
    <!-- <x-dialog
        v-model="bomStructureModalStatus"
        title="BOM结构">
        BOM结构
        <div slot="footer"></div>
    </x-dialog> -->
  </div>
</template>

<script>
/*
 * @currentStatus
 * error: 模板消息展示获取错误展示
 * onlyDetails: 通过模板消息进入的任务详情
 * designer: heyunjiang
 * time: 2018.4.10
 */
import { Group, Popup, Icon, XButton, XDialog } from 'vux'
import { urlGetParamsForObject } from 'hyj-func'
import TimeLineBox from '../components/TimeLineBox'
import Details from '../components/details'
import TaskCheck from '../components/TaskCheck'
import Transfer from '../components/Transfer'
import CheckMixin from '../mixin/checkMixin'
import DocMixin from '../mixin/docMixin'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'Wxtasktemplate',
  components: {
    Details,
    Group,
    Popup,
    Icon,
    XButton,
    XDialog,
    TimeLineBox,
    TaskCheck,
    Transfer
  },
  mixins: [CheckMixin, DocMixin],
  data () {
    return {
      errorDefaultInfo: {
        content: '扫码不合要求'
      },
      httpError: { //popup 展示网络请求数据错误
        show: false,
        msg: ''
      },
      currentStatus: 'onlyDetails', // 用于切换界面
      detailType: '', // 详情类型
      selectedTasks: [], // 选中任务简要信息列表，如果单一任务，则 length = 1
      detailsData: {} // 单一任务详细信息
    }
  },
  methods: {
    /*
     * 进入任务详情
     * 包含: 文档审批、变更申请审批、变更审批、项目任务、发放文档、变更通知
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
          taskType: obj.tasktype
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200 && typeof(data.data) === 'object' && data.data !== null) {
          tv.detailsData = data.data
          tv.detailType = data.data.taskTypes
          tv.selectedTasks.push(obj) // 增加审批任务
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
            //设计BOM审批
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
    },
    /* 当加入审批mixin时, 需要的必须函数 */
    afterCheck: function () {
      this.goTaskList()
    },
    /* 前往任务列表 */
    goTaskList: function () {
      window.location.href = host + "redirectToTaskList?userWxh=" + urlGetParamsForObject(window.location.href).userWxh
    }
  },
  mounted: function () {
    // sessionStorage.setItem('userWxh', 'ossKL1kv1VKPFGr7lanAasofrzb4')
    const obj = urlGetParamsForObject(window.location.href)
    const tv = this
    tv.getDetails(obj)
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
</style>
