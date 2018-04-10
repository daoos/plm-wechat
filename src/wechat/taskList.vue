<template>
  <div id="app">
    <popup v-model="httpError.show" :popup-style="{zIndex: '6001'}" position="top" :show-mask="false">
      <div class="httpError">
        {{httpError.msg}}
      </div>
    </popup>
    <div v-if="currentStatus === 'taskList'" class="taskList">
      <group>
        <cell
        :title="'审签任务('+taskListData.CheckTask.length+')'"
        is-link
        :border-intent="false"
        :arrow-direction="cellBoxPanel.checkUITask ? 'up' : 'down'"
        @click.native="cellBoxPanel.checkUITask = !cellBoxPanel.checkUITask"></cell>

        <ul @click="goDetail" class="slide" :class="cellBoxPanel.checkUITask?'animate':''">
          <li v-for="item in taskListData.CheckTask" taskCategory="CheckTask" :detailType="item.tasktype" :taskid="item.taskid">{{item.checkobject}}&nbsp;&nbsp;{{item.taskname}}</li>
        </ul>

        <cell
        :title="'项目任务('+taskListData.PROJECT_TASK.length+')'"
        is-link
        :border-intent="false"
        :arrow-direction="cellBoxPanel.projectUITask ? 'up' : 'down'"
        @click.native="cellBoxPanel.projectUITask = !cellBoxPanel.projectUITask"></cell>

        <ul @click="goDetail" class="slide" :class="cellBoxPanel.projectUITask?'animate':''">
          <li v-for="item in taskListData.PROJECT_TASK" taskCategory="PROJECT_TASK" :detailType="item.tasktype" :taskid="item.taskid">{{item.taskname}}</li>
        </ul>

        <cell
        :title="'变更通知('+taskListData.CHANGE_LISTENER.length+')'"
        is-link
        :border-intent="false"
        :arrow-direction="cellBoxPanel.changeNoticeUITask ? 'up' : 'down'"
        @click.native="cellBoxPanel.changeNoticeUITask = !cellBoxPanel.changeNoticeUITask"></cell>

        <ul @click="goDetail" class="slide" :class="cellBoxPanel.changeNoticeUITask?'animate':''">
          <li v-for="item in taskListData.CHANGE_LISTENER" taskCategory="CHANGE_LISTENER" :detailType="item.tasktype" :taskid="item.taskid">{{item.infoObj.docid}}&nbsp;,&nbsp;{{item.infoObj.docver}}</li>
        </ul>

        <cell
        :title="'发放文档('+taskListData.FAFANG_NOTICE.length+')'"
        is-link
        :border-intent="false"
        :arrow-direction="cellBoxPanel.faFangUITask ? 'up' : 'down'"
        @click.native="cellBoxPanel.faFangUITask = !cellBoxPanel.faFangUITask"></cell>

        <ul @click="goDetail" class="slide" :class="cellBoxPanel.faFangUITask?'animate':''">
          <li v-for="item in taskListData.FAFANG_NOTICE" taskCategory="FAFANG_NOTICE" :detailType="item.tasktype" :taskid="item.taskid">{{item.infoObj.docid}}&nbsp;,&nbsp;{{item.infoObj.docname}}&nbsp;,&nbsp;{{item.infoObj.docver}}&nbsp;&nbsp;发放文档</li>
        </ul>
      </group>
    </div>
    <div v-if="currentStatus === 'onlyDetails'">
      <div class="backbtn" @click="backUp('taskList')"></div>
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
 * @currentStatus 界面切换
 * taskList: 任务列表
 * onlyDetails: 任务详情
 * designer: heyunjiang
 * time: 2018.3.22
 */
/*
 * @cellBoxPanel 展开栏
 * projectUITask: 项目任务
 * checkUITask: 审签任务
 * changeNoticeUITask: 变更通知
 * faFangUITask: 发放文档
 * designer: heyunjiang
 * time: 2018.3.23
 */
/*
 * @detailType 当前访问的任务类型
 * PROJECT_TASK
 * CHECK_DOC_TASK
 * CHECK_BOM_TASK
 * CHECK_CHGAPP_TASK
 * CHECK_CHG_TASK
 * CHANGE_LISTENER
 * FAFANG_NOTICE
 */
