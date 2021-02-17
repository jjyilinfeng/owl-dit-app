<template>

  <div class="FriendBox" style="text-align: left">
    <button class="btn btn-success" @click="fun"  style="display: none">刷新</button>
  <div class="friend-box-header">
    <span class="dit-font" v-if="showType==='friend' && visitedType==='self'">看看朋友们都在聊什么</span>
    <span class="dit-font" v-else-if="showType==='self'&& visitedType==='self'">这里是你自己发送的Dit</span>
    <span class="dit-font" v-else>这里是你{{visitedName}}发送的Dit</span>
    <div class="friend-switch" style="float: right">
      <div :class="['demo-box-content animate__animated',visitedType==='self'?'animate__zoomIn':'animate__zoomOut']"
             id="ditSwitch" @click="switchSelf">
        <span class="switch-font" v-if="showType==='self'">仅显示自己</span>
        <span class="switch-font" v-else-if="showType==='friend'">显示自己和朋友</span>
        <input type="checkbox" class="dit-switch" />
      </div>
    </div>
  </div>
  <div :class="['dit-Box animate__animated',ditBoxAnimateFlag?'animate__zoomIn animate__delay-1s':'animate__zoomOut']"
       v-for="(dit,idx) in userAllDit" :id="'dit-'+idx">
      <div class="dit-header">
        <img class="dit-userFace" @click="showUserFace(dit['userFaceUuid'])" :src="'/api/static/img/userFace/'+dit['userFaceUuid']" :alt="dit['ditUserName']"/>
        <div class="dit-info">
          <a @click="showDitUserInfo(dit['ditUserName'])" class="dit-userName">
            <span v-if="dit['userNickName']!==''">{{dit['userNickName']}}</span>
            <span v-else>{{dit['userName']}}</span>
          </a>
          <span class="dit-dateTime">{{dit['ditDateTime']}}</span>
        </div>
      </div>
    <div class="dit-message">
      <span class="dit-msg" v-html="dit.ditMessage"/>
    </div>
    <div class="dit-op" :data-ditIdx="idx" :data-ditUuid="dit['ditUuid']" :data-ditPraise="dit['ditPraise']" :id="'dit-'+idx">
      <i class="layui-icon layui-icon-praise" @click="praiseDit" :style="praiseJug(dit)"></i>
      <i class="layui-icon layui-icon-star" style="font-size: 25px; "></i>
      <i class="layui-icon layui-icon-reply-fill" @click="chooseDit=idx" style="font-size: 25px; "></i>
      <i class="layui-icon layui-icon-delete" @click="deleteDit" v-show="dit['ditUserName'] === userName" style="font-size: 25px;"></i>
    </div>
    <div class="dit-footer-praise" v-show="dit['ditPraise'].length > 0" style="margin-left: 20px;margin-top: 10px">
      <span v-for="(praiseUser,praiseIdx) in dit['ditPraise']" style="font-weight: bolder;color: red">
        <a :class="praiseUser['ditPraiseUserName']===userName?'animate__animated animate__zoomIn':''" @click="showDitUserInfo(praiseUser['ditPraiseUserName'])">
          <span v-if="praiseUser['userNickName']!==''">{{praiseUser['userNickName']}}</span>
          <span v-else>{{praiseUser['ditPraiseUserName']}}</span>
        </a>
        <span v-show="praiseIdx !== dit['ditPraise'].length-1">、</span>
      </span>
      <span>
        等{{dit['ditPraise'].length}}人表示很赞
      </span>
    </div>
    <div class="dit-footer-comment"  style="margin-left: 20px;margin-top: 20px;">
      <div class="comment" v-for="ditComment in dit['ditComment']">
        <img :src="'/api/static/img/userFace/'+ditComment['userFaceUuid']" :alt="ditComment['ditCommentUserName']">
        <a v-if="ditComment['userNickName']!==''">&nbsp;{{ditComment['userNickName']}} &nbsp;</a>
        <a v-if="ditComment['userNickName']===''">&nbsp;{{ditComment['ditCommentUserName']}} &nbsp;</a>
        <span>说:{{ditComment['ditCommentMessage']}}</span>
        <span>  {{ditComment['ditDateTime']}}</span>
      </div>
      <div class="send-comment animate__animated" :id="'dit-comment-'+idx" style="display: none;margin-top: 20px">
        <label>
          <input  :class="['form-control','form-send-comment']" v-model="sendCommentMsg" type="text" placeholder="说点什么吧..">
        </label>
        <button class="btn btn-info" @click="commentDit(dit,idx)">
          <i class="layui-icon">&#xe609;</i>
          发送</button>
      </div>
    </div>
  </div>
  <div class="footer" style="text-align: center">
    <span class="dit-font">再怎么拉也没有啦！</span>
  </div>

