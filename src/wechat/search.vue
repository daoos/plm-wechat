<template>
  <div class="app">
    <Form v-if="currentStatus === 'search'" ref="searchFormValidate" :model="searchForm" :label-width="80">
      <Tabs v-model="activeTab" style="z-index: 200; padding: 10px 0; margin: 0 10px;">
        <TabPane label="文档" name="doc" style="min-height: 520px;">
          <FormItem label="编码 : ">
            <Input v-model="searchForm.doc.docNum" icon="document-text" autocomplete="off" />
          </FormItem>
          <FormItem label="名称 : ">
            <Input v-model="searchForm.doc.docName" icon="android-create" autocomplete="off" />
          </FormItem>
          <FormItem label="创建人 : ">
            <Input v-model="searchForm.doc.docCreatePerson" icon="person" autocomplete="off" />
          </FormItem>
          <FormItem label="创建时间 : ">
            <DatePicker type="datetime" placement="bottom-end" v-model="searchForm.doc.docCreateTime" style="width: 100%"></DatePicker>
          </FormItem>
          <Button type="error" style="margin-top: 40px;" @click="formCheck" long>查询</Button>
        </TabPane>
        <TabPane label="物料" name="matter" style="min-height: 520px;">
         <FormItem label="编码 : ">
            <Input v-model="searchForm.matter.materailNum" icon="document-text" autocomplete="off" />
          </FormItem>
          <FormItem label="名称 : ">
            <Input v-model="searchForm.matter.materailName" icon="android-create" autocomplete="off" />
          </FormItem>
          <FormItem label="创建人 : ">
            <Input v-model="searchForm.matter.materailCreatePerson" icon="person" autocomplete="off" />
          </FormItem>
          <FormItem label="创建时间 : ">
            <DatePicker type="datetime" placement="bottom-end" v-model="searchForm.matter.materailCreateTime" style="width: 100%"></DatePicker>
          </FormItem>
          <Button type="error" style="margin-top: 40px;" @click="formCheck" long>查询</Button>
        </TabPane>
        <TabPane label="变更申请" name="apply" style="min-height: 520px;">
          <FormItem label="编码 : ">
            <Input v-model="searchForm.apply.chgApplyNum" icon="document-text" autocomplete="off" />
          </FormItem>
          <FormItem label="名称 : ">
            <Input v-model="searchForm.apply.chgApplyName" icon="android-create" autocomplete="off" />
          </FormItem>
          <FormItem label="创建人 : ">
            <Input v-model="searchForm.apply.chgApplyCreatePerson" icon="person" autocomplete="off" />
          </FormItem>
          <FormItem label="创建时间 : ">
            <DatePicker type="datetime" placement="bottom-end" v-model="searchForm.apply.chgApplyCreateTime" style="width: 100%"></DatePicker>
          </FormItem>
          <Button type="error" style="margin-top: 40px;" @click="formCheck" long>查询</Button>
        </TabPane>
        <TabPane label="变更任务" name="task" style="min-height: 520px;">
          <FormItem label="名称 : ">
            <Input v-model="searchForm.task.chgTaskName" icon="android-create" autocomplete="off" />
          </FormItem>
          <FormItem label="执行人 : ">
            <Input v-model="searchForm.task.chgTaskExecutePerson" icon="document-text" autocomplete="off" />
          </FormItem>
          <FormItem label="创建人 : ">
            <Input v-model="searchForm.task.chgTaskCreatePerson" icon="person" autocomplete="off" />
          </FormItem>
          <FormItem label="创建时间 : ">
            <DatePicker type="datetime" placement="bottom-end" v-model="searchForm.task.chgTaskCreateTime" style="width: 100%"></DatePicker>
          </FormItem>
          <FormItem label="任务状态 : ">
            <Input v-model="searchForm.task.chgTaskStatus" icon="document-text" autocomplete="off" />
          </FormItem>
          <Button type="error" style="margin-top: 40px;" @click="formCheck" long>查询</Button>
        </TabPane>
      </Tabs>
    </Form>
    <div v-if="currentStatus === 'searchResult'">
      <div class="backbtn" @click="backUp('search')"><Icon type="ios-arrow-left"></Icon></div>
      <SearchResult :goDetail="backUp" :lists="searchResultData" :resultType="activeTab" />
    </div>
    <div v-if="currentStatus === 'details'">
      <div class="backbtn" @click="backUp('searchResult')"><Icon type="ios-arrow-left"></Icon></div>
      <Details :detailType="activeTab" :detailInfo="detailsData" />
      <Button v-if="activeTab === 'doc'">下载</Button>
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Input, Button, Select, Option,
  CheckboxGroup, Checkbox, Tabs, TabPane, DatePicker, Message, Icon } from 'iview'
import SearchResult from '../components/searchResult'
import Details from '../components/details'
import request from '../utils/request.js'
import {host} from '../utils/config.js'

export default {
  name: 'Search',
  components: {
    Form,
    FormItem,
    Input,
    Button,
    Select,
    Option,
    CheckboxGroup,
    Checkbox,
    Tabs,
    TabPane,
    DatePicker,
    Message,
    SearchResult,
    Details,
    Icon
  },
  data () {
    return {
      currentStatus: 'search', // 类型切换: search searchResult details
      activeTab: 'doc', // 类型切换: 查询类型切换
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
        doc: 0,
        matter: 1,
        apply: 2,
        task: 3
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
          myObj: JSON.stringify(tv.searchForm[tv.activeTab]),
          tabIndex: tv.activeTabIndex[tv.activeTab]
        }
      }
      request(requestObj).then(function (data) {
        if (data.status === 200) {
          tv.searchResultData = data.data
          tv.backUp('searchResult')
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
      Object.keys(tv.searchForm[tv.activeTab]).forEach(item => {
        if (tv.searchForm[tv.activeTab][item].length > 0) {
          empty = false
        }
      })
      if (empty) {
        Message.error('查询条件为空')
      } else {
        tv.submit()
      }
    },
    /* 跳转控制 */
    backUp: function (type) {
      this.currentStatus = type
    }
  },
  mounted: function () {}
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
  padding: 0 5px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  z-index: 101;
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 15px;
}
</style>
