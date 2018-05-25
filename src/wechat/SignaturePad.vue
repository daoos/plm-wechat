<template>
    <div id="app">
        <vueSignature ref="signature" :sigOption="option" :w="'800px'" :h="'400px'"></vueSignature> 
        <vueSignature ref="signature1" :sigOption="option"></vueSignature> 
        <button @click="save">Save</button>
        <button @click="clear">Clear</button>
        <button @click="undo">Undo</button>
        <button @click="addWaterMark">addWaterMark</button>
    </div>
</template>

<script>
export default {
    name: "SignaturePad",
    data() {
        return {
            option:{
                penColor:"rgb(0, 0, 0)",
                backgroundColor:"rgb(255,255,255)"
            }
        };
    },
    methods:{
        save(){
            var _this = this;
            var png = _this.$refs.signature.save()
            var jpeg = _this.$refs.signature.save('image/jpeg')
            var svg = _this.$refs.signature.save('image/svg+xml');
            console.log(png);
            console.log(jpeg)
            console.log(svg)
        },
        clear(){
            var _this = this;
            _this.$refs.signature.clear();
        },
        undo(){
            var _this = this;
            _this.$refs.signature.undo();
        },
        addWaterMark(){
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
        },
        fromDataURL(url){
            var _this = this;
            _this.$refs.signature.fromDataURL("data:image/png;base64,iVBORw0K...");
        }
    }
};
</script>