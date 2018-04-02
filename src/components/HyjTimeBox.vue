<template>
  <div class="hyj-timeBox">
    <div class="hyj-timeline"></div>
    <slot name="hyj-timehead"></slot>
    <slot name="hyj-timecontent"></slot>
  </div>
</template>

<script>

export default {
  name: 'HyjTimeBox',
}
</script>
<style scoped>
  .hyj-timeBox,
  .hyj-timeline,
  .hyj-timehead,
  .hyj-timecontent,
  .hyj-timecontent-title,
  .hyj-timecontent-list {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .hyj-timeBox {
    padding: 0 0 10px 15px;
    position: relative;
  }
  .hyj-timeBox .hyj-timeline {
    position: absolute;
    left: 10px;
    top: 0;
    height: 100%;
    border-left: 2px solid #e9e9e9;
  }
  .hyj-timeBox .hyj-timehead {
    position: relative;
    padding-left: 10px;
    font-size: 12px;
    text-align: left;
  }
  .hyj-timeBox .hyj-timehead:before {
    content: '';
    position: absolute;
    left: -10px;
    width: 12px;
    height: 12px;
    background-color: #fff;
    border-radius: 6px;
    border: 2px solid #e60012;
    box-sizing: border-box;
  }
  .hyj-timecontent {
    padding: 0 0 0 0;
    background-color: #f7f5f5;
    margin: 0 2px 0 2px;
  }
  .hyj-timecontent .hyj-timecontent-title {
    height: 40px;
    line-height: 40px;
    text-align: left;
    display: block;
    width: 100%;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid #d4d2d2;
    font-size: 16px;
    color: black;
    padding-left: 8px;
  }
  .hyj-timecontent .hyj-timecontent-list {
    height: 20px;
    line-height: 20px;
    padding-left: 8px;
    font-size: 14px;
    color: #03356b;
    text-align: left;
  }
  .detailInfoBtn {
    text-align: left;
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #ece8e8;
    border-bottom: 1px solid #ece8e8;
    padding-left: 8px;
    margin-top: 8px;
    font-size: 14px;
    color: #03356b;
    position: relative;
  }
  .detailInfoBtn:after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #9e9d9d;
    border-width: 1px 0 0 1px;
    transform: rotate(135deg);
    top: 8px;
    right: 11px;
  }
</style>
