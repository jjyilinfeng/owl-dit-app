<template>
  <div class="PostBox" style="text-align: left">
    <span class="dit-font">记录一下好心情
    <i class="layui-icon layui-icon-face-smile"></i>  </span>

    <form class="layui-form">
      <div class="layui-form-item">

        <label for="dit"></label>
        <textarea name="dit" id="dit" class="layui-hide">
      </textarea>
        <div class="layui-upload">
          <button type="button" class="layui-btn layui-btn-normal layui-btn-radius" id="uploadDitVideo" style="margin-top: 20px">上传视频（最大200MB）</button>
        </div>
        <div style="position: absolute">
          <label >上传进度条</label>
          <div class="layui-progress layui-progress-big" style="width: 200px;" lay-showpercent="true" lay-filter="demo">
            <div class="layui-progress-bar layui-bg-red layui-progress-big" lay-percent="0%"></div>
          </div>
        </div>
      </div>
    </form>
    <div style="text-align: right">
      <button class="layui-btn layui-btn-radius" id="sendDit" style="margin-right: 5%"><i class="layui-icon">&#xe609;</i>Dit</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs/dist/qs.js"
export default {
  name: "PostBox",
  props:{
    userName:String
  },
  data() {
    return {
      ditUuid:"",
      ditWithVideo:false,
    }
  },
  mounted() {
    let _this = this;
    layui.use(['layedit','layer','upload','element'], function(){
      let layedit = layui.layedit;
      let upload = layui.upload;
      let element = layui.element;
      let index = layedit.build('dit', {
        height: 180,
        uploadImage: {
          url: '/api/dit/ditImgUpload'
          ,type: 'post'
          ,accept:"images"
          ,done:function(res){

          }
        }
        ,tool: ['face','image']
      });

      upload.render({
        elem: '#uploadDitVideo'
        ,url: '/api/dit/ditVideoUpload' //改成您自己的上传接口
        ,auto: false
        ,exts:'mp4'
        ,size:200000
        ,accept: 'video' //视频
        ,choose: function(obj){
          //将每次选择的文件追加到文件队列
          var files = this.files = obj.pushFile();
          obj.preview(function(index, file, result){
            _this.ditWithVideo = true;
            layer.msg("视频"+files[index].name+"已选择");
          });
        }
        ,progress: function(n, elem) {
          let percent = n + '%' //获取进度百分比
          element.progress('demo', percent); //可配合 layui 进度条元素使用
        }
        //,multiple: true
        ,bindAction: '#sendDit'
        ,done: function(res){
          if(res.data.code === 0){
            layer.msg("视频上传成功",{icon: data.code===0?6:5,time:2000, shade:0.4});
          }
          let ditVideoUuid = res.data;
          console.log(_this.ditUuid);
          setTimeout(()=>{
            axios.post("/api/dit/ditVideoUpdate",Qs.stringify({'ditUuid':_this.ditUuid,'ditVideoUuid':ditVideoUuid}))
                .then(res =>{
                  _this.$emit("sendDit","发送了一个Dit");
                  let data = res.data;
                  layer.msg(data.message,{icon: data.code===404?5:6,time:2000, shade:0.4});
                  _this.ditWithVideo = false;
                })
                .catch(err =>{
                  console.error(err);
                })
          },500)

        }
      });

      $("#sendDit").click(()=>{
        let ditImgArr = "";
        let reg = /alt="([\w.]+)"/g
        let i;
        while(i = reg.exec(layedit.getContent(index))){
          ditImgArr += i[1] + '&';
        }
        ditImgArr = ditImgArr.substring(0,ditImgArr.length-1);
        axios.post("/api/dit/createDit",Qs.stringify({"userName":_this.userName,"ditMessage":layedit.getContent(index),'ditImg':ditImgArr,'ditUuid':_this.ditUuid}))
        .then(res =>{
          _this.ditUuid = res.data.data;
          if(!_this.ditWithVideo){
            _this.$emit("sendDit","发送了一个Dit");
            let data = res.data;
            layer.msg(data.message,{icon: data.code===404?5:6,time:2000, shade:0.4});
          }

          $("#dit").html("");
        })
        .catch(err =>{
          console.error(err);
        })
      })
    });
  },
  methods:{
    fun(){
      console.log(this.ditUuid);
    },
    getUuid(){
      axios.post("/api/util/getUuid",{})
      .then(res =>{
        console.log(res.data)
      })
      .catch(err =>{
        console.error(err);
      })
    }

  }

}
</script>

<style scoped>
.PostBox{
  padding: 20px;
  width: 700px;
  height: auto;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
}

.dit-font{
  display: inline-block;
  position: relative;
  padding: 0 20px;
  height: 30px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  color: #FFFFFF;
  font-size: 20px;
  left: -28px;
  background-color: rgb(255, 0, 98);

}

.dit-font:before {
  height: 0;
  width: 0;
  border-bottom: 8px solid rgb(100,20,20);
  border-left: 8px solid transparent;
  top: -8px;
  left: 0;
  content: "";
  position: absolute;
}


</style>