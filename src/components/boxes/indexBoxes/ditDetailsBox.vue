<template>
  <div class="dit-detail-box" style="text-align: left">
    <a @click="closeDetail"><span class="fa fa-angle-left"  style="padding-bottom: 10px"></span> 返回</a>
    <div class="dit-Box">
      <div class="dit-header">
        <img class="dit-userFace" :src="'/api/static/img/userFace/'+ditInfo['userFaceUuid']" :alt="ditInfo['ditUserName']"/>
        <div class="dit-info">
          <a class="dit-userName">
            <span v-if="ditInfo['userNickName']!==''">{{ditInfo['userNickName']}}</span>
            <span v-else>{{ditInfo['userName']}}</span>
          </a>
          <span class="dit-dateTime">{{transDate(ditInfo['ditDateTime'])}}</span>
        </div>
      </div>
      <div class="dit-message">
        <span class="dit-msg" v-html="ditInfo.ditMessage"/>
      </div>
      <div class="dit-op" :data-ditIdx="ditInfo" :data-ditUuid="ditInfo['ditUuid']" :data-ditPraise="ditInfo['ditPraise']">
        <i class="layui-icon layui-icon-praise" @click="praiseDit" :style="praiseJug"></i>
        <i class="layui-icon layui-icon-star" ></i>
        <i class="layui-icon layui-icon-reply-fill" ></i>
      </div>
      <div class="dit-footer-praise" v-show="ditInfo['ditPraise'].length > 0" style="margin-left: 20px;margin-top: 10px">
      <span v-for="(praiseUser,praiseIdx) in ditInfo['ditPraise']" style="font-weight: bolder;color: red">
        <a :class="praiseUser['ditPraiseUserName']===userName?'animate__animated animate__zoomIn':''" >
          <span v-if="praiseUser['userNickName']!==''">{{praiseUser['userNickName']}}</span>
          <span v-else>{{praiseUser['ditPraiseUserName']}}</span>
        </a>
        <span v-show="praiseIdx !== ditInfo['ditPraise'].length-1">、</span>
      </span>
        <span>
        等{{ditInfo['ditPraise'].length}}人表示很赞
      </span>
      </div>
      <div class="dit-footer-comment"  style="margin-left: 20px;margin-top: 20px;">
        <div class="comment" v-for="ditComment in ditInfo['ditComment']">
          <img :src="'/api/static/img/userFace/'+ditComment['userFaceUuid']" :alt="ditComment['ditCommentUserName']">
          <span>
          <a v-if="ditComment['userNickName']!==''">&nbsp;{{ditComment['userNickName']}} &nbsp;</a>
          <a v-if="ditComment['userNickName']===''">&nbsp;{{ditComment['ditCommentUserName']}} &nbsp;</a>
        </span>
          <span>:{{ditComment['ditCommentMessage']}}</span>
          <span style="margin-left: 10px;color: gray">  {{transDate(ditComment['ditDateTime'])}}</span>
          <span>&nbsp;&nbsp;<i class="layui-icon layui-icon-delete" v-show="ditComment['ditCommentUserName']===userName" @click="deleteComment(ditComment['ditCommentId'])" ></i></span>
        </div>
        <div class="send-comment animate__animated animate__zoomIn"  style="margin-top: 20px;width: 100%">
          <label style="width: 80%">
            <input  :class="['form-control','form-send-comment']" v-model="sendCommentMsg"  type="text" placeholder="说点什么吧.." >
          </label>
          <button class="btn btn-info" @click="commentDit()">
            <i class="layui-icon">&#xe609;</i>
            发送</button>
        </div>
        <div id="dit-page" v-show="count > 5" style="margin: 0 auto"></div>
      </div>
    </div>


<!--  <div style="position: absolute;bottom: 0">-->
<!--    {{ditInfo}}-->
<!--  </div>-->

  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs/dist/qs"

