/*
 * 微信手写签章使用例子
 * designer: heyunjiang
 * time: 2018.6.14
 */
<template>
    <div id="app">
        <SP :resize="true" :submitSig="submitSig" :ignoreSig="ignoreSig"></SP>
        <x-dialog
            v-model="img.show"
            title="签章预览"
            :hide-on-blur="true"
            :dialog-style="{width: '90%', maxWidth: '90%', padding: '10px'}">
            <x-img :src="img.src" ></x-img>
        </x-dialog>
    </div>
</template>

<script>
import SP from '../components/SignaturePad'
import { Group, XButton, XDialog, XImg } from 'vux'

export default {
    name: "SignaturePad",
    components: {
        SP,
        Group,
        XButton,
        XDialog,
        XImg
    },
    data() {
        return {
            img: {
                show: false,
                src: ''
            }
        }
    },
    methods:{
        // 确认按钮，提交
        submitSig(png) {
            console.log(png)
            this.img.src = png
            this.img.show = true
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