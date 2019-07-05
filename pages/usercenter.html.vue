<template>
    <div class="main">
        <div class="header">
            <img :src="logimg" alt="" class="userimg">
            <span>{{nickName}}</span>
        </div>
        <div class="listBox">
            <el-tabs v-model="activeName">
                <!-- <el-tab-pane label="我的收藏" name="collect"> </el-tab-pane> -->
                <el-tab-pane label="我的评论" name="comment"> </el-tab-pane>
            </el-tabs>
            <div v-for="news in textList" :key="news.id" class="list" @click="inDetail(news.news.id)">
                <section v-if="news.news.cover_type == 'single'" class="infor">
                    <img :src="JSON.parse(news.news.cover_img)" alt="新闻" class="illimg">
                    <p class="title">{{news.news.title}}</p>
                    <div class="detail" v-html="parseFun(news.news.content)"></div>
                    <p class="time">{{news.news.created_at}}
                        <span><img src="" alt="" class="comment_icon">&nbsp;{{news.news.comment_num||0}}</span>
                    </p>
                </section>
                <section v-else class="infor2">
                    <p class="title">{{news.news.title}}</p>
                    <div class="detail" v-html="parseFun(news.news.content)"></div>
                    <img v-for="(imgitem,index) in JSON.parse(news.news.cover_img)" :key="index" :src="imgitem" alt="新闻" class="illimg2">
                    <p class="time">{{news.news.created_at}}
                        <span><img src="" alt="" class="comment_icon">&nbsp;{{news.news.comment_num||0}}</span>
                    </p>
                </section>
            </div>
            <p v-if="textList.length==0" class="noload">到底了...</p>
        </div>

        <seo></seo>
    </div>
</template>

<script>
import Seo from '../components/SEO'
export default {
    name:"index-imgText",
    components:{Seo},
    head(){
        return{
            title:"筑牛资讯 - 个人中心",
            meta:[
                {hid: 'description', name: 'description', content: 'My custom description'}
            ]
        }
    },
    data(){
        return{
            activeName:"comment",
            textList: [],      //left
            pageNum: 1,
            logimg:"",
            nickName:"123",
        }
    },
    mounted(){
        if(this.$cookies.get("token")){
            this.logimg=this.$cookies.get("photo")||require("../assets/images/loginLogo.png");
            this.nickName = this.$cookies.get("name");
            this.inforList();
        }else{
            this.$message.warning("请先登录用户")
            this.$router.push({name:"index"})
        }
        
    },
    methods:{
        inforList: function(){
           let that = this;
           this.$request.get('/api/frontend/news/comment/my_lists',{params:{token:this.$cookies.get("token")}}).then(function(response){
                if(response.data.msg_code == 100000){
                    that.textList = response.data.response;
                }else{

                }
            }).catch(function(error){
                console.log(error);
            });
        },
        parseFun: function(parsehtml){
           let striphtml = require('js-striphtml');
           let parsec = striphtml.stripAttr(parsehtml);
           return parsec.replace(/<[^>]+>/g,"");
        },
        inDetail: function(id){
           this.$router.push({path:'/detail/'+id+'.html'});
        },
    }
}
</script>

<style lang="less" scoped>
.main{
    min-width: 1000px;
    max-width: 1000px;
    color: #333;
    margin-top: 120px;
    .header{
        height: 200px;
        width: 100%;
        background-image: url("../assets/images/userBg.png");
        background-position: top left;
        background-size: 100% 60%;
        background-repeat: no-repeat;
        box-shadow: 0px 0px 10px 2px #ccc;
        .userimg{
            width: 50px;
            height: 50px;
            float: left;
            margin-top: 100px;
            margin-left: 60px;
        }
        span{
            float: left;
            margin-top: 110px;
            margin-left: 10px;
            color: #000;
            font-size: 20px;
            font-weight: 500;
        }
    }
    .listBox{
        margin-top: 20px;
        box-shadow: 0px 0px 10px 2px #ccc;
        padding: 10px;
    }
        .list{
            color: #999;
            font-size: 14px;
            text-align: left;
            line-height: 20px;
            .infor{
                border-bottom: 1px solid #eee;
                padding: 20px 0px;
                width: 100%;
                .illimg{
                    width: 240px;
                    height: 150px;
                    background: #ccc;
                    float: left;
                    margin-right: 25px;
                }
                .title{
                    font-weight: bold;
                    margin-bottom: 10px;
                    font-size: 15px;
                    color: #222;
                    &:hover{
                        color: #e22014;
                        cursor: pointer;
                    }
                }
                .detail{
                    height: 80px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                .time span{
                    float: right;
                    .comment_icon{
                        width: 16px;
                        height: 16px;
                        background-image: url(../assets/images/comment_icon.png);
                        background-size: 100% 100%;
                        margin: 3px 3px 0px 0px;
                        float: left;
                    }
                }
            }
            .infor2{
                border-bottom: 1px solid #eee;
                padding: 20px 0px;
                width: 100%;
                .title{
                    font-weight: bold;
                    margin-bottom: 10px;
                    font-size: 15px;
                    color: #222;
                    &:hover{
                        color: #e22014;
                        cursor: pointer;
                    }
                }
                .illimg2{
                    width: 240px;
                    height: 150px;
                    background: #ccc;
                    margin: 10px 15px 10px 0px;
                    display: inline-block;
                }
                .detail{
                    height: 80px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                .time span{
                    float: right;
                    .comment_icon{
                        width: 16px;
                        height: 16px;
                        background-image: url(../assets/images/comment_icon.png);
                        background-size: 100% 100%;
                        margin: 3px 3px 0px 0px;
                        float: left;
                    }
                }
            }
        }
        .loading{
            width: 320px;
            height: 40px;
            border: 0px;
            border-radius: 5px;
            background: #ddd;
            color: #999;
            margin-top: 60px;
            outline: none;
            &:hover{
                box-shadow: 0px 0px 1px 1px #ccc;
                cursor: pointer;
            }
        }
        .noload{
            font-size: 14px;
            color: #999;
            margin-top: 20px;
        }
    
}
</style>

