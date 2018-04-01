/*
 * 流程图
 */
<template>
  <div class="timelineBox">
    <timeline>
      <timeline-item v-if="workFlowInfo.code === 'S'" v-for="item in workFlowInfo.list" :color="item.state=='1'?'red':item.state=='0'?'blue':'green'">
        <h4 class="content">{{item.detail}}</h4>
      </timeline-item>
    </timeline>
  </div>
</template>

<script>
import { Timeline, TimelineItem } from 'vux'
// import { Flow, FlowState, FlowLine } from 'vux'

export default {
  name: 'TimeLineBox',
  props: {
    workFlowInfo: Object
  },
  components: {
    Timeline,
    TimelineItem
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.timelineBox {
  padding: 10px 90px;
}
h4 {
  color: #666;
  font-weight: normal;
}
</style>
