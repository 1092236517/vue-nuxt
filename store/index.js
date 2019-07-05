import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    token: "",
    user:{}
  },
  mutations: {
    userInfo (state,data) {
        state.token  = data.token;
        state.user  = data.user;
    }
  }
})

export default store