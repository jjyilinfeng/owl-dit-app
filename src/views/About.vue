<template>
  <div class="about">
    <div :class="['MsgBox', 'animate__animated', MsgBoxSet?'animate__zoomIn':'animate__zoomOut']" >
      <button type="button" id="testButton" class="btn btn-primary btn-lg" @click="nextStep" style="display:none">下一步</button>

      <div class="userGenderChoose">
        <div class="LeftBox" @click="userGender='male'">
          <div class="radio">
            <img src="../assets/img/man.png" alt="man">
            <label>
              <input type="radio" name="checkGender" id="male"  value="male" v-model="userGender" checked="checked" style="zoom: 2;">
              <span style="zoom: 2">我是男生</span>
            </label>
          </div>

        </div>
        <div class="MiddleHr"></div>
        <div class="RightBox"  @click="userGender='female'">
          <img src="../assets/img/woman.png" alt="woman" style="margin-top: 2px">
          <div class="radio">
            <label>
              <input type="radio" name="checkGender"  value="female" v-model="userGender" checked="checked" style="zoom: 2;">
              <span style="zoom: 2">我是女生</span>
            </label>
          </div>
        </div>
        <div class="ButtonClass">
          <button type="button" class="btn btn-primary btn-lg">上一步</button>
          <button type="button" class="btn btn-primary btn-lg">下一步</button>
        </div>
      </div>
    </div>

    <button type="button"  class="btn btn-primary btn-lg" @click="setMsgBox" >显示对话框</button>
    <button type="button"  class="btn btn-primary btn-lg" @click="closeMsgBox" >关闭对话框</button>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "animate.css/animate.min.css"

export default {
  name:"AboutMe",
  data() {
    return {
      MsgBoxSet:false,
      userGender: ""
    }
  },/*数据*/
  component:{},/*自定义标签*/
  mounted(){

  },/*自动加载函数*/
  methods: {
    nextStep:function(){
      $(".userGenderChoose").fadeIn();
    },
    setMsgBox:function(){
      this.MsgBoxSet = true;
      $(".MsgBox").css("display","block");
      setTimeout(function(){
        $("#testButton").fadeIn(500);
      },1000)
    },
    closeMsgBox:function(){
      $(".MsgBox").children().fadeOut(500);
      setTimeout(() =>{
        this.MsgBoxSet = false;
        setTimeout(function(){
          $(".MsgBox").css("display","none");
        },500)
      },500)
    }
  },/*执行触发函数*/
  computed: {},/*动态计算属性*/
}

</script>
<style>
.MsgBox{
  margin-left: 560px;
  margin-top: 200px;
  width: 800px;
  height: 600px;
  padding: 30px;
  border-radius: 30px;
  box-shadow: 2px 2px 5px #000;
  position: fixed;
  display: none;
}

.userGenderChoose{
  display: none;
  padding: 10px;
}

.userGenderChoose label{
  margin-left: 60px;
  margin-top:60px;
}

.userGenderChoose .LeftBox{
  width: 300px;
  height: 400px;
  padding:15px;
  border-radius: 15px;
  float: left;

}

.userGenderChoose .LeftBox:hover{
  border: 2px solid lightskyblue;
}

.userGenderChoose .LeftBox img{
  margin-left: 50px;
}

.userGenderChoose .MiddleHr{
  width: 2px;
  height: 400px;
  border-radius: 1px;
  background-color: #000;
  margin-left: 80px;
  float: left;
}

.userGenderChoose .RightBox{
  width: 300px;
  height: 400px;
  padding:15px;
  border-radius: 15px;
  float: right;
}

.userGenderChoose .RightBox img{
  margin-left: 50px;
}

.userGenderChoose .RightBox:hover{
  border: 2px solid lightskyblue;
}

.userGenderChoose .ButtonClass{
  float: left;
  margin-left:280px;
  margin-top: 20px;
}
</style>
