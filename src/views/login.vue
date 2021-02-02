<template>
  <div class="container">
    <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9" style="margin-left: 80px">
      <form id="loginForm"  method="post" role="form">
        <h2 class="form-signin-heading"><i class="glyphicon glyphicon-log-in"></i> 用户登录</h2>
        <div class="form-group has-success has-feedback">
          <label for="username"></label><input type="text" class="form-control" id="username" v-model="username" name="username" placeholder="在此输入用户名" autofocus>
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
        </div>
        <div class="form-group has-success has-feedback">
          <input type="password" class="form-control" id="password" v-model="password" name="password" placeholder="在此输入密码" style="margin-top:10px;">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="checkbox" style="height: 20px;">
          <label style="float: left">
            <input id="rememberMe" v-model="rememberMe" type="checkbox" value="1"> 记住我
          </label>
          <label style="float:right">
            <a href="#">还没有账号？</a>
          </label>
        </div>
        <div style="text-align: center">
          <button id="logSub" type="button" class="btn btn-success btn-lg" value="登录" title="登录失败" @click="doLogin"
                  style="margin:auto">登入</button>
        </div>

      </form>
    </div>
  </div>
</template>


<script>

import VueCookies from 'vue-cookies'
import axios from "axios";
import Qs from "qs"
import toastr from "toastr"
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
    toastr.options = {
      "positionClass":"toast-top-center"
    }
  },/*自动加载函数*/
  methods: {
    doLogin:function () {
      if(this.rememberMe === true){
      }
      axios.post("/api/user/loginServlet", this.userMsg("login"))
          .then(res => {
            const data = res.data;

            if(data.code === 402){
              toastr.error("账号或者是密码输入错误");
            }
            else if(data.code === 202){
              toastr.success("登录成功");
            }
          })
          .catch(err => {
            console.error(err);
          })

    },
    userMsg:function(style){
      let params = new URLSearchParams();
      params.append("username",this.username);
      params.append("password",this.password);
      params.append("style",style);
      return params;
    }
  },/*执行触发函数*/
  computed: {

  },/*动态计算属性*/
}
</script>

<style scoped>

</style>