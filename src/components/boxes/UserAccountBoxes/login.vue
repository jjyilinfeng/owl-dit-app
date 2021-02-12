<template>
  <div class="container">
    <div class="userAccounts-login">
      <div class="login-header" style="padding-top: 10px">
        <img src="@/assets/img/raw.png" style="width: 80%;" alt="头像">
      </div>
      <h2 class="form-signin-heading" style="text-align: left"><i class="glyphicon glyphicon-log-in"></i> 用户登录</h2>
      <div class="form-group has-success has-feedback">
        <label for="login-username"></label><input type="text" class="form-control" id="login-username" v-model="username" name="username" placeholder="在此输入用户名" autofocus>
        <span class="glyphicon glyphicon-user form-control-feedback"></span>
      </div>
      <div class="form-group has-success has-feedback">
        <input type="password" class="form-control" id="login-password" v-model="password" name="password" placeholder="在此输入密码" style="margin-top:10px;">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="checkbox" style="height: 20px;">
        <label style="float: left">
          <input id="rememberMe" v-model="rememberMe" type="checkbox" value="1"> 记住我
        </label>
        <label style="float:right">
          <a @click="jumpToRegister">还没有账号？</a>
        </label>
      </div>
      <div style="text-align: center">
        <button id="logSub" type="button" class="btn btn-success btn-lg" value="登录" @click="doLogin"
                style="margin:auto">登入</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr"
import Cookie from "js-cookie"
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
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      checkAccount: true,
    }
  },/*数据*/
  component:{},/*自定义标签*/
  mounted(){

    this.username = Cookie.get("userName");
    this.password = Cookie.get("userPassword");
    window.addEventListener('keydown',this.keyDown);
  },/*自动加载函数*/
  methods: {

    keyDown:function (e){
      if(e.keyCode === 13){
        this.doLogin();
      }
    },
    doLogin:function () {

      axios.post("/api/user/login", this.userMsg("login"))
          .then(res => {
            const data = res.data;
            if(data.code === 201){
              toastr.error("账号或者是密码输入错误");
            }
            else if(data.code === 202){
              toastr.success("登录成功");
              if(this.rememberMe === true){
                Cookie.set("userName",this.username);
                Cookie.set("userPassword",this.password);
              }
              this.$router.push({
                name:"主页",
                params:{
                  userName:this.username
                }
              })
            }
            else if(data.code === 203){
              toastr.warning("用户异地登录，需要验证邮箱");
              const checkCode = getCode(6);
              let map = this.userMsg("checkAccount");
              map.append("checkCode",checkCode)
              this.$emit("jumpToCheckCode",map);
              axios.post("/api/user/sendCheckCode", map)
                  // eslint-disable-next-line no-unused-vars
                  .then(res => {
                    toastr.warning("验证码邮件已经成功发送至您的邮箱，请注意查收");
                  })
                  .catch(err => {
                    console.error(err);
                  })
            }
          })
          .catch(err => {
            console.error(err);
          })

    },
    userMsg:function(style){
      let params = new URLSearchParams();
      params.append("userName",this.username);
      params.append("password",this.password);
      params.append("style",style);
      return params;
    },
    jumpToRegister:function (){
      this.$emit("jumpToRegister","跳转到登录")
    }
  },/*执行触发函数*/
}
</script>

<style scoped>
.container{
  text-align: center;
  height: auto;
  width: 800px;
  border-radius: 30px;
  box-shadow: 2px 2px 5px #030303;
  background-color: rgba(255,255,255,0.8);
  padding: 50px;
}

.login-header{
  height: 100px;
  width: 100px;
  border: 2px solid #24b679;
  border-radius: 50px;
  position: relative;
}
</style>