/*
 * 微信手写签章使用例子
 * designer: heyunjiang
 * time: 2018.5.28
 */
<template>
    <div id="app">
        <group>
          <x-button type="warn" @click.native="check">申签</x-button>
        </group>
        <x-dialog
            v-model="show"
            title="申签"
            :hide-on-blur="true"
            :dialog-style="{width: '90%', maxWidth: '90%', padding: '10px'}">
            <SP :resize="show" :submitSig="submitSig" :ignoreSig="ignoreSig"></SP>
        </x-dialog>
    </div>
</template>

<script>
import SP from '../components/SignaturePad'
import { Group, XButton, XDialog } from 'vux'

export default {
    name: "SignaturePad",
    components: {
        SP,
        Group,
        XButton,
        XDialog
    },
    data() {
        return {
            show: false
        }
    },
    methods:{
        // 确认按钮，提交
        submitSig(png) {
            console.log(png)
        },
        // 跳过按钮
        ignoreSig() {

        },
        check() {
            this.show = !this.show
        }
    }
};
</script>