/*
 * 审批弹出框内容
 * designer: heyunjiang
 * time: 2018.5.29
 */
<template>
  <div>
    <group>
      <x-textarea v-model="approveDescription" :max="200" placeholder="请输入批语..."></x-textarea>
    </group>
    <group>
      <x-button type="warn" @click.native="goDoTransfor">转发</x-button>
    </group>
    <group v-if="userAuthority.bill.opertype === '0'">
      <x-button type="primary" @click.native="Config.isBuild?submitTask(true, approveDescription):goDoSig(true, approveDescription)">提交</x-button>
      <x-button type="warn" @click.native="Config.isBuild?submitTask(false, approveDescription):goDoSig(false, approveDescription)">打回</x-button>
    </group>
    <group v-if="userAuthority.bill.opertype === '1'">
      <x-button type="primary" @click.native="Config.isBuild?submitTask(true, approveDescription):goDoSig(true, approveDescription)">通过</x-button>
      <x-button type="warn" @click.native="Config.isBuild?submitTask(false, approveDescription):goDoSig(false, approveDescription)">不通过</x-button>
    </group>
    <group>
      <x-button type="default" @click.native="cancel">取消</x-button>
    </group>
  </div>
</template>

<script>
import { XTextarea, Group, XButton } from 'vux'
import Config from '../utils/config'

export default {
  name: 'TaskCheck',
  props: {
    goDoTransfor: Function,
    userAuthority: Object,
    submitTask: Function,
    modalCancel: Function,
    goDoSig: Function
  },
  components: {
    XTextarea,
    XButton,
    Group
  },
  data () {
    return {
      approveDescription: ''
    }
  },
  methods: {
    cancel: function () {
      this.modalCancel()
      this.approveDescription = ''
    }
  }
}
</script>

<style scoped>

</style>
