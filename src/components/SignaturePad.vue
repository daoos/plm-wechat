/*
 * 手写签章
 * designer: heyunjiang
 * time: 2018.5.25
 * update: 2018.6.5
 */
<template>
    <div id="app">
        <div class="sgBox">
            <div class="canvasbox" :style="{height: height}">
                <canvas ref="signature" class="canvasContent"></canvas>
            </div>
        </div> 
        <group>
          <x-button type="warn" @click.native="onOk">确认</x-button>
          <x-button type="default" @click.native="clear">清除</x-button>
          <x-button type="default" @click.native="jump">跳过</x-button>
          <x-button type="default" @click.native="cancel">取消</x-button>
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
import SignaturePad from 'signature_pad'

export default {
    name: "SP",
    props: {
        submitSig: Function,
        ignoreSig: Function,
        modalCancel: Function,
        resize: {
            type: Boolean,
            default: false
        },
        canvasRadios: Object
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
            },
            height: '300px',
            sig:{}
        }
    },
    methods:{
        /* 绘制 */
        draw(){
            var _this = this;
            var canvas = _this.$refs.signature
            _this.sig = new SignaturePad(canvas, _this.option);
        },
        /* 跳过 */
        jump() {
            this.ignoreSig()
        },
        /* 取消 */
        cancel() {
            this.sig.clear()
            this.modalCancel()
        },
        /* 预览 */
        preview() {
            var png = this.sig.toDataURL("image/jpeg")
            this.img.show = true
            this.img.src = png
        },
        onOk() {
            console.log(this.sig.toDataURL("image/jpeg"))
            this.submitSig(this.sig.toDataURL("image/jpeg"))
        },
        /* 清除 */
        clear() { this.sig.clear(); },
        /* 撤销 */
        undo() { 
            var _this = this;
            var data = _this.sig.toData();
            if(data){
                data.pop()
                _this.sig.fromData(data);
            }
        },
        // 更新canvas对象，绘制比例， 设置 canvas 及父 div 高度
        resizeCanvas() {
            const { height = 7, width = 12 } = this.canvasRadios;
            const canvas = this.$refs.signature;
            const cowidth = canvas.offsetWidth * height / width;

            this.height = cowidth + 'px';

            let ratio =  Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = cowidth * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            this.sig.clear&&this.sig.clear() // 重置canvas之后，需要清除一下
        }
    },
    mounted() {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas()
        this.$nextTick(() => { this.draw() });
    },
    watch: {
        // 每次弹出，重置画布
        resize: function() {
            this.resizeCanvas()
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
    .canvasbox {
        width: 100%;
        height: 200px;
    }
    .canvasContent {
        height: 100%;
        width: 100%;
    }
</style>
