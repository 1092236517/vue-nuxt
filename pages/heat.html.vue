<template>
    <div class="main">
        <div class="right">
            <div>
                <p class="hot">热点<span @click="heatmore">更多</span></p>
                <section class="ad">
                    <el-carousel height="250px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in adoneList" :key="item.id">
                            <a :href="'https://'+item.redirect_url" target="_blank">
                                <img :src="JSON.parse(item.pic_url)" :alt="item.id">
                            </a>
                        </el-carousel-item>
                    </el-carousel>
                </section>
                <!-- <img :src="JSON.parse(newsList[0].cover_img)" alt="图片" class="hotimg"> -->
                <div v-for="news in newsList" :key="news.id" @click="inDetail(news.id)">
                    <section v-if="news.cover_type == 'single'" class="infor">
                        <img :src="JSON.parse(news.cover_img)" alt="热点" class="illimg">
                        <p class="title">{{news.title}}</p>
                        <p class="time">{{news.created_at}}
                            <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                        </p>
                    </section>
                </div>
            </div>
        </div>
        <div class="left">
            <p class="hotlist">热点列表</p>
            <div v-for="news in hotList" :key="news.id" class="list" @click="inDetail(news.id)">
                <section v-if="news.cover_type == 'single'" class="infor">
                    <div class="illimg"><img :src="JSON.parse(news.cover_img)" alt="新闻"></div>
                    <p class="title">{{news.title}}</p>
                    <div class="detail" v-html="parseFun(news.content)"></div>
                    <p class="time">{{news.created_at}}
                        <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                    </p>
                </section>
                <section v-else class="infor2">
                    <p class="title">{{news.title}}</p>
                    <div class="detail" v-html="parseFun(news.content)"></div>
                    <div class="illimg2" v-for="(imgitem,index) in JSON.parse(news.cover_img)" :key="index">
                        <img :src="imgitem" alt="新闻">
                    </div>
                    
                    <p class="time">{{news.created_at}}
                        <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                    </p>
                </section>
            </div>
            <button v-if="isLoading" class="loading" @click="loading">加载更多</button>
            <p v-else class="noload">到底了...</p>
        </div>

        <seo></seo>
    </div>
</template>

<script>
import Seo from '../components/SEO'
export default {
    name:"index-heat",
    components:{Seo},
    async asyncData ({app,store}) {
        let [response1, response2,response3] = await Promise.all([
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{heat_set:'SET',per_page:10}}),
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{per_page:10}}),
            app.$request.get('/api/frontend/news/banner/lists',{params:{type:'ADONE'}}).then(response=>{
                let data = response.data.response;
                let dataArr=[];
                for(let i=0;i<data.length;i++){
                    if(data[i].status=="display"){
                        dataArr.push(data[i]); 
                    }
                }
                return dataArr;
            }),
        ])
        return{
            hotList: response1.data.response.data,
            newsList: response2.data.response.data,
            adoneList: response3,
        }
        // called every time before loading the component
    },
    fetch () {
        // The fetch method is used to fill the store before rendering the page
    },
    head(){
        return{
            title:"筑牛资讯 - 热点",
            meta:[
                {hid: 'description', name: 'description', content: 'My custom description'}
            ]
        }
    },
    data(){
        return{
            hotList: [],      //left
            newsList: [],     //right
            adoneList:[],
            pageNum: 1,
            isLoading: true
        }
    },
    methods:{
        inforList: function(page){
           let that = this;
           this.$request.get('/api/frontend/news/text/pc_lists',{params:{heat_set:'SET',current_page:page,per_page:10}}).then(function(response){
                if(response.data.msg_code == 100000){
                    if(response.data.response.data.length < 10){
                        that.isLoading = false;
                    }
                    if(page == 1){
                        that.hotList = response.data.response.data;
                    }else{
                        that.hotList = that.hotList.concat(response.data.response.data);
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
        //    this.$router.push({path:'/detail/'+id+'.html'});
            window.open("https://news.zhuniu.com/detail/" + id + ".html");
        },
        heatmore(){
           this.$router.push({name:'heat.html'});
       },
    }
}
</script>

<style lang="less" scoped>
.main{
    min-width: 1140px;
    max-width: 1140px;
    margin-top: 120px;
    color: #333;
    .right{
        width: 32%;
        float: right;
        text-align: left;
        padding-left: 60px;
        font-size: 14px;
        .ad{
            img{
                width: 100%;
                height: 250px;
                margin: 20px 0px;
                display: block;
                background: #ccc;
            }
        }
        .hot{
            line-height: 60px;
            height: 60px;
            border-bottom: 1px solid #e61f18;
            font-weight: bold;
            font-size: 18px;
            padding: 0 6px;
            span{
                float: right;
                font-weight: normal;
                font-size: 14px;
                &:hover{
                    cursor: pointer;
                }
            }
        }
        .hotimg{
            width: 300px;
            height: 170px;
            background: #9f9;
            display: inline-block;
            margin: 15px 0px;
        }
        .infor{
            font-size: 14px;
            text-align: left;
            width: 100%;
            margin-top: 15px;
            padding-bottom: 10px;
            .illimg{
                width: 60px;
                height: 60px;
                float: left;
                margin-right: 10px;
                border: 1px solid #eee;
                border-radius: 5px;
                padding: 6px 0px;
            }
            .title{
                margin-bottom: 10px;
                padding-top: 3px;
                font-size: 14px;
                line-height: 24px;
                height: 24px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-weight: bold;
                &:hover{
                    color: #e22014;
                    cursor: pointer;
                }
            }
            .time{
                font-size: 12px;
                color: #aaa;
                span{
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
    }
    .left{
        width: 68%;
        .hotlist{
            padding-right: 18px;
            line-height: 70px;
            font-size: 20px;
            font-weight: bold;
            color: #565656;
            text-align: left;
        }
        .list{
            .infor{
                border-top: 1px solid #eee;
                padding: 20px 10px;
                font-size: 14px;
                text-align: left;
                width: 100%;
                line-height: 20px;
                .illimg{
                    width: 240px;
                    height: 150px;
                    background: #ccc;
                    float: left;
                    margin-right: 25px;
                    overflow: hidden;
                    img{
                        height:100%;
                        width:100%;
                        &:hover{
                            transform: scale(1.1);
                            -webkit-transition: -webkit-transform 0.3s;
                            transition: -webkit-transform 0.3s;
                            transition: transform 0.3s;
                            transition: transform 0.3s, -webkit-transform 0.3s;
                        }
                    }
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
                p span{
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
                &:hover{
                    box-shadow: 0px 0px 1px 1px #eee;
                }
                
            }
            .infor2{
                border-top: 1px solid #eee;
                padding: 20px 10px;
                font-size: 14px;
                text-align: left;
                width: 100%;
                line-height: 20px;
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
                .illimg2{
                    width: 240px;
                    height: 150px;
                    background: #ccc;
                    margin: 10px 8px 10px 0px;
                    display: inline-block;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                        &:hover{
                            transform: scale(1.1);
                            -webkit-transition: -webkit-transform 0.3s;
                            transition: -webkit-transform 0.3s;
                            transition: transform 0.3s;
                            transition: transform 0.3s, -webkit-transform 0.3s;
                        }
                    }
                }
                .detail{
                    margin-bottom: 20px;
                    overflow: hidden;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #999;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                p span{
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
                &:hover{
                    box-shadow: 0px 0px 1px 1px #eee;
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
}
</style>
