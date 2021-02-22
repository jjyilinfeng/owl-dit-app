<template>
 <div class="set-index-image-box" >

   <div :class="['tool-box animate__animated',toolBoxAnimateFlag?'animate__slideInDown':'animate__slideOutUp']"
      v-show="toolBoxDisFlag"
   >

   </div>

   <div class="upload-img">
     <div class="layui-upload">
       <button type="button" class="layui-btn" id="upload-index-image">图片上传</button>
     </div>
   </div>

   <blockquote class="layui-elem-quote index-show-img" style="text-align: left">

     <span>展示的图片</span>
     <div class="site-demo-flow" id="index-show-img-data">
       <div class="index-image-data"  v-for="(image,idx) in indexShowImage" >
         <img :class="['animate__animated',imgShakeFlag?'animate__headShake':'']" :id="'show-image-'+idx" :src="'/api/static/img/userImg/'+image['imageUuid']" :alt="'image-show-'+idx"
              @mouseover="picMouseOver"  @mouseleave="picMouseLeave($event, image['imageId'])" @click="picAdd($event, image['imageId'],image['imageUuid'])"
         />
       </div>
     </div>
   </blockquote>



   <blockquote class="layui-elem-quote index-all-img" style="text-align: left">
     <div class="set-button" style="right: 5%;position:absolute;">

       <div class="btn-group" data-toggle="buttons" style="margin-right: 40px">
         <label class="btn btn-success btn-sm" @click="showTypeChangeAll">
           <input type="radio" name="options" id="option1"> 全部照片
         </label>
         <label class="btn btn-default btn-sm" @click="showTypeChangeTime">
           <input type="radio" name="options" id="option2"> 时间线
         </label>
       </div>
       <div class="btn-group">
         <button class="btn btn-success btn-sm" @click="fun" data-toggle="tooltip" title="刷新" >刷新<span class="glyphicon glyphicon-refresh"></span></button>
         <button class="btn btn-success btn-sm" v-show="editor === false" @click="editor=true" data-toggle="tooltip" title="编辑" >编辑<span class="glyphicon glyphicon-edit"></span></button>
         <button class="btn btn-success btn-sm" v-show="editor === true" @click="editor = false" data-toggle="tooltip" title="返回" >返回<span class="glyphicon glyphicon-arrow-left"></span></button>
         <button class="btn btn-success btn-sm" v-show="editor === true" @click="confirmEdit" data-toggle="tooltip" title="完成" >完成<span class="glyphicon glyphicon-ok"></span></button>
         <button class="btn btn-danger btn-sm" v-show="editor === true" @click="deletePic" data-toggle="tooltip" title="删除"  >删除<span class="glyphicon glyphicon-trash"></span> </button>
         <button class="btn btn-info btn-sm" v-show="editor === true" @click="deleteShowPic" data-toggle="tooltip" title="不展示图片"  >不展示图片<span class="glyphicon glyphicon-arrow-down"></span></button>
         <button class="btn btn-info btn-sm" v-show="editor === true" @click="addShowPic" data-toggle="tooltip" title="展示图片" >展示图片<span class="glyphicon glyphicon-arrow-up"></span> </button>
       </div>

     </div>

     <span>所有图片</span>
     <div class="site-demo-flow" id="index-all-img-data"  style="margin-top: 10px">
       <div  class="index-image-data"  v-for="(image,idx) in indexAllImage" v-show="allImageShowDisFlag" >
         <div class="img-shadow" v-show="shadowFun(image['imageUuid'])"> 已被展示的图片</div>
         <img :class="['animate__animated',imgShakeFlag?'animate__headShake':'']" :id="'show-image-'+idx" :src="'/api/static/img/userImg/'+image['imageUuid']" :alt="'image-'+idx"
            @mouseover="picMouseOver"  @mouseleave="picMouseLeave($event, image['imageUuid'])" @click="picAdd($event, image['imageUuid'], image['imageUuid'])"
         />
       </div>
       <ul class="layui-timeline" v-show="!allImageShowDisFlag">
         <li class="layui-timeline-item" v-for="timeLine in indexAllImageTimeLine">
           <i class="layui-icon layui-timeline-axis"></i>
           <div class="layui-timeline-content layui-text">
             <h3 class="layui-timeline-title" >{{timeLine.time}}</h3>
             <div  class="index-image-data"  v-for="(image,idx) in timeLine.timeData" >
               <div class="img-shadow" v-show="shadowFun(image['imageUuid'])"> 已被展示的图片</div>
               <img :class="['animate__animated',imgShakeFlag?'animate__headShake':'']" :id="'show-image-'+idx" :src="'/api/static/img/userImg/'+image['imageUuid']" :alt="'image-'+idx"
                    @mouseover="picMouseOver"  @mouseleave="picMouseLeave($event, image['imageUuid'])" @click="picAdd($event, image['imageUuid'], image['imageUuid'])"
               />
             </div>
           </div>
         </li>
       </ul>
     </div>
   </blockquote>
 </div>
</template>

<script>
import axios from "axios";
import Qs from "qs/dist/qs"
export default {
  name: "SetIndexImageBox",
  props:{
    userName:String,
    indexImageRefreshFlag:Boolean
  },
  data() {
    return {
      indexShowImage:[],
      indexAllImage:[],
      indexAllImagePages:1,
      indexAllImagePage:1,
      indexAllImageLimit:10,

      toolBoxAnimateFlag:false,
      toolBoxDisFlag:false,

      editor:false,
      editPic:[],
      imgShakeFlag:false,

      allImageShowDisFlag:true,
    }
  },
  watch:{
    editor(newName){
      if(newName === false){
        $(".index-image-data").css("background-color","#F2F2F2");
        this.editPic = [];
      }
    },
    indexImageRefreshFlag(newName){
      if(newName === true){
        this.getAllImage();
        this.$emit("indexImageRefreshOver",'刷新结束')
      }
    }
  },
  mounted() {
    let _this = this;
    layui.use(['flow','upload'], function() {
      let upload = layui.upload;

      upload.render({
        elem: '#upload-index-image'
        ,url: '/api/userIndex/userIndexImageUpload' //改成您自己的上传接口
        ,multiple: true
        ,choose: function(obj) {
          var files = this.files = obj.pushFile();
        }
        ,done: function(res, index){
          console.log("in");
          layer.msg('上传成功',{'icon':6});
          let uploadUuid = res.data;
          for (let i = 0; i < uploadUuid.length; i++) {
            axios.post("/api/userIndex/insertIndexImage", Qs.stringify({'userName':_this.userName,'imgUuid':uploadUuid[i]}))
            .then(res =>{

            })
                .catch(err =>{
              console.error(err);
            })
          }
        },
        allDone:function(){
          _this.getAllImage();
        }
      });
    })


    setTimeout(()=>{
      this.getShowIndexImage();
      this.getAllImage();
    },200)
  },
  methods:{
    fun(){
      this.getAllImage();
      //console.log(this.indexAllImage);
    },
    getShowIndexImage(){
      axios.post("/api/userIndex/queryShowIndexImage",Qs.stringify({'userName':this.userName}))
          .then(res =>{
            this.indexShowImage = res.data.data;
          })
          .catch(err =>{
            console.error(err);
          })
    },
    getAllImage(){
      let _this = this;
      _this.indexAllImage = [];
      layui.use(['flow','upload'], function(){
        let flow = layui.flow;
        flow.load({
          elem: '#index-all-img-data' //流加载容器
          ,done: function(page, next){ //执行下一页的回调
            axios.post("/api/userIndex/queryIndexImage",Qs.stringify({'userName':_this.userName,'page':page,'limit':_this.indexAllImageLimit}))
                .then(res =>{
                  let currData = res.data.data;
                  for (let i = 0; i < currData.length; i++) {
                    _this.indexAllImage.push(currData[i]);
                  }
                  if(_this.indexAllImage.length > 0){
                    _this.indexAllImagePages = _this.indexAllImage[0]['pages'];
                  }
                  next('列表HTML片段', page < _this.indexAllImagePages);
                })
                .catch(err =>{
                  console.error(err);
                })
          }
        });
      });
    },
    picMouseOver(ev){
      if(this.editor === true){
        $(ev.target).parent().css("background-color","#32B0D5");
      }
    },
    picMouseLeave(ev,id){
      if(this.editor === true){
        for (let i = 0; i < this.editPic.length; i++) {
          if(this.editPic[i] === id){
            return;
          }
        }
        $(ev.target).parent().css("background-color","#F2F2F2");
      }
    },
    picAdd(ev,id,uuid){
      if(this.editor === true){
        for (let i = 0; i < this.editPic.length; i++) {
          if(this.editPic[i] === id){
            this.editPic.splice(i,1);
            $(ev.target).parent().css("background-color","#F2F2F2");
            return;
          }
        }
        $(ev.target).parent().css("background-color","#32B0D5");
        this.editPic.push(id);
      }
      else{
        this.$emit("showIndexImage",uuid);
      }
    },
    shadowFun(id){
      for (let i = 0; i < this.indexShowImage.length; i++) {
        if(this.indexShowImage[i]['imageUuid'] === id){
          return true;
        }
      }
      return false;
    },
    addShowPic(){
      if(this.editPic.length + this.indexShowImage.length > 10){
        layer.msg('最大只允许展示10张图片',{'icon':5});
        return;
      }
      $(".index-image-data").css("background-color","#F2F2F2");
      for (let i = 0; i < this.editPic.length; i++) {
        this.indexShowImage.push(this.indexAllImage[this.searchIdx(this.indexAllImage,'imageUuid',this.editPic[i])]);
      }
      this.editPic = [];
    },
    deleteShowPic(){
      $(".index-image-data").css("background-color","#F2F2F2");
      for (let i = 0; i < this.editPic.length; i++) {
        this.indexShowImage.splice(this.searchIdx(this.indexShowImage,'imageUuid',this.editPic[i]),1);
      }
      this.editPic = [];
    },
    confirmEdit(){
      let changePicStr = "";
      for (let i = 0; i < this.indexShowImage.length; i++) {
        changePicStr += this.indexShowImage[i]['imageId'] + '&';
      }
      axios.post("/api/userIndex/updateIndexShowImage",Qs.stringify({'userName':this.userName,'showImgId':changePicStr}))
      .then(res =>{
        let data = res.data;
        layer.msg(data.message,{icon: data.code===404?5:6,time:2000, shade:0.4});
        this.$emit("refreshRightBoxImage","刷新展图");
      })

          .catch(err =>{
        console.error(err);
      })
      this.editor = false;
    },
    deletePic(){
      if(this.editPic.length === 0){
        layer.msg("您还有没有选择图片",{icon: 2,time:2000, shade:0.4});
        return;
      }

      let deletePicStr = "";
      for (let i = 0; i < this.editPic.length; i++) {
        deletePicStr += this.editPic[i] + '&';
      }
      this.editor = false;
      this.$emit("deleteIndexImage",deletePicStr);
      this.$emit("refreshRightBoxImage","刷新展图");
    },

    showTypeChangeAll(ev){
      $(ev.target).attr("class","btn btn-success btn-sm");
      $(ev.target).next().attr("class","btn btn-default btn-sm");
      this.allImageShowDisFlag = true;
    },
    showTypeChangeTime(ev){
      $(ev.target).attr("class","btn btn-success btn-sm");
      $(ev.target).prev().attr("class","btn btn-default btn-sm");
      this.allImageShowDisFlag = false;
    },

    transDate: function (timestamp) {
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
      let D = date.getDate() + '日';
      return M + D;
    },
    searchIdx(arr, key, val){
      for (let i = 0; i < arr.length; i++) {
        if(arr[i][key] === val){
          return i;
        }
      }
      return -1;
    }
  },
  computed:{
    indexAllImageTimeLine(){
      let data = [];
      if(this.indexAllImage.length > 0){
        let time = this.transDate(this.indexAllImage[0]['imageDateTime']);
        let timeData = [this.indexAllImage[0]];
        let flag = false;
        for (let i = 1; i < this.indexAllImage.length; i++) {
          let forTime = this.transDate(this.indexAllImage[i]['imageDateTime']);
          if(time === forTime){
            timeData.push(this.indexAllImage[i]);
            flag = false;
          }
          else{
            data.push({
              'time':time,
              'timeData':timeData
            });
            timeData = [this.indexAllImage[i]];
            time = forTime;
            flag = true;
          }
        }
        if(!flag){
          data.push({
            'time':time,
            'timeData':timeData
          });
        }
      }
      return data;
    }
  }
}
</script>

<style scoped>
.set-index-image-box{
  width: 1000px;
  min-height: 600px;
  padding-top: 30px;
  border-radius: 30px;
  background-color: rgba(255,255,255,0.8);
  box-shadow: #0f0f0f 2px 2px 5px;
}

.set-button *{
  /*margin-right: 5px;*/
}

.upload-img{
  margin-top: 50px;
}

.index-show-img{
  padding: 10px;
  margin: 20px 20px;
}

.index-all-img{
  padding: 10px;
  margin: 20px 20px;
}

.index-image-data{
  margin: 5px;
  padding: 5px;
  height: 210px;
  border-radius: 5px;
  display: inline-block;
  position: relative;
}

.index-image-data img{
  max-height: 200px;
}

.img-shadow{
  width: 100%;
  height: 200px;
  background-color: rgba(255,255,255,0.8);
  position: absolute;
}

</style>