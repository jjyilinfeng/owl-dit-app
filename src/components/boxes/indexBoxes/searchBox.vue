<template>
<div class="searchBox">
  <div class="search-welcome">
    <div :class="['center-font', 'animate__animated', 'animate__bounce animate__infinite']">
      大家都在搜
    </div>
    <div class="search-font animate__animated animate__headShake animate__infinite" v-for="(word,idx) in keyWords"
         :style="randomFont(idx,word)" @mouseover="deepColor" @mouseleave="lowColor" @click="uploadWord(word.searchWord)">
      {{word.searchWord}}
    </div>
  </div>
  <div class="search-info" style="display: none">
    <div class="layui-inline" style="width: 80%;margin-top: 10px;">
      <div class="layui-tab layui-tab-card" style="min-height: 460px;">
        <ul class="layui-tab-title">
          <li>查找的用户</li>
          <li class="layui-this">查找的Dit</li>
          <li>查找的文章</li>
        </ul>
        <div class="layui-tab-content">
          <div class="layui-tab-item">
            <div class="search-not-found" id="user-not-found" style="display: none">
              <img src="@/assets/img/sadTuanZi.png" alt="返回空"/>
              <span class="lovelyFont">什么都没有找到呢</span>
            </div>
            <div class="loading-item">
              <div class="configure-border-1">
                <div class="configure-core"></div>
              </div>
              <div class="configure-border-2">
                <div class="configure-core"></div>
              </div>
            </div>
            <div id="user-found">
              <div class="user-box" v-for="(user,idx) in searchInfo['userNameSearch']" :style="{'float':idx%2!==0?'right':'left'}" >
                <img class="user-userFace" @click="showUserFace(user['userFaceUuid'])" :src="'/api/static/img/userFace/'+user['userFaceUuid']" :alt="user['userName']"/>
                <div class="user-info">
                  <a @click="showDitUserInfo(user['userName'])" class="user-userName">
                    <span v-if="user['userNickName']!==''">{{user['userNickName']}}</span>
                    <span v-else>{{user['userName']}}</span>
                  </a>
                  <span class="user-info-main">
                    <i class="layui-icon layui-icon-male" v-show="user['userGender']==='男'" style="color: #1E9FFF"/>
                    <i class="layui-icon layui-icon-female" v-show="user['userGender']==='女'" style="color: deeppink"/>
                      {{user['userAge']}}
                  </span>
                  <div class="user-sign">
                    {{user['userSign']}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="layui-tab-item  layui-show">
            <div class="search-not-found" id="dit-not-found">
              <img src="@/assets/img/sadTuanZi.png" alt="返回空"/>
              <span class="lovelyFont" >什么都没有找到呢</span>
            </div>
            <div class="loading-item">
              <div class="configure-border-1">
                <div class="configure-core"></div>
              </div>
              <div class="configure-border-2">
                <div class="configure-core"></div>
              </div>
            </div>
            <div id="dit-found">
              <div class="dit-Box animate__animated animate__zoomIn animate__delay-1s" v-for="dit in searchInfo['ditSearch']">
                <div class="dit-header">
                  <img class="dit-userFace" @click="showUserFace(dit['userFaceUuid'])" :src="'/api/static/img/userFace/'+dit['userFaceUuid']" :alt="dit['ditUserName']"/>
                  <div class="dit-info">
                    <a @click="showDitUserInfo(dit['ditUserName'])" class="dit-userName">
                      <span v-if="dit['userNickName']!==''">{{dit['userNickName']}}</span>
                      <span v-else>{{dit['userName']}}</span>
                    </a>
                    <span class="dit-dateTime">{{transDate(dit['ditDateTime'])}}</span>
                  </div>
                </div>
                <div class="dit-message">
                  <span v-html="dit.ditMessage"/>
                </div>
                <button class="btn btn-info btn-sm" @click="showDitDetail(dit['ditUuid'])" style="margin-left: 45%;">点击查看详细</button>
              </div>
              <div class="search-page" id="search-dit-page"></div>
              <div id="setColor" style="float: right;bottom: 5%"></div>
            </div>
          </div>
          <div class="layui-tab-item">
            6
          </div>
        </div>
      </div>
    </div>

  </div>

</div>
</template>

<script>
import Qs from "qs/dist/qs.js"
import axios from "axios";
import "@/assets/css/font.css"
export default {
  name: "searchBox",
  watch:{
    searchFlag:{
      handler(newName, oldName) {
        if(newName === true){
          if((this.$store.state.searchWord !== '')){
            $(".search-welcome").fadeOut();
            this[this.$store.state.searchType](this.$store.state.searchWord);
            setTimeout(()=>{
              $(".search-info").fadeIn();
            },500)
          }
          else{
            this.getMainSearchWord();
            $(".search-info").fadeOut();
            setTimeout(()=>{
              $(".search-welcome").fadeIn();
            },500)
          }
        }

      },
    }
  },
  props:{
    searchFlag:Boolean,
  },
  data() {
    return {
      keyWords:[],
      keyWordsPos:[],
      pageWidth:window.innerWidth*0.9,
      pageHeight:window.innerHeight*0.9,
      centerFontAnimateFlag:true,
      searchInfo:{
        userNameSearch:[],
        ditSearch:[],
        articleSearch:[]
      },
      pageItemColor:"#66ccff"
    }
  },
  mounted() {
    this.getMainSearchWord();
    let bd = $(".searchBox");
    bd.css("min-width",this.pageWidth);
    bd.css("min-height",this.pageHeight);
    let _this = this;
    layui.use(['element', 'form','layer','colorpicker'], function(){
      let colorpicker = layui.colorpicker;

      //初始色值
      colorpicker.render({
        elem: '#setColor'
        ,color: _this.pageItemColor //设置默认色
        ,done: function(color){
          _this.pageItemColor = color;
        }
      });

      $('.layui-tab-title').on('click', function(title) {
        if(title.toElement.textContent==="查找的用户"){
          _this.searchUser(_this.$store.state.searchWord);
          _this.$store.commit('changeSearchType','searchUser');
        }else if(title.toElement.textContent==="查找的Dit"){
          _this.searchDits(_this.$store.state.searchWord);
          _this.$store.commit('changeSearchType','searchDits');
        }else if(title.toElement.textContent==="查找的文章"){
          _this.$store.commit('changeSearchType','searchArticle');
        }
      });
    });
  },
  methods: {
    randomNum: function (minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return Math.floor(Math.random() * minNum + 1);
        case 2:
          return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
        default:
          return 0;
      }
    },
    randomFont(idx){
      let top, left;
      let R = Math.floor(Math.random() * 255);
      let G = Math.floor(Math.random() * 255);
      let B = Math.floor(Math.random() * 255);
      top = this.randomNum(this.pageHeight*0.8);
      left = this.randomNum(this.pageWidth*0.8);


      const fontSize = 100-idx*5;
      return {
        position:'fixed',
        "margin-left":left+'px',
        'margin-top':top+'px',
        'z-index':idx+1,
        'font-size':fontSize+"px",
        color: 'rgba(' + R + ',' + G + ',' + B + ',0.5)',
      };
    },
    deepColor:function(event){
      let color = $(event.target).css('color');
      color = color.substring(0,color.indexOf(', 0.5'))+',0.9)';
      $(event.target).css('color',color);
    },
    lowColor:function(event){
      let color = $(event.target).css('color');
      color = color.substring(0,color.indexOf(', 0.9'))+',0.5)';
      $(event.target).css('color',color);
    },
    uploadWord:function (word){
      $(".search-welcome").fadeOut();
      this.$store.commit("changeSearchWord",word);
      this.searchDits(this.$store.state.searchWord);
      setTimeout(()=>{
        $(".search-info").fadeIn();
      },500)

    },
    searchUser(searchWord){
      $("#user-found").css("display","none")
      $("#user-not-found").fadeOut(200);
      $(".loading-item").fadeIn();
      axios.post("/api/userIndex/searchUser",Qs.stringify({"searchWord":searchWord}))
      .then(res =>{
        this.$emit("searchOver","搜索完毕");
        if(searchWord === ""){
          return;
        }
        this.searchInfo['userNameSearch'] = res.data.data;
        $(".loading-item").fadeOut();
        setTimeout(()=>{
          if(res.data.data.length === 0){
            $("#user-not-found").fadeIn();
          }
          else{
            $("#user-found").fadeIn();
          }
        },600)
      })
      .catch(err =>{
        console.error(err);
      })
    },
    searchDits(searchWord){
      if(searchWord === ''){
        return;
      }
      $("#dit-found").css("display","none")
      $("#dit-not-found").fadeOut(200);
      $(".loading-item").fadeIn();
      axios.post("/api/userIndex/searchDits",Qs.stringify({"searchWord":searchWord,'page':1,'pageSize':5}))
          .then(res =>{
            this.$emit("searchOver","搜索完毕");
            let count;
            if(res.data.data.length > 0){
              count = res.data.data[0]['count'];
            }
            else{
              count = 0;
            }

            this.searchInfo['ditSearch'] = res.data.data;
            //layUI翻页初始
            let _this = this;
            layui.use(['element', 'laypage'], function() {
              let laypage = layui.laypage;
              laypage.render({
                elem: 'search-dit-page'
                , theme: _this.pageItemColor
                , count: count
                , layout: ['count', 'prev', 'page', 'next', 'limit','skip']
                , jump: function (obj) {
                  $(".loading-item").fadeIn();
                  axios.post("/api/userIndex/searchDits",Qs.stringify({"searchWord":searchWord,'page':obj.curr,'pageSize':obj.limit}))
                  .then(res =>{
                    _this.searchInfo['ditSearch'] = res.data.data;
                    $(".loading-item").fadeOut();
                  })
                  .catch(err =>{
                    console.error(err);
                  })
                }
              });
            })


            setTimeout(()=>{
              if(res.data.data.length === 0){
                $("#dit-not-found").fadeIn();
              }
              else{
                $("#dit-found").fadeIn();
              }
            },600)
          })
          .catch(err =>{
            console.error(err);
          })
    },
    getMainSearchWord(){
      axios.post("/api/userIndex/queryMainSearchWord",{})
      .then(res =>{
        this.keyWords = res.data.data;
      })
      .catch(err =>{
        console.error(err);
      })
    },
    showUserFace:function (uuid){
      this.$emit("showDitUserFace",uuid);
    },
    showDitUserInfo:function (userName){
      this.$emit("showDitUserInfo",userName);
    },
    showDitDetail(uuid){
      this.$emit("showDitDetail",uuid);
    },
    transDate: function (timestamp) {
      let nowDate = new Date();
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes();
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
    },
  },
  computed:{
    maxWords:function (){
      let max = 0;
      for (let i = 0; i < this.keyWords.length; i++) {
        if(this.keyWords[i]['keyTimes'] > max){
          max = this.keyWords[i]['keyTimes'];
        }
      }
      return max;
    },
    minWords:function (){

    }

  }
}
</script>

