<template>
<button id="fixedButton" class="btn btn-info btn-lg" @click="buttonFunction">{{buttonShowName}}</button>
</template>

<script>
export default {
  name: "FixedButton",
  props:{
    buttonShowName:String,
    buttonFunction:Function
  }
}
</script>

<style scoped>
#fixedButton{
  right: 5%;
  bottom: 5%;
  position: fixed;
  z-index: 999;
}
</style>