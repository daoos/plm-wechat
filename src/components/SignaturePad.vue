/*
 * 手写签章
 * designer: heyunjiang
 * time: 2018.5.25
 */
<template>
    <div id="app">
        <div class="sgBox">
            <vueSignature ref="signature" :sigOption="option" :w="'100%'" :h="'200px'"></vueSignature>
        </div> 
        <group>
          <x-button type="warn" @click.native="save">确认</x-button>
          <x-button type="default" @click.native="clear">清除</x-button>
          <x-button type="default" @click.native="undo">撤销上一步</x-button>
          <x-button type="default" @click.native="preview">预览</x-button>
          <x-button type="default" @click.native="cancel">跳过</x-button>
        </group>
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
import { Group, XButton, XImg, XDialog } from 'vux'

export default {
    name: "SP",
    props: {
        submitSig: Function,
        ignoreSig: Function
    },
    components: {
        Group,
        XButton,
        XImg,
        XDialog
    },
    data() {
        return {
            option:{
                penColor:"rgb(0, 0, 0)",
                backgroundColor:"rgb(255,255,255)"
            },
            img: {
                show: false,
                src: ''
            }
        }
    },
    methods:{
        /* 跳过 */
        cancel() {

        },
        /* 预览 */
        preview() {
            var png = this.$refs.signature.save()
            this.img.show = true
            this.img.src = png
        },
        save() {
            var _this = this;
            var png = _this.$refs.signature.save()
            var jpeg = _this.$refs.signature.save('image/jpeg')
            var svg = _this.$refs.signature.save('image/svg+xml');
            console.log(png);
            /*console.log(jpeg)
            console.log(svg)*/
        },
        /* 清除 */
        clear() { this.$refs.signature.clear(); },
        /* 撤销 */
        undo() { this.$refs.signature.undo(); },
        /* 加水印 */
        _addWaterMark() {
            var _this = this;
            _this.$refs.signature.addWaterMark({
                text:"mark text",          // watermark text, > default ''
                font:"20px Arial",         // mark font, > default '20px sans-serif'
                style:'all',               // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill		
                fillStyle:"red",           // fillcolor, > default '#333' 
                strokeStyle:"blue",	   // strokecolor, > default '#333'	
                x:100,                     // fill positionX, > default 20
                y:200,                     // fill positionY, > default 20				
                sx:100,                    // stroke positionX, > default 40
                sy:200                     // stroke positionY, > default 40
            });
        }
    }
};
</script>

<style scoped>
    #app {
        padding: 5px;
        overflow: hidden;
    }
    .sgBox,
    .previewBox {
        border: 1px solid #ece9e9;
    }
</style>
