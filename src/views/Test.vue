<template>
  <video height="240" controls="controls">
    <source src="/api/static/audio/ditVideo/kongfu.mp4" type="video/mp4" />
  </video>
</template>
<script>

import "animate.css";
import UserInformationBox from "../components/boxes/indexBoxes/UserInformationBox";
import axios from "axios";
import ImgSetBigger from "@/components/msgbox/ImgSetBigger";
import UserSafeInformationBox from "@/components/boxes/indexBoxes/UserSafeInformationBox";
import PostBox from "@/components/boxes/indexBoxes/middleBox/PostBox";
import UserCardBox from "@/components/msgbox/userCardBox";
import SearchBox from "@/components/boxes/indexBoxes/searchBox";
import ProgressBar from "progressbar.js";

export default {
  name: "Test",
  components: {SearchBox, UserCardBox, PostBox, UserSafeInformationBox, ImgSetBigger, UserInformationBox},
  data(){
    return{
      msgBoxDis:false,
      msgBoxAnimate:false,
      switches:false,
      userFaceSrc:'/api/static/img/userFace/default.png',
    }
  },
  mounted() {
    console.log(window.baseUrl);

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