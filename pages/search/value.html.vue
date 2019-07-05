<template>
    <div class="main">
        <!-- <el-form :inline="true">
            <el-form-item>
                <el-input v-model="title" class="width300"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="inforList(1)">搜索</el-button>
            </el-form-item>
        </el-form> -->
        <div v-for="news in textList" :key="news.id" class="list" @click="inDetail(news.id)">
            <section v-if="news.cover_type == 'single'" class="infor">
                <img :src="JSON.parse(news.cover_img)" alt="新闻" class="illimg">
                <p class="title">{{news.title}}</p>
                <div class="detail" v-html="parseFun(news.content)"></div>
                <p class="time">{{news.created_at}}
                    <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                </p>
            </section>
            <section v-else class="infor2">
                <p class="title">{{news.title}}</p>
                <div class="detail" v-html="parseFun(news.content)"></div>
                <img v-for="(imgitem,index) in JSON.parse(news.cover_img)" :key="index" :src="imgitem" alt="新闻" class="illimg2">
                <p class="time">{{news.created_at}}
                    <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                </p>
            </section>
        </div>
        <button v-if="isLoading&&textList.length!=0" class="loading" @click="loading">加载更多</button>
        <p v-else-if="textList.length!=0" class="noload">到底了...</p>
        <div v-else>
            <img src="../../assets/images/nodata.png">
        </div>

        <!--seo优化-->
        <seo></seo>
    </div>
</template>

<script>
import Seo from '../../components/SEO'
export default {
    name:"index-imgText",
    components:{Seo},
    async asyncData ({params,app,store}) {
        return app.$request.get('/api/frontend/news/text/pc_lists',{params:{per_page:10,title:decodeURI(params.value)}}).then(response=>{
            return {textList: response.data.response.data,title:decodeURI(params.value)}
        })
        // called every time before loading the component
    },
    fetch () {
        // The fetch method is used to fill the store before rendering the page
    },
    head(){
        return{
            title:"筑牛资讯 - 图文",
            meta:[
                {hid: 'description', name: 'description', content: 'My custom description'}
            ]
        }
    },
    data(){
        return{
            textList: [],      //left
            title:"",
            pageNum: 1,
            isLoading: true
        }
    },
    methods:{
        inforList: function(page){
           let that = this;
           this.$request.get('/api/frontend/news/text/pc_lists',{params:{text_type:'text',current_page:page,per_page:10,title:that.title}}).then(function(response){
                if(response.data.msg_code == 100000){
                    if(response.data.response.data.length < 10){
                        that.isLoading = false;
                    }
                    if(page == 1){
                        that.textList = response.data.response.data;
                    }else{
                        that.textList = that.textList.concat(response.data.response.data);
                    }
                }else{

                }
            }).catch(function(error){
                console.log(error);
            });
        },
        loading: function(){
           this.pageNum = this.pageNum + 1;
           this.inforList(this.pageNum);
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
    min-width: 1140px;
    max-width: 1140px;
    color: #333;
    margin-top: 100px;
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
                    font-size: 18px;
                    line-height: 30px;
                    padding-bottom: 10px;
                    max-height: 60px;
                    font-weight: bold;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    &:hover{
                        color: #e22014;
                        cursor: pointer;
                        transition: .5s;
                    }
                }
                .detail{
                    height: 80px;
                    margin-bottom: 20px;
                    overflow: hidden;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #999;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                .time span{
                    float: right;
                    .comment_icon{
                        width: 16px;
                        height: 16px;
                        background-image: url(../../assets/images/comment_icon.png);
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
                        background-image: url(../../assets/images/comment_icon.png);
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