<style scoped>
.searchBox{
  height: auto;
  padding: 10px;
  border-radius: 30px;
  box-shadow: 2px 2px 5px #0f0f0f;
  position: absolute;
  z-index: -1;
  left: 5%;
  right: 5%;
  top: 10%;
  background-color: rgba(255,255,255,0.9);
}

.center-font{
  margin-left: 35%;
  margin-top: 20%;
  z-index: 999;
  font-size: 5em;
  color: rgba(0,0,0,0.2);
  float: left;
}


.animate__animated.animate__headShake {
  --animate-duration: 5s;
}

.search-not-found{
  padding: 50px;
}

.lovelyFont{
  margin-left: 100px;
  font-family: lovelyFont,serif;
  font-size: 50px;
  color: saddlebrown;
}

.user-box{
  width: 40%;
  height: 150px;
  margin: 20px;
  padding : 16px;
  border-radius: 10px;
  border: gray 1px solid;
  background-color: rgba(255,255,255,0.6);
}

.user-box .user-userFace{
  width: 50px;
  height: 50px;
  margin-right: 12px;
  border-radius: 50%;
  float: left;
  display: block;
}

.user-box .user-info{
  float: left;
  overflow: hidden;
}

.user-box .user-info .user-info-main{
  margin-top: 5px;
  color: #8c7e83;
  display: block;
}

