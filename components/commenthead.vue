<template>
  <div class="header indexPage">
    <label class="logo">筑牛资讯</label>
    <ul class="title">
      <li @click="liselect('index')" :class="{liselect:liindex=='index'}">首页</li>
      <li @click="liselect('heat')" :class="{liselect:liindex=='heat.html'}">热点</li>
      <li @click="liselect('imgText')" :class="{liselect:liindex=='imgText.html'}">图文</li>
      <li @click="liselect('video')" :class="{liselect:liindex=='video.html'}">视频</li>
    </ul>
    <label class="search">
      <el-input
        ref="input"
        @focus="isHiddenSearch=true"
        @blur="inputblur"
        @keyup.enter.native="searchIn"
        v-model="search"
      >
      <el-button slot="append" icon="el-icon-search" @click="searchIn"></el-button>
      </el-input>
    </label>
    <ul class="login">
      <li @mouseenter="isHiddenCode=true" @mouseleave="isHiddenCode=false">小程序</li>
      <li v-if="isLogin">
        <img :src="logimg" alt class="userimg" @click="isLogout=true">
      </li>
      <li v-else @click="loginIn">登录</li>
    </ul>
    <hr>
    <div v-if="isLogout" class="logout" @mouseleave="isLogout=false">
      <div @click="usercenter">个人中心</div>
      <div @click="loginIn">退出登录</div>
    </div>
    <img src="../assets/images/applet.jpg" alt="二维码" v-show="isHiddenCode" class="code">
    <div class="search_hot" v-show="isHiddenSearch&&searchList.length!=0" @mouseleave="leaveHotList">
      <ul>
        <li v-for="(item,index) in searchList" :key="index" @click="inDetail(item.id)">
          <label :class="{hot_active:index<3}">{{index+1}}</label>
          {{item.title}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      liindex:'index',
      isHiddenCode: false,
      isHiddenSearch: false,
      searchList: [],
      isLogin: false,
      logimg: "",
      isLogout: false
    };
  },
  watch: {
      '$route' (to, from){
          this.liindex = this.$route.name;
      }
  },
  created(){
      this.liindex = this.$route.name;
  },
  mounted() {
    if (this.$cookies.get("token")) {
      this.isLogin = true;
      this.logimg =
        this.$cookies.get("photo") || require("../assets/images/loginLogo.png");
    }
    this.searchHotList();
  },
  methods: {
    leaveHotList() {
      this.isHiddenSearch = false;
      this.$refs.input.blur();
    },
    inputblur() {
      setTimeout(function() {
        this.isHiddenSearch = false;
      }, 2000);
    },
    searchHotList() {
      let that = this;
      that.$request
        .get("/api/frontend/news/text/pc_lists", {
          params: { heat_set: "SET", text_type: "text", per_page: 6 }
        })
        .then(response => {
          that.searchList = response.data.response.data;
        });
    },
    liselect(index) {
      if (index == 'index') {
        this.liindex = 'index';
        this.$router.push({ name: "index"});
      } else if (index == 'heat') {
        this.liindex = 'heat.html';
        this.$router.push({ name: "heat.html"});
      } else if (index == 'imgText') {
        this.liindex = 'imgText.html';
        this.$router.push({ name: "imgText.html"});
      } else if (index == 'video') {
        this.liindex = 'video.html';
        this.$router.push({ name: "video.html"});
      }
    },
    loginIn() {
      this.$router.push({ name: "login.html" });
      this.$cookies.removeAll();
    },
    inDetail: function(id) {
      this.$router.push({ path: "/detail/" + id + ".html" });
    },
    searchIn() {
      if (this.search) {
        this.$router.push({
          path: "/search/" + encodeURI(this.search) + ".html"
        });
      } else {
        this.$router.push({ name: "index" });
      }
    },
    usercenter() {
      this.$router.push({ name: "usercenter.html" });
    }
  }
};
</script>

<style>
.indexPage .el-input__inner {
  /*background: #efefef;
   border: 0px;
  border-radius: 50px;*/
  height: 30px; 
}
.indexPage .el-icon-search:before {
  color: #000;
}
</style>

<style scoped lang="less">
.header {
  position: fixed;
  top: 0;
  z-index: 10;
  color: #444;
  background: #fff;
  min-width: 1200px;
  .logo {
    font-size: 28px;
    color: #e22014;
    float: left;
    font-weight: bold;
    line-height: 72px;
    margin: 0px 22px;
  }
  ul {
    li {
      line-height: 76px;
      padding: 0px 40px;
      float: left;
      cursor: pointer;
      position: relative;
      &:hover{
        font-size: 16px;
        color: rgba(218, 14, 31,1);
        font-weight: bold;
        // border-bottom: 3px solid rgba(218, 14, 31, .6);
        -webkit-transition: 0.5s;
        transition: 0.5s;
        -webkit-animation: underline 0.5s;
      }
    }
    .liselect {
      font-size: 16px;
      color: #e22014;
      font-weight: bold;
      border-bottom: 3px solid #e22014;
      -webkit-transition: 0.5s;
      transition: 0.5s;
      -webkit-animation: underline 0.5s;
    }
  }
  .login {
    li {
      .userimg {
        width: 32px;
        height: 32px;
        display: inline-block;
        // background: #ccc;
        margin-bottom: -12px;
      }
      &:hover {
        font-weight: bold;
        color: #444;
        border: 0px;
      }
    }
  }
  .search {
    width: 295px;
    float: left;
    padding: 0px 40px;
    line-height: 53px;
  }
  hr {
    position: fixed;
    top: 79px;
    left: 0px;
    right: 0px;
    z-index: 10;
    border: 0px;
    border-bottom: 1px solid #ddd;
    width: 100%;
  }
}
.logout {
  position: fixed;
  top: 62px;
  z-index: 10;
  margin-left: 1050px;
  background: #eee;
  border: 1px solid #eee;
  font-size: 14px;
  color: #000;
  padding: 5px;
  cursor: pointer;
  div {
    border-bottom: 1px solid #ddd;
    line-height: 20px;
    height: 20px;
    &:hover {
      color: #e22014;
    }
  }
}
.code {
  width: 128px;
  height: 128px;
  position: fixed;
  top: 80px;
  z-index: 10;
  margin-left: 902px;
  box-shadow: 0px 0px 1px 1px #eee;
  padding: 5px 5px;
  background: #fff;
  display: block;
}
.search_hot {
  background: #fff;
  width: 215px;
  position: fixed;
  top: 56px;
  z-index: 10;
  margin-left: 642px;
  padding: 10px 20px;
  text-align: left;
  font-size: 14px;
  box-shadow: 1px 1px 1px 0px #ddd;
  ul li {
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    width: 100%;
    label {
      background: #f7f7f5;
      color: #9a9a9a;
      margin-right: 8px;
      padding: 0px 5px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 12px;
      line-height: 20px;
    }
    .hot_active {
      background: #ff5601;
      color: #fff;
    }
    &:hover {
      border-bottom: none;
      font-size: 14px;
      color: #444;
      font-weight: normal;
      background-color: #eee;
    }
  }
}
</style>
