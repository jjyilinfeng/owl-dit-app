<template>
<box-shadow/>
  <img :src="imgSrc" alt="放大图"/>
</template>

<script>
import BoxShadow from "@/components/msgbox/BoxShadow";
export default {
  name: "ImgSetBigger",
  components: {BoxShadow},
  props:{
    imgSrc:String,
  }
}
</script>

<style scoped>
img{
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  max-width: 100%;
  position: fixed;
  z-index: 9999;
}
</style>