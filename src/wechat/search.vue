<template>
  <div class="app">
    <popup v-model="httpError.show" :popup-style="{zIndex: '6001'}" position="top" :show-mask="false">
      <div class="httpError">
        {{httpError.msg}}
      </div>
    </popup>
    <div v-if="currentStatus === 'search'" class="searchBox">
      <tab v-model="activeTab">
        <tab-item :value="0" selected><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC0ElEQVRoge2ZvWsUQRTAf0WKFBF33txCCsETAn4QMGpKC4sUlilSXBEkRYqACpb+FykDBjkxCIrgZ2ElKfJHpBGuuN3ZcM0VKa6wWIvd9SZLcpfb3ZsjsA9eMzP73vvtzLx5swu1XAHp0Jw3NFYD9NakapCnMw0+RL8wyKlB4uKqDnv4C86Dj9DPywU+1BD5FCH3nAIYpJ8GMIiQdsElZIMcOZuJE9Sy5Xi/qJ30+VPnEAa1mTkN0FvF7Uic7qMjpxD29JcFCNBbPfwFpxAGvV4RQD973qDvhshHC+JLgHe/qphzjqsHAAhp3DboD1aK/RrgrVQRc87xdAAAuvhLBvXegvgW4j0oG3PO8fQAAE64fssg7zIfEeq7ofGwTMw5x9MFSPq8mxHydgihfxgaj4r6yhmfPgBAgNwwyJvhia1/GhqrRf1ZhqtNo6PGxDAXIZ+t7HTcw18s6hOoFODYILvjxlUOUR2APjBIN4a5cWMrhagKIMJrJrWQOgxQO5co/rYNEtkQHTxvZgAABn3HIL+s6nbS+8RmEaeVZKGiUtp/DVBSaoCLDMQwZ9Dr+ewRolo9/IWL+jPt4i8BBHgrw2f1mjOApJKUv+dliwDZGNWf1DvSTuyrQ6t90KE57wTAldQAFxlID6WBNf37SfuZJRFP0B8bpJ+/H08NoENzPkS1sg14glpOA3x83qYd15+c+Hr9sv5LA7iSGmCCPVB4zacfvGa7B8qs+R7+Yr0HJjVguNaI0HsR0o6QdohqJe3yKmvL1CC7l7mJOQXo4S8aZN8KcjsZr17nASL0Xr5EmDmAK6kBrjxAgGxYeXu7+hDH+bd/TxW41J/9xaQPphDjSEkTRGyQODtbJpLkZvX/+8zAILtFfvJNrmrHJJ9gstnvFH4LIao1ohxwol28J4UBEgj9MkL/cR14hPwO0M9KBZ9JWnituVhCIapVaM3XMiP5B9mUjM4m4OnaAAAAAElFTkSuQmCC" class="hyj-tab1-img">文档</tab-item>
        <tab-item :value="1"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACrElEQVRoge2ZP2gTURzHP0MFhwr3fi8RB4eCRTpUCFjHYhEE/6CTg4NDRweHDh07FBSXDo4dHFU6iqDgVkEQtP4ZHDo4BMzl92I7dKjgeA5J6CW55q7JXe5K84Pvktx79/3kvu+XvBcY17jyL6U0p5hNRf4pEvTRviIfFVmq4nl5+wZgh/I5RfZijEdpWzlTyts/inkwgPlAkcDHruTtH8W+6DVnNhU7A9DAzLbi1QPgML9yMV2jPO1jF33sYivXYWPVHcqT4et3KE8qUo2CqCPLzbm8ysgAWsYjY+GQtagxDlmLidSzQgAo5mnUGMU8GRmAj3moiOv8ZL2pZADyM4CJ8HwBTCiy1Q+gjqx2Ane8v9dAHicyX8Xzovr5EQACh2z4yPnQfM/jOlIMQEuluViAOuZ+tKnkACHtJm2pSQAStd3DzA0IcBR1rIGB18kJAZB72uzraWopDqA7ZgMDjKIyfQKjqNQBFKllEJt+SjdCBdFQT6AIGgPkrTFAFnI1vAWHXY+7tohdyLW3ngB1ZPU4AXx2mJsh89cd8um4ROiLw9xq37OBvabN86K4cYUA2PIxt9v3c3hXFfsh4dhUAZwiS9p7KpE4861Dse2k49NcA/vt7Z2PV9Gu/XMW5tMG6Ni4K3YmBmJo82kDBIp91cBcOoAw84q8773OfGtg7hxcV7qsyNujms9iDQSKvFPMfHvsb+wVxbwOQX6vU7p7MLdXcZg3A5rPBCBQxDUws6F4TGqzJXbHpv36oOYz/SLbr+EthM3WKE+naT5rgEAR32Efdc+3S+miQzaGNZ9lhML6q9iVr3AK4A9nLyj2ZUrmRwIQKBI47HrrSHHo2IwyQj3rIk3zeQBkoUL8mBsD9C1FbhTAaKTqyHIsQJWp04f9q5izfoz6eHNcJ6L+A0X2Jp7BIneTAAAAAElFTkSuQmCC" class="hyj-tab1-img">物料</tab-item>
        <tab-item :value="2"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADF0lEQVRoge1ZsWobQRB9hYsUDtzO6sClChcuHHDhNMGENCauQpo0IR+QD0jhIoXAhQMunOAiXVI4YIghLpQuhavgwgEVCqhwIYh0s/K5dCGIC6XYlZHPK93eaXXBcA+m0868dzczN7MCSpQoUeJOg1FZZch9BVkfAHMuZxToUIEOGGJt1vzGoo0gYNApgwZDU6CdtHMRqDZ6hkENhaBaAOWbiBHOJ4gYE0cdhIvJ3ysEVf3Ub5+JES4ULgAA7AKuhRwriD0FscegHwy6GvfbNqr3CievEFQnC8hicqlwAQyx6U8AbRVMPnjMoF8eBfxm0NNCyMcIFxjU8kh+aC1b8XsFQz5nkHIk1GdQ21jf8YxiiFfeCEegmoKsM8SRIZJG4EqBdroIVpK+ughWGHLbUUybIY4UZN3l22JFD+IBg/5kSIHvPVSepfll0AaDvrn7lTGjsppZQAR64xpEQX50HSMAYADMmbfhKEJsZhagIM4cAzSykB8VoUAnbg9InGUWoHM2tdtc2fLdFQy55FATzdwx0lpm7gIbQQ+0NYF8Z+o5ybTOv2MCbEwrgCHWeOycJF5O698EuTk2G+t7ca79d2y15cs/GPTBkj5Nj/5/Jv1HoM++/INB74sWoECffPkH63n+bqZQBHrEoAtbkZ2D1j35txaxAr2YWsC4NVCb3PYgILkjj1qLcb8yK+cD/RHKv02Zre4yJcZprjFbgQ5THA9f80meUQIAGOLYJQaDWnkETEid26mUVYTD2x1tqbXMAs71F9hRAA0Y9DVyKGq9jsovGfxeKMiHmQXoYNTIKKLfA23ZcraDcNE89bScH5Ku62WKdnORB3SRxQgXYoTzPYhlM8O7EBiw7u2nxmx93maXXYjXeWvKCWYEnsVSrwq7HzoHrTOo6Yu8gjiLEKSuo17BkG99CYgg3xVK3ghY8iVgmq0uN/RiPpFYgyH3tVn3iWuLEc4XLsCsmxZC4tj2RHsQy6Yt2gQUf73eQbiY7EYKtJPWAhm0mxDQnvmV4iR0EDxRoIMsfzHpWzc6ZA87dYkSJUr8X/wDDZkS+49m10EAAAAASUVORK5CYII=" class="hyj-tab1-img" >变更申请</tab-item>
        <tab-item :value="3"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACfUlEQVRoge2ZLXDbQBCFHwgwsGfuVtZMQIBAQECAYUCAoWFBYEBAQUBAQUFBQWYKAgoKAgoDDQMLAwIKAgwKDAoEfN7LOMDAQCDABZITj6y/s1VJHmtnHtFIq/vudvf2JKC22mpLNRdOQ4FORhDdoqUgOhsNXkFeMshj0LxEaQb1jAfPsI4Y9Fry4BeauhDCEIA+VWDgb1Kgk60GGEF0dxIgLoG9Mayr9CpCZwx6KhRgDuxpCEdDOIxW+xn0bdWhvDeYiI+FAbhwGgxylx4cTmA32S9lb8406C4rgIJ1USCAEAyaLT34ElxzcwDwGNZR2v0T2Pvh9xmF0AR2cxFCLoQINrN5DgDzMeizgnWRLHnJoOnGSRy8eBS1nJUNoWUbg67jnG0AMA3CI0kvVQXwJrCbaffPgT0G/dkYIEjeHoN+5bUCGvJ2DLpOEsO64Yj9JzMAQz68L6d8CEC8PAAKyYFQGfWCa4OQw0FWAIb8UijABPb+UitwoCA6MU6H/moliR45p5bcOAdGEF0N6kfFYxna2W609IGvDaAgOhr0nSO29UoDMOjHIgk1rJ/PkMcxTgfpSbyOVipedoCgEww9aB9GOH0yWk5Di4LIvAJ++fQ7Qwb1GK02r1YiT4P6GnT3H9TniNJrnAP+iUyea9DvsuN/LYCkZs6fIXmfZUY5dJqrCsBjdj/WVSkADOsDg4YJTjNWoXx28swALpzG+5HSaTDkednxnxkg4gvElNFqa8i/WwugQAccc8yrHEA4hEawDzXkbdmDNwJYGG97M1cD1ABhyVMjgIQ2ugzNjH8xAYCC9ZXL/082U6Az48EvbPkrRdFiyNO1Zr622nbE/gHrJJo16FqdUwAAAABJRU5ErkJggg==" class="hyj-tab1-img">变更任务</tab-item>
      </tab>
      <group v-if="activeTab === 0">
        <x-input label-width="80px" title="编码" text-align="right" v-model="searchForm.doc.docNum"></x-input>
        <x-input label-width="80px" title="名称" text-align="right" v-model="searchForm.doc.docName"></x-input>
        <x-input label-width="80px" title="创建人" text-align="right" v-model="searchForm.doc.docCreatePerson"></x-input>
        <datetime
          v-model="searchForm.doc.docCreateTime"
          format="YYYY-MM-DD"
          title="创建时间"></datetime>
      </group>
      <group v-if="activeTab === 1">
        <x-input label-width="80px" title="编码" text-align="right" v-model="searchForm.matter.materailNum"></x-input>
        <x-input label-width="80px" title="名称" text-align="right" v-model="searchForm.matter.materailName"></x-input>
        <x-input label-width="80px" title="创建人" text-align="right" v-model="searchForm.matter.materailCreatePerson"></x-input>
        <datetime
          v-model="searchForm.matter.materailCreateTime"
          format="YYYY-MM-DD"
          title="创建时间"></datetime>
      </group>
      <group v-if="activeTab === 2">
        <x-input label-width="80px" title="编码" text-align="right" v-model="searchForm.apply.chgApplyNum"></x-input>
        <x-input label-width="80px" title="名称" text-align="right" v-model="searchForm.apply.chgApplyName"></x-input>
        <x-input label-width="80px" title="创建人" text-align="right" v-model="searchForm.apply.chgApplyCreatePerson"></x-input>
        <datetime
          v-model="searchForm.apply.chgApplyCreateTime"
          format="YYYY-MM-DD"
          title="创建时间"></datetime>
      </group>
      <group v-if="activeTab === 3">
        <x-input label-width="80px" title="名称" text-align="right" v-model="searchForm.task.chgTaskName"></x-input>
        <x-input label-width="80px" title="执行人" text-align="right" v-model="searchForm.task.chgTaskExecutePerson"></x-input>
        <x-input label-width="80px" title="创建人" text-align="right" v-model="searchForm.task.chgTaskCreatePerson"></x-input>
        <datetime
          v-model="searchForm.task.chgTaskCreateTime"
          format="YYYY-MM-DD"
          title="创建时间"></datetime>
        <x-input label-width="80px" title="任务状态" text-align="right" v-model="searchForm.task.chgTaskStatus"></x-input>
      </group>
      <div class="searchFooterBtn">
        <x-button type="warn" class="searchBtn"  @click.native="formCheck">查询</x-button>
        <x-button type="default" class="searchBtn"  @click.native="resetInput">重置</x-button>
      </div>
      <div style="text-align: right;padding: 20px 10px;"><img :src="Logo" alt="logo"></div>
    </div>
    <div v-if="currentStatus === 'searchResult'">
      <div class="backbtn" @click="backUp('search')"></div>
      <SearchResult :goDetail="goDetail" :submit="submit" :lists="searchResultData" :resultType="activeTabIndex[activeTab]" />
    </div>
    <div v-if="currentStatus === 'details'">
      <div class="backbtn" @click="backUp('searchResult')"></div>
      <Details :detailType="activeTabIndex[activeTab]" :detailInfo="detailsData" />
      <div style="padding: 10px;"><x-button v-if="activeTab === 0" type="warn"  @click.native="fileDownload(downloadFileInfo)">下载</x-button></div>
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
import Logo from '../img/logo.png'

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
      Logo,
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
      searchPage: 1,//当前查询页
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
          index: tv.searchPage,
          myObj: JSON.stringify(tv.searchForm[tv.activeTabIndex[tv.activeTab]]),
          tabIndex: tv.activeTab
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
    resetInput: function () {
      switch(this.activeTab) {
        case 0:
          this.searchForm.doc.docNum = '';
          this.searchForm.doc.docName = '';
          this.searchForm.doc.docCreatePerson = '';
          this.searchForm.doc.docCreateTime = '';
          break;
        case 1:
          this.searchForm.matter.materailNum = '';
          this.searchForm.matter.materailName = '';
          this.searchForm.matter.materailCreatePerson = '';
          this.searchForm.matter.materailCreateTime = '';
          break;
        case 2:
          this.searchForm.apply.chgApplyNum = '';
          this.searchForm.apply.chgApplyName = '';
          this.searchForm.apply.chgApplyCreatePerson = '';
          this.searchForm.apply.chgApplyCreateTime = '';
          break;
        case 3:
          this.searchForm.task.chgTaskName = '';
          this.searchForm.task.chgTaskExecutePerson = '';
          this.searchForm.task.chgTaskCreatePerson = '';
          this.searchForm.task.chgTaskCreateTime = '';
          this.searchForm.task.chgTaskStatus = '';
          break;
        default:
          break;
      }
    },
    /* 跳转控制 */
    backUp: function (type) {
      this.currentStatus = type
      if (this.currentStatus === 'search') {
        this.searchPage = 1
        this.searchResultData = []
        sessionStorage.setItem('scrollY', 0)
      }
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
  mounted: function () {
    sessionStorage.setItem('scrollY', 0)
  },
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
.searchResultDefault {
  position: absolute;
  opacity: 0;
  top: 0;
  max-height: 100vh;
}
.searchResultShow {
  opacity: 1;
  max-height: auto;
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
.searchFooterBtn {
  padding: 10px 10px;
}
.hyj-tab1-img {
  width: 16px;
  position: relative;
  top: 2px;
  left: -2px;
}
.searchBox {
  padding-top: 10px;
}
/* 重写 vux 样式 */
.vux-x-input .weui-label,
.vux-datetime>div:first-of-type {
  text-align: justify; 
  text-justify: distribute-all-lines; 
  text-align-last: justify;
  height: 24px;
}
.vux-x-input .weui-label {
  padding-right: 10px;
}
.vux-datetime>div:first-of-type>p:after,
.vux-x-input .weui-label:after {
  content: '';
  display: inline-block;
  width: 100%;
}
.vux-datetime>div:first-of-type {
  word-wrap: break-word;
  word-break: break-all;
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
