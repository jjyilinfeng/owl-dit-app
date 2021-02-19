<template>
  <div class="set-bgm-box">

    <button class="btn btn-success"  @click="refreshTable" style="position:absolute;left: 10%"><i class="layui-icon layui-icon-refresh"></i>刷新</button>

    <div style="float: right;position: absolute;right: 5%" @click="showHidPlayer">
      <input type="checkbox" class="bgm-switch"  />
      <label style="float: right;margin-top: 4px">
        隐藏播放器
      </label>
    </div>

    <button @click="fun" v-show="false">click</button>

    <div>
      <label>
        Tip:如果你上传的音乐文件名是乱序，请自行设定歌曲名和艺术家名。
      </label>
    </div>

    <div>
      <label>
        如果你上传的音乐文件名是 艺术家-歌曲名 请选中此处
        <input type="checkbox"  v-model="special">
      </label>

    </div>


    <label style="margin-right: 20px">歌曲名
      <input type="text" class="form-control" v-model="bgmName" placeholder="必填">
    </label>
    <label style="margin-left: 20px">艺术家
      <input type="text" class="form-control" v-model="bgmArtist" placeholder="必填">
    </label>
    <div style="margin: 20px 0">
      <button type="button" class="btn btn-success" id="uploadBGM" :disabled="uploadGate"><i class="layui-icon"></i>上传音频</button>
    </div>
    <div>
      <label >上传进度条</label>
      <div class="layui-progress layui-progress-big" style="width: 60%;margin-left: 20%" lay-showpercent="true" lay-filter="demo">
        <div class="layui-progress-bar layui-bg-red layui-progress-big" lay-percent="0%"></div>
      </div>
    </div>

    <table v-show="userBGMInfo.length > 0" class="table table-hover table-bordered music-table" style="text-align: center;">
      <thead>
      <tr>
        <th><span>序号</span></th>
        <th><span>歌曲名</span></th>
        <th>艺术家</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(bgm,idx) in userBGMInfo">
        <td>{{idx+1}}</td>
        <td>{{bgm['name']}}</td>
        <td>{{bgm['artist']}} </td>
        <td>
          <button class="btn btn-info btn-sm" style="display: none">修改</button>
          <button class="btn btn-danger btn-sm" @click="deleteBgm(bgm['bgmId'])" >删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-show="count > 5" id="bgm-page"></div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from 'qs/dist/qs'

export default {
  name: "SetBackGroundMusicBox",
  props:{
    userName:String,
  },
  data() {
    return {
      bgmName:"",
      bgmArtist:"",
      special:false,
      userBGMInfo:[],
      showPlayer:false,
      page:1,
      count:0,
    }
  },
  watch:{

  },
  mounted() {
    setTimeout(()=>{
      this.getBackGroundMusic(this.userName,1,5);
    },200)

    this.switchInit();

    let _this = this;
    layui.use(['upload','element','laypage'], function() {
      let upload = layui.upload;
      let element = layui.element;

      upload.render({
        elem: '#uploadBGM'
        ,url: '/api/userIndex/userBGMUpload' //改成您自己的上传接口
        ,accept: 'audio' //音频
        ,choose: function(obj){
          var files = this.files = obj.pushFile();
          obj.preview(function (index) {
            let fileName = files[index].name;
            _this.bgmName = fileName.split("-")[1].replace(/^\s+|\s+$/g,"");
            _this.bgmName = _this.bgmName.substring(0,_this.bgmName.lastIndexOf("."));
            _this.bgmArtist = fileName.split("-")[0].replace(/^\s+|\s+$/g,"");
          })
        }
        ,progress: function(n, elem){
          let percent = n + '%' //获取进度百分比
          element.progress('demo', percent); //可配合 layui 进度条元素使用
        }
        ,done: function(res,index){
          layer.msg('上传成功',{icon:6});
          setTimeout(()=>{
            element.progress('demo', '0%')
          },3000)
          delete this.files[index];
          let uuid = res.data;
          axios.post("/api/userIndex/insertBackGroundMusic",
              Qs.stringify({'bgmName':_this.bgmName,'bgmArtist':_this.bgmArtist,'bgmUuid':uuid,'userName':_this.userName}))
          .then(res =>{
            _this.bgmName = "";
            _this.bgmArtist = "";
            _this.refreshTable();
          })
              .catch(err =>{
            console.error(err);
          })
        }
      });


    })
  },
  methods:{
    fun(){
      console.log(this.showPlayer);
    },
    getBackGroundMusic(userName,page,limit) {
      axios.post("/api/userIndex/queryPageBGM", Qs.stringify({'userName': userName,'page':page,'limit':limit}))
        .then(res => {
          this.userBGMInfo = res.data.data;
          let _this = this;
          let len;
          if(this.userBGMInfo.length > 0){
            len = this.userBGMInfo[0]['count'];
            this.count = len;
          }
          else{
            len = 0;
          }

          layui.use(['laypage'], function() {
            let layPage = layui.laypage;
            layPage.render({
              elem: 'bgm-page'
              , count: len //数据总数
              , theme: '#1E9FFF'
              , limit: 5
              , jump: function (obj) {
                _this.page = obj.curr;
                axios.post("/api/userIndex/queryPageBGM", Qs.stringify({'userName': userName,'page':obj.curr,'limit':obj.limit}))
                .then(res =>{
                  _this.userBGMInfo = res.data.data;
                })
                .catch(err =>{
                  console.error(err);
                })
              }
            });
          })
        })
        .catch(err =>{
          console.error(err);
        })
    },
    deleteBgm(id){
      this.$emit("deleteBgm",id);
    },
    refreshTable(){
      this.getBackGroundMusic(this.userName,1,5);
    },
    showHidPlayer(){
      if(this.showPlayer === true){
        this.showPlayer = false;
        this.$emit("showPlayer","展示播放器")
      }
      else{
        this.showPlayer = true;
        this.$emit("hidePlayer","展示播放器")
      }
    },
    switchInit(){
      //开关初始
      let switches = {};
      let switchConfig = {
        'bgm-switch': {},
      }
      Object.keys(switchConfig).forEach(function (key) {
        switches[key] = new Switch(document.querySelector('.' + key),switchConfig[key]);
      });
    },
  },
  computed:{
    uploadGate(){
      return !((this.bgmArtist !== "" && this.bgmName !== "") || this.special === true);
    }
  }
}
</script>

<style scoped>
.set-bgm-box{
  width: 1000px;
  min-height: 600px;
  padding-top: 30px;
  border-radius: 30px;
  background-color: rgba(255,255,255,0.8);
  box-shadow: #0f0f0f 2px 2px 5px;
}

#bgmList{
  width: 80%;
}

.music-table{
  border-radius: 20px;
  margin-top: 20px;
  margin-left: 10%;
  width: 80%;
  background-color: #fff;
  text-align: center;
}
</style>