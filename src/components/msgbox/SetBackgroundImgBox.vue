<template>
  <div class="uploadBackGroundImage">
    <div class="layui-upload-drag" id="uploadBGI" style="width: 100%;height: 100%;padding-top: 30%">
      <i class="layui-icon"></i>
      <p>点击上传背景图，或将文件拖拽到此处</p>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import Qs from "qs/dist/qs"
export default {
  name: "SetBackgroundImgBox",
  props:{
    userName:String,
  },
  mounted() {
    let _this = this;
    layui.use('upload', function() {
        let upload = layui.upload;
      upload.render({
        elem: '#uploadBGI'
        ,url: '/api/userIndex/userBackGroundUpload' //改成您自己的上传接口

        ,done: function(res){
          let Uuid = res.data;
          layer.msg('上传成功',{'icon':6});
          console.log(Uuid);
          axios.post("/api/userIndex/updateBackGroundImg",Qs.stringify({'userName':_this.userName,"UUID":Uuid}))
          _this.$emit("changeBackGround",Uuid)
        }
      });
    })
  }
}
</script>

<style scoped>
.uploadBackGroundImage{
  width: 500px;
  height: 400px;
  box-shadow: #0f0f0f 2px 2px 5px;
  border-radius: 10px;
  background-color: rgba(255,255,255,0.9);
  z-index: 9990;
  position: absolute;
}
</style>