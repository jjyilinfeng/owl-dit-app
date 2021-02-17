<template>
  <div class="LeftBox">
    <div class="index-userInfo">

      <div class="head">
        <div v-show="userInfo['userName']==='jjyilinfeng'">
          <i class="fa fa-trophy fa-lg" style="color: gold;margin-bottom: 10px"></i>owl-dit首席设计师认证
        </div>

        <div class="pic">
          <img :src="'/api/static/img/userFace/'+userInfo['userFaceUuid']" :alt="userInfo['userName']">
        </div>
        <div class="name">
          <div class="userNickName">{{userInfo['userNickName']}}</div>
        </div>
        <div class="info">
          <i class="layui-icon layui-icon-male" v-show="userInfo['userGender']==='男'" style="color: #1E9FFF"/>
          <i class="layui-icon layui-icon-female" v-show="userInfo['userGender']==='女'" style="color: deeppink"/>
          <i class="fa fa-venus-mars" v-show="userInfo['userGender']==='秘密'" style="color: purple"></i>
          <span class="age">{{userInfo['userAge']}}</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="index">
        <div class="data-box" style="text-align: center;height: 140px">
          <div style="float: left;margin-left: 30px;">
            <div class="title">关注</div>
            <div class="data">{{userInfo['userFollow']}}</div>
          </div>
          <div class="data-box" style="float: left;margin-left: 30px;">
            <div class="title">粉丝</div>
            <div class="data">{{userInfo['userFans']}}</div>
          </div>
          <div class="data-box" style="float: left;margin-left: 30px;">
            <div class="title">Dit数</div>
            <div class="data">{{userInfo['userDitCount']}}</div>
          </div>
          <div style="float: left;margin-left: 20px;">
            <div class="title">文章</div>
            <div class="data">{{userInfo['userArticle']}}</div>
          </div>
          <div class="data-box" style="float: left;margin-left: 20px;">
            <div class="title">收到的赞</div>
            <div class="data">{{userInfo['userByPraise']}}</div>
          </div>
          <div class="data-box" style="float: left;margin-left: 20px;">
            <div class="title">访客量</div>
            <div class="data">{{userInfo['userVisited']}}</div>
          </div>
        </div>
      </div><!--data-box-->
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import "font-awesome/css/font-awesome.css"
import axios from "axios";
import Qs from 'qs/dist/qs'
export default {

  name: "LeftBox",
  props:{
    userName:String,
    visitedType:String,
    visitedName:String,
    userFaceSrc:String,
  },
  watch:{
    visitedType:{
      handler(newName, OldName) {
        if(newName !== OldName){
          if(newName === 'friend'){
            setTimeout(()=>{
              this.getIndexInfo(this.visitedName);
            },500)
          }
          if(newName === 'self'){
            setTimeout(()=>{
              this.getIndexInfo(this.userName);
            },500)
          }
        }
      },
    },
    userFaceSrc:{
      handler(newName, OldName) {

      },
    }
  },
  data() {
    return {
      userInfo:{
        'userFaceUuid':'default.png'
      }
    }
  },
  mounted() {
    setTimeout(()=>{
      this.getIndexInfo(this.userName);
    },200)

    layui.use(['colorpicker'], function(){
      let colorPicker = layui.colorpicker;
        colorPicker.render({
          elem: '#leftBoxColor'
          ,color: 'rgba(255,255,255,0.9)'
          ,format: 'rgb'
          ,alpha: true //开启透明度滑块
        });
    })
  },
  methods:{
    getIndexInfo(userName){
      axios.post("/api/userIndex/queryUserIndex",Qs.stringify({'userName':userName}))
      .then(res =>{
        this.userInfo = res.data.data;
      })
      .catch(err =>{
        console.error(err);
      })
    }
  }
}
</script>

<style scoped>
.LeftBox{
  width: 300px;
  height: 900px;
  padding: 40px 0;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
}

.head{
  text-align: center;
}

.head .pic{
  width:40%;
  margin: 0 auto;
  display: flex;
}

.head .pic img{
  width:100%;
  height: 120px;
  border-radius:50%;
  border:5px solid #66ccff;
}

.head .name{
  margin: 10px 0;
}

.head .name .userNickName{
  font-size: 20px;
}

.head .info{
  margin: 10px 0;
}

.head .info .age{
  margin-left: 3px;
  font-size: 16px;
}

.index{
  padding: 10px 0;
}

.index *{
  padding: 2px 0;
}

.title {
  font-size: 25px;
  font-weight: bolder;
}


.data{
  font-size: 18px;
  font-weight: bolder;
}

.line{
  background-color: #761c19;
  width: 300px;
  height: 3px;
}
</style>