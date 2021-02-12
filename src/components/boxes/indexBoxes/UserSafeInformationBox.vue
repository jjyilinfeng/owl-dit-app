<template>
  <div class="contain">
    <div class="Mark">
      <span id="mark2" class="glyphicon glyphicon-flag"></span>
      <span id="mark3" class="glyphicon glyphicon-flag"></span>
      <span id="mark4" class="glyphicon glyphicon-flag"></span>
      <span id="mark5" class="glyphicon glyphicon-flag"></span>
    </div>
    <div class="progress" id="safePro">
      <div class="progress-bar progress-bar-success" id="pb" role="progressbar">
      </div>
    </div>
    <!-- step1 选择修改的类型-->
    <div id="step1" style="margin-top: 20px">
      <h1>您的邮箱为{{userEmailChaos}}</h1>
      <h3>请牢记您的邮箱，您的邮箱的安全即是您的账号的安全</h3>
      <div class="btn-toolbar" role="toolbar" style="margin-left:120px">
        <div class="btn-group">
          <button type="button" class="btn btn-info btn-lg" @click="resetMail">重置我的邮箱</button>
        </div>
        <div class="btn-group" style="margin-left: 50px">
          <button class="btn btn-success btn-lg" @click="changePassword" >修改我的密码</button>
        </div>
      </div>

    </div>
    <!-- step1 选择修改的类型end-->

    <!-- step2 验证邮箱-->
    <div id="step2">
      <h1>我们需要验证您的邮箱</h1>
      <h3>我们已经向您的邮箱{{userEmailChaos}}发送了验证码</h3>
      <h3>请在下方输入您所接受到的验证码</h3>
      <div class="inputColumn" style="height: 20%">
        <div class="form-inline" style="margin-top: 100px;" >
          <input class="form-control input-lg" v-model="confirmCode" maxlength="6" type="text">
        </div>
      </div>

      <div class="confirmBox">
        <button type="button" class="btn btn-info btn-lg" @click="backStep" style="margin-left: 100px;">后退</button>
        <button type="button" class="btn btn-success btn-lg" @click="confirmCodeFun" style="margin-left: 100px;">确认</button>
      </div>
      <a href="#" @click="getMailCode"><span>没有收到？重新发送</span></a>
    </div>
    <!-- step2 验证邮箱end-->

    <!-- step3ResetMail 输入新邮箱-->
    <div id="step3-mail">
      <div class="input-group input-lg">
        <span class="input-group-addon">您的新邮箱</span>
        <input type="text" class="form-control input-lg" v-model="newEmail" placeholder="输入常用的邮箱">
      </div>
      <button @click="resetMailConfirm" class="btn btn-info btn-lg">确认</button>
    </div>
    <!-- step3ResetMail 输入新邮箱end-->

    <!-- step3ResetPassword 输入新密码-->
    <div id="step3-password">
      <div class="input-group input-lg">
        <span class="input-group-addon">您的新密码</span>
        <input type="password" class="form-control input-lg" v-model="inputNewPassword">
      </div>

      <button @click="resetPasswordInput"  class="btn btn-info btn-lg">确认</button>
    </div>
    <!-- step3ResetPassword 输入新密码end-->

    <!-- step4ResetMail 验证新邮箱-->
    <div id="step4-mail">
      <h1>我们需要验证您的新邮箱</h1>
      <h3>我们已经向您的新邮箱发送了验证码</h3>
      <h3>请在下方输入您所接受到的验证码</h3>
      <div class="inputColumn" style="height: 20%">
        <div class="form-inline" style="margin-top: 100px;" >
          <input class="form-control input-lg" v-model="newMailConfirmCode" maxlength="6" type="text">
        </div>
      </div>

      <div class="confirmBox">
        <button type="button" class="btn btn-info btn-lg" @click="newMailBackStep" style="margin-left: 100px;">后退</button>
        <button type="button" class="btn btn-success btn-lg" @click="confirmNewMailCode" style="margin-left: 100px;">确认</button>
      </div>
      <a href="#" @click="getNewMailCode"><span>没有收到？重新发送</span></a>
    </div>
    <!-- step4ResetMail 验证新邮箱end-->
    <!-- step4ResetPassword 确认密码-->
    <div id="step4-password">

      <div class="input-group input-lg">
        <span class="input-group-addon">确认您的新密码</span>
        <input type="password" class="form-control input-lg" v-model="confirmNewPassword">
      </div>
      <button @click="backStep"  class="btn btn-info btn-lg">返回</button>
      <button @click="resetPasswordConfirm"  class="btn btn-info btn-lg">确认</button>

    </div>
    <!-- step4ResetPassword 确认密码end-->

    <!-- step5ResetPassword 成功-->
    <div id="step5-mail">
      <h1>修改成功</h1>
      <a class="btn btn-success btn-lg" @click="doLogout">返回登录页面</a>
    </div>
    <!-- step5ResetPassword 成功-->

    <!-- step5ResetPassword 成功-->
    <div id="step5-password">
      <h1>修改成功</h1>
      <a class="btn btn-success btn-lg" @click="doLogout">返回登录页面</a>
    </div>

    <!-- step5ResetPassword 成功end-->
  </div>
