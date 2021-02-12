<template>
  <div class="home">
    <owl-blink-eyes/>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
  {{testVar}}
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import OwlBlinkEyes from "@/components/items/owlBlinkEyes";

export default {
  name: 'Home',
  components: {
    OwlBlinkEyes,
    HelloWorld
  },
  data() {
    return {
      testVar:"test"
    }
  }
}
</script>
