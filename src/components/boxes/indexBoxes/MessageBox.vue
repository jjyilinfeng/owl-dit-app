<template>
  <div class="message-box">
    <div class="msg-box-left">
      <div class="row">
        <div class="span2">
          <ul class="nav nav-pills nav-stacked">
            <li :class="checkMsgBoxType==='收到的赞'?'active':''"><a @click="changeType">收到的赞</a></li>
            <li :class="checkMsgBoxType==='回复消息'?'active':''"><a @click="changeType">回复消息</a></li>
            <li :class="checkMsgBoxType==='留言板'?'active':''"><a @click="changeType">留言板</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="msg-box-right">
      <div class="title">
        {{checkMsgBoxType}}
      </div>
      <div class="msg-box-data">
        <div class="loading">

        </div>
        <div :class="['msg-praise animate__animated',praiseAFlag?'animate__zoomIn':'animate__zoomOut']" v-show="praiseDFlag"
             id="msg-praise" v-for="praise in praiseInfo">

          <div class="dit-message" style="float: right;width: 80px;height: 100px;">
            <a @click="showDetails(praise['ditUuid'])" style="color: gray">{{praise['ditMessage']}}</a>
          </div>

          <div class="praise-data" style="margin-top: 30px">
            <span class="praise-name" v-for="name in praise['ditPraiseUserName'].slice(0,3)" style="font-weight: bolder;">
              <a @click="showUserCard(name)">{{name}}</a>
            </span>
            <span v-show="praise['ditPraiseUserName'].length>2">&nbsp;等{{praise['ditPraiseUserName'].length-2}}人</span>
            <span>赞了你</span>
          </div>
        </div>
        <div :class="['msg-comment animate__animated',commentAFlag?'animate__zoomIn':'animate__zoomOut']"
              id="msg-comment" v-show="commentDFlag" v-for="comment in $store.state.unReadInfo.unReadComment">

          <div class="dit-message" style="float: right;width: 80px;height: 100px;">
            <a @click="showDetails(comment['ditUuid'])" style="color: gray">{{comment['ditMessage']}}</a>
          </div>

          <div class="comment-data" style="margin-top: 30px">
            <span style="font-weight: bolder">
              <a @click="showUserCard(comment['ditCommentUserName'])">{{comment['ditCommentUserName']}}</a> 回复了你：
            </span>
            <span>{{comment['ditCommentMessage']}}</span>
          </div>



        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/font.css"
import axios from "axios";
import Qs from "qs/dist/qs"
export default {
  name: "MessageBox",
  props:{
    userName:String,
    checkMsgBoxType:String,
  },
  data() {
    return {
      praiseAFlag:false,
      praiseDFlag:false,
      commentAFlag:false,
      commentDFlag:false,

    }
  },
  watch:{
    checkMsgBoxType(newVal) {
      if(newVal === "收到的赞"){
        this.$store.commit("getUnReadPraise",this.userName);
        this.commentAFlag = false;
        setTimeout(()=>{
          this.commentDFlag = false;
          this[this.boxType+"DFlag"] = true;
          this[this.boxType+"AFlag"] = true;
        },600);
      }
      else if (newVal === "回复消息"){
        this.readMessage();
        this.$store.commit("getUnReadComment",this.userName);

        this.praiseAFlag = false;
        setTimeout(()=>{
          this.praiseDFlag = false;
          this[this.boxType+"DFlag"] = true;
          this[this.boxType+"AFlag"] = true;
        },600);
      }
    }
  },
  mounted() {

  },
  methods:{
    fun(){
      console.log(this.$store.state.unReadInfo);
    },
    changeType(ev){
      this.$emit("changeMsgBoxType",$(ev.target).html());
    },
    showDetails(uuid){
      this.$emit("showDitDetails",uuid)
    },
    showUserCard(name){
      this.$emit("showUserCard",name);
    },
    readMessage(){
      axios.post("/api/message/readMessage",Qs.stringify({'userName':this.userName}))
      .catch(err =>{
        console.error(err);
      })
    }
  },
  computed:{
    boxType(){
      switch (this.checkMsgBoxType){
        case "收到的赞" :return "praise";
        case "回复消息" :return "comment";
        case "留言板" :return "leaveMsg";
        default :return "";

      }
    },
    praiseInfo(){
      let info = [];
      let praise = this.$store.state.unReadInfo.unReadPraise;
      let praiseName = [],currDit;
      if(praise.length > 0){
        currDit = praise[0]['ditMessage'];
        praiseName.push(praise[0]['ditPraiseUserName']);
      }
      for (let i = 1; i < praise.length; i++) {
        if(praise[i]['ditMessage'] === currDit){
          praiseName.push(praise[i]['ditPraiseUserName']);
        }
        else{
          info.push({'ditMessage':currDit,'ditPraiseUserName':praiseName,'ditUuid':praise[i-1]['ditUuid']});
          currDit = praise[i]['ditMessage'];
          praiseName = [];
          praiseName.push(praise[i]['ditPraiseUserName']);
        }
      }
      if(praise.length > 0){
        info.push({'ditMessage':currDit,'ditPraiseUserName':praiseName,'ditUuid':praise[praise.length-1]['ditUuid']});
      }
      return info;
    }
  }
}
</script>

<style scoped>
.message-box{
  width: 80%;
  min-height: 200px;
  padding: 20px;
  border-radius: 30px;
  box-shadow: #0f0f0f 2px 2px 5px;
  background-color: rgba(255,255,255,0.5);
}

.msg-box-left{
  width: 12%;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 15px;
  font-family: "Microsoft YaHei UI",serif;
  float: left;
}

.msg-box-right{
  margin-left: 20px;
  width: 80%;
  float: right;
}

.msg-box-right .title{
  width: 100%;
  height: 40px;
  padding: 7px 20px;
  margin-bottom: 20px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 7px;
  text-align: left;
  font-size: 18px;
  font-family: "Microsoft YaHei UI",serif ;
}

.msg-box-right .msg-box-data{
  width: 100%;
  min-height: 400px;
  padding: 10px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 7px;
  text-align: left;
  font-size: 15px;
  font-family: "Microsoft YaHei UI",serif ;
}

.msg-box-right .msg-box-data .msg-praise{
  width: 100%;
  height: 100px;
  padding: 5px 10px;
  border-bottom: rgba(0,0,0,0.1) solid 1px;

}

.msg-box-right .msg-box-data .msg-comment{
  width: 100%;
  height: 100px;
  padding: 5px 10px;
  border-bottom: rgba(0,0,0,0.1) solid 1px;
}

</style>