</template>

<script>
const messCode = [
  "A", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function getCode(size){
  const codeLen = messCode.length;
  let code = "";
  for(let i = 0;i < size;i++){
    let randIdx = Math.floor(Math.random()*codeLen)
    code += messCode[randIdx];
  }
  return code;
}
import axios from "axios";
import Qs from "qs/dist/qs.js"
import toastr from "toastr"

export default {
  name: "UserSafeInformationBox",
  props:{

  },
  data() {
    return {
      userName:"ZhongSir",
      userEmail:"",
      newEmail:"",
      step: 0,
      style:"",
      checkCode: "",
      confirmCode:"",
      newMailConfirmCode:"",
      inputNewPassword:"",
      confirmNewPassword:"",
      inputNewMail:"",
    }
  },/*数据*/
  mounted(){
    axios.post("/api/user/queryUserSafeInfo",Qs.stringify({'userName':this.userName}))
        .then(res =>{
          this.userEmail = res.data.data['userEmail'];
        })
        .catch(err =>{
          console.error(err);
        })
  },/*自动加载函数*/
  methods: {
    doLogout: function () {
      this.$router.push({
        name:"登录注册"
      })
    },
    proAni:function(style){
      $("#pb").animate({width:25*this.step+"%"},100);
      if(style === "step"){
        $("#mark"+(this.step+1)).fadeIn();
      }
      else if(style === "back"){
        $("#mark"+(this.step+2)).fadeOut();
      }
    },
    goStep:function(action){
      if(this.step < 1){
        if(action === "step"){
          $("#step"+(this.step+1)).fadeOut();
          $("#step"+(this.step+2)).fadeIn();
          this.step++;
        }
      }
      else if(this.step === 1){
        if(action === "step"){
          $("#step"+(this.step+1)).fadeOut();
          $("#step"+(this.step+2)+"-"+this.style).fadeIn();
          this.step++;
        }
        else if(action === "back"){
          $("#step"+(this.step+1)).fadeOut();
          $("#step"+(this.step)).fadeIn();
          this.step--;
        }
      }
      else if(this.step < 4){
        if(action === "back"){
          $("#step"+(this.step+1)+"-"+this.style).fadeOut();
          $("#step"+(this.step)+"-"+this.style).fadeIn();
          this.step--;
        }
        else if(action === "step"){
          $("#step"+(this.step+1)+"-"+this.style).fadeOut();
          $("#step"+(this.step+2)+"-"+this.style).fadeIn();
          this.step++;
        }
      }
      this.proAni(action);
    },
    resetMail:function(){
      this.style = "mail";
      $("#safePro").fadeIn();
      this.goStep("step");
      this.checkCode = getCode(6);
      axios.post("/api/user/sendCheckCode",Qs.stringify({'userEmail':this.userEmail,'checkCode':this.checkCode}));
    },
    changePassword:function(){
      this.style = "password";
      $("#safePro").fadeIn();
      this.goStep("step");
      this.checkCode = getCode(6);
      axios.post("/api/user/sendCheckCode",Qs.stringify({'userEmail':this.userEmail,'checkCode':this.checkCode}));
    },
    backStep:function(){
      this.goStep("back");
    },
    getMailCode:function(){
      this.checkCode = getCode(6);
      axios.post("/api/user/sendCheckCode",Qs.stringify({'userEmail':this.userEmail,'checkCode':this.checkCode}));
    },
    getNewMailCode:function (){
      this.checkCode = getCode(6);
      axios.post("/api/user/sendCheckCode",Qs.stringify({'userEmail':this.newEmail,'checkCode':this.checkCode}));
    },
    confirmCodeFun:function(){
      if(this.checkCode === this.confirmCode){
        this.goStep("step");
      }
      else{
        toastr.error("验证码不正确");
      }
    },
    resetMailConfirm:function(){
      let patterEmail = RegExp(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/)
      if(patterEmail.test(this.newEmail)){
        axios.post("/api/user/checkRe",Qs.stringify({'style':"userEmail",'userEmail':this.newEmail}))
            .then(res =>{
              if(res.data.code === 404){
                toastr.error("邮箱已被使用");
              }
              else if(res.data.code === 200){
                this.goStep("step");
                this.checkCode = getCode(6);
                axios.post("/api/user/sendCheckCode",Qs.stringify({'userEmail':this.newEmail,'checkCode':this.checkCode}));
              }
            })
            .catch(err =>{
              console.error(err);
            })
      }
      else{
        toastr.error("输入的邮箱格式不正确");
      }
    },
    resetPasswordInput:function(){
      this.goStep("step");
    },
    resetPasswordConfirm:function(){
      if(this.inputNewPassword === this.confirmNewPassword){
        axios.post("/api/user/updateUserSafeInfo",Qs.stringify({'userPassword':this.confirmNewPassword,'userName':this.userName}))
            .then(res =>{
              if(res.data.code === 200){
                toastr.success("密码已更新");
              }
              else if(res.data.code === 404){
                toastr.error("密码更新失败");
              }
            })
            .catch(err =>{
              console.error(err);
            })
        this.goStep("step");
      }
      else{
        toastr.error("两次输入的密码不一致");
      }
    },
    newMailBackStep:function(){
      this.goStep("back");
    },
    confirmNewMailCode:function(){
      if(this.checkCode === this.newMailConfirmCode){
        axios.post("/api/user/updateUserSafeInfo",Qs.stringify({'userEmail':this.newEmail,'userName':this.userName}))
            .then(res =>{
              if(res.data.code === 200){
                toastr.success("邮箱已更新，请牢记您的新邮箱");
                this.goStep("step");
              }
              else if(res.data.code === 404){
                toastr.error("邮箱更新失败");
              }
            })
            .catch(err =>{
              console.error(err);
            })

      }
      else{
        toastr.error("验证码不正确")
      }

    }
  },/*执行触发函数*/
  computed: {
    userEmailChaos:function (){
      let idx = this.userEmail.indexOf("@");
      return this.userEmail.substring(0,3) + "***" + this.userEmail.substring(idx,this.userEmail.length);
    }
  },/*动态计算属性*/
}
</script>

<style scoped>
.contain{
  left: 0;
  right: 0;
  margin: 0 auto;
  height: auto;
  width: 700px;
  background-color: #fff;
  text-align: center;
  box-shadow: 2px 2px 5px #000;
  border-radius: 30px 30px 30px 30px;
  padding: 50px 50px 50px 50px;
}

.confirmBox{
  margin-top: 100px;
  margin-left: 80px;
  text-align: left;
}

.contain .Mark{
  text-align: left;
}

.contain .Mark span{
  margin-left: 22%;
  color: green;
  display: none;
}


.contain #step2,#step3-mail,#step3-password,#step4-mail,#step4-password,#step5-mail,#step5-password{
  margin-top: 20px;
  display: none;
}

.contain #safePro{
  display: none;
}
</style>