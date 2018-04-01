<template>
  <div class="hello">
    <Timeline>
      <TimelineItem v-if="resultType === 'doc'" v-for="list in lists" :key="list.docNum">
        <p class="time">{{list.createTime}}</p>
        <Card class="resultCard">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            文档名称: {{list.docName}}
          </p>
          <p>文档编码: {{list.docNum}}</p>
          <p>创建人: {{list.createPerson}}</p>
          <p>版本: {{list.docVer}}</p>
          <p><Button type="primary" size="small" shape="circle" icon="information-circled" @click="goDetail('details')">详情</Button></p>
        </Card>
      </TimelineItem>
      <TimelineItem v-if="resultType === 'matter'" v-for="list in lists" :key="list.materialNum">
        <p class="time">{{list.createTime}}</p>
        <Card class="resultCard">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            物料名称: {{list.materialName}}
          </p>
          <p>物料编码: {{list.materialNum}}</p>
          <p>创建人: {{list.createPerson}}</p>
          <p>版本: {{list.materialVer}}</p>
          <p><Button type="primary" size="small" shape="circle" icon="information-circled" @click="goDetail('details')">详情</Button></p>
        </Card>
      </TimelineItem>
      <TimelineItem v-if="resultType === 'apply'" v-for="list in lists" :key="list.chgApplyNum">
        <p class="time">{{list.createTime}}</p>
        <Card class="resultCard">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            名称: {{list.chgApplyName}}
          </p>
          <p>编码: {{list.chgApplyNum}}</p>
          <p>创建人: {{list.createPerson}}</p>
          <p><Button type="primary" size="small" shape="circle" icon="information-circled" @click="goDetail('details')">详情</Button></p>
        </Card>
      </TimelineItem>
      <TimelineItem v-if="resultType === 'task'" v-for="list in lists" :key="list.chgTaskName">
        <p class="time">{{list.createTime}}</p>
        <Card class="resultCard">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            名称: {{list.chgTaskName}}
          </p>
          <p>执行人: {{list.executePerson}}</p>
          <p>创建人: {{list.createPerson}}</p>
          <p>任务状态: {{list.status}}</p>
          <p><Button type="primary" size="small" shape="circle" icon="information-circled" @click="goDetail('details')">详情</Button></p>
        </Card>
      </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
import { Button, Message, TimelineItem, Timeline, Card, Icon } from 'iview'

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
    Button,
    Message,
    TimelineItem,
    Timeline,
    Card,
    Icon
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
</style>
