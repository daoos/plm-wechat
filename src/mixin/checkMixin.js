/*
 * type: mixin
 * name: 任务审批
 * function: 用于需要审批的组件选项，支持批量审批
 * mentions: 这里只包含基础数据和方法，对于组件的使用需要自行引入
 * example: taskList.vue
 * includes: data, methods
 * previous vux plugin for vue: {
 *   toast,
 *   loading
 * }
 * previous data requires: {
 *   httpError: { //错误提示
 *     show: false,
 *     msg: ''
 *   },
 *   taskListData: {CheckTask: []}, // 当前任务简要信息列表集合，用于批量审批，单一审批不必传入
 *   detailsData: {}, // 单一任务详情
 *   selectedTasks: [], // 选中任务简要信息列表，如果单一任务，则 length = 1
 *   detailType: '' // 当前任务类型
 * }
 * previous methods requires: {
 *   afterCheck: Function // 结束审批
 * }
 * creator: heyunjiang
 * time: 2018.3.29
 * update: 2018.4.11
 */
import request from '../utils/request.js'
import {host} from '../utils/config.js'

const CheckMixin = {
  data () {
  	return {
  	  isMultipleCheck: false, //是否是批量审批
      mutipleListValue: [], //批量审批-当前选中值
      mutipleList: [], //批量审批-当前选项
      userAuthority: {  // 审批权限
        approveYN: 'S',
        bill: {
          opertype: '0'
        },
        code: 'S'
      },
      modalStatus: {
        checkModalStatus: false, //审批弹出框状态
        doTransfor: false //转发
      },
      transforPersonList: [],
      bomStructure: {             //Bom结构，用于Modal展示
        code: 'F',
        list: []
      }
  	}
  },
  methods: {
  	/* 1. 审批开始, 进入审批模态框, 获取当前用户的执行权限, 弹出审批模态框 */
    goCheckModal: function () {
      const tv = this
      if (tv.isMultipleCheck) {
        // 批量审批
        tv.modalStatus = {
          checkModalStatus: true,
          doTransfor: false
        }
      } else {
        let workid, billtypename
        switch (tv.detailsData.taskTypes) {
          case 'CHECK_DOC_TASK': workid = tv.detailsData.taskid;
                                 billtypename = '文档审签任务';
                                 break;
          case 'CHECK_BOM_TASK': workid = tv.detailsData.taskid+'$$$'+tv.detailsData.bomName+'$$$'+tv.detailsData.bomVer+'$$$'+tv.detailsData.materialNum+'$$$'+tv.detailsData.materialVer;
                                 billtypename = 'BOM审签任务';
                                 break;
          case 'CHECK_CHGAPP_TASK': workid = tv.detailsData.taskid;
                                 billtypename = '变更申请审签任务';
                                 break;
          case 'CHECK_CHG_TASK': workid = tv.detailsData.taskid;
                                 billtypename = '变更审签任务';
                                 break;
        }
        console.log('2', tv.selectedTasks, tv.selectedTasks[0])
        // 单一审批
        const requestObj = {
          url: host + 'wxservice/getApproveInfo',
          method: 'post',
          data: {
            activeId: tv.selectedTasks[0].activeid,
            billtypename,
            receivetime: tv.selectedTasks[0].receivetime,
            taskType: tv.selectedTasks[0].tasktype,
            workid
          }
        }
        console.log('requestObj', requestObj)
        tv.$vux.loading.show()
        request(requestObj).then(function (data) {
          if (data.status === 200) {
            tv.userAuthority = data.data
            tv.modalStatus = {
              checkModalStatus: true,
              doTransfor: false
            }
          }else {
            tv.httpError = {
              show: true,
              msg: data.error.message
            }
          }
          tv.$vux.loading.hide()
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    /* 2 打开执行转发模态框，并获取转发人列表信息 */
    goDoTransfor: function () {
      const tv = this
      if (this.isMultipleCheck && !this._multipleCheckIsSame()) {
        tv.httpError = {
          show: true,
          msg: '请选择相同类型任务'
        }
        return ;
      }
      let url, data
      const firstTask = tv.selectedTasks[0]
      if (this.isMultipleCheck) {
        url = host + 'wxservice/getTranstaskPerson'
        data = "<id>"+firstTask.taskid+"</id><type>"+firstTask.tasktype+"</type><personid>"+firstTask.personid+"</personid>"
        data += "<receivetime>"+firstTask.receivetime+"</receivetime><activeid>"+firstTask.activeid+"</activeid>"
      } else {
        url = host + 'wxservice/single/getTranstaskPerson'
        data = {
          activeid: firstTask.activeid,
          receivetime: firstTask.receivetime,
          taskId: firstTask.taskid,
          type: firstTask.tasktype
        }
      }
      /* 获取转发人列表信息 */
      const requestObj = {
        url,
        method: 'post',
        data
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          let arr = []
          arr.push(data.data.personlist.map(item=>{
            return {
              name: item.personname,
              value: item.personid
            }
          }))
          tv.transforPersonList = arr
          tv.modalStatus = {
            checkModalStatus: false,
            doTransfor: true
          }
        }else {
          tv.httpError = {
            show: true,
            msg: data.error.message
          }
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /*
     * 3 任务提交, 结束审批
     * @bool true | false for 提交/通过 | 打回/不通过
     * @approveDescription 描述信息
     */
    submitTask: function(bool, approveDescription) {
      const tv = this, dd = this.detailsData, st = this.selectedTasks[0], ot = tv.userAuthority.bill.opertype
      if (typeof(bool) !== 'boolean') {
        tv.finishTask()
      }
      // 构造 url, data, action
      let url = '', data, action = 'C'
      if (ot == 0) {
        if (bool) {
          action = 'C'
        } else {
          action = 'R'
        }
      } else {
        if (bool) {
          action = 'Y'
        } else {
          action = 'N'
        }
      }
      if (this.isMultipleCheck) {
        // 批量审批
        url = host + 'wxservice/doMultiProceedTask';
        let result = "";
        tv.selectedTasks.forEach(item=>{
          result += "<work><workid>"+item.taskid+"</workid>";
          result += "<billtypename>"+item.tasktypename+"</billtypename>";
          result += "<activeid>"+item.activeid+"</activeid>";
          result += "<billobjectkey>"+decodeURI(tv._multipleCheckGenerateBillobjectkey(item).replace(/\\"/g,"\'"))+"</billobjectkey>";
          result += "<userid>"+item.personid+"</userid>";
          result += "<action>"+action+"</action>";
          result += "<description>"+approveDescription+"</description></work>";
        })
        data = result
      } else {
        // 单一审批
        switch (tv.detailType) {
          case 'CHECK_DOC_TASK':url = host + 'wxservice/approveDoc';
                                data = {
                                  workid: dd.taskid,
                                  activeId: st.activeid,
                                  docNum: dd.docNum,
                                  docVer: dd.docVer,
                                  action,
                                  description: approveDescription
                                };
                                break;
          case 'CHECK_BOM_TASK':url = host + 'wxservice/approveBomDesign';
                                data = {
                                  workid: dd.taskid,
                                  activeId: st.activeid,
                                  bomname: dd.bomName,
                                  bomver: dd.bomVer,
                                  partid: dd.materialNum,
                                  partver: dd.materialVer,
                                  action,
                                  description: approveDescription
                                };
                                break;
          case 'CHECK_CHGAPP_TASK':url = host + 'wxservice/approveChgApply';
                                data = {
                                  workid: dd.taskid,
                                  activeId: st.activeid,
                                  action,
                                  description: approveDescription
                                };
                                break;
          case 'CHECK_CHG_TASK':url = host + 'wxservice/approveChg';
                                data = {
                                  workid: dd.taskid,
                                  activeId: st.activeid,
                                  action,
                                  description: approveDescription
                                };
                                break;
        }
      }
      
      // 提交任务
      const requestObj = {
          url,
          method: 'post',
          data
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        tv.$vux.loading.hide()
        if (data.status === 200) {
          let des = [];
          data.data.forEach(function(item){
              if(item.tranflag != 0){
                /*des.push(tv.selectedTasks.filter(jtem=>{
                  return item.workid === jtem.taskid
                }).taskname)*/
                des.push(item.description)
              }
          })
          if (des.length > 0) {
            tv.httpError = {
              show: true,
              msg: des.join('、')
            }
          } else {
            tv.$vux.toast.show({
             text: '处理成功',
             onHide: tv.finishTask(),
             time: 2000
            })
          }
        }else {
          tv.httpError = {
            show: true,
            msg: data.error.message
          }
        }
      }).catch(function (error) {
          console.log(error)
      })
    },
    /* 4 提交转发, 结束审批 */
    submitTrans: function (des, selectedPersonId) {
      const tv = this
      let url = '', data
      if (this.isMultipleCheck) {
        // 批量审批
        url = host + 'wxservice/trancheckstask';
        let result = "";
        tv.selectedTasks.forEach(item=>{
          result += "<work><id>"+item.taskid+"</id>";
          result += "<type>"+item.tasktype+"</type>";
          result += "<personid>"+item.personid+"</personid>";
          result += "<trpersonid>"+selectedPersonId+"</trpersonid>";
          result += "<tranReason>"+des+"</tranReason>";
          result += "<receivetime>"+item.receivetime+"</receivetime>";
          result += "<activeid>"+item.activeid+"</activeid></work>";
        })
        data = result
      } else {
        url = host + 'wxservice/single/trancheckstask';
        data = {
            taskId: tv.detailsData.taskid,
            type: tv.detailType,
            trpersonid: selectedPersonId,
            tranReason: des,
            receivetime: tv.selectedTasks[0].receivetime,
            activeid: tv.selectedTasks[0].activeid
        }
      }
      const requestObj = {
          url,
          method: 'post',
          data
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        tv.$vux.loading.hide()
        if (data.status === 200) {
          let des = [];
          data.data.forEach(function(item){
              if(item.tranflag != 0){
                /*des.push(tv.selectedTasks.filter(jtem=>{
                  return item.workid === jtem.taskid
                }).taskname)*/
                des.push(item.description)
              }
          })
          if (des.length > 0) {
            tv.httpError = {
              show: true,
              msg: des.join('、')
            }
          } else {
            tv.$vux.toast.show({
             text: '转发成功',
             onHide: tv.finishTask(),
             time: 2000
            })
          }
        }else {
          tv.httpError = {
            show: true,
            msg: data.error.message
          }
        }
      }).catch(function (error) {
          console.log(error)
      })
    },
    /* 5 结束审批, 调用 afterCheck */
    finishTask: function () {
      this.modalCancel()
      this.afterCheck()
    },
    /* 6 取消: 点击取消按钮，隐藏所有框 */
    modalCancel: function () {
      this.modalStatus = {
        checkModalStatus: false,
        doTransfor: false
      }
      this.isMultipleCheck = false
    },
    /* 
     * 7 批量审批开始
     */
    multipleCheck: function (e) {
      e.preventDefault() // 解决android 在浏览器中打开
      const tv = this
      tv.isMultipleCheck = true
    },
    /*
     * 8 执行批量审批
     * 实现了：封装selectedTasks、进入 goCheckModal
     */
    multipleCheckStart: function () {
      const tv = this
      // 封装 selectedTasks 信息
      if (tv.taskListData && tv.taskListData.CheckTask) {
        tv.selectedTasks = tv.mutipleListValue.map(item => {
          return tv.taskListData.CheckTask.filter(jtem => {
            return jtem.taskid === item
          })[0]
        })
        if (tv.selectedTasks.length < 1) {
          tv.httpError = {
            show: true,
            msg: '当前无需要审签的任务'
          }
          return false;
        }
        tv.goCheckModal()
      } else {
        tv.multipleCheckCancle()
      }
    },
    /*
     * 9 取消执行批量审批
     */
    multipleCheckCancle: function () {
      const tv = this
      tv.selectedTasks = []
      tv.mutipleListValue = []
      tv.isMultipleCheck = false
    },
    // 10 验证任务是否全部类型相同
    _multipleCheckIsSame: function () {
      const tv = this
      let isSameTasks = true
      // 验证是否是同一任务类型
      for(let i=1;i<tv.selectedTasks.length;i++) {
        if (tv.selectedTasks[i].tasktype !== tv.selectedTasks[i-1].tasktype) {
          isSameTasks = false
        }
      }
      return isSameTasks
    },
    // 11 批量审批 生成key
    _multipleCheckGenerateBillobjectkey: function (taskInfo){
      if(typeof(taskInfo)!='object'){return '';}
      let billobjectkey = '';
      /*taskInfo.bomName = taskInfo.bomName.replace(/'/g,"/'");
      taskInfo.bomName = encodeURI(taskInfo.bomName);*/
      switch(taskInfo.tasktype) {
        case 'CHECK_DOC_TASK' : billobjectkey += taskInfo.tasktypename + '$$$';
                    billobjectkey += taskInfo.documentId + '$$$';
                    billobjectkey += taskInfo.documentVer;
                    break;
        case 'CHECK_BOM_TASK' : billobjectkey += taskInfo.tasktypename + '$$$';
                    billobjectkey += taskInfo.bomName + '$$$';
                    billobjectkey += taskInfo.partId + '$$$';
                    billobjectkey += taskInfo.partVer + '$$$';
                    billobjectkey += taskInfo.bomVer;
                    break;
        case 'CHECK_CHG_TASK' : billobjectkey += taskInfo.tasktypename + '$$$129';
                    break;
        case 'CHECK_CHGAPP_TASK' : billobjectkey += taskInfo.tasktypename + '$$$85';
                    break;
        default : ;
      }
      billobjectkey = encodeURI(billobjectkey).replace(/'/g,'\\"')
      return billobjectkey;
    }
  }
}

export default CheckMixin
