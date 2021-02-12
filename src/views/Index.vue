<template>
  <cat-return-top/>
  <div class="user-index-backgroundImg">
    <img src="../assets/img/backgroundImg/owl-dit-bgi.jpg" alt="背景图片" :style="{'width':BgiWidth+'px'}"/>
  </div>

  <div id="img-set" @click="imgClose">
    <div class="chaos-img" :style="{'height':'1080px','width':'1920px','display':ImgSetDisFlag?'block':'none'}"></div>
    <img :src="'/api/static/img/userFace/'+userFaceSrc" alt="放大图片" :style="{'display':ImgSetDisFlag?'block':'none'}"
         :class="['setImg','animate__animated',ImgSetAnimateFlag?'animate__zoomIn':'animate__zoomOut']" />
  </div>


  <Header :class="['Header','animate__animated', HeaderAnimateFlag?'animate__flipInX':'animate__flipOutX']"
          :style="{'display':HeaderDisFlag?'block':'none'}"
          :userName="userName"  :user-face-src="userFaceSrc"
          @showBgi="showBgi" @showBoxes="showBoxes" @showUserInfoBox="showUserInfoBox" @showMainIndex="showMainIndex"
  />
  <LeftBox :class="['LeftBox','animate__animated', LeftBoxAnimateFlag?'animate__slideInLeft':'animate__slideOutLeft']"
           :style="{'display':LeftBoxDisFlag?'block':'none','margin-left':LeftBoxMarginLeft+'px'}"
  />
  <div class="middleBox">
    <PostBox :class="['PostBox','animate__animated', PostBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
             :style="{'display':PostBoxDisFlag?'block':'none'}"/>
    <friend-post-box :class="['friend-post-box','animate__animated', FriendPostBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                     :style="{'display':FriendPostBoxDisFlag?'block':'none'}"/>
  </div>
  <RightBox :class="['RightBox','animate__animated', RightBoxAnimateFlag?'animate__slideInRight':'animate__slideOutRight']"
            :style="{'display':RightBoxDisFlag?'block':'none'}"/>

  <user-information-box :class="['UserInfoBox','animate__animated', UserInfoBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                        :style="{'display':UserInfoBoxDisFlag?'block':'none','margin-left':UserInfoBoxMarginLeft+'px'}"
                        :user-information-new="userInfo" :user-face-src="userFaceSrc"
                        @updateUserFaceSrc="updateUserFaceSrc" @imgSet="imgSet"
  />
</template>

<script>
import "animate.css"

