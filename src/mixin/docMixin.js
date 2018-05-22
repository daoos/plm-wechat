/*
 * type: mixin
 * name: 任务附带操作
 * function: 流程获取、下载信息获取(任务页下载文档、)、下载、BOM结构、变更通知文档详情、变更申请书详情
 * mentions: 这里只包含基础数据和方法，对于组件的使用需要自行引入
 * example: taskList.vue
 * includes: data, methods
 * previous vux plugin for vue: {
 *   toast,
 *   loading
 * }
 * previous data requires: {
 *   backUp: function,
 *   httpError: { //错误提示
 *     show: false,
 *     msg: ''
 *   }
 * }
 * creator: heyunjiang
 * time: 2018.4.2
 * modifier: heyunjiang
 * modifyTime: 2018.4.16
 * 注意：名称叫docMixin，因为当初只考虑到文档审签，后来也有变更审签、变更申请审签、设计BOM审签也需要流程图和下载信息
 */
import request from '../utils/request.js'
import {host} from '../utils/config.js'
import { downloadFileForUrl } from 'hyj-func'

const DocMixin = {
  data () {
  	return {
  	  downloadFileInfo: { //任务页下载详情
        code: 'F',
        message: '',
        downloadUrl: ''
      },
      chgDownloadFileInfo: { // 变更申请、变更通知下载详情
        code: 'F',
        message: '',
        downloadUrl: ''
      },
      workFlowInfo: {
        code: 'F',
        list: []
      },
      bomStructureModalStatus: false, //BOM结构展示
      bomStructuresDatas: [], // bom结构数据
      chgApplyBookDetail: {}, //变更申请书详情
      chgNotifyListDetail: {} //变更通知详情
  	}
  },
  methods: {
  	/* 
     * 1 获取文档流程详情
     * @require obj 任务详细信息 + activeid
     * 通过任务详情，获取对应流程详情
     */
    getdocworkflow: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/getdocworkflow',
        method: 'post',
        data: {
          activeid: obj.activeid,
          docNum: obj.docNum,
          docVer: obj.docVer,
          workid: obj.taskid,
        }
      }
      tv._getWorkFolw(requestObj)
    },
    /* 
     * 2 获取变更流程详情
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
      tv._getWorkFolw(requestObj)
    },
    /* 
     * 3 获取BOM审批流程详情
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
          bomname: obj.bomName,
          bomver: obj.bomVer,
          partid: obj.materialNum,
          partver: obj.materialVer,
          workid: obj.taskid
        }
      }
      tv._getWorkFolw(requestObj)
    },
    /* 
     * 4 获取变更申请审批流程详情
     * @require obj 任务详细信息 + activeid
     * 通过任务详情，获取对应流程详情
     */
    getchgapplyworkflow: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/getChgApplyWorkFlow',
        method: 'post',
        data: {
          activeid: obj.activeid,
          workid: obj.taskid
        }
      }
      tv._getWorkFolw(requestObj)
    },
    /* 
     * 5 获取BOM结构
     * 通过任务详情，获取对应BOM结构
     */
    _getbomstructuretable: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/getbomstructuretable',
        method: 'post',
        data: {
          bomname: obj.bomName,
          bomver: obj.bomVer,
          partid: obj.materialNum,
          partver: obj.materialVer
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          const result = data.data
          if (result.code === 'S') {
            tv.bomStructuresDatas = result.list
            tv.bomStructureModalStatus = true
          } else {
            tv.httpError = {
              show: true,
              msg: result.message || '服务器返回数据格式错误'
            }
          }
        } else {
          tv.httpError = {
            show: true,
            msg: result.message || '服务器返回数据格式错误'
          }
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 6 获取变更申请书详情
     * 通过任务详情，获取对应申请书详情
     */
    _getChgApplyBook: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/chgApplyBook',
        method: 'post',
        data: {
          id: obj.taskid
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          const result = data.data
          if (result.status === '0') {
            tv.chgApplyBookDetail = result.data[0] || {}
            tv.chgDownloadvalidate(result.data[0] || '')
            tv.backUp('chgApplyBookDetails')
          } else if(result.status === '1') {
            tv.httpError = {
              show: true,
              msg: result.message || '无变更申请书'
            }
            tv.$vux.loading.hide()
          } else {
            tv.httpError = {
              show: true,
              msg: result.message || '服务器返回数据格式错误'
            }
            tv.$vux.loading.hide()
          }
        } else {
          tv.httpError = {
            show: true,
            msg: result.message || '服务器返回数据格式错误'
          }
          tv.$vux.loading.hide()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 7 获取变更通知文档详情
     * 通过任务详情，获取对应通知详情
     * status： 0->有变更通知 1->无变更申请书
     */
    _getChgNotifyList: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/chgNotifyList',
        method: 'post',
        data: {
          id: obj.taskid
        }
      }
      tv.$vux.loading.show()
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          const result = data.data
          if (result.status === '0') {
            tv.chgNotifyListDetail = result[0] || {}
            tv.chgDownloadvalidate(result[0] || '')
            tv.backUp('chgNotifyDetails')
          } else if(result.status === '1') {
            tv.httpError = {
              show: true,
              msg: result.message || '此变更通知无变更申请书'
            }
            tv.$vux.loading.hide()
          } else {
            tv.httpError = {
              show: true,
              msg: result.message || '服务器返回数据格式错误'
            }
            tv.$vux.loading.hide()
          }
        } else {
          tv.httpError = {
            show: true,
            msg: result.message || '服务器返回数据格式错误'
          }
          tv.$vux.loading.hide()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 8 获取并判断下载详情--文档审签
     * @require obj 任务详细信息
     * 通过任务详情，获取对应文档下载详情
     */
    downloadvalidate: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      if (typeof(obj.docName) === 'undefined') {
        tv.$vux.loading.hide()
        return ;
      }
      console.log('before ajax', obj)
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/downloadvalidate',
        method: 'post',
        data: {
          docName: obj.docName||obj.docname,
          docNum: obj.docNum||obj.docid,
          docVer: obj.docVer||docver,
          docType: obj.docFormat || obj.docType
        }
      }
      console.log('requestObj', requestObj)
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.downloadFileInfo = data.data
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 9 获取并判断下载详情--变更审签、变更申请审签
     * @require obj 任务详细信息
     * 通过任务详情，获取对应文档下载详情
     */
    chgDownloadvalidate: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      if (typeof(obj.docName) === 'undefined') {
        tv.$vux.loading.hide()
        return ;
      }
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/downloadvalidate',
        method: 'post',
        data: {
          docName: obj.docName,
          docNum: obj.docNum,
          docVer: obj.docVer,
          docType: obj.docFormat || obj.docType
        }
      }
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.chgDownloadFileInfo = data.data
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 
     * 文件下载 
     * @require downloadFileInfo 'object'
     */
    fileDownload: function (downloadFileInfo) {
      if(typeof(downloadFileInfo) !== 'object') {
        this.httpError = {
          show: true,
          msg: '传参错误'
        }
      }
      const tv = this
      if (downloadFileInfo.code == 'S') {
        let url = downloadFileInfo.downloadUrl
        // 微信环境判断
        if (navigator.userAgent.indexOf('MicroMessenger')>-1) {
          url += '&isDownload=0'
        } else {
          url += '&isDownload=1'
        }
        // 进入下载页
        window.location.href=url
      } else {
        tv.httpError = {
          show: true,
          msg: downloadFileInfo.message&&downloadFileInfo.message.length>0?downloadFileInfo.message:'获取下载信息失败' || '获取下载信息失败'
        }
      }
    },
    /* 获取流程图 */
    _getWorkFolw: function (requestObj) {
      if (typeof(requestObj) === 'undefined') {return ;}
      const tv = this
      request(requestObj).then(function (data) {
        if (data.status === 200 && typeof(data.data) === 'object') {
          tv.workFlowInfo = data.data
        } else {
          tv.httpError = {
            show: true,
            msg: '服务器返回数据格式错误'
          }
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}

export default DocMixin
