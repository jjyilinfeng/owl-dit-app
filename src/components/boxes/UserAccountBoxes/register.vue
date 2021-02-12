<template>


  <div class="container">
    <h2 class="form-signin-heading" style="text-align: left;"><i class="glyphicon glyphicon-import"></i> 用户注册</h2>
    <div class="form-horizontal" role="form">
      <div class="form-group" id="username_group">
        <label class="col-sm-2 control-label" for="register-username">用户名</label>
        <div class="col-sm-10">
          <input class="form-control" @blur="uNameJug"  v-model="username" name="registerName" id="register-username" type="text"  placeholder="2-16位字符">
          <span class="glyphicon glyphicon-user form-control-feedback" style="margin-right: 15px"></span>
        </div>
        <span class="col-sm-2 control-label"></span>
      </div>

      <div class="form-group" id="password_group">
        <label class="col-sm-2 control-label" for="register-password">密码</label>
        <div class="col-sm-10">
          <input type="password" @blur="uPwdJug"  v-on:input="pwdStrength" class="form-control form-group-lg" name="registerPassword" v-model="password" id="register-password"  placeholder="4-20位字符">
          <span class="glyphicon glyphicon-lock form-control-feedback" style="margin-right: 15px"></span>
        </div>
      </div>
      <label class="col-sm-2" style="float: left;">密码强度</label>
      <div class="progress" style="width: 150px;height: 10px;margin-top:30px;margin-left: 100px;">
        <div class="progress-bar progress-bar-danger" id="password-bar"  role="progressbar" style="padding: 0;margin: 0"></div>
      </div>
      <div class="form-group" id="userEmail_group">
        <label class="col-sm-2 control-label" for="userEmail">电子邮箱</label>
        <div class="col-sm-10">
          <input class="form-control form-group-lg" @blur="uEmailJug" v-model="userEmail" name="registerEmail" id="userEmail" type="text"  placeholder="常用的电子邮箱地址">
          <span class="glyphicon glyphicon-envelope form-control-feedback" style="margin-right: 15px"></span>
        </div>
      </div>


      <div class="user-account-register-footer">
        <button type="button" class="btn btn-info btn-lg" @click="getMailCode" style="margin-right: 20px">  注册  </button>
        <button @click="jumpToLogin" class="btn btn-success btn-lg" title="跳转到登录界面">已有账号？</button>
      </div>
    </div>
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
import toastr from "toastr";
export default {
  name: "register",
  components: {},
  data: function() {
    return {
      username:"",
      password:"",
      userEmail:"",
      username_msg:"",
      checkCodeData:[
        "","","","","",""
      ],
      checkCode:"",
      checkCodeConfirm:"",
      usernameGate:false,
      userPasswordGate:false,
      userEmailGate:false,
      userCheckCodeGate:false,


    };
  },/*数据*/
  component:{},/*自定义标签*/
  mounted(){

  },/*自动加载函数*/
  methods: {
    pwdStrength:function(){
      const pwd = this.password;
      let pwdstr = 0;
      let passwordStrengthBar = $("#password-bar");
      const pattNum = new RegExp(/^.*[\d]+.*$/);
      const pattLetterLow = new RegExp(/.*[a-z]+.*$/);
      const pattLetterUpper = new RegExp(/.*[A-Z]+.*$/);
      const pattSpecial = new RegExp(/.*[`~!@#$%^&*()_\-+=<>?:"{}|,.;'\\[\]·]+.*$/);
      if(pwd.length > 3 && pwd.length < 31){
        if(pattNum.test(pwd)){
          pwdstr++;
        }
        if(pattLetterLow.test(pwd)){
          pwdstr++;
        }
        if(pattLetterUpper.test(pwd)){
          pwdstr++;
        }
        if(pattSpecial.test(pwd)){
          pwdstr++;
        }
      }
      switch(pwdstr){
        case 0:
          if(passwordStrengthBar.css("width") !== "0"){
            passwordStrengthBar.attr("class","progress-bar progress-bar-danger");
            passwordStrengthBar.animate({width:"0"},40);
          }
          break;
        case 1:
          if(passwordStrengthBar.css("width") !== "37.5px"){
            passwordStrengthBar.attr("class","progress-bar progress-bar-danger");
            passwordStrengthBar.animate({width:"37.5px"},40);
          }
          break;
        case 2:
          if(passwordStrengthBar.css("width") !== "82.5px"){
            passwordStrengthBar.attr("class","progress-bar progress-bar-warning");
            passwordStrengthBar.animate({width:"82.5px"},40);
          }
          break;
        case 3:
          if(passwordStrengthBar.css("width") !== "120px"){
            passwordStrengthBar.attr("class","progress-bar progress-bar-success");
            passwordStrengthBar.animate({width:"120px"},40);
          }
          break;
        case 4:
          if(passwordStrengthBar.css("width") !== "150px"){
            passwordStrengthBar.attr("class","progress-bar progress-bar-success");
            passwordStrengthBar.animate({width:"150px"},100);
          }
          break;
        default:
          console.log("密码强度错误");
          break;
      }
    },
    uNameJug:function(){
      let uname = this.username;
      if(uname.length < 2 || uname.length > 16){
        $("#username_group").attr("class","form-group has-error");
        toastr.error("用户名输入格式错误");
        this.usernameGate = false;
      }
      else{
        axios.post("/api/user/checkRe", this.userMsg("userName"))
            .then(res => {
              const data = res.data;
              if(data.code === 404){
                $("#username_group").attr("class","form-group has-error");
                toastr.error(data.message);
                this.usernameGate = false;
              }
              else if(data.code === 200){
                $("#username_group").attr("class","form-group has-success");
                toastr.success(data.message);
                this.usernameGate = true;
              }
            })
            .catch(err => {
              console.error(err);
            })
      }
    },
    uPwdJug:function(){
      if(this.password.length > 20 || this.password.length < 4){
        this.userPasswordGate = false;
        toastr.error("密码格式不正确");
      }
      else{
        this.userPasswordGate = true;
      }
    },
    uEmailJug:function(){
      let patterEmail = RegExp(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/)
      if(patterEmail.test(this.userEmail)){
        axios.post("/api/user/checkRe", this.userMsg("userEmail"))
            .then(res => {
              const data = res.data;
              if(data.code === 404){
                $("#userEmail_group").attr("class","form-group has-error");
                toastr.error(data.message);
                this.userEmailGate = false;
              }
              else if(data.code === 200){
                $("#userEmail_group").attr("class","form-group has-success");
                toastr.success(data.message);
                this.userEmailGate = true;
              }
            })
            .catch(err => {
              console.error(err);
            })
      }
      else{
        $("#userEmail_group").attr("class","form-group has-error");
        toastr.error("邮箱格式不正确");
        this.userEmailGate = false;
      }
    },


    getMailCode:function(){
      if(this.usernameGate && this.userPasswordGate && this.userEmailGate){
        this.checkCodeConfirm = getCode(6);
        this.$emit("jumpToCheckCode",this.userMsg("checkRegister"))
        axios.post("/api/user/sendCheckCode", this.userMsg("registerCheck"))
            // eslint-disable-next-line no-unused-vars
            .then(res => {
              toastr.warning("验证码邮件已经成功发送至您的邮箱，请注意查收");
            })
            .catch(err => {
              console.error(err);
            })
      }
      else{
        toastr.warning("信息填写不正确")
      }
    },


    userMsg:function(style){
      let params = new URLSearchParams();
      params.append("userName",this.username);
      params.append("password",this.password);
      params.append("userEmail",this.userEmail);
      params.append("checkCode",this.checkCodeConfirm);
      params.append("style",style);

      return params;
    },
    jumpToLogin:function (){
      this.$emit("jumpToLogin","跳转到登录");
    }
  },/*执行触发函数*/
}
</script>

<style scoped>
.container{
  height: auto;
  width: 700px;
  background-color: rgba(255,255,255,0.8);
  text-align: center;
  box-shadow: 2px 2px 5px #000;
  border-radius: 30px 30px 30px 30px;
  padding: 50px 50px 50px 50px;
}

.container *{
  margin-top: 9px
}


</style>