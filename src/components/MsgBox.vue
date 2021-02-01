<template>
  <div class="MsgBox">
    <button type="button" id="testButton" class="btn btn-info btn-lg" @click="nextStep" style="display:none">下一步</button>

    <div class="userGenderChoose">
      <div class="LeftBox" @click="userGender='male'">
        <div class="radio">
          <img src="@/assets/img/man.PNG" alt="man">
          <label>
            <input type="radio" name="checkGender" id="male"  value="male" v-model="userGender" checked="checked" style="zoom: 2;">
            <span style="zoom: 2">我是男生</span>
          </label>
        </div>

      </div>
      <div class="MiddleHr"></div>
      <div class="RightBox"  @click="userGender='female'">
        <img src="../assets/img/woman.PNG" alt="woman" style="margin-top: 20px">
        <div class="radio">
          <label>
            <input type="radio" name="checkGender"  value="female" v-model="userGender" checked="checked" style="zoom: 2;">
            <span style="zoom: 2">我是女生</span>
          </label>
        </div>
      </div>
      <div class="ButtonClass">
        <button type="button" class="btn btn-info btn-lg">上一步</button>
        <button type="button" class="btn btn-info btn-lg">下一步</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "MsgBox",
  data() {
    return {
      userGender:""
    }
  },
  methods: {
    nextStep: function () {
      $(".userGenderChoose").fadeIn();
    }
  }
}
</script>

<style scoped>
.MsgBox{
  margin-left: 560px;
  margin-top: 200px;
  width: 60px;
  height: 60px;
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


.userGenderChoose .RightBox:hover{
  border: 2px solid lightskyblue;
}

.userGenderChoose .ButtonClass{
  float: left;
  margin-left:280px;
  margin-top: 20px;
}
</style>