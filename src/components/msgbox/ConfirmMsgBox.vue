<template>
  <div class="MsgBox">
    <div class="MsgBoxHead">
      <div class="close-box" style="float: right">
        <i class="layui-icon layui-icon-close close-icon" @click="cancel" style="font-size: 18px"></i>
      </div>
      <span>
        {{titleMsg}}
      </span>
    </div>
    <div class="MsgBoxBody">
      <span>
        {{bodyMsg}}
      </span>
    </div>
    <div class="MsgBoxFoot">
      <button class="btn btn-success" style="margin-right: 20px;" @click="clickEvent(eventData)">确认</button>
      <button class="btn btn-danger" @click="cancel">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmMsgBox",
  props:{
    titleMsg:String,
    bodyMsg:String,
    clickEvent:Function,
    eventData:String,
  },
  emits:{
    "cancel":"取消"
  },
  mounted() {
    let chaos = $(".chaos")
    chaos.css("height","1920px");
    chaos.css("width","1080px");
  },
  methods:{
    cancel:function(){
      this.$emit("cancel","取消");
    }
  }
}
</script>

<style scoped>

.MsgBox{
  width: 500px;
  height: 180px;
  text-align: left;
  border-radius: 20px;
  box-shadow: 1px 1px 3px #000;
  background-color: #fff;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  position: fixed;
  z-index: 9999;
}

.MsgBox .MsgBoxHead{
  font-size: 22px;
  color: #000022;
  padding: 18px;
  position: relative;
}

.MsgBox .MsgBoxBody{
  font-size: 16px;
  color: #666667;
  overflow: auto;
  padding: 10px 22px;
}

.MsgBox .MsgBoxFoot{
  position: relative;
  text-align: right;
  padding: 14px;
}

.close-icon{
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}

.close-box:hover .close-icon{
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
}
</style>