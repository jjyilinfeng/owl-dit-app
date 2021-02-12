<template>
  <ul class="layui-nav" style="text-align: center">
    <li class="layui-nav-item" style=""><a href="">最新活动</a></li>
    <li class="layui-nav-item">
      <div class="navbar-form navbar-left" role="search" style="margin: 0">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Search">
        </div>
        <button type="button" class="btn btn-success">
          <span class="glyphicon glyphicon-search"></span>    搜索
        </button>
      </div>
    </li>
    <li class="layui-nav-item">
      <a><img :src="'/api/static/img/userFace/'+userFaceSrc" alt="头像" class="layui-nav-img">{{userName}}</a>
      <dl class="layui-nav-child" style="padding: 10px">
        <dd><a @click="showMainIndex">用户主页</a></dd>
        <dd><a @click="showUserInfoBoxes">用户信息</a></dd>
        <dd><a href="">安全信息</a></dd>
        <dd><a @click="logOut">登出</a></dd>
      </dl>
    </li>

    <li class="layui-nav-item">
      <a>消息</a>
      <dl class="layui-nav-child" style="padding: 10px">
        <dd><a href="">收到的赞</a></dd>
        <dd><a href="">回复消息</a></dd>
        <dd><a href="">留言板</a></dd>
      </dl>
    </li>
    <li class="layui-nav-item"><a href="">好友</a></li>
    <li class="layui-nav-item"><a href="">收藏</a></li>
    <li class="layui-nav-item">
      <a>设置</a>
      <dl class="layui-nav-child" style="padding: 10px">
        <dd>
          <div class="demo-box-content" @click="switchShowBgi">
            <span class="switch-font">展示首页</span>
            <input type="checkbox" class="demo-default-1" />
          </div>
        </dd>
      </dl>
    </li>
  </ul>
</template>

<script>
import "animate.css"
import axios from "axios";
export default {
  name: "Header",
  props:{
    userName:String,
    userFaceSrc:String
  },
  data() {
    return {
      switches:{
        showBgiSwitch:false
      }
    }
  },
  mounted() {
    //layUI初始
    layui.use(['element', 'form'], function(){
      let element = layui.element;

    });
    //开关初始
    let switches = {};
    let switchConfig = {
      'demo-default-1': {},
    }
    Object.keys(switchConfig).forEach(function (key) {
      switches[key] = new Switch(document.querySelector('.' + key),switchConfig[key]);
    });
  },
  methods:{
    logOut:function (){
      this.$router.push({
        name:"登录注册",
        params:{
          "message":"登出成功"
        }
      })
    },
    showUserInfoBoxes:function(){
      this.$emit("showUserInfoBox","展示用户信息");
    },
    showMainIndex:function (){
      console.log("in");
      this.$emit("showMainIndex","展示用户主页");
    },
    switchShowBgi:function (){
      if(this.switches['showBgiSwitch'] === false){
        this.$emit("showBgi","展示背景");
        this.switches['showBgiSwitch'] = true;
      }
      else{
        this.$emit("showBoxes","展示盒子");
        this.switches['showBgiSwitch'] = false;
      }
    },

  }
}
</script>

<style scoped>
dl dd{
  padding:10px
}
.switch-font{
  color: #0C0C0C;
  padding-right: 5px
}
</style>