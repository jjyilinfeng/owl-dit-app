<template>
  <div id="nav" :style="{'display':navDisplay}">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/welcomePage">welcome</router-link> |
    <router-link to="/userAccount">登录</router-link> |
    <router-link to="/test">test</router-link> |
    <router-link to="/index">首页</router-link> |
  </div>
  <fixed-button :button-function="hideNav" :button-show-name="fixButtonMsg"/>
  <router-view/>
</template>

<style>
#app {

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import OwlBlinkEyes from "@/components/items/owlBlinkEyes";
import FixedButton from "@/components/items/FixedButton";
export default {
  components: {FixedButton, OwlBlinkEyes},
  data() {
    return {
      fixButtonMsg:"显示标签",
      navDisplay:'none'
    }
  },
  methods:{
    hideNav:function(){
      if(this.navDisplay === 'block'){
        this.navDisplay = 'none';
        this.fixButtonMsg = "显示标签"
      }
      else{
        this.navDisplay ='block';
        this.fixButtonMsg = "隐藏标签"
      }

    }
  }
}
</script>