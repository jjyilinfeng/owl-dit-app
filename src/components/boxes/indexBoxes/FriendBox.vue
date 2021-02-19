<template>
  <div class="friend-box">
    <button class="btn btn-success" @click="fun"><i class="layui-icon layui-icon-refresh"></i>刷新  </button>
    <div class="layui-tab friend-info">
      <ul class="layui-tab-title">
        <li class="layui-this">关注</li>
        <li class="">粉丝</li>
      </ul>
      <div class="layui-tab-content">
        <div class="layui-tab-item layui-show">
          <div id="concern-found">
            <div class="user-box" v-for="(user,idx) in userFriendInfo['concern']" :style="{'float':idx%2!==0?'right':'left'}" >
              <img class="user-userFace" @click="showUserFace(user['userFaceUuid'])" :src="'/api/static/img/userFace/'+user['userFaceUuid']" :alt="user['userName']"/>
              <div class="user-info">
                <a @click="showDitUserInfo(user['userName'])" class="user-userName">
                  <span v-if="user['userNickName']!==''">{{user['userNickName']}}</span>
                  <span v-else>{{user['userName']}}</span>
                </a>
                <span class="user-info-main">
                    <i class="layui-icon layui-icon-male" v-show="user['userGender']==='男'" style="color: #1E9FFF"/>
                    <i class="layui-icon layui-icon-female" v-show="user['userGender']==='女'" style="color: deeppink"/>
                      {{user['userAge']}}
                  </span>
                <div class="user-sign">
                  {{user['userSign']}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-tab-item">
          <div id="fans-found">
            <div class="user-box" v-for="(user,idx) in userFriendInfo['fans']" :style="{'float':idx%2!==0?'right':'left'}" >
              <img class="user-userFace" @click="showUserFace(user['userFaceUuid'])" :src="'/api/static/img/userFace/'+user['userFaceUuid']" :alt="user['userName']"/>
              <div class="user-info">
                <a @click="showDitUserInfo(user['userName'])" class="user-userName">
                  <span v-if="user['userNickName']!==''">{{user['userNickName']}}</span>
                  <span v-else>{{user['userName']}}</span>
                </a>
                <span class="user-info-main">
                    <i class="layui-icon layui-icon-male" v-show="user['userGender']==='男'" style="color: #1E9FFF"/>
                    <i class="layui-icon layui-icon-female" v-show="user['userGender']==='女'" style="color: deeppink"/>
                      {{user['userAge']}}
                  </span>
                <div class="user-sign">
                  {{user['userSign']}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from 'qs/dist/qs'
export default {
  name: "FriendBox",
  props:{
    userName:String,
  },
  data() {
    return {
      userFriendInfo:{
        'concern':[],
        'fans':[]
      }
    }
  },
  mounted() {

    setTimeout(()=>{
      this.getFriendInfo(this.userName);
    },200)
  },
  methods:{
    fun(){
      this.getFriendInfo(this.userName);
    },
    showDitUserInfo(userName){
      this.$emit("showDitUserInfo",userName)
    },
    showUserFace(uuid){
      this.$emit("showUserFace",uuid);
    },
    getFriendInfo(userName){
      axios.post("/api/userIndex/queryUserFriend",Qs.stringify({'userName':userName}))
      .then(res =>{
        this.userFriendInfo = res.data.data;

      })
      .catch(err =>{
        console.error(err);
      })
    }
  }
}
</script>

<style scoped>
.friend-box{
  width: 80%;
  height: auto;
  padding: 10px;
  border-radius: 30px;
  box-shadow: 2px 2px 5px #0f0f0f;
  position: absolute;
  z-index: -1;
  left: 10%;
  right: 10%;
  top: 10%;
  background-color: rgba(255,255,255,0.9);
}

.user-box{
  width: 40%;
  height: 150px;
  margin: 20px;
  padding : 16px;
  border-radius: 10px;
  border: gray 1px solid;
  background-color: rgba(255,255,255,0.6);
}

.user-box .user-userFace{
  width: 50px;
  height: 50px;
  margin-right: 12px;
  border-radius: 50%;
  float: left;
  display: block;
}

.user-box .user-info{
  float: left;
  overflow: hidden;
}

.user-box .user-info .user-info-main{
  margin-top: 5px;
  color: #8c7e83;
  display: block;
}

.friend-info{
  width: 80%;
  margin-left: 10%;
}
</style>