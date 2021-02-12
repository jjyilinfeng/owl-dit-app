<template>
<user-safe-information-box/>
</template>
<script>
import "animate.css";
import UserInformationBox from "../components/boxes/indexBoxes/UserInformationBox";
import axios from "axios";
import ImgSetBigger from "@/components/msgbox/ImgSetBigger";
import UserSafeInformationBox from "@/components/boxes/indexBoxes/UserSafeInformationBox";
export default {
  name: "Test",
  components: {UserSafeInformationBox, ImgSetBigger, UserInformationBox},
  data(){
    return{
      msgBoxDis:false,
      msgBoxAnimate:false,
      switches:false,
      userFaceSrc:'/api/static/img/userFace/default.png',
    }
  },
  mounted() {
    let switches = {};
    let switchConfig = {
      'demo-default-1': {},
    }

    Object.keys(switchConfig).forEach(function (key) {
      switches[key] = new Switch(document.querySelector('.' + key),switchConfig[key]);
    });

  },
  methods:{
    closeMsgBox:function (){
      this.msgBoxAnimate = false;
      setTimeout(()=>{
        this.msgBoxDis = false;
      },600)
    },
    fun:function (){

    },
    uploadGet:function(){
      let formData=new FormData(document.getElementById("uploadForm"));
      console.log($("#userUpload").val());
      axios.post('/api/userIndex/userFaceUpload',formData).then(function(response){
        let data=response.data;
        setTimeout(function (){
          this.userFaceSrc=data.newFilePath;
        },1000);
      });
    }
  }
}
</script>
<style scoped>
dl{
  text-align: left;
}

dl dd{
  padding:10px
}

</style>