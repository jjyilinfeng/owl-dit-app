<template>
      <div class="single-member effect-3">
        <div class="member-image">
          <img v-show="userCardData['userFaceUuid']!==''" :src="'/api/static/img/userFace/'+userCardData['userFaceUuid']" alt="Member" style="max-height:200px;max-width: 200px">
        </div>
        <div class="member-info">
          <h3>
            <span v-show="userCardData['userNickName']!==undefined">{{userCardData['userNickName']}}</span>
            <span v-show="userCardData['userNickName']===undefined">{{userCardData['userName']}}</span>
            <i class="layui-icon layui-icon-male" v-show="userCardData['userGender']==='男'" style="color: #1E9FFF"/>
            <i class="layui-icon layui-icon-female" v-show="userCardData['userGender']==='女'" style="color: deeppink"/>
            <span style="margin-left: 3px;font-size: 18px">{{userCardData['userAge']}}</span>
          </h3>

          <h5>
            关注：<span style="font-weight: bolder">{{userCardData['userFollow']}}</span>
            粉丝：<span style="font-weight: bolder">{{userCardData['userFans']}}</span>
            Dit数：<span style="font-weight: bolder">{{userCardData['userDitCount']}}</span>
          </h5>
          <p v-if="userCardData['userSign']!==''">
            {{userCardData['userSign']}}
          </p>
          <p v-else>
            这个人很懒，还什么都没有写
          </p>
        </div>
        <div class="foot-button" v-show="userCardData['style'] !== 'self'">
          <button class="btn btn-info btn-sm" style="margin-right: 20px">
          <span @click="followSwitch" v-if="userCardData['style']==='unfollow'">
            关注TA
          </span>
            <span @click="followSwitch" v-else-if="userCardData['style']==='follow'">
              取消关注
            </span>
          </button>
          <button class="btn btn-success btn-sm" @click="visit">访问TA的Dit空间</button>
        </div>

      </div>
</template>

<script>
import axios from "axios";
import Qs from "qs/dist/qs.js"

export default {
  name: "userCardBox",
  props:{
    userName:String,
    userCardData:{
      type:Object,
      default:()=>{
        return{
          userName:"",
          userGender:"",
          userFollow:"",
          userFans:"",
          userDitCount:"",
          userAge: '',
          userSign:""
        }
      }
    }
  },
  methods:{

    fun(){
      console.log(this.userCardData);
    },

    followSwitch(){
      if(this.userCardData['style'] === 'follow'){
        this.unfollow();
        this.userCardData['style'] = 'unfollow'
      }
      else if(this.userCardData['style'] === 'unfollow'){
        this.follow();
        this.userCardData['style'] = 'follow'
      }
    },

    follow(){
      axios.post("/api/userIndex/follow",Qs.stringify({'concernUserName':this.userName,
        'concernByUserName':this.userCardData['userName']}))
          .then(res=>{
              layer.msg('关注成功',{icon: 6,time:2000, shade:0.4});
      })
      .catch(err =>{
        console.error(err);
      })
    },

    unfollow(){
      axios.post("/api/userIndex/unfollow",Qs.stringify({'concernUserName':this.userName,
        'concernByUserName':this.userCardData['userName']}))
          .then(res=>{
            layer.msg('取消关注成功',{icon: 6,time:2000, shade:0.4});
          })
          .catch(err =>{
            console.error(err);
          })
    },

    visit(){
      this.$emit("visit",this.userCardData['userName']);
    }
  }
}
</script>

<style scoped>
.userCard{
  box-shadow: #3F3F3F 2px 2px 5px;
}

/*= common css to all effects =*/
.single-member{width: 340px; float: left; background-color: rgba(255,255,255,0.9); text-align: center; position: relative;padding: 10px;}
.member-image img{max-width: 100%; vertical-align: middle;}
h3 {font-size: 24px; font-weight: normal; margin: 10px 0 0; text-transform: uppercase;}
h5 {font-size: 16px; font-weight: 300; margin: 0 0 15px; line-height: 22px;}
p {font-size: 14px; font-weight: 300; line-height: 22px; padding: 0 30px; margin-bottom: 10px;}
/*= common css to all effects end =*/


/*= effect-3 css =*/
.effect-3{max-height: 302px; min-height: 302px; overflow: hidden;border-radius: 30px;box-shadow: 2px 2px 5px #3F3F3F}
.effect-3 h3{padding-top: 7px; line-height: 33px;}
.effect-3 .member-image{border-bottom: 5px solid #e5642b; transition: 0.4s; height: 212px; width: 100%; display: inline-block; float: none; vertical-align: middle;}
.effect-3 .member-info{transition: 0.4s;}
.effect-3 .member-image img{width: 100%; vertical-align: bottom;}
.effect-3:hover .member-image{border-bottom: 0; border-radius: 0 0 50px 50px; height: 81px; display: inline-block; overflow: hidden; width: 109px; transition: 0.4s;}
/*= effect-3 css end =*/

</style>