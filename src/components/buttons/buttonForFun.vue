<template>
  <div class="regButton">
    <button class="btn btn-success btn-lg" ref="registerBtn">我要注册一个</button>
    <button class="btn btn-danger btn-lg" ref="refuseBtn" @mouseover="transformBtn" @mouseleave="transformBtn" @click="">我拒绝</button>
  </div>
</template>

<script>
export default {
  name: "buttonForFun",
  methods:{
    transformBtn:function(event){
      if($(event.target).text() === "我拒绝"){
        $(event.target).html("我要注册一个");
        this.$refs.registerBtn.html("我拒绝");
      }
      else{
        $(event.target).html("我拒绝");
        this.$refs.registerBtn.html("我要注册一个");
      }
    }
  }
}
</script>

<style scoped>

</style>