export default {
  name: "ditDetailsBox",
  props:{
    userName:String,
    ditUuid:String,
  },
  data() {
    return {
      ditInfo:{
        'ditPraise':[],
        'ditComment':[],
        'userFaceUuid':'default.png',

      },
      commentPage:1,
      commentLimit:5,
      sendCommentMsg:"",
      count:0,
    }
  },
  watch:{
    ditUuid(newId){
      this.getDit(newId);
    }
  },
  methods:{
    getDit(uuid){
      let _this = this;

      axios.post("/api/dit/getDitByUuid",Qs.stringify({'ditUuid':uuid,'page':this.commentPage,'limit':this.commentLimit}))
      .then(res =>{
        this.ditInfo = res.data.data;
        let len;
        if(this.ditInfo['ditComment'].length > 0){
          len = this.ditInfo['ditComment'][0]['count'];
          this.count = len;
        }
        else{
          len = 0;
        }
        layui.use(['laypage'], function() {
          let layPage = layui.laypage;
          layPage.render({
            elem: 'dit-page'
            , count: len //数据总数
            , theme: '#1E9FFF'
            , limit: 5
            , jump: function (obj) {
              axios.post("/api/dit/getDitByUuid",Qs.stringify({'ditUuid':uuid,'page':obj.curr,'limit':obj.limit}))
                .then(res => {
                  _this.ditInfo = res.data.data;
                })
                .catch(err =>{
                  console.error(err)
                })
            }
          });
        })
      })
      .catch(err =>{
        console.error(err);
      })
    },
    praiseJug(){
      let dit = this.ditInfo['ditPraise'];
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
    deleteComment(id){
      this.$emit("deleteComment",id);
    },
    commentDit(){
      axios.post("/api/dit/insertDitComment",Qs.stringify({'ditCommentMessage':this.sendCommentMsg,
        'ditUuid':this.ditUuid,'ditCommentUserName':this.userName}))
          .then(res =>{
            this.ditInfo['ditComment'] = res.data.data;
          })
          .catch(err =>{
            console.error(err);
          })

      this.sendCommentMsg = "";
    },
    praiseDit(event){
      if($(event.target).css('color') === 'rgb(44, 62, 80)'){
        $(event.target).css("color","red");
        axios.post("/api/dit/insertDitPraise",Qs.stringify({'ditPraiseUserName':this.userName,'ditUuid':this.ditUuid}))
            .then(res =>{
              this.ditInfo['ditPraise'] = res.data.data;
            })
            .catch(err =>{
              console.error(err);
            })
      }
      else{
        $(event.target).css("color","rgb(44, 62, 80)");
        axios.post("/api/dit/deleteDitPraise",Qs.stringify({'ditPraiseUserName':this.userName,'ditUuid':$(event.target).parent().attr("data-ditUuid")}))
            .then(res =>{
              this.ditInfo['ditPraise'] = res.data.data;
            })
            .catch(err =>{
              console.error(err);
            })
      }
    },
    closeDetail(){
      this.$emit("closeDetail","返回");
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
.dit-detail-box{
  width: 1000px;
  min-height: 500px;
  padding: 20px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 20px;
  box-shadow: #0f0f0f 2px 2px 5px;
}

.dit-Box{
  text-align: left;
}

.dit-Box .dit-header{
  height: 50px;
  width: 560px;
  padding: 0 16px;
  margin-bottom: 12px;
}

.dit-Box .dit-header .dit-userFace{
  width: 75px;
  height: 75px;
  margin-right: 12px;
  border-radius: 50%;
  float: left;
  display: block;
}

.dit-Box .dit-header .dit-info{
  font-size: 20px;
  float: left;
  overflow: hidden;
}
.dit-Box .dit-header .dit-info .dit-userName{

  color: #332f30;
}

.dit-Box .dit-header .dit-info .dit-dateTime{
  margin-top: 10px;
  color: #8c7e83;
  display: block;
}

.dit-Box .dit-message{
  margin: 20px 0;
  padding: 0 20px;
  font-weight: normal;
  font-size: 20px;
}

.dit-Box .dit-op{
  margin-top: 20px;
  border-bottom: 1px solid #ebccd1;
  text-align: right;
}
.dit-Box .dit-op *{
  margin-right: 50px;
  font-size: 25px;
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
</style>