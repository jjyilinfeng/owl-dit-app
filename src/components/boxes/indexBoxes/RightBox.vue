<template>
<div class="RightBox">
  <div class="album-box">
<!--    <button @click="fun">click</button>-->
    <div style="text-align: left;padding-top: 20px;">
      <span class="week-chart-font" style="background-color: mediumpurple;">相册&nbsp;<i class="layui-icon layui-icon-picture" style="font-size: 20px"></i></span>
      <div class="layui-carousel" id="user-pic" lay-filter="user-pic">
        <div carousel-item="">
          <div v-if="showImgInfo.length === 0">
            <div class="non-pic">
              <div>这里还什么都没有</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TAT</div>
            </div>
          </div>
          <div v-for="(img,idx) in showImgInfo">
            <img @click="showIndexImage(img['imageUuid'])" :src="'/api/static/img/userImg/'+img['imageUuid']" :alt="'图片'+idx" style="max-width: 100%;"/>
          </div>
        </div>
      </div>

      <div class="add-img" v-if="visitedType==='self'">
        <button class="layui-btn layui-btn-radius layui-btn-lg" @click="showSetImage">编辑我的相册<i class="layui-icon layui-icon-picture" style="font-size: 20px"></i></button>
      </div>

    </div>
  </div>

  <div class="text-box">
    <div style="text-align: left;padding-top: 20px;">
      <span class="week-chart-font" style="background-color: #a6a6a6;">文章&nbsp;<i class="fa fa-book" style="font-size: 20px"></i></span>

      <div v-if="userArticle.length === 0">
        <div class="non-pic">
          <div>这里还什么都没有</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TAT</div>
        </div>
      </div>
      <div class="article-area">

        <div class="index-article" v-for="article in userArticle">
          <a @click="showArticle(article['articleUuid'])">{{article['articleTittle']}}</a>
          <i :class="['layui-icon',article['articlePraise']-article['articleStep']>=0?'layui-icon-praise':'layui-icon-tread']" style="margin-left: 2px"></i>{{Math.abs(article['articlePraise']-article['articleStep'])}}
        </div>
      </div>
      <button class="btn btn-success" @click="createArticle" style="margin-left: 110px;">写文章<i class="layui-icon layui-icon-edit"></i> </button>

<!--      <img src="@/assets/img/咕咕咕.jpeg" alt="咕咕咕" style="width: 80%;height: 80%">-->
<!--      <div style="font-size: 20px">咕咕咕</div>-->
    </div>


  </div>




</div>
</template>

<script>
import "font-awesome/css/font-awesome.css"
import axios from "axios";
import Qs from 'qs/dist/qs'
import "@/assets/css/font.css"
export default {
  name: "RightBox",
  props:{
    userName:String,
    visitedType:String,
    visitedName:String,
    indexShowImageFlag:Boolean,
  },
  data() {
    return {
      showImgInfo:[],
      ins:"",

      userArticle:[],
    }
  },
  watch:{
    visitedType(newName){
      if(newName !== ""){
        // setTimeout(()=>{
        //   this.ins.reload({elem:'#user-pic'});
        // },600)

        if(newName === 'self') {
          this.getShowIndexImage(this.userName);
          this.getIndexArticle(this.userName);
        }
        else if(newName === 'friend'){
          this.getShowIndexImage(this.visitedName);
          this.getShowIndexImage(this.visitedName);
        }
      }
    },
    indexShowImageFlag(newName){
      if(newName === true && this.visitedType === 'self'){
        this.getShowIndexImage(this.userName);
        this.$emit("indexShowImageFlagEnd","刷新结束")
      }
    }
  },
  mounted() {
    let _this = this;
    layui.use(['carousel', 'form'], function(){
      let carousel = layui.carousel;

      _this.ins = carousel.render({
        elem: '#user-pic'
        ,arrow: 'always'
        ,width: '100%' //设置容器宽度
        ,height: '400'
      });
    })

    setTimeout(()=>{
      this.getShowIndexImage(this.userName);
      this.getIndexArticle(this.userName);
    },600)
  },
  methods:{
    fun(){
      console.log($(".layui-carousel-ind ul").html());
    },
    showSetImage(){
      this.$emit("showSetImage",'展示设置图片盒子')
    },

    getShowIndexImage(userName){
      let _this = this;
      axios.post("/api/userIndex/queryShowIndexImage",Qs.stringify({'userName':userName}))
      .then(res =>{
        this.showImgInfo = res.data.data;
        layui.use(['carousel', 'form'], function(){
          let carousel = layui.carousel;

          setTimeout(()=>{

            _this.ins.reload({
              elem: '#user-pic'
              ,arrow: 'always'
              ,width: '100%' //设置容器宽度
              ,height: '400'
            })
          },1000)

        })
      })
      .catch(err =>{
        console.error(err);
      })
    },
    getIndexArticle(userName){
      axios.post("/api/article/queryIndexArticle", Qs.stringify({'userName':userName}))
      .then(res =>{
        this.userArticle = res.data.data;

      })
      .catch(err =>{
        console.error(err);
      })
    },
    createArticle(){
      this.$emit("crateArticle","写文章");
    },
    showIndexImage(uuid){
      this.$emit("showIndexImage",uuid);
    },
    showArticle(uuid){
      this.$emit("showArticle",uuid);
    }
  }
}
</script>

<style scoped>
.RightBox{
  width: 300px;
  height: auto;

}

.album-box{
  width: 300px;
  height: auto;
  padding: 20px 0;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
  border-radius: 20px;
}

.album-box .add-img{
  padding-top: 20px;
  padding-left: 60px;
}

.text-box{

  width: 300px;
  height: auto;
  margin-top: 20px;
  padding: 10px 0;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 2px 2px 5px #3F3F3F;
  border-radius: 20px;
}

.week-chart-font{
  display: inline-block;
  position: relative;
  width: 100px;
  height: 30px;
  padding-left: 15px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  color: #FFFFFF;
  font-size: 20px;
  background-color: #1E9FFF;
  left: -8px;
}

.week-chart-font:before {
  height: 0;
  width: 0;
  border-bottom: 8px solid rgb(100,0,50);
  border-left: 8px solid transparent;
  top: -8px;
  left: 0;
  content: "";
  position: absolute;
}

.non-pic{
  margin-top: 60px;
  margin-left: 30px;
  font-size: 30px;
  font-family: lovelyFont,serif;
  color: #761c19;
}

#user-pic{
  padding: 20px 0;
}


.index-article{
  font-size: 20px;
  padding: 10px 15px;
}
</style>