<!-- 查询结果 -->
<template>
  <div class="searchResultBox" ref="scrollWrapper">
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
import BScroll from 'better-scroll'
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
    },
    submit: {
      type: Function,
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
  },
  mounted: function () {
    if (!this.scroll) {
      this.$nextTick(() => {
        window.scrollTo(0,0)//用以解决加载、卸载的先后问题，保证 BScroll 在合适的滚动位置实例化
        this.scroll = new BScroll(this.$refs.scrollWrapper, {
          pullUpLoad: {
            threshold: 50
          },
          preventDefaultException: {
            className:/(^|\s)detailInfoBtn(\s|$)/
          }
        })
        this.scroll.once('refresh', () => {
          if (sessionStorage.getItem('scrollY') < -10) {
            console.log('once',this.scroll, sessionStorage.getItem('scrollY'))
            // window.scrollTo(0,sessionStorage.getItem('scrollY'))
            this.scroll.scrollTo(0,+sessionStorage.getItem('scrollY'))
            this.scroll.refresh()
          }
        })
        this.scroll.on('pullingUp', (pos) => {
          this.submit()
        })
        this.scroll.on('scrollEnd', (pos) => {
          // if (this.scroll.y < this.scroll.maxScrollY) {
          //   this.scroll.scrollTo(0,sessionStorage.getItem('scrollY'))
          // }
          console.log(this.scroll.y, sessionStorage.getItem('scrollY'))
        })
      })
    }
  },
  updated: function () {
    if (this.scroll) {
      this.scroll.finishPullUp()
      // this.scroll.refresh()
    }
  },
  beforeDestroy: function () {
    if (this.scroll) {
      sessionStorage.setItem('scrollY', this.scroll.y)
      this.scroll.destroy()
    }
  }
}
</script>

<style scoped>
  .searchResultBox {
    height: 100vh;
  }
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
