import { createStore } from 'vuex'

import axios from "axios";
import Qs from 'qs/dist/qs.js'
export default createStore({
  state: {
    searchType:"searchDits",
    searchWord:"",

    unReadInfo:{
      'unReadPraise':[],
      'unReadComment':[]
    }
  },
  mutations: {
    getUnReadPraise(state, userName){
      axios.post("/api/message/unReadPraise",Qs.stringify({'userName':userName}))
        .then(res => {
          state.unReadInfo['unReadPraise'] = res.data.data;
        }).catch(err=>{
          console.error(err);
        })
    },

    getUnReadComment(state, userName){
      axios.post("/api/message/unReadComment",Qs.stringify({'userName':userName}))
          .then(res => {
            state.unReadInfo['unReadComment'] = res.data.data;
          }).catch(err=>{
        console.error(err);
      })
    },

    changeSearchType(state,newType){
      state.searchType = newType;
    },
    changeSearchWord(state,newWord){
      state.searchWord = newWord;
    }
  },
  actions: {
  },
  modules: {
  }
})
