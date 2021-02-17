<template>
  <div class="PostBox" style="text-align: left">
    <span class="dit-font">记录一下好心情
    <i class="layui-icon layui-icon-face-smile" style="color: red"></i>  </span>
    <form class="layui-form">
      <div class="layui-form-item">
        <label for="dit"></label>
        <textarea name="dit" id="dit" class="layui-hide">
      </textarea>
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

    }
  },
  mounted() {
    let _this = this;
    layui.use(['layedit','layer'], function(){
      let layedit = layui.layedit;
      let index = layedit.build('dit', {
        height: 180,
        uploadImage: {
          url: '/api/dit/ditImgUpload'
          ,type: 'post'
          ,accept:"images"
          ,done:function(res){
              console.log(res);
          }
        }
        ,tool: ['face','image']
      });
      $("#sendDit").click(()=>{
        _this.$emit("sendDit","发送了一个Dit");

        let ditImgArr = "";
        let reg = /alt="([\w.]+)"/g
        let i;
        while(i = reg.exec(layedit.getContent(index))){
          ditImgArr += i[1] + '&';
        }
        ditImgArr = ditImgArr.substring(0,ditImgArr.length-1);


        axios.post("/api/dit/createDit",Qs.stringify({"userName":_this.userName,"ditMessage":layedit.getContent(index),'ditImg':ditImgArr}))
        .then(res =>{
          let data = res.data;
          layer.msg(data.message,{icon: data.code===404?5:6,time:2000, shade:0.4});
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
      alert($(".laydit img").attr("alt"));
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
  color: #3F3F3F;
  font-size: 18px;
}
</style>