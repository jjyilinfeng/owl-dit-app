<template>
  <div class="uploadBackGroundImage">
    <div class="layui-upload-drag" id="uploadBGI">
      <i class="layui-icon"></i>
      <p>点击上传，或将文件拖拽到此处</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "SetBackgroundImgBox",
  mounted() {
    layui.use('upload', function() {
        let upload = layui.upload;
      upload.render({
        elem: '#uploadBGI'
        ,url: '/api/userIndex/userBackGroundUpload' //改成您自己的上传接口
        ,done: function(res){
          layer.msg('上传成功',{'icon':6});
          axios.post("/api/userIndex/updateBackGroundImg")
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