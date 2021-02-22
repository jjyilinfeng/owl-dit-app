<template>
  <div class="s3">
    <div class="s4">
      <h2>我的信息</h2>
      <div class="userInfo-header" style="margin-top: 20px">
        <img :src="'/api/static/img/userFace/'+userFace" @click="imgSet"  alt="头像">
        <button type="button" class="layui-btn layui-btn-radius" id="test1"  style="margin-top: 20px">
          <i class="layui-icon">&#xe67c;</i>上传新头像
        </button>
      </div>
      <label class="col-sm-2" style="margin-left: 300px;">信息完善程度</label>
      <div class="progress" style="width: 150px;height: 10px;margin-top: 15px;">
        <div class="progress-bar progress-bar-info" id="information-bar"  role="progressbar" style="padding: 0;margin: 0"></div>

      </div>
      <div class="input-group input-group-lg">
        <span class="input-group-addon">昵称</span>
        <input type="text" class="form-control" placeholder="会显示到名片上（○｀ 3′○）" @blur="refreshBar" v-model="userInformation.userNickName" maxlength="15">
      </div>
      <div class="input-group input-group-lg">
        <span class="input-group-addon">性别</span>
        <div class="form-group">
          <select class="form-control input-lg" v-model="userInformation.userGender">
            <option>男</option>
            <option>女</option>
            <option>秘密</option>
          </select>
        </div>
        <span class="input-group-addon" >年龄</span>
        <input type="text" placeholder="永远的18岁╰(*°▽°*)╯" class="form-control" @blur="refreshBar" v-model="userInformation.userAge" maxlength="3">
      </div>

      <div class="input-group input-group-lg">
        <span class="input-group-addon">出生日期</span>
        <input type="date" placeholder="w(ﾟДﾟ)w" class="form-control"  @blur="refreshBar" v-model="userInformation.userBirthday">
      </div>
      <div class="input-group input-group-lg" style="height: 100px">
        <span class="input-group-addon">签名</span>
        <textarea  class="form-control" placeholder="这个人很懒，还什么都没有写(；′⌒`)" @blur="refreshBar" v-model="userInformation.userSign" style="height: 100px">
        </textarea>
          </div>
      <button class="btn btn-success btn-lg" @click="saveData">保存</button>

    </div>
  </div>
</template>
<script>
import "layui-src/dist/css/layui.css"
import axios from "axios";
import ImgSetBigger from "@/components/msgbox/ImgSetBigger";
import BoxShadow from "@/components/msgbox/BoxShadow";

export default {
  name: "UserInformationBox",
  components: {BoxShadow, ImgSetBigger},
  props:{
    'userInformationNew':Object,
    'userFaceSrc':String,
  },
  watch:{
    userInformationNew:{
      handler(newName, oldName) {
        this.userInformation = newName;
        this.refreshBar();
        this.userFace = this.userInformation['userFaceUuid'];
      },
    },
    userFaceSrc:{
      handler(newName, oldName) {
        this.userFace = newName;
      },
    }
  },
  data() {
    return {
      userInformation:{
        'userName':"",
        'userNickName':"",
        'userGender':"",
        'userAge':"",
        'userBirthday':"",
        'userSign':""
      },
      userFace:"",
    }
  },
  mounted() {

    let _this = this;
    layui.use(['upload','layer'], function(){
      let upload = layui.upload;
      let layer = layui.layer;
      //执行实例
      let uploadInst = upload.render({
        elem: '#test1' //绑定元素
        ,url: '/api/userIndex/userFaceUpload' //上传接口
        ,accept:"images"
        ,done: function(res){
          //上传完毕回调
          let data =res.data;
          layer.msg(res.message,{icon: 6,time:2000, shade:0.4});
          _this.userFace = data;
          //上传的图片地址传给主页
          _this.$emit("updateUserFaceSrc",res.data);
          let params = new URLSearchParams();
          params.append("UUID",res.data)
          params.append("userName",_this.userInformation['userName'])
          axios.post("/api/userIndex/updateUserFace",params)
          .then(res =>{
            if(res.data.code === 404){
              layer.msg("UUID注入失败",{icon: 5,time:2000, shade:0.4});
              _this.$emit("leftBoxRefresh","刷新左边盒子");
            }
          })
          .catch(err =>{
            console.error(err);
          })
        }
        ,error: function(){
          //请求异常回调
        }
      });
    });
  },
  methods:{
    imgSet:function (){
      this.$emit("imgSet","设置图片窗口")
    },
    refreshBar:function(){
      let barLen = 0;
      let flag = true;

      for(let key in this.userInformation){
        let data = this.userInformation[key]
        if(data !== "" && key !== "userName" && key !== "userFaceUuid" && key !== "userId"){
          barLen++;
        }
        if((data+"").length > 250){
          flag = false;
        }
      }
      this.submitGate = flag;
      $("#information-bar").css("width",barLen*20+"%");
    },
    getParams:function (){
      let params = new URLSearchParams()
      for(let key in this.userInformation){
        params.append(key,this.userInformation[key]);
      }
      return params;
    },
    saveData:function (){
      let params = new URLSearchParams();
      for(let key in this.userInformation){
        params.append(key,this.userInformation[key]);
      }
      axios.post("/api/userIndex/updateUserInfo",params)
          .then(res =>{
            if(res.data.code === 404){
              layer.msg("用户信息更新失败",{icon: 5,time:2000, shade:0.4});
            }
            else if(res.data.code === 200){
              console.log("200");
              layer.msg("用户信息更新成功",{icon: 6,time:2000, shade:0.4});
            }
          })
          .catch(err =>{
            console.error(err);
          })
    },

  }
}
</script>

<style scoped>
.s3 {
  width:900px;
  height:auto;
  background:white;background:rgba(0, 0, 0, 0.6);
  filter:Alpha(opacity=60);
  box-shadow:10px 10px 20px rgba(0,0,0,0.3);
  border-radius:30px;
}
.s4 {
  padding-top:50px;
  padding-bottom: 80px;
  text-align :center;
  width:1000px;
  height:auto;
  background:rgba(255,255,255,0.9);
  border-radius:30px;
}
.s4 .input-group{
  width: 50%;
  margin-left: 25%;
  margin-top: 20px;

}

.s4 .btn{
  margin-top:20px;
}


.userInfo-header img{
  width: 120px;
  height: 120px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0,0,0,0.3);
  overflow: hidden;
  left: 0;
  right: 0;
  margin: 0 auto;
}


</style>