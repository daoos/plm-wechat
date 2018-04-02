<!-- 查询结果 -->
<template>
  <div class="hello">
    <!-- <div>
      <card>
        <div slot="content" class="result-card">
          <p slot="header">文档名称: </p>
          <p>文档编码: </p>
          <p>创建人: </p>
          <p>版本: </p>
          <p><x-button type="warn" mini>详情</x-button></p>
          <p></p>
        </div>
      </card>
    </div> -->
    <div v-if="resultType === 'doc'">
      <HyjTimeBox v-for="list in lists" :key="list.docNum+'_'+list.docVer">
        <div class="hyj-timehead" slot="hyj-timehead">{{list.createTime}}</div>
        <div class="hyj-timecontent" slot="hyj-timecontent">
          <div class="hyj-timecontent-title">文档名称: {{list.docName}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">文档编码:</span>{{list.docNum}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">创建人:</span>{{list.createPerson}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">版本:</span>{{list.docVer}}</div>
          <div class="detailInfoBtn" @click="goDetail(list.docNum+'_'+list.docVer)">详情</div>
        </div>
      </HyjTimeBox>
    </div>
    <div v-if="resultType === 'matter'">
      <HyjTimeBox v-for="list in lists" :key="list.materialNum+'_'+list.materialVer">
        <div class="hyj-timehead" slot="hyj-timehead">{{list.createTime}}</div>
        <div class="hyj-timecontent" slot="hyj-timecontent">
          <div class="hyj-timecontent-title">物料名称: {{list.materialName}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">物料编码:</span>{{list.materialNum}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">创建人:</span>{{list.createPerson}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">版本:</span>{{list.materialVer}}</div>
          <div class="detailInfoBtn" @click="goDetail(list.materialNum+'_'+list.materialVer)">详情</div>
        </div>
      </HyjTimeBox>
    </div>
    <div v-if="resultType === 'apply'">
      <HyjTimeBox v-for="list in lists" :key="list.chgApplyId">
        <div class="hyj-timehead" slot="hyj-timehead">{{list.createTime}}</div>
        <div class="hyj-timecontent" slot="hyj-timecontent">
          <div class="hyj-timecontent-title">名称: {{list.chgApplyName}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">编码:</span>{{list.chgApplyNum}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">创建人:</span>{{list.createPerson}}</div>
          <div class="detailInfoBtn" @click="goDetail(list.chgApplyId)">详情</div>
        </div>
      </HyjTimeBox>
    </div>
    <div v-if="resultType === 'task'">
      <HyjTimeBox v-for="list in lists" :key="list.chgAppId">
        <div class="hyj-timehead" slot="hyj-timehead">{{list.createTime}}</div>
        <div class="hyj-timecontent" slot="hyj-timecontent">
          <div class="hyj-timecontent-title">名称: {{list.chgTaskName}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">执行人:</span>{{list.executePerson}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">创建人:</span>{{list.createPerson}}</div>
          <div class="hyj-timecontent-list"><span class="texttitle">任务状态:</span>{{list.status}}</div>
          <div class="detailInfoBtn" @click="goDetail(list.chgAppId)">详情</div>
        </div>
      </HyjTimeBox>
    </div>
  </div>
</template>

<script>
import { Divider, Card, XButton, Group, Cell } from 'vux'
import HyjTimeBox from '../components/HyjTimeBox'

export default {
  name: 'SearchResult',
  props: {
    goDetail: {
      type: Function,
      required: true
    },
    lists: {
      type: Array,
      required: true
    },
    resultType: {
      type: String,
      required: true
    }
  },
  components: {
    Divider,
    Card,
    XButton,
    HyjTimeBox,
    Group,
    Cell
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
  .time{
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }
  .content{
    padding-left: 5px;
  }
  .resultCard p {
    text-align: left;
  }
  .resultCard .ivu-card-body p:last-child {
    text-align: right;
  }
  .result-card {
    padding: 0 10px;
  }
  .texttitle {
    width: 80px;
    display: inline-block;
    margin-right: 10px;
    color: black;
  }
</style>