.dit-Box{
  width: 80%;
  margin-left: 10%;
  min-height: 150px;
  margin-top: 20px;
  padding : 16px;
  border-radius: 20px;
  border: gray 1px solid;
  background-color: rgba(255,255,255,0.6);
}

.dit-Box.animate__animated.animate__zoomIn{
  --animate-delay: 0.5s;
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

.search-page{
  position: relative;
  left: 25%;
  right: 20%;
}

/*loading界面*/

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to{
    transform: rotate(359deg);
  }
}

@keyframes configure-clockwise {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(359deg);
  }
}

@keyframes configure-xclockwise {
  0% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(-135deg);
  }
  75% {
    transform: rotate(-215deg);
  }
  100% {
    transform: rotate(-305deg);
  }
}

.configure-border-1 {
  width: 115px;
  height: 115px;
  padding: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffab91;
  animation: configure-clockwise 3s ease-in-out 0s infinite alternate;
}

.configure-border-2 {
  width: 115px;
  height: 115px;
  padding: 3px;
  left: -115px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(63,249,220);
  transform: rotate(45deg);
  animation: configure-xclockwise 3s ease-in-out 0s infinite alternate;
}

.configure-core {
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.8);
}

.loading-item{
  margin-left: 500px;
  margin-top: 100px;
  display: none;
}



</style>