import Header from "@/components/boxes/indexBoxes/Header";
import LeftBox from "@/components/boxes/indexBoxes/LeftBox";
import PostBox from "@/components/boxes/indexBoxes/middleBox/PostBox";
import FriendPostBox from "@/components/boxes/indexBoxes/middleBox/FriendPostBox";
import RightBox from "@/components/boxes/indexBoxes/RightBox";
import CatReturnTop from "@/components/items/catReturnTop";
import UserInformationBox from "@/components/boxes/indexBoxes/UserInformationBox";
import axios from "axios";
export default {
  name: "Index",
  components: {UserInformationBox, CatReturnTop, RightBox, FriendPostBox, PostBox, LeftBox, Header},
  data() {
    return {
      //用户名，登录的钥匙
      userName:"",

      //界面动态调整
      LeftBoxMarginLeft:"",
      UserInfoBoxMarginLeft:"",
      BgiWidth:"",


      //页面展示风格
      AllBoxes:["RightBox", "FriendPostBox", "PostBox", "LeftBox", "Header","UserInfoBox","ImgSet"],
      MainIndex:["LeftBox","RightBox","PostBox","FriendPostBox"],

      HideBoxes:[],

      //动画判定变量
      LeftBoxAnimateFlag:true,
      LeftBoxDisFlag:true,
      RightBoxAnimateFlag:true,
      RightBoxDisFlag:true,
      PostBoxAnimateFlag:true,
      PostBoxDisFlag:true,
      FriendPostBoxAnimateFlag:true,
      FriendPostBoxDisFlag:true,
      HeaderAnimateFlag:true,
      HeaderDisFlag:true,

      UserInfoBoxAnimateFlag:false,
      UserInfoBoxDisFlag:false,
      ImgSetDisFlag: false,
      ImgSetAnimateFlag:false,

      //用户信息动态变量
      userInfo:{},
      userFaceSrc:"default.png"
    }
  },
  mounted() {
    //过滤器
    if(this.$route.params['userName'] === undefined){
      this.$router.push({
        name:"登录注册",
        params:{
          userType:"login",
          message:"您还没有登录"
        }
      })
    }
    this.LeftBoxMarginLeft = (window.innerWidth - 1400) / 2;
    this.UserInfoBoxMarginLeft = (window.innerWidth - 900) / 2;
    this.BgiWidth = window.innerWidth;
    this.userName = this.$route.params['userName'];

    this.getUserInfo();
  },
  methods:{
    showBgi:function (){
      this.HideBoxes = this.getShowBoxes();
      this.boxSwitch(this.HideBoxes, []);
    },
    showBoxes:function (){
      this.boxSwitch([], this.HideBoxes);
      this.HideBoxes = [];
    },
    showUserInfoBox:function (){
      this.boxSwitch(this.getShowBoxes(), ["UserInfoBox"]);
      this.getUserInfo();
    },
    showMainIndex:function (){
      this.boxSwitch(this.getShowBoxes(), this.MainIndex);
    },

    imgSet:function (){
      this.HideBoxes = this.getShowBoxes();
      this.boxSwitch(this.HideBoxes, ["ImgSet"]);
    },
    imgClose:function (){
      this.boxSwitch(["ImgSet"], this.HideBoxes);
      this.HideBoxes = [];
    },
    getUserInfo:function (){
      axios.post("/api/userIndex/queryUserInfo",this.setParams({'userName':this.userName}))
          .then(res =>{
            this.userInfo = res.data.data;
            this.userFaceSrc = res.data.data.userFaceUuid;
            for(let key in this.userInfo){
              if(this.userInfo[key] === null){
                this.userInfo[key] = "";
              }
            }

          })
          .catch(err =>{
            console.error(err);
          })
    },
    updateUserFaceSrc:function (data){
        this.userFaceSrc = data;
    },
    getShowBoxes:function (){
      let showBoxes = [];
      for (let i = 0; i < this.AllBoxes.length; i++) {
        if (this[this.AllBoxes[i]+"DisFlag"] === true && this.AllBoxes[i] !== "Header"){
          showBoxes.push(this.AllBoxes[i]);
        }
      }
      return showBoxes;
    },
    boxSwitch:function (closeBoxItems, openBoxItems){
      for (let i = 0; i < closeBoxItems.length; i++) {
        this[closeBoxItems[i]+'AnimateFlag'] = false;
      }
      let timeout;
      if(closeBoxItems.length === 0){
        timeout = 0;
      }
      else{
        timeout = 600;
      }
      setTimeout(()=>{
        for (let i = 0; i < closeBoxItems.length; i++) {
          this[closeBoxItems[i]+'DisFlag'] = false;
        }
        for (let i = 0; i < openBoxItems.length; i++) {
          this[openBoxItems[i]+'AnimateFlag'] = true;
          this[openBoxItems[i]+'DisFlag'] = true;
        }
      },timeout)
    },
    setParams:function (Obj){
      let params = new URLSearchParams();
      for(let key in Obj){
        if(Obj.hasOwnProperty(key)){
          params.append(key,Obj[key]);
        }
      }
      return params;
    }
  },
  computed:{

  }
}
</script>

<style scoped>

.Header{
  margin-bottom: 20px;
}

.LeftBox{
  position: relative;
  z-index: -1;
  float: left;
}

.middleBox{
  width: 700px;
  height: auto;
  position: relative;
  z-index: -1;
  float: left;
  margin-left: 50px;
}


.friend-post-box{
  margin-top: 25px;

}

.RightBox{
  position: relative;
  z-index: -1;
  float: left;
  margin-left: 50px;
}

.UserInfoBox{
  float: left;
  position: relative;
  z-index: -1;
}

.user-index-backgroundImg{
  position: fixed;
  z-index: -9999;
}

.chaos-img{
  background-color: rgba(0,0,0,0.3);
  position: fixed;
  z-index: 999;
}

.setImg{
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 100%;
  max-width: 100%;
  position: fixed;
  z-index: 9999;
}
</style>