/*
 * 微信手写签章使用例子
 * designer: heyunjiang
 * time: 2018.6.14
 */
<template>
    <div id="app">
        <ul>
            <li v-for="(item, index) in list" :key="index" @click="liClick(item.value)">
                <check-icon :value="item.isfinish"></check-icon>
                <span v-if="!item.isfinish">{{item.name}}</span>
                <del v-if="item.isfinish">{{item.name}}</del>
            </li>
        </ul>
        <div class="addBtn"><x-button @click.native="addTask" type="warn">+</x-button></div>
        <x-dialog v-model="controlModal" class="dialog-demo" :hide-on-blur="true" @on-hide="saveValue" :dialog-style="{backgroundColor: 'transparent', color: 'white'}">
            <x-input v-model="currentTask.name"></x-input>
            <divider></divider>
            <x-button @click.native="finishTask" type="primary">{{currentTask.isfinish?'设为未完成':'设为完成'}}</x-button>
        </x-dialog>
    </div>
</template>

<script>
/*
 * 设计方式： localstorage 保存数据
 * designer: heyunjiang
 * time: 2018.7.17
 */
import { CheckIcon, XDialog, XButton, XInput, Divider } from 'vux'

export default {
    name: "Todo",
    components: {
        CheckIcon,
        XDialog,
        XButton,
        XInput,
        Divider
    },
    data() {
        return {
            list: [
                {
                    name: 'hello',
                    value: 0,
                    isfinish: true
                },
                {
                    name: 'world',
                    value: 1,
                    isfinish: false
                }
            ],
            controlModal: false,
            currentTask: {}
        }
    },
    methods:{
        // 点击任务项
        liClick: function(index) {
            this.currentTask = this.list.filter(item => {
                return item.value === index
            })[0]
            this.controlModal = true
        },
        // 完成任务
        finishTask: function() {
            this.currentTask.isfinish = !this.currentTask.isfinish;
            this.controlModal = false;
            this.saveValue()
        },
        // 关闭弹窗，保存 currentTask 值
        saveValue: function() {
            const list = this.list.map(item => {
                if(item.value === this.currentTask.value) {
                    return this.currentTask
                } else {
                    return item
                }
            })
            this.list = list
            localStorage.setItem('taskList', JSON.stringify(list))
        },
        addTask: function() {
            this.list.push({
                name: '',
                value: this.list[this.list.length-1].value + 1,
                isfinish: false
            })
        }
    },
    mounted: function() {
        if(localStorage.getItem('taskList')) {
            this.list = JSON.parse(localStorage.getItem('taskList'))
        } else {
            localStorage.setItem('taskList', '')
        }
    }
};
</script>

<style>
#app {
  font-family: "Microsoft Yahei", "AvenirNext-Regular", "Helvetica Neue", "lucida grande", "PingFangHK-Light", "STHeiti", "Heiti SC", "Hiragino Sans GB", "Microsoft JhengHei", SimHei, "WenQuanYi Micro Hei", "Droid Sans", "Roboto", Helvetica, Tahoma, Arial, "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  padding: 0 10px;
  height: 90vh;
  overflow: scroll;
}
li {
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ececec;
    margin-bottom: 10px;
}
.addBtn {
    position: fixed;
    bottom: 5px;
}
</style>