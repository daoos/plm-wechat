<template>
    <div id="app">
        <SP :submitSig="submitSig" :ignoreSig="ignoreSig" />
    </div>
</template>

<script>
import SP from '../components/SignaturePad'

export default {
    name: "SignaturePad",
    components: {
        SP
    },
    data() {
        return {}
    },
    methods:{
        // 确认按钮，提交
        submitSig() {

        },
        // 跳过按钮
        ignoreSig() {

        }
    }
};
</script>