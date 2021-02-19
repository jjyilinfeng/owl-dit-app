<template>
  <div class="LeftBox">
    <div class="index-userInfo">
      <div style="text-align: left;padding-bottom: 20px;">
        <span class="information" style="background-color: orange;">个人信息<i class="layui-icon layui-icon-username" style="font-size: 20px"></i></span>
      </div>
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
    </div>
    <div class="left-box-down">
      <div class="week-chart" style="text-align: left;">
        <span class="week-chart-font" style="">一周内动态<i class="layui-icon layui-icon-star" style="font-size: 20px"></i></span>
        <div id="myChart"
             :style="{ width: '300px', height: '300px' }"></div>
      </div>
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
        this.getIndexInfo(this.userName);
      },
    }
  },
  data() {
    return {
      userInfo:{
        'userFaceUuid':'default.png',
      },
      myChart:"",
    }
  },
  mounted() {
    this.myChart = this.$root.echarts.init(document.getElementById("myChart"));
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
      let _this = this;
      axios.post("/api/userIndex/queryUserIndex",Qs.stringify({'userName':userName}))
      .then(res =>{
        this.userInfo = res.data.data;
        let nowDate = new Date();
        let xAxis = [];
        let data = [];
        let idx = 0;
        for (let i = 0; i < 7; i++) {
          let timeStamp = new Date();
          timeStamp.setTime(nowDate - 24*60*60*1000*6 + 24*60*60*1000*i);
          let userInfoDate = new Date();
          if(idx < this.userInfo['userWeekDit'].length){
            userInfoDate.setTime(this.userInfo['userWeekDit'][idx]['ditDateTime']);
            if(userInfoDate.getMonth() === timeStamp.getMonth() && userInfoDate.getDate() === timeStamp.getDate() && userInfoDate.getFullYear() === timeStamp.getFullYear()){
              data.push(this.userInfo['userWeekDit'][idx]['ditCount']);
              idx++;
            }
            else{
              data.push("0");
            }
          }
          else{
            data.push("0");
          }
          let str = timeStamp.getMonth() + 1 + "-" + timeStamp.getDate();
          xAxis.push(str);
        }
        let chartData = [{
          name: "发送Dit数",
          type: "line",
          data: data
        }]
        this.chartInit(['发送Dit数'],xAxis,chartData);
      })
      .catch(err =>{
        console.error(err);
      })
    },
    chartInit:function(legend,xAxis, chartData){
      let then = this;
      // 绘制图表
      then.myChart.setOption({
        title: { text: "" },
        tooltip: {},
        legend: {
          data:legend
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {},
        series: chartData,
      });
    }
  }
}
</script>

<style scoped>
.LeftBox{
  width: 300px;
  height: 480px;
  padding: 40px 0;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
}

.left-box-down{
  width: 300px;
  height: 350px;
  margin: 50px 0;
  padding: 20px 0;
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

.data-box .title {
  font-size: 25px;
  font-weight: bolder;
}


.data-box .data{
  font-size: 18px;
  font-weight: bolder;
}

.week-chart{
  margin: 20px 0;
}

.week-chart-font:before, .week-chart-font:after {
  content: "";
  position: absolute;
}
.week-chart-font:before {
  height: 0;
  width: 0;
  border-bottom: 8px solid rgb(100,0,50);
  border-left: 8px solid transparent;
  top: -8px;
  left: 0;
}

 .week-chart-font {
   display: inline-block;
   position: relative;
   width: 150px;
   height: 30px;
   padding-left: 15px;
   border-top-right-radius: 15px;
   border-bottom-right-radius: 15px;
   color: #FFFFFF;
   font-size: 20px;
   background-color: #1E9FFF;
   left: -8px;
 }

 .information{
   display: inline-block;
   position: relative;
   width: 150px;
   height: 30px;
   padding-left: 15px;
   border-top-right-radius: 15px;
   border-bottom-right-radius: 15px;
   color: #FFFFFF;
   font-size: 20px;
   left: -8px;
 }

.information:before {
  height: 0;
  width: 0;
  border-bottom: 8px solid rgb(20,20,100);
  border-left: 8px solid transparent;
  top: -8px;
  left: 0;
}


.information:before, .information:after {
  content: "";
  position: absolute;
}


#myChart{
  margin-top: 20px;
}

.line{
  background-color: #1E9FFF;
  width: 300px;
  height: 3px;
}
</style>