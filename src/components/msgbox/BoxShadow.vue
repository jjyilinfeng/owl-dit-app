<template>
<div class="chaos" :style="{'height':chaosHeight,'width':chaosWidth}"></div>
</template>

<script>
export default {
  name: "BoxShadow",
  data() {
    return {
      chaosHeight:"",
      chaosWidth:""
    }
  },
  mounted() {
    this.chaosWidth = "1920px";
    this.chaosHeight = "1080px";
  }
}
</script>

<style scoped>
.chaos{
  background-color: rgba(0,0,0,0.3);
  position: fixed;
  z-index: 999;
}
</style>