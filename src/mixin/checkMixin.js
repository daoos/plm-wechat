/*
 * type: mixin
 * name: 任务审批
 * function: 用于需要审批的组件选项
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
 *   taskListData: {CheckTask: []}, // 当前任务简要信息列表集合，用于批量审批
 *   detailsData: {}, // 单一任务详情
 *   selectedTasks: [], // 选中任务简要信息列表，如果单一任务，则 length = 1
 *   detailType: '' // 当前任务类型
 * }
 * previous methods requires: {
 *   afterCheck: Function // 结束审批
 * }
 * creator: heyunjiang
 * time: 2018.3.29
 * update: 2018.4.1
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
      /* 获取转发人列表信息 */
      const requestObj = {
        url: host + 'wxservice/single/getTranstaskPerson',
        method: 'post',
        data: {
          activeid: tv.selectedTasks[0].activeid,
          receivetime: tv.selectedTasks[0].receivetime,
          taskId: tv.detailsData.taskid,
          type: tv.detailType
        }
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
      if (this.isMultipleCheck) {
        // 是否是批量审批
        tv.finishTask()
      }
      // 构造 url, data, action
      let url = '', data = {}, action = 'C'
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
      // 提交任务
      const requestObj = {
          url,
          method: 'post',
          data
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
          if (data.status === 200) {
            if (data.data[0].tranflag !== '-1') {
              tv.$vux.toast.show({
               text: '处理成功',
               onHide: tv.finishTask()
              })
            } else {
              tv.httpError = {
                show: true,
                msg: data.data[0].description
              }
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
    /* 4 提交转发, 结束审批 */
    submitTrans: function (des, selectedPersonId) {
      const tv = this
      const requestObj = {
          url: host + 'wxservice/single/trancheckstask', //单一任务转发
          method: 'post',
          data: {
            taskId: tv.detailsData.taskid,
            type: tv.detailType,
            trpersonid: selectedPersonId,
            tranReason: des,
            receivetime: tv.selectedTasks[0].receivetime,
            activeid: tv.selectedTasks[0].activeid
          }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
          if (data.status === 200) {
            //单一审批
            if (data.data[0].tranflag !== '-1') {
              tv.$vux.toast.show({
               text: '转发成功',
               onHide: tv.finishTask()
              })
            } else {
              tv.httpError = {
                show: true,
                msg: data.data[0].description
              }
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
    },
    /* 
     * 7 批量审批开始
     */
    multipleCheck: function () {
      const tv = this
      tv.isMultipleCheck = true
    },
    /*
     * 8 执行批量审批
     * 实现了：封装selectedTasks、进入 goCheckModal
     */
    multipleCheckStart: function () {
      const tv = this
      let isSameTasks = true
      // 封装 selectedTasks 信息
      if (tv.taskListData && tv.taskListData.CheckTask) {
        tv.selectedTasks = tv.mutipleListValue.map(item => {
          return tv.taskListData.CheckTask.filter(jtem => {
            return jtem.taskid === item
          })[0]
        })
        // 验证是否是同一任务类型
        for(let i=1;i<tv.selectedTasks.length;i++) {
          if (tv.selectedTasks[i].tasktype !== tv.selectedTasks[i-1].tasktype) {
            isSameTasks = false
          }
        }
        if (isSameTasks) {
          tv.goCheckModal()
        } else {
          tv.httpError = {
            show: true,
            msg: '请选择相同类型任务'
          }
        }
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
    }
  }
}

export default CheckMixin
