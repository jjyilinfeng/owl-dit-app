<template>
  <div class="msgBox">
    <div class="rmIcon">
      <a @click="closeMsgBox" title="返回注册界面"><span class="glyphicon glyphicon-remove"></span></a>
    </div>
    <hr>
    <h1>我们需要验证您的邮箱</h1>
    <h3>请在下方输入您所接受到的验证码</h3>
    <div class="form-inline" id="checkCodeGroup" style="margin-top: 100px;" >
      <input class="form-control input-lg" v-model="checkCodeData[0]" name="0" @input="goNext(0)" ref="c0" maxlength="1" type="text">
      <input class="form-control input-lg" v-model="checkCodeData[1]" name="1" @input="goNext(1)" ref="c1" maxlength="1" type="text">
      <input class="form-control input-lg" v-model="checkCodeData[2]" name="2" @input="goNext(2)" ref="c2" maxlength="1" type="text">
      <input class="form-control input-lg" v-model="checkCodeData[3]" name="3" @input="goNext(3)" ref="c3" maxlength="1" type="text">
      <input class="form-control input-lg" v-model="checkCodeData[4]" name="4" @input="goNext(4)" ref="c4" maxlength="1" type="text">
      <input class="form-control input-lg" v-model="checkCodeData[5]" name="5" ref="c5" maxlength="1" type="text">
    </div>
    <div style="margin-top: 100px">
      <button type="button" class="btn btn-success btn-lg" @click="doRegister" style="margin-left: 100px;">确认</button>
      <a @click="getEmailCode"><span>没有收到？重新发送</span></a>
    </div>

  </div>
</template>

<script>
const messCode = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m",
  "A", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function getCode(size){
  const codeLen = messCode.length;
  let code = "";
  for(let i = 0;i < size;i++){
    let randIdx = Math.floor(Math.random()*codeLen)
    code += messCode[randIdx];
  }
  return code;
}
import axios from "axios";
import toastr from "toastr"
export default {
  name: "CheckCodeMsgBox",
  props:{
    userInfo:Object,
    resendEmail:Function
  },
  data:function() {
    return {
      checkCodeData:[],
    };
  },
  mounted() {

  },
  methods:{
    doRegister:function(){
      let code = "";
      for(let i = 0; i < this.checkCodeData.length; i++){
        code += this.checkCodeData[i];
      }
      let _this = this;
      if(code === this.userInfo.get("checkCode")){
        if(this.userInfo.get("style") === "checkRegister"){
          axios.post("/api/user/register", this.userInfo)
              .then(res => {
                const data = res.data;
                if(data.code === 200){
                  toastr.success("注册成功,将在三秒后跳转至登录界面");
                  setTimeout(function(){
                    _this.$emit("jumpToLogin","跳转到登录")
                  },3000);
                }
                else if(data.code === 404){
                  toastr.error("操作失败");
                }
              })
              .catch(err => {
                console.error(err);
              })
        }
        else if(this.userInfo.get("style") === "checkAccount"){
          toastr.success("登录成功,已将该IP列入白名单，如果想要删除在个人中心中设置");
          axios.post("/api/user/insertUserIp",this.userInfo)
              .then(res =>{
                console.log(res);
                this.$router.push({
                  name:"主页",
                  params:{
                    userName:this.userInfo.get("userName")
                  }
                })
              })
              .catch(err =>{
                console.error(err);
              })

        }
      }
      else{
        toastr.error("验证码不正确");
        for(let i = 0;i < this.checkCodeData.length;i++){
          this.checkCodeData[i] = "";
        }
        this.$refs['c0'].focus();
      }
    },
    goNext:function(idx){
      let index = parseInt(idx);
      this.$refs['c'+(index+1)].focus();
    },
    getEmailCode:function (){
      this.userInfo.set("checkCode",getCode(6));
      axios.post("/api/user/sendCheckCode", this.userInfo)
          // eslint-disable-next-line no-unused-vars
          .then(res => {
            toastr.warning("验证码邮件已经成功发送至您的邮箱，请注意查收");
          })
          .catch(err => {
            console.error(err);
          })
    },
    closeMsgBox:function (){
      if(this.userInfo.get("style") === "checkRegister"){
        this.$emit("jumpToRegister","跳转到注册")
      }
      else if(this.userInfo.get("style") === "checkAccount"){
        this.$emit("jumpToLogin","跳转到登录")
      }

    }
  }
}
</script>

<style scoped>
.msgBox{
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  width: 500px;
  height: 500px;
  z-index: 9999;
  background-color: rgba(255,255,255,0.9);
  text-align: center;
  box-shadow: 2px 2px 2px 2px #66ccff;
  border-radius: 30px 30px 30px 30px;
  padding: 10px 30px 50px 30px;
  position: fixed;
  display: block;
}

.msgBox .rmIcon{
  float: right;
  width: 20px;
  border-radius: 4px 4px 4px 4px;
  box-shadow: 1px 1px 1px 1px grey;
}

.msgBox .rmIcon:hover{
  background-color:pink;
}

.msgBox #checkCodeGroup *{
  width: 50px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 20px;
}
</style>