import { Group, Cell, CellBox, Popup, Icon, XButton, XDialog } from 'vux'
import { downloadFileForUrl } from 'hyj-func'
import CheckMixin from '../mixin/checkMixin'
import DocMixin from '../mixin/docMixin'
import TaskCheck from '../components/TaskCheck'
import Transfer from '../components/Transfer'
import Details from '../components/details'
import TimeLineBox from '../components/TimeLineBox'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'TaskList',
  components: {
    Group,
    Cell,
    CellBox,
    Popup,
    Icon,
    Details,
    TimeLineBox,
    XButton,
    XDialog,
    TaskCheck,
    Transfer
  },
  mixins: [CheckMixin, DocMixin],
  data () {
    return {
      httpError: { //popup 展示网络请求数据错误
        show: false,
        msg: ''
      },
      cellBoxPanel: {
        checkUITask: true,
        projectUITask: false,
        changeNoticeUITask: false,
        faFangUITask: false
      },
      currentStatus: 'taskList', // 用于切换界面
      detailType: 'PROJECT_TASK', //当前任务类型
      taskListData: {
        PROJECT_TASK: [],
        CheckTask: [],
        CHANGE_LISTENER: [],
        FAFANG_NOTICE: []
      },
      detailsData: {}, //任务详细数据
      selectedTasks: [], //当前选中任务(任务概要信息，设为数组，方便后期批量审批扩展)
      bomStructureModalStatus: false //BOM结构展示
    }
  },
  methods: {
    test: function () {},
    /* 1. 获取任务列表 */
    getTaskList: function () {
      const tv = this
      /* 获取任务列表信息 */
      const requestObj = {
        url: host + 'wxservice/wxtasklist',
        method: 'post'
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          const result = data.data
          /* 可提取至hyj-func，对象赋值 */
          Object.keys(tv.taskListData).forEach(item => {
            if (typeof(result[item]) !== 'undefined') {
              tv.taskListData[item] = [] //清空数组
              Object.keys(result[item]).forEach(jtem => {
                if (result[item][jtem].tasktype === 'CHANGE_LISTENER') {
                  result[item][jtem].infoObj = JSON.parse(result[item][jtem].jsonobj)
                  result[item][jtem].taskid = result[item][jtem].infoObj.chgNoticeID+''
                  result[item][jtem].receivetime = result[item][jtem].infoObj.fromAppID
                  result[item][jtem].activeid = result[item][jtem].infoObj.chgTaskID
                }
                if (result[item][jtem].tasktype === 'FAFANG_NOTICE') {
                  result[item][jtem].infoObj = JSON.parse(result[item][jtem].jsonobj)
                  result[item][jtem].taskid = result[item][jtem].infoObj.outputid+''
                  result[item][jtem].receivetime = result[item][jtem].infoObj.docid
                  result[item][jtem].activeid = result[item][jtem].infoObj.docver
                }
                tv.taskListData[item].push(result[item][jtem])
              })
            }
          })
        } else {
          tv.httpError = {
            show: true,
            msg: data.error.response.statusText||'网络错误'
          }
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 2. 获取任务详情
     * @require obj 任务概略信息
     * 通过任务简要信息，获取任务详细信息，完成之后获取流程信息、对应下载或变更信息
     */
    getDetails: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
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
        if (data.status === 200 && typeof(data.data) === 'object' && data.data !== null) {
          tv.detailsData = data.data
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
        } else {
          tv.httpError = {
            show: true,
            msg: '服务器返回数据格式错误'
          }
          tv.$vux.loading.hide()
        }
      }).catch(function (error) {
        console.log(error)
      })
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
     * 3.2.1 获取变更通知
     * 通过任务详情，获取对应变更通知详情
     */
    getchgnotifylist: function () {
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/chgnotifylist',
        method: 'post',
        data: {
          id: tv.detailsData.taskid,
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        tv.$vux.loading.hide()
        if (data.status === 200) {
          Modal.info(data.data)
        }
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
    /* 3.3.2 打开BOM结构模态框 */
    goBomStructure: function () {
      const tv = this
      tv.bomStructureModalStatus = true
    },
    /* 前往任务详情 */
    goDetail: function (e) {
      const li = e.target
      const tv = this
      /* 进入详情 */
      if (li.tagName.toLowerCase() === 'li') {
        const detailType = li.getAttribute('detailType')
        const taskid = li.getAttribute('taskid')
        const taskCategory = li.getAttribute('taskCategory')
        let currentLi = {}
        tv.taskListData[taskCategory].forEach(item => {
          if (item.taskid === taskid) {
            currentLi = item
          }
        })
        tv.detailType = detailType
        tv.selectedTasks.length = 0 //清空当前选中任务
        tv.selectedTasks.push(currentLi)
        tv.currentStatus = 'onlyDetails'
        tv.getDetails(currentLi)
      }
    },
    /* 当加入审批mixin时, 需要的必须函数 */
    afterCheck: function () {
      this.currentStatus = 'taskList'
      this.getTaskList()
    },
    /* 跳转控制 */
    backUp: function (type) {
      this.currentStatus = type
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
  },
  mounted: function () {
    // 数据初始化
    this.taskListData = {
      PROJECT_TASK: [],
      CheckTask: [],
      CHANGE_LISTENER: [],
      FAFANG_NOTICE: []
    }
    this.getTaskList()
  }
}
</script>

<style>
#app {
  font-family: "Microsoft Yahei", "AvenirNext-Regular", "Helvetica Neue", "lucida grande", "PingFangHK-Light", "STHeiti", "Heiti SC", "Hiragino Sans GB", "Microsoft JhengHei", SimHei, "WenQuanYi Micro Hei", "Droid Sans", "Roboto", Helvetica, Tahoma, Arial, "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
}
.taskList {
  /*padding-top: 20px;*/
}
.taskList li {
  list-style: none;
  height: auto;
  line-height: 40px;
  background: #fbfbfb;
  padding-left: 32px;
  overflow: scroll;
}
.taskList li:nth-of-type(2n+1) {
  background: #fffff9;
}
.ivu-collapse>.ivu-collapse-item>.ivu-collapse-header {
  text-align: left;
}
.ivu-collapse-content {
  padding: 0;
}
.ivu-collapse-content>.ivu-collapse-content-box {
  padding: 0;
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
  left: 7px;
}
.detailFooterBtn {
  padding: 0 20px 20px;
  /* display: flex;
  flex-flow: row nowrap;
  justify-content: space-between; */
}
.longTouchHeader {
  display: inline-block;
  height: 38px;
  line-height: 38px;
  width: 90%;
}
/* 重写模态框样式 */
.ivu-modal-footer {
  border: none;
}
/* test */
.slide {
  overflow: hidden;
  max-height: 0;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
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
