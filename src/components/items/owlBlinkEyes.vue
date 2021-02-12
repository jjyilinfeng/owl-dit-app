<template>
  <div class="owl">
    <div class="leftEye" >
      <div class="eyesShadow leftEyesShadow"></div>
      <div class="owlEyeBox leftEyeBox" id="LEyeB">
        <div class="owlEye" id="leftEye">
          <div class="owlEyeLight" id="leftEyeLight"></div>
        </div>
      </div>
    </div>
    <div class="rightEye">
      <div class="eyesShadow rightEyesShadow" id="REyeB"></div>
      <div class="owlEyeBox rightEyeBox">
        <div class="owlEye" id="rightEye">
          <div class="owlEyeLight" id="rightEyeLight"></div>
        </div>
      </div>
    </div>
    <img src="@/assets/img/rawI.png" alt="raw">
  </div>
</template>

<script>
export default {
  name: "owlBlinkEyes",
  mounted(){
    const pageWidth = document.body.clientWidth;
    const pageHeight = document.body.clientHeight;
    const eyeMoveDistance = 16;
    const eyeLightMoveDistance = 10;

    setInterval(()=>{
      $(".eyesShadow").animate({"height":"51px"},100);
      setTimeout(()=>{
        $(".eyesShadow").animate({"height":"0px"},100);
      },200)
    },6000)

    document.onmousemove = (e)=>{
      const eyeMoveX = e.clientX/pageWidth*eyeMoveDistance;
      const eyeMoveY = e.clientY/pageHeight*eyeMoveDistance;
      const eyeLightMoveX = e.clientX/pageWidth*eyeLightMoveDistance;
      const eyeLightMoveY = e.clientY/pageHeight*eyeLightMoveDistance;

      let leftEye = $("#leftEye");
      let rightEye = $("#rightEye");
      let leftEyeLight = $("#leftEyeLight");
      let rightEyeLight = $("#rightEyeLight");

      leftEye.css("margin-top",eyeMoveY);
      leftEye.css("margin-left", eyeMoveX);

      rightEye.css("margin-top",eyeMoveY);
      rightEye.css("margin-left", eyeMoveX);

      leftEyeLight.css("margin-top",eyeLightMoveY);
      leftEyeLight.css("margin-left", eyeLightMoveX);

      rightEyeLight.css("margin-top",eyeLightMoveY);
      rightEyeLight.css("margin-left", eyeLightMoveX);
    }

  },/*自动加载函数*/
}
</script>

<style scoped>
.owl{
  width: 200px;
  position:relative;
  left: 0;
  right: 0;
  margin:0 auto;
}

.eyesShadow{
  height: 0;
  width: 51px;
  border-radius: 25px;
  background-color: #80A467;
  position: fixed;
  z-index: 99;
}

.leftEyesShadow{
  margin-left: 43px;
  margin-top: 25px;
}

.rightEyesShadow{
  margin-left: 110px;
  margin-top: 25px;
}

.owlEye{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #30552A;
  padding: 3px;
  position: fixed;
  z-index: -19;
}

.owlEyeLight{
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
}

.owlEyeBox{
  width: 46px;
  height: 46px;
  position: fixed;
}

.leftEyeBox{
  margin-left: 45px;
  margin-top: 27px;
}

.rightEyeBox{
  margin-left: 112px;
  margin-top: 27px;
}

.owlEye{
  margin-left: 8px;
  margin-top: 8px;
  padding: 2px;
}
</style>