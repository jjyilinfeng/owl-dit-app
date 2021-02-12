<template>
  <owl-blink-eyes id="owl-welcome"/>
  <div class="jumbotron">
    <div class="container">
      <h1>欢迎来到OwlDit网站</h1>
      <p>在这里你可以分享记录你自己的生活，让OwlDit成为你生活的好帮手</p>
      <p>
        <a @click="toRegister" class="btn btn-info btn-lg">马上注册</a>
        <a @click="toLogin" class="btn btn-success btn-lg" style="margin-left: 20px">已有账号？马上登录</a>
      </p>
    </div>

  </div>
</template>

<script>
import OwlBlinkEyes from "../components/items/owlBlinkEyes";
export default {
  name: "welcomePage",
  components: {OwlBlinkEyes},
  methods:{
    toRegister:function(){
      this.$router.push({
        name:'登录注册',
        params:{
          userType:"register"
        }
      })
    },
    toLogin:function (){
      this.$router.push({
        name:'登录注册',
        params:{
          userType:"login"
        }
      })
    }
  }
}
</script>

<style scoped>
.jumbotron{
  text-align: left;
}
.container{
  position: relative;
}
#owl-welcome{

}
</style>