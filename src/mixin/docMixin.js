/*
 * type: mixin
 * name: 文档操作
 * function: 文档流程获取、下载信息获取、下载
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
 *   }
 * }
 * creator: heyunjiang
 * time: 2018.4.2
 */
import request from '../utils/request.js'
import {host} from '../utils/config.js'
import { downloadFileForUrl } from 'hyj-func'

const DocMixin = {
  data () {
  	return {
  	  downloadFileInfo: {
        code: 'F',
        message: '',
        downloadUrl: ''
      },
      workFlowInfo: {
        code: 'F',
        list: []
      }
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
     * 2 获取并判断下载详情
     * @require obj 任务详细信息
     * 通过任务详情，获取对应文档下载详情
     */
    downloadvalidate: function (obj) {
      if(typeof(obj) === 'undefined') {return ;}
      const tv = this
      /* 获取任务详情信息 */
      const requestObj = {
        url: host + 'wxservice/downloadvalidate',
        method: 'post',
        data: {
          docName: obj.docName,
          docNum: obj.docNum,
          docVer: obj.docVer,
          docType: obj.docFormat || obj.docType,
        }
      }
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.downloadFileInfo = data.data
        }
        tv.$vux.loading.hide()
      }).catch(function (error) {
        console.log(error)
      })
    },
    /* 3 文件下载 */
    fileDownload: function () {
      const tv = this
      if (this.downloadFileInfo.code == 'S') {
        let url = this.downloadFileInfo.downloadUrl
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
          msg: tv.downloadFileInfo.message&&tv.downloadFileInfo.message.length>0?tv.downloadFileInfo.message:'获取下载信息失败' || '获取下载信息失败'
        }
      }
    },
  }
}

export default DocMixin
