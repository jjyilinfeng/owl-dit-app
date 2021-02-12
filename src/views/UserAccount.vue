<template>
  <div class="user-account-backgroundImg">
    <img id="user-account-bgi" src="../assets/img/backgroundImg/backgroundImg_Flower.jpeg" alt="背景图片"
         style="display: none"/>
  </div>

  <div class="user-account-message-boxes">
    <check-code-msg-box :user-info="userInfo"
                        :class="['animate__animated',msgBoxAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
                        :style="{'display':msgBoxDisFlag?'block':'none'}"
                        @jumpToRegister="ctr" @jumpToLogin="ctl" />
  </div>

  <div :class="['user-account-boxes']">
    <login :class="['animate__animated',loginAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
           id="user-account-boxes-login"  :style="{'display':loginDisFlag?'block':'none'}"
           @jumpToRegister="ltr" @jumpToCheckCode="ltc"/>
    <register :class="['animate__animated',registerAnimateFlag?'animate__zoomIn':'animate__zoomOut']"
              id="user-account-boxes-register" :style="{'display':registerDisFlag?'block':'none'}"
              @jumpToLogin="rtl" @jumpToCheckCode="rtc"/>
  </div>
</template>

<script>
import Login from "../components/boxes/UserAccountBoxes/login";
import "animate.css"
import Register from "../components/boxes/UserAccountBoxes/register";
import CheckCodeMsgBox from "../components/msgbox/CheckCodeMsgBox";
import toastr from "toastr";
export default {
  name: "UserAccount",
  components: {CheckCodeMsgBox, Register, Login},
  emits:{
    jumpToLogin:"跳转到login",
    jumpToRegister:"跳转到register"
  },
  data:function() {
    return {
      loginAnimateFlag:false,
      loginDisFlag:false,
      registerAnimateFlag:false,
      registerDisFlag:false,

      msgBoxDisFlag:false,
      msgBoxAnimateFlag:false,
      userInfo:{}
    };
  },
  mounted() {
    toastr.options = {
      closeButton: false,
      debug: false,
      progressBar: false,
      positionClass: "toast-top-center",
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "3000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };

    const sendMessage = this.$route.params.message
    if(sendMessage !== undefined){
      toastr.info(this.$route.params.message);

    }
    if(sendMessage === "登出成功"){
      location.reload();
    }
    else{
      $("#user-account-bgi").css("display","block");
      const type = this.$route.params.userType;
      if(type === 'login' || type === undefined){
        this['loginDisFlag'] = true;
        this.loginAnimateFlag = true
        this.registerAnimateFlag = false;
      }
      else if(type === 'register'){
        this.registerDisFlag = true;
        this.registerAnimateFlag = true;
        this.loginAnimateFlag = false;
      }
    }

  },
  methods:{
    ltr:function (){
      this.boxSwitch("login","register");
    },
    rtl:function(){
      this.boxSwitch("register","login");
    },
    rtc:function (userInfo){
      this.userInfo = userInfo
      this.boxSwitch("register","msgBox");
    },
    ctl:function (){
      this.boxSwitch("msgBox","login");
    },
    ctr:function (){
      this.boxSwitch("msgBox","login");
    },
    ltc:function (userInfo){
      this.userInfo = userInfo;
      this.boxSwitch("login","msgBox");
    },
    boxSwitch:function(box1, box2){
      const box1a = box1+"AnimateFlag";
      const box1d = box1+"DisFlag";
      const box2a = box2+"AnimateFlag";
      const box2d = box2+"DisFlag";
      this[box1a] = false;
      setTimeout(()=>{
        this[box1d] = false;
        this[box2d] = true;
        this[box2a] = true;
      },600)
    },
  }

}
</script>

<style scoped>
.user-account-backgroundImg{
  position: fixed;
  z-index: -9999;
}


</style>