<template>
    <div :class="['pullBox', 'animate__animated', hangCatFlag?'animate__slideInDown':'animate__slideOutUp']" @click="getUp">
      <img src="@/assets/img/hangCat.png" alt="悬挂的猫">
    </div>
</template>

<script>
export default {
  name: "catReturnTop",
  data() {
    return {
      hangCatFlag: true,
    }
  },/*数据*/
  component:{},/*自定义标签*/
  mounted(){
    $(window).scroll(()=>{
      let top = $(document).scrollTop();
      if(top > 100){
        this.hangCatFlag = true;
        $(".pullBox").css("display","block");
      }
      else{
        this.hangCatFlag = false;
      }
    })
  },/*自动加载函数*/
  methods: {
    getUp:function(){
      $("html,body").animate({scrollTop:0},800);

      this.returningFlag = true;
    }
  },/*执行触发函数*/
}
</script>

<style scoped>
.pullBox{
  right: 5%;
  display: none;
  position: fixed;
}
</style>