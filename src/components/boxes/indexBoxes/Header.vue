<template>
  <ul class="layui-nav" style="text-align: center">

    <li class="layui-nav-item layui-this">
      <a v-if="visitedType==='self'" @click="showMainIndex">
        <i class="layui-icon">&#xe68e;</i>
        用户主页
      </a>
      <a v-if="visitedType==='friend'" @click="returnMainIndex">
        <i class="layui-icon">&#xe68e;</i>
        回到主页
      </a>
    </li>
    <li class="layui-nav-item">
      <div class="navbar-form navbar-left" role="search" style="margin: 0">
        <div class="form-group">
          <input type="text" v-model="searchWord"  @focus="showSearchBox" class="form-control" placeholder="Search">
        </div>
        <button type="button" @click="search" class="btn btn-success">
          <span class="glyphicon glyphicon-search"></span>    搜索
        </button>
      </div>
    </li>
    <li class="layui-nav-item">
      <a><img :src="'/api/static/img/userFace/'+userFaceSrc" alt="头像" class="layui-nav-img">{{userName}}</a>
      <dl class="layui-nav-child" style="padding: 10px">
        <dd><a @click="showUserInfoBoxes">用户信息</a></dd>
        <dd><a @click="showUserSafeInfoBox">安全信息</a></dd>
        <dd><a @click="logOut">登出</a></dd>
      </dl>
    </li>

    <li class="layui-nav-item">
      <span v-show="unReadInfo['unReadPraise']+unReadInfo['unReadComment']>0" class="layui-badge-dot layui-bg-orange" style="left: 4px"></span>
      <a>
        <i class="layui-icon">&#xe667;</i>消息
      </a>
      <dl class="layui-nav-child" style="padding: 10px">
        <dd><a @click="showMessageBox" data-msg-type="收到的赞">收到的赞
          <span  v-show="unReadInfo['unReadPraise']>0" class="layui-badge layui-bg-orange" style="right: -12px">{{ unReadInfo['unReadPraise'] }}</span>
        </a></dd>
        <dd><a @click="showMessageBox" data-msg-type="回复消息">回复消息</a><span v-show="unReadInfo['unReadComment']>0" class="layui-badge layui-bg-orange" style="right: -12px">{{ unReadInfo['unReadComment'] }}</span></dd>
        <dd><a @click="showMessageBox" data-msg-type="留言板">留言板</a><span class="layui-badge layui-bg-orange" style="right: -12px">99+</span></dd>
      </dl>
    </li>
    <li class="layui-nav-item"><a @click="showFriendBox"><i class="layui-icon">&#xe612;</i>好友</a></li>
    <li class="layui-nav-item"><a href=""><i class="layui-icon">&#xe600;</i>收藏</a></li>
    <li class="layui-nav-item">
      <a><i class="layui-icon">&#xe716;</i>设置</a>
      <dl class="layui-nav-child" style="padding: 10px">
        <dd><a @click="showSetBGI">设置背景图</a></dd>
        <dd><a @click="showSetBGM">设置背景音乐</a></dd>
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
import Cookie from "js-cookie"
export default {
  name: "Header",
  watch:{

  },
  props:{
    userName:String,
    userFaceSrc:String,
    visitedType:String,
  },
  data() {
    return {
      switches:{
        showBgiSwitch:false
      },
      searchWord:""
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
    fun(){
      console.log(this.$store.state.unReadInfo);
    },
    logOut:function (){
      this.$emit("logout","登出")

    },
    showUserInfoBoxes:function(){
      this.$emit("showUserInfoBox","展示用户信息");
    },
    showUserSafeInfoBox:function (){
      this.$emit("showUserSafeInfoBox","展示用户安全信息");
    },
    showMainIndex:function (){
      this.$emit("showMainIndex","展示用户主页");
    },
    showSearchBox:function (){
      this.$emit("showSearchBox","展示搜索页");
    },
    showFriendBox(){
      this.$emit("showFriendBox","展示朋友页");
    },
    showMessageBox(ev){
      this.$emit("showMessageBox",$(ev.target).attr("data-msg-type"));
    },
    showSetBGI(){
      this.$emit("showSetBGI","设置背景图");
    },
    showSetBGM(){
      this.$emit("showSetBGM","设置背景图");
    },
    returnMainIndex(){
      this.$emit("returnMainIndex","回到主页");
    },
    search:function(){
      this.$store.commit("changeSearchWord",this.searchWord)
      this.$emit("search",this.searchWord);
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

  },
  computed:{
    unReadInfo(){
      let pra=this.$store.state.unReadInfo['unReadPraise'],
          com=this.$store.state.unReadInfo['unReadComment'];

      let praC = 0, comC = 0;

      for (let i = 0; i < pra.length; i++) {
        if(pra[i]['ditAttention'] === 1){
          praC++;
        }
      }

      for (let i = 0; i < com.length; i++) {
        if(com[i]['ditAttention'] === 1){
          comC++;
        }
      }

      praC>99?pra='99+':praC;
      comC>99?com='99+':comC;

      return{
        'unReadPraise':praC,
        'unReadComment':comC
      }
    }
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