</div>
</template>

<script>
import axios from "axios";
import Qs from "qs/dist/qs.js"
import "animate.css"
export default {
  name: "FriendPostBox",
  props: {
    userName: String,
    refreshDitFlag:String,
    page: String,
    visitedName:String,
    visitedType:String,
  },
  data() {
    return {
      userAllDit: [],
      showType:"friend",
      ditBoxAnimateFlag:true,
      ditLoading:false,

      chooseDit:-1,
      chooseDitHeight:0,
      sendCommentMsg:"",
      maxPage:2
    }
  },
  watch:{
    page:{
      handler(newName, OldName) {
        if(newName !== OldName){
          if(this.showType === 'friend'){
            this.getAllDit(this.userName);
          }
          if(this.showType === 'self'){
            this.getSelfDit(this.userName);
          }
        }
      },
    },

    refreshDitFlag:{
      handler(newName) {
        if((this.page === '1' && newName === 'refresh')||newName === 'delete'){
          setTimeout(()=>{
            this.getAllDit(this.userName);
          },600)

          if(this.showType === 'self'){
            $("#ditSwitch").click();
          }
        }
      },
    },
    visitedType:{
      handler(newName) {
        if(newName === 'friend'){
          //console.log(newName);
          this.heightReSet();
          this.getSelfDit(this.visitedName);

        }
        else if (newName === 'self'){
          this.heightReSet();
          this.getAllDit(this.userName);
        }
      },
    },
    chooseDit:{
      handler(newName,oldName){
        this.sendCommentMsg = "";
        let oldDit,oldDitHeight;
        let newDom = $("#dit-comment-"+newName);
        let oldDom = $("#dit-comment-"+oldName);
        let newDit = $("#dit-"+newName);
        let newDitHeight = parseInt(newDit.css('height').substring(0,newDit.css('height').indexOf("px")));
        if(oldName !== -1){
          oldDit = $("#dit-"+oldName);
          oldDitHeight = parseInt(oldDit.css('height').substring(0,newDit.css('height').indexOf("px")));
        }
        newDit.animate({'min-height':newDitHeight+60+'px'},800);
        oldDom.attr("class","send-comment animate__animated animate__fadeOutUp");
        setTimeout(()=>{
          newDom.css("display","block");
          newDom.attr("class","send-comment animate__animated animate__fadeInDown");
          if(oldName !== -1){
            oldDom.css("display","none");
            oldDit.animate({'min-height':oldDitHeight-60+'px'});
          }
        },800)
      }
    },

    showType:{
      handler(newName){
        switch (newName){
          case 'self':
            this.getSelfDit(this.userName);
            break;
          case 'friend':
            this.getAllDit(this.userName);
            break;
          default:
              break;
        }
      }
    }
  },
  mounted() {

    this.switchInit();
    setTimeout(() => {
      let _this = this;
      this.getAllDit(this.userName);
      $(window).scroll(function() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTop+900 >= document.documentElement.scrollHeight && _this.ditLoading === true
          && _this.maxPage > parseInt(_this.page)){
          _this.$emit("addPage","增加页数");
        }

      })
    }, 200)

  },
  methods: {
    fun(){
      if(this.showType === 'self'){
        this.getSelfDit(this.userName);
      }
      else if (this.showType === 'friend'){
        this.getAllDit(this.userName);
      }
    },

    switchSelf(){
      this.$emit("setPage","1");
      if(this.showType === "friend"){
        this.showType = "self"
      }
      else if(this.showType === "self"){
        this.showType = "friend"
      }
    },
    getSelfDit(ditUser){
      this.ditLoading = false;
      if(this.page === "1"){
        this.ditBoxAnimateFlag = false;
      }
      let _this = this;
      axios.post("/api/dit/getSelfDit", Qs.stringify({"userName": ditUser,"page":this.page}))
          .then(res => {
            let data = res.data;
            if (data.code === 200) {
              this.userAllDit = data.data;
              this.maxPage = this.userAllDit[0]['pageMax'];
              for (let i = 0; i < this.userAllDit.length; i++) {
                this.userAllDit[i]['ditDateTime'] = this.transDate(this.userAllDit[i]['ditDateTime']);
              }
              this.ditLoading = true;
              //console.log(this.userAllDit);
              setTimeout(() => {
                this.ditBoxAnimateFlag = true;
                let img = $(".dit-msg img");
                img.css("max-height","350px");
                img.css("max-width","650px");
                img.each(function(){
                  $(this).click(()=>{
                    _this.$emit('showDitImg',($(this).attr("alt")));
                  })
                })
                this.$emit("refreshEnd","刷新结束");
              }, 200)
            }
            else{
              this.userAllDit = [];
            }
          })
          .catch(err => {
            console.error(err)
          })
    },
    getAllDit:function(ditUser){
      this.ditLoading = false;
      if(this.page === "1"){
        this.ditBoxAnimateFlag = false;
      }

      let _this = this;
      axios.post("/api/dit/getAllDit", Qs.stringify({"userName": ditUser,"page":this.page}))
          .then(res => {
            let data = res.data;
            if (data.code === 200) {
              this.userAllDit = data.data;
              this.maxPage = this.userAllDit[0]['pageMax'];
              for (let i = 0; i < this.userAllDit.length; i++) {
                this.userAllDit[i]['ditDateTime'] = this.transDate(this.userAllDit[i]['ditDateTime']);
              }
              this.ditLoading = true;
              this.ditBoxAnimateFlag = true;
              setTimeout(() => {
                let img = $(".dit-msg img");
                img.css("max-height","350px");
                img.css("max-width","650px");
                img.each(function(){
                  $(this).click(()=>{
                    _this.$emit('showDitImg',($(this).attr("alt")));
                  })
                })
                this.$emit("refreshEnd","刷新结束");
              }, 500)

            }
            else{
              this.userAllDit = [];
            }
          })
          .catch(err => {
            console.error(err)
          })
    },
    deleteDit:function(event){
      this.$emit("deleteDit",$(event.target).parent().attr("data-ditUuid"));
    },
    praiseJug(dit){
      dit = dit['ditPraise'];
      for(let i = 0;i < dit.length;i++){
        if(dit[i]['ditPraiseUserName'] === this.userName) {
          return {
            'font-size': '25px',
            'color': 'red'
          }
        }
      }
      return{
        'font-size':'25px',
        'color':'rgb(44, 62, 80)'
      }
    },
    praiseDit:function (event){
      if($(event.target).css('color') === 'rgb(44, 62, 80)'){
        $(event.target).css("color","red");
        axios.post("/api/dit/insertDitPraise",Qs.stringify({'ditPraiseUserName':this.userName,'ditUuid':$(event.target).parent().attr("data-ditUuid")}))
          .then(res =>{
            this.userAllDit[$(event.target).parent().attr("data-ditIdx")]['ditPraise'] = res.data.data;
          })
          .catch(err =>{
            console.error(err);
          })
      }
      else{
        $(event.target).css("color","rgb(44, 62, 80)");
        axios.post("/api/dit/deleteDitPraise",Qs.stringify({'ditPraiseUserName':this.userName,'ditUuid':$(event.target).parent().attr("data-ditUuid")}))
          .then(res =>{
            this.userAllDit[$(event.target).parent().attr("data-ditIdx")]['ditPraise'] = res.data.data;
          })
          .catch(err =>{
            console.error(err);
          })
      }
    },
    commentDit(dit, idx){
      axios.post("/api/dit/insertDitComment",Qs.stringify({'ditCommentMessage':this.sendCommentMsg,
        'ditUuid':dit['ditUuid'],'ditCommentUserName':this.userName}))
      .then(res =>{
        this.userAllDit[idx]['ditComment'] = res.data.data;
      })
      .catch(err =>{
        console.error(err);
      })

      this.sendCommentMsg = "";
    },
    showUserFace:function (uuid){
      this.$emit("showDitUserFace",uuid);
    },
    showDitUserInfo:function (userName){
      this.$emit("showDitUserInfo",userName);
    },
    switchInit(){
      //开关初始
      let switches = {};
      let switchConfig = {
        'dit-switch': {},
      }
      Object.keys(switchConfig).forEach(function (key) {
        switches[key] = new Switch(document.querySelector('.' + key),switchConfig[key]);
      });
    },
    heightReSet(){
      for (let i = 0; i < this.userAllDit.length; i++) {
        $("#dit-"+i).css("min-height","0px");
      }
    },

    transDate: function (timestamp) {
      let nowDate = new Date();
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes()
      m<10?m='0'+m:m;
      if(nowDate.getMonth() === date.getMonth() && nowDate.getDate() === date.getDate()){
        return "今天 "+h+m;
      }
      else if(nowDate.getMonth() === date.getMonth() && nowDate.getDate() === date.getDate()+1){
        return "昨天 "+h+m;
      }
      else {
        return M + D + h + m;
      }
    }
  }
}
</script>

<style scoped>
.FriendBox{
  width: 700px;
  height: auto;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
  padding: 20px;
}

.dit-font{
  color: #3F3F3F;
  font-size: 18px;

}

.dit-Box{
  width: 660px;
  height: auto;
  margin-top: 20px;
  padding : 16px 0;
  border-radius: 10px;
  border: gray 1px solid;
  background-color: rgba(255,255,255,0.4);
}

.dit-Box.animate__animated.animate__zoomIn{
  --animate-delay: 0.8s;
}

.dit-msg *{
  height: 200px;
}

.dit-Box .dit-header{
  height: 50px;
  width: 560px;
  padding: 0 16px;
  margin-bottom: 12px;
}

.dit-Box .dit-header .dit-userFace{
  width: 50px;
  height: 50px;
  margin-right: 12px;
  border-radius: 50%;
  float: left;
  display: block;
}

.dit-Box .dit-header .dit-info{
  float: left;
  overflow: hidden;
}
.dit-Box .dit-header .dit-info .dit-userName{
  color: #332f30;
}

.dit-Box .dit-header .dit-info .dit-dateTime{
  margin-top: 5px;
  color: #8c7e83;
  display: block;
}

.dit-Box .dit-message{
  padding: 0 20px;
  font-weight: normal;
  font-size: 16px;
}

.dit-Box .dit-op{
  margin-top: 20px;
  border-bottom: 1px solid #ebccd1;
  text-align: right;
}
.dit-Box .dit-op *{
  margin-right: 50px;
}

.dit-Box .dit-footer-comment .comment{
  margin-top: 5px;
  margin-left: 20px;
  min-height: 30px;
}

.dit-Box .dit-footer-comment .comment img{
  width: 30px;
  height: 30px;
  display: block;
  float: left;
  border-radius: 50%;
}


.form-send-comment{
  width: 520px;
}


.comment{

}

.switch-font{

  color: #0C0C0C;
  padding-right: 20px
}
</style>