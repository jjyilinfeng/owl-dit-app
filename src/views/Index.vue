<template>
  <cat-return-top/>
  <div class="user-index-backgroundImg">
    <img :src="'/api/static/img/backGroundImg/'+backGroundSrc" alt="背景图片" style="max-width: 100%"/>
  </div>

  <div id="img-set" >
    <div @click="boxClose(closeBoxType)" class="chaos-img" :style="{'height':'1080px','width':'1920px','display':ShadowSetDisFlag?'block':'none'}"></div>
    <img :src="'/api/static/img/'+imgBiggerType+'/'+imgBiggerSrc" alt="放大图片" v-show="ImgSetDisFlag===true"
         :class="['setImg','animate__animated',ImgSetAnimateFlag?'animate__zoomIn':'animate__zoomOut']" />
  </div>

<!--  展示界面-->
  <Header :class="['Header','animate__animated', HeaderAnimateFlag?'animate__flipInX':'animate__flipOutX']"
          v-show="HeaderDisFlag===true"
          :userName="userName"  :user-face-src="userFaceSrc"
          @showBgi="showBgi" @showBoxes="showBoxes" @showUserInfoBox="showUserInfoBox" @showMainIndex="showMainIndex"
          @showUserSafeInfoBox="showUserSafeInfoBox" @showSearchBox="showSearchBox" @search="search" @showFriendBox="showFriendBox"
          @showSetBGI="showSetBGI" @showSetBGM="showSetBGM" @showMessageBox="showMessageBox"
  />
  <LeftBox :class="['LeftBox','animate__animated', LeftBoxAnimateFlag?'animate__slideInLeft':'animate__slideOutLeft']"
           :style="{'display':LeftBoxDisFlag?'block':'none','margin-left':LeftBoxMarginLeft+'px'}"
           :user-name="userName" :visited-name="visitedName" :visited-type="visitedType" :user-face-src="userFaceSrc"
  />
  <div class="middleBox">
    <PostBox :class="['PostBox','animate__animated', PostBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
             :style="{'display':PostBoxDisFlag?'block':'none'}"
              :user-name="userName"
             @sendDit="sendDit"
    />
    <friend-post-box :class="['friend-post-box','animate__animated', FriendPostBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                     :style="{'display':FriendPostBoxDisFlag?'block':'none'}"
                      :user-name="userName" :refreshDitFlag="refreshDitFlag" :page="ditsPage"
                     :visited-name="visitedName" :visited-type="visitedType"
                     @refreshEnd="refreshEnd" @addPage="addPage" @deleteDit="deleteDit" @deleteComment="deleteComment"
                     @showDitUserFace="showDitUserFace" @showDitUserInfo="showDitUserInfo"
                     @showDitImg="showDitImg"
                     @setPage="setPage"
    />
  </div>
  <RightBox :class="['RightBox','animate__animated', RightBoxAnimateFlag?'animate__slideInRight':'animate__slideOutRight']"
            v-show="RightBoxDisFlag"/>


  <div  v-show="APlayerDisFlag" id="aPlayer"></div>
<!--展示界面END-->

<!--  隐藏界面-->
  <user-information-box :class="['UserInfoBox','animate__animated', UserInfoBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                        :style="{'display':UserInfoBoxDisFlag?'block':'none','margin-left':UserInfoBoxMarginLeft+'px'}"
                        :user-information-new="userInfo" :user-face-src="userFaceSrc"
                        @updateUserFaceSrc="updateUserFaceSrc" @imgSet="imgSet"
  />

  <user-safe-information-box :class="['UserSafeInfoBox','animate__animated', UserSafeInfoBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                             v-show="UserSafeInfoBoxDisFlag"
                              :user-name="userName"
  />

  <confirm-msg-box :class="['confirmMsgBox','animate__animated',confirmMsgBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                   v-show="confirmMsgBoxDisFlag===true"
                   :body-msg="confirmBoxMsg" :click-event="messageBoxFunction" :title-msg="confirmBoxTittle" :event-data="confirmBoxData"
                   @cancel="closeConfirmMsgBox"
  />

  <user-card-box :user-card-data="userCardInfo" :user-name="userName" v-show="UserCardBoxDisFlag === true"
                 :class="['userCardBox','animate__animated',UserCardBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                  @visit="visitFriend"/>

  <dit-details-box :class="['ditDetailBox','animate__animated',ditDetailBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                   v-show="ditDetailBoxDisFlag===true" :dit-uuid="ditDetailUuid" :user-name="userName"
                   @closeDetail="closeDetail" @deleteComment="deleteComment"
                   />

  <search-box :class="['SearchBox','animate__animated',SearchBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']" v-show="SearchBoxDisFlag"
              :searchFlag="searchFlag"
               @showDitUserFace="showDitUserFace" @showDitUserInfo="showDitUserInfo" @searchOver="searchOver" @showDitDetail="showDitDetail"
              />

  <friend-box :class="['FriendBox','animate__animated',FriendBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']" v-show="FriendBoxDisFlag"
          :user-name="userName" @showDitUserInfo="showDitUserInfo" @showUserFace="showDitUserFace"
  />

  <message-box :class="['MsgBox','animate__animated',MsgBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']" v-show="MsgBoxDisFlag"
               :user-name="userName" :check-msg-box-type="checkMsgBoxType"
               @changeMsgBoxType="changeMsgBoxType" @showUserCard="showDitUserInfo" @showDitDetails="showDitDetail"
               />

  <set-background-img-box :class="['setBGIBox','animate__animated',setBGIBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']" v-show="setBGIBoxDisFlag"
                          :user-name="userName" @changeBackGround="changeBackGroundImg"
                         />

  <set-back-ground-music-box :class="['setBGMBox','animate__animated',setBGMBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']" v-show="setBGMBoxDisFlag"
                             :user-name="userName" @deleteBgm="deleteBgm" @showPlayer="showPlayer" @hidePlayer="hidePlayer"
  />
<!--  隐藏界面END-->

</template>

<script>
import "animate.css"
import Cookie from "js-cookie"
import Qs from "qs/dist/qs.js"
import axios from "axios";
import "aplayer/dist/APlayer.min.css"
import APlayer from 'aplayer'

import Header from "@/components/boxes/indexBoxes/Header";
import LeftBox from "@/components/boxes/indexBoxes/LeftBox";
import PostBox from "@/components/boxes/indexBoxes/middleBox/PostBox";
import FriendPostBox from "@/components/boxes/indexBoxes/middleBox/FriendPostBox";
import RightBox from "@/components/boxes/indexBoxes/RightBox";
import CatReturnTop from "@/components/items/catReturnTop";
import UserInformationBox from "@/components/boxes/indexBoxes/UserInformationBox";
import UserSafeInformationBox from "@/components/boxes/indexBoxes/UserSafeInformationBox";
import ConfirmMsgBox from "@/components/msgbox/ConfirmMsgBox";
import UserCardBox from "@/components/msgbox/userCardBox";
import SearchBox from "@/components/boxes/indexBoxes/searchBox";
import FriendBox from "@/components/boxes/indexBoxes/FriendBox";
import SetBackgroundImgBox from "@/components/msgbox/SetBackgroundImgBox";
import SetBackGroundMusicBox from "@/components/boxes/indexBoxes/SetBackGroundMusicBox";
import MessageBox from "@/components/boxes/indexBoxes/MessageBox";
import DitDetailsBox from "@/components/boxes/indexBoxes/ditDetailsBox";
export default {
  name: "Index",
  components: {
    DitDetailsBox,
    MessageBox,
    SetBackGroundMusicBox,
    SetBackgroundImgBox,
    FriendBox,
    SearchBox,
    UserCardBox,
    ConfirmMsgBox,
    UserSafeInformationBox,
    UserInformationBox, CatReturnTop, RightBox, FriendPostBox, PostBox, LeftBox, Header},
  data() {
    return {
      //用户名，登录的钥匙
      userName:"",

      //界面动态调整
      LeftBoxMarginLeft:"",
      UserInfoBoxMarginLeft:"",

      //页面展示风格
      AllBoxes:["RightBox", "FriendPostBox", "PostBox", "LeftBox", "Header","UserInfoBox","UserSafeInfoBox","ImgSet","SearchBox","FriendBox","MsgBox","setBGIBox","setBGMBox","ditDetailBox"],
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
      APlayerDisFlag:true,

      UserInfoBoxAnimateFlag:false,
      UserInfoBoxDisFlag:false,
      ImgSetDisFlag: false,
      ImgSetAnimateFlag:false,
      UserSafeInfoBoxDisFlag:false,
      UserSafeInfoBoxAnimateFlag:false,
      SearchBoxDisFlag:false,
      SearchBoxAnimateFlag:false,
      FriendBoxDisFlag:false,
      FriendBoxAnimateFlag:false,
      setBGIBoxAnimateFlag:false,
      setBGIBoxDisFlag:false,
      setBGMBoxAnimateFlag:false,
      setBGMBoxDisFlag:false,
      MsgBoxDisFlag:false,
      MsgBoxAnimateFlag:false,
      ditDetailBoxAnimateFlag:false,
      ditDetailBoxDisFlag:false,


      confirmMsgBoxAnimateFlag:false,
      confirmMsgBoxDisFlag:false,
      UserCardBoxAnimateFlag:false,
      UserCardBoxDisFlag:false,


      ShadowSetDisFlag:false,

      //用户信息动态变量
      userInfo:{
        userFaceUuid:"default.png"
      },
      userCardInfo:{
        userName:"",
        userGender:"",
        userFollow:"",
        userFans:"",
        userDitCount:"",
        userAge: '',
        userFaceUuid:"",
        userSign:"这个人很懒，还什么都没有写",
        style:""
      },

      //用户头像
      userFaceSrc:"default.png",

      //背景图
      backGroundSrc:"default.jpg",

      //关闭的窗口值
      closeBoxType:"",

      //放大图片路径
      imgBiggerSrc:"default.png",
      imgBiggerType:"userFace",

      //搜索值
      searchFlag:false,

      //DitFlag
      refreshDitFlag:'unRefresh',

      //页数
      ditsPage:"1",

      //消息盒子类型
      checkMsgBoxType:"0",

      //访问模式
      visitedType:"self",
      //访问的人
      visitedName:"",

      //确认窗口信息
      confirmBoxTittle:"",
      confirmBoxMsg:"",
      confirmBoxData:"",

      //dit详情uuid
      ditDetailUuid:"",

      //播放器
      ap:""
    }
  },
  mounted() {
    this.userName = this.$route.params['userName'];
    if(this.userName !== null && this.userName !== undefined){
      Cookie.set("userName-idx",this.userName);
    }
    else{
      this.userName = Cookie.get("userName-idx");
    }
    //过滤器
    if(this.userName === undefined || this.userName === ""){
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

    this.ap = new APlayer({
      container: document.getElementById('aPlayer'),
      mini:true,
      fixed:true,
      audio: []
    })

    //读新消息
    this.$store.commit("getUnReadPraise",this.userName);
    this.$store.commit("getUnReadComment",this.userName);

    this.getUserInfo();
    this.getBackGroundImg(this.userName);
    this.getBackGroundMusic(this.userName);
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
    showUserSafeInfoBox:function (){
      this.boxSwitch(this.getShowBoxes(), ["UserSafeInfoBox"]);
    },
    showMainIndex:function (){
      this.visitedType = 'self';
      this.getBackGroundImg(this.userName);
      this.ap.list.clear();
      this.getBackGroundMusic(this.userName);
      this.boxSwitch(this.getShowBoxes(), this.MainIndex);
    },
    showSearchBox:function(){
      if(this.SearchBoxAnimateFlag !== true){
        this.boxSwitch(this.getShowBoxes(), ["SearchBox"]);
      }
    },
    showFriendBox(){
      this.boxSwitch(this.getShowBoxes(),["FriendBox"])
    },
    showMessageBox(data){
      axios.post("/api/message/readMessage",Qs.stringify({'userName':this.userName}))
          .then(res=>{
            this.checkMsgBoxType = data;
            if(this.MsgBoxDisFlag === false){
              this.boxSwitch(this.getShowBoxes(),["MsgBox"])
            }
          })
          .catch(err =>{
            console.error(err);
          })

    },
    showDitUserFace:function (data){
      this.boxSwitch([], ["ImgSet"]);
      this.closeBoxType = "ImgSet";
      this.ShadowSetDisFlag = true;
      this.imgBiggerType = 'userFace';
      this.imgBiggerSrc = data;
    },
    showDitUserInfo:function(userName){
      //userCard初始
      this.userCardInfo = {userName:"", userGender:"", userFollow:"", userFans:"", userDitCount:"",userAge: '', userFaceUuid:"", userSign:"这个人很懒，还什么都没有写", style:""}
      this.closeBoxType = "UserCardBox";
      this.ShadowSetDisFlag = true;
      this.boxSwitch([], ["UserCardBox"]);
      this.getUserCard(userName)
    },
    showDitDetail(uuid){
      this.ditDetailUuid = uuid;
      this.HideBoxes = this.getShowBoxes();
      this.boxSwitch(this.HideBoxes, ["ditDetailBox"]);
    },
    showDitImg(uuid){
      this.boxSwitch([], ["ImgSet"]);
      this.closeBoxType = "ImgSet";
      this.ShadowSetDisFlag = true;
      this.imgBiggerType = 'ditImg';
      this.imgBiggerSrc = uuid;
    },
    imgSet:function (){
      this.boxSwitch([], ["ImgSet"]);
      this.ShadowSetDisFlag = true;
      this.imgBiggerType = 'userFace';
      this.imgBiggerSrc = this.userFaceSrc;
      this.closeBoxType = "ImgSet";
    },
    showSetBGI(){
      this.ShadowSetDisFlag = true;
      this.boxSwitch([],["setBGIBox"]);
      this.closeBoxType = "setBGIBox";
    },
    showSetBGM(){
      this.boxSwitch(this.getShowBoxes(),["setBGMBox"])
    },
    boxClose:function (type){
      this.ShadowSetDisFlag = false;
      this.boxSwitch([type], []);
    },
    closeDetail(){
      console.log("in");
      this.boxSwitch(["ditDetailBox"],this.HideBoxes);
      this.HideBoxes = [];
    },
    deleteDit:function(data){
      this.messageBoxFunction = this.deleteDitFunction;
      this.confirmBoxMsg = "确认要删除这个条动态吗？";
      this.confirmBoxTittle = "删除动态";
      this.closeBoxType = "confirmMsgBox";
      this.ShadowSetDisFlag = true;
      this.boxSwitch([], ["confirmMsgBox"]);
      this.confirmBoxData = data;
    },
    deleteComment(data){
      this.messageBoxFunction = this.deleteCommentFunction;
      this.closeBoxType = "confirmMsgBox";
      this.confirmBoxMsg = "确认要删除你发送的这条信息吗？";
      this.confirmBoxTittle = "删除评论";
      this.ShadowSetDisFlag = true;
      this.boxSwitch([], ["confirmMsgBox"]);
      this.confirmBoxData = data;
    },
    deleteBgm(data){
      this.messageBoxFunction = this.deleteBgmFunction;
      this.confirmBoxMsg = "确认要删除你空间的这首背景音乐吗？";
      this.confirmBoxTittle = "删除背景音乐";
      this.ShadowSetDisFlag = true;
      this.boxSwitch([], ["confirmMsgBox"]);
      this.confirmBoxData = data;
    },
    closeConfirmMsgBox:function (){
      this.ShadowSetDisFlag = false;
      this.boxSwitch(["confirmMsgBox"],[])
    },
    visitFriend(visitName){
      this.visitedType = 'friend';
      this.visitedName = visitName;
      this.ap.list.clear();
      this.getBackGroundMusic(this.visitedName);
      this.getBackGroundImg(this.visitedName);
      this.visit(visitName);
      this.ShadowSetDisFlag = false;
      let closeBox = this.getShowBoxes();
      closeBox.push("UserCardBox");
      window.scrollTo(0, 0);
      setTimeout(()=>{
        this.boxSwitch(closeBox,["LeftBox","RightBox","FriendPostBox"])
      },200)
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
            if(this.userInfo['userFaceUuid'] === ''){
              this.userInfo['userFaceUuid'] = 'default.png';
            }
          })
          .catch(err =>{
            console.error(err);
          })
    },
    getUserCard(userName){
      axios.post("/api/userIndex/queryUserCard",Qs.stringify({"userCardName":userName,"userName":this.userName}))
          .then(res =>{
            this.userCardInfo = res.data.data;
          })
          .catch(err =>{
            console.error(err);
          })
    },
    getBackGroundImg(userName){
      axios.post("/api/userIndex/queryBackGroundImg",Qs.stringify({"userName":userName}))
          .then(res =>{
            if(res.data.data !== "" && res.data.data !== null){
              this.backGroundSrc = res.data.data;
            }
            else{
              this.backGroundSrc = "default.jpg";
            }
          })
          .catch(err =>{
            console.error(err);
          })
    },
    getBackGroundMusic(userName){
      axios.post("/api/userIndex/queryBGM",Qs.stringify({'userName':userName}))
      .then(res =>{
        let data = res.data.data;

        this.ap.list.add(data);
      })
      .catch(err =>{
        console.error(err);
      })
    },

    changeBackGroundImg(uuid){
      this.backGroundSrc = uuid;
    },
    changeMsgBoxType(type){
      this.checkMsgBoxType = type;
    },

    updateUserFaceSrc:function (data){
        this.userFaceSrc = data;
        this.refreshDitFlag = 'refresh';
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

    sendDit:function(){
      this.ditsPage = '1';
      setTimeout(()=>{
        this.refreshDitFlag = 'refresh';
      },200)
    },
    refreshEnd:function (){
      this.refreshDitFlag = 'unRefresh';
    },
    addPage:function (){
      this.ditsPage = parseInt(this.ditsPage)+1+"";
      this.refreshDitFlag = 'refresh';
    },
    setPage:function(data){
      this.ditsPage = data;
    },
    messageBoxFunction:function (){

    },
    deleteDitFunction:function (uuid){

      axios.post("/api/dit/deleteDit",Qs.stringify({'ditUuid':uuid}))
      .then(res =>{
        this.closeConfirmMsgBox();
        this.refreshDitFlag = 'delete';
        let data = res.data;
        layui.use(['layer'],function () {
          layer.msg(data.message,{icon: data.code===200?6:5,time:2000, shade:0.4});
        })
      })
      .catch(err =>{
        console.error(err);
      })
    },
    deleteCommentFunction(id){
      this.refreshDitFlag = 'delete';
      axios.post("/api/dit/deleteDitComment",Qs.stringify({'id':id}))
          .then(res =>{
            this.closeConfirmMsgBox();
            let data = res.data;
            layui.use(['layer'],function () {
              layer.msg(data.message,{icon: data.code===200?6:5,time:2000, shade:0.4});
            })
          })
          .catch(err =>{
            console.error(err);
          })
    },
    deleteBgmFunction(data){
      axios.post("/api/userIndex/deleteBgm",Qs.stringify({'id':data}))
      .then(res =>{
        this.closeConfirmMsgBox();
        let data = res.data;
        layui.use(['layer'],function () {
          layer.msg(data.message,{icon: data.code===200?6:5,time:2000, shade:0.4});
        })
      })
      .catch(err =>{
        console.error(err);
      })
    },
    search:function(word){
      this.searchFlag = true;
    },
    searchOver(){
      this.searchFlag = false;
    },
    showPlayer(){
      this.APlayerDisFlag = true;
    },
    hidePlayer(){
      this.APlayerDisFlag = false;
    },
    visit(userName){
      axios.post("/api/userIndex/visit",Qs.stringify({'userName':userName}))
      .catch(err =>{
        console.error(err);
      })
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

.userCardBox{
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  z-index: 9999;
  position: fixed;
}

.MsgBox{
  left: 0;
  right: 0;
  margin: auto;
  z-index: -1;
  position: fixed;
}

.setBGIBox{
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  z-index: 9999;
  position: fixed;
}

.setBGMBox{
  left: 0;
  right: 0;
  margin: auto;
  z-index: -1;
  position: fixed;
}

.confirmMsgBox{
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  z-index: 9999;
  position: fixed;

}

.ditDetailBox{
  left: 0;
  right: 0;
  margin: auto;
  z-index: -1;
  position: absolute;
}

.user-index-backgroundImg{
  top: 0;
  left: 0;
  width:100%;
  height:100%;
  min-width: 1000px;
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
  max-height: 90%;
  max-width: 100%;
  position: fixed;
  z-index: 9999;
}
</style>