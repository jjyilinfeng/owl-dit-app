<template>
<div class="RightBox">
  <div class="album-box">
    <div style="text-align: left;padding-top: 20px;">
      <span class="week-chart-font" style="background-color: mediumpurple;">相册&nbsp;<i class="layui-icon layui-icon-picture" style="font-size: 20px"></i></span>
    </div>
  </div>

  <div class="text-box">
    <div style="text-align: left;padding-top: 20px;">
      <span class="week-chart-font" style="background-color: #a6a6a6;">文章&nbsp;<i class="fa fa-book" style="font-size: 20px"></i></span>
    </div>
  </div>




</div>
</template>

<script>
import "font-awesome/css/font-awesome.css"
export default {
  name: "RightBox"
}
</script>

<style scoped>
.RightBox{
  width: 300px;
  height: 900px;

}

.album-box{
  width: 300px;
  height: 500px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
  border-radius: 20px;
}

.text-box{

  width: 300px;
  height: 300px;
  margin-top: 20px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
  border-radius: 20px;
}

.week-chart-font{
  display: inline-block;
  position: relative;
  width: 100px;
  height: 30px;
  padding-left: 15px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  color: #FFFFFF;
  font-size: 20px;
  background-color: #1E9FFF;
  left: -8px;
}

.week-chart-font:before {
  height: 0;
  width: 0;
  border-bottom: 8px solid rgb(100,0,50);
  border-left: 8px solid transparent;
  top: -8px;
  left: 0;
  content: "";
  position: absolute;
}
</style>