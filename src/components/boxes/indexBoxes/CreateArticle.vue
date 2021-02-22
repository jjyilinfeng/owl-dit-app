<template>
  <div class="create-article">
    <button @click="fun">click</button>
      <div class="article-title input-group" style="width: 60%;margin-left:20%;margin-bottom: 20px;">
        <span class="input-group-addon">文章标题</span>
        <input class="form-control" v-model="articleTitle"  >
      </div>
    <label>为你的文章添加一些标签（最多五个）</label>
    <button class="btn btn-info btn-sm" @click="refreshDefaultTag">换一批</button>

    <div class="default-tag" style="margin:10px 0">
      <div class="article-tag" v-for="tag in defaultTag">
        <button :class="['layui-btn layui-btn-radius layui-btn-sm animate__animated',refreshFlag?'animate__zoomOut':'animate__zoomIn']"
        @click="chooseTag($event,tag['columnName'])" :style="defaultTagStyle(tag)">
          {{tag['columnName']}}</button>
      </div>
    </div>
  <div class="create-tag">
    <label>不喜欢？自己写一个标签！</label>
    <div class="input-group" style="width: 20%">
      <input type="text" maxlength="10" v-model="selfTag" class="form-control input-sm">
      <span class="input-group-btn">
        <button @click="addSelfTag()" class="btn btn-success btn-sm btn-group">确定</button>
      </span>
    </div>
    <div class="add-tag" style="margin-top: 10px;">
      <button :class="['layui-btn layui-btn-radius layui-btn-sm animate__animated',addTagFlag?'animate__zoomIn':'animate__zoomOut']" v-for="tag in selfTags"
              @click="deleteSelfTag($event, tag)" :style="selfTagsStyle(tag['color'])">{{tag['tag']}}</button>
    </div>


  </div>
    <div>
      <label for="demo"></label>
      <textarea id="demo" style="display: none;"></textarea>
    </div>
    <div style="text-align: right;margin-right: 5%">
      <button id="send-article" class="btn btn-success">发表</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateArticle",
  props:{
    'userName':String,
  },
  data() {
    return {
      styleFlag: false,

      articleTitle:"",

      defaultTag:[],
      refreshFlag:false,

      chooseTags:[],

      selfTag:"",
      selfTags:[],
      addTagFlag:true,
    }
  },
  mounted() {
    let _this = this;
    this.getDefaultTag();

    layui.use('layedit', function(){
      let layedit = layui.layedit;
      layedit.build('demo'); //建立编辑器

      $("#send-article").click(()=>{
        console.log(_this.chooseTags);
      })
    });

    let main = $(".create-article");
    main.css("width",window.innerWidth*0.6);
  },
  methods:{
    fun(){
      console.log(this.defaultTag);
    },
    chooseTag(ev, name){
      let bgc = $(ev.target).css("background-color");
      if(bgc === 'rgb(255, 255, 255)' && this.chooseTags.length + this.selfTags.length >= 5){
        layer.msg("最多只能选5个tag",{icon:5});
      }
      else if(bgc === 'rgb(255, 255, 255)'){
        this.chooseTags.push(name);
      }
      else{
        for (let i = 0; i < this.chooseTags.length; i++) {
          if(this.chooseTags[i] === name){
            this.chooseTags.splice(i,1);
          }
        }
      }
    },
    addSelfTag(){
      // this.selfTag.replaceAll(" ","");
      if(this.chooseTags.length + this.selfTags.length >= 5){
        layer.msg("最多只能选5个tag",{icon:5});
      }
      else{
        let R = Math.floor(Math.random() * 255);
        let G = Math.floor(Math.random() * 255);
        let B = Math.floor(Math.random() * 255);

        this.selfTags.push({'tag':this.selfTag,'color':'rgb(' + R + ',' + G + ',' + B + ')'});
        this.selfTag = "";
      }
    },
    deleteSelfTag(ev, tag){
      for (let i = 0; i < this.selfTag.length; i++) {
        if(this.selfTag[i]['tag'] === tag['tag']){
          this.selfTag.splice(i,1);
        }
      }
      $(ev.target).attr("class","layui-btn layui-btn-radius layui-btn-sm animate__animated animate__zoomOut");
      setTimeout(()=>{
        $(ev.target).css("display","none");
      },600)
    },
    getDefaultTag(){
      this.styleFlag = false;
      axios.post("/api/article/queryDefaultColumn",{})
      .then(res =>{
        this.defaultTag = res.data.data;
        setTimeout(()=>{
          this.refreshFlag = false;
          this.styleFlag = true
        },600);
      })
      .catch(err =>{
        console.error(err);
      })
    },
    refreshDefaultTag(){
      this.refreshFlag = true;
      this.getDefaultTag();
    },
    defaultTagStyle(tag){
      let color = tag['columnColor'];
      let tagName = tag['columnName'];
      let flag = false;

      for (let i = 0; i < this.chooseTags.length; i++) {
        if(this.chooseTags[i] === tagName){
          flag = true;
          break;
        }
      }

      if(flag === false){
        return {
          backgroundColor:'white',
          color:color,
          border:'1px solid '+color
        }
      }
      else{
        return {
          backgroundColor:color,
          color:'white',
          border:'1px solid '+color
        }
      }


    },
    selfTagsStyle(color){

      return{
        'border': color+' 1px solid',
        'background-color': color,
        'color': 'white'
      }
    }
  }
}
</script>

<style scoped>
.create-article{
  height: auto;
  padding: 20px;
  border-radius: 20px;
  box-shadow: #0f0f0f 2px 2px 5px;
  background-color: rgba(255,255,255,0.9);
  text-align: left;
}

.article-tag{
  margin-right: 8px;
  display: inline-block;
}
</style>