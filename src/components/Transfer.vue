/*
 * 转发弹出框内容
 */
<template>
  <div>
    <group>
      <popup-picker :show-name="true" title="转发人" :popup-style="{zIndex: '6000'}" :data="transforPersonList" v-model="selectedPersonId" placeholder="请选择转发人"></popup-picker>
    </group>
    <group>
      <x-textarea v-model="approveDescription" :max="200" placeholder="转发理由..."></x-textarea>
    </group>
    <group>
      <x-button type="warn" @click.native="doTransfer">转发</x-button>
      <x-button type="default" @click.native="cancel">取消</x-button>
    </group>
  </div>
</template>

<script>
import { XTextarea, Group, XButton, PopupPicker } from 'vux'
export default {
  name: 'Transfer',
  props: {
    submitTrans: Function,
    modalCancel: Function,
    transforPersonList: Array,
    doTransforModal: Boolean
  },
  components: {
    XTextarea,
    Group,
    XButton,
    PopupPicker
  },
  data () {
    return {
      approveDescription: '',
      selectedPersonId: []
    }
  },
  methods: {
    doTransfer: function(){
      if (this.selectedPersonId.length === 0) {
        this.$vux.toast.show({
          text: '请选择转发人',
          type: 'warn'
        })
        return ;
      }
      this.submitTrans(this.approveDescription, this.selectedPersonId[0])
    },
    cancel: function(){
      this.modalCancel()
      this.approveDescription = '',
      this.selectedPersonId = []
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
