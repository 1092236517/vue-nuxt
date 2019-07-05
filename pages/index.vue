<template>
    <div class="main">
        <div class="right">
            <div>
                <p>热点<span @click="heatmore">更多</span></p>
                <ul>
                    <li v-for="hotspot in hotList" :key="hotspot.id" @click="inDetail(hotspot.id)"><span>{{hotspot.title}}</span></li>
                </ul>
                <section class="ad">
                    <el-carousel height="250px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in adoneList" :key="item.id">
                            <a :href="'https://'+item.redirect_url" target="_blank">
                                <img :src="JSON.parse(item.pic_url)" :alt="item.id">
                            </a>
                        </el-carousel-item>
                    </el-carousel>
                </section>
                <p>视频<span @click="videomore">更多</span></p>
                <img style="cursor:pointer" v-for="video_src in videoList" :key="video_src.id" :src="JSON.parse(video_src.cover_img)[0]" @click="inDetail(video_src.id)" alt="视频">
                <section class="ad">
                    <el-carousel height="250px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in adtwoList" :key="item.id">
                            <a :href="'https://'+item.redirect_url" target="_blank">
                                <img :src="JSON.parse(item.pic_url)" :alt="item.id">
                            </a>
                        </el-carousel-item>
                    </el-carousel>
                </section>
            </div>
        </div>
        <div class="left">
            <section class="carousel">
                <el-carousel height="380px">
                    <el-carousel-item v-for="item in carouselList" :key="item.id">
                        <a :href="'https://'+item.redirect_url" target="_blank">
                            <img :src="JSON.parse(item.pic_url)" :alt="item.id">
                            <p>{{item.title}}</p>
                        </a>
                    </el-carousel-item>
                </el-carousel>
            </section>
            <div class="news">
                <div class="arrow">
                    <a href="javascript:;" class="prev" @click="prev"></a>
                    <a href="javascript:;" class="next" @click="next"></a>
                </div>
                <div class="Ztheme">
                    <div class="theme">
                        <ul :style="{width:110*Object.keys(this.liData).length+'px','-webkit-transform':'translateX('+ translateX +'px)'}">
                            <li v-for="(item,index) in liData" :key="index" :item="item" :class="{active:index==activeIndex}" @click="theme(index)">{{item.name}}</li>
                        </ul>
                    </div>
                </div>
                <div v-for="news in newsList" :key="news.id" class="list" @click="inDetail(news.id)" >
                    <section v-if="news.cover_type == 'single'" class="infor">
                        <div class="illimg">
                            <img :src="JSON.parse(news.cover_img)" alt="新闻">
                        </div>
                        <p class="title">{{news.title}}</p>
                        <div class="detail" v-html="parseFun(news.content)"></div>
                        
                        <p>{{news.created_at}}
                            <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                        </p>
                    </section>
                    <section v-else class="infor2">
                        <p class="title">{{news.title}}</p>
                        <div class="detail" v-html="parseFun(news.content)"></div>
                        <div class="illimg2" v-for="(imgitem,index) in JSON.parse(news.cover_img)" :key="index">
                            <img :src="imgitem" alt="新闻">
                        </div>
                        <p>{{news.created_at}}
                            <span><img src="" alt="" class="comment_icon">&nbsp;{{news.comment_num||0}}</span>
                        </p>
                    </section>
                </div>
                <button v-if="isLoading" class="loading" @click="loading">加载更多</button>
                <p v-else class="noload">到底了...</p>
            </div>
        </div>
        <seo></seo>
    </div>
</template>

<script>
import Seo from '../components/SEO'

export default {
    name:"index",
    components:{Seo},
    async asyncData ({app,store}) {
        // let that = this;
        let [response1, response2, response3, response4, response5, response6, response7] = await Promise.all([
            app.$request.get('/api/frontend/news/plate/lists'),
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{plate_id:1,per_page:10}}),
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{heat_set:'SET',per_page:15}}),
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{text_type:'video',per_page:5}}),
            app.$request.get('/api/frontend/news/banner/lists',{params:{type:'banner'}}).then(response=>{
                let data = response.data.response;
                let dataArr=[];
                for(let i=0;i<data.length;i++){
                    if(data[i].status=="display"){
                        dataArr.push(data[i]); 
                    }
                }
                return dataArr;
            }),
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
            app.$request.get('/api/frontend/news/banner/lists',{params:{type:'ADTWO'}}).then(response=>{
                let data = response.data.response;
                let dataArr=[];
                for(let i=0;i<data.length;i++){
                    if(data[i].status=="display"){
                        dataArr.push(data[i]); 
                    }
                }
                return dataArr;
            })
        ])
        return{
            liData: response1.data.response,
            newsList: response2.data.response.data,
            hotList: response3.data.response.data,
            videoList: response4.data.response.data,
            carouselList: response5,
            adoneList: response6,
            adtwoList: response7
        }
    },
    fetch () {
        // The fetch method is used to fill the store before rendering the page
    },
    head(){
        return{
            title:"筑牛资讯 - 首页",
            meta:[
                {hid: 'description', name: 'description', content: 'My custom description'}
            ]
        }
    },
    data(){
        return{
            carouselList: [],
            adoneList: [],
            adtwoList: [],
            hotList: [],
            videoList: [],
            liData: [],
            activeIndex: 0,
            translateX: 0,
            newsList: [],
            pageNum: 1,
            isLoading: true
        }
    },
    created(){
        // console.log("lishi");
    },
    mounted(){

    },
    methods:{
       prev: function(){
           var liDataLength =  Object.keys(this.liData).length-1;
           if(this.activeIndex <= 0){
               return
           }else{
               if(this.activeIndex < 5){
                   this.translateX = 0;
               }else if(this.activeIndex >= 5 && this.activeIndex < liDataLength){
                    this.translateX = -110 * (this.activeIndex-4);
                }
               this.activeIndex = parseInt(this.activeIndex) - 1;
           }
           let plate_id = this.activeIndex + 1;
           this.pageNum = 1;
           this.isLoading = true;
           this.inforList(plate_id,this.pageNum);
       },
       next: function(){
            var liDataLength =  Object.keys(this.liData).length-1;
            if(this.activeIndex >= liDataLength){
                return
            }else{
                if(this.activeIndex >= 5 && this.activeIndex < liDataLength){
                    this.translateX = -110 * (this.activeIndex-4);
                }else if(this.activeIndex >= liDataLength){
                    this.translateX = -110 * (liDataLength-5);
                }
                this.activeIndex = parseInt(this.activeIndex) + 1;
            }
            let plate_id = this.activeIndex + 1;
            this.pageNum = 1;
            this.isLoading = true;
            this.inforList(plate_id,this.pageNum);
       },
       theme: function(index){
           var liDataLength =  Object.keys(this.liData).length-1;
           if(index < 5){
               this.activeIndex = index;
               this.translateX = 0;
           }else if(index >= 5 && index < liDataLength){
               this.activeIndex = index;
               this.translateX = -110 * (index-4);
           }else if(index >= liDataLength){
               this.activeIndex = index;
               this.translateX = -110 * (liDataLength-5);
           }
            let plate_id = index + 1;
            this.pageNum = 1;
            this.isLoading = true;
            this.inforList(plate_id,this.pageNum);

       },
       inforList: function(id,page){
           let that = this;
           this.$request.get('/api/frontend/news/text/pc_lists',{params:{plate_id:id,current_page:page,per_page:10}}).then(function(response){
                if(response.data.msg_code == 100000){
                    if(response.data.response.data.length < 10){
                        that.isLoading = false;
                    }
                    if(page == 1){
                        that.newsList = response.data.response.data;
                    }else{
                        that.newsList = that.newsList.concat(response.data.response.data);
                    }
                }else{

                }
            }).catch(function(error){
                console.log(error);
            });
       },
       loading: function(){
           let plate_id = this.activeIndex + 1;
           this.pageNum = this.pageNum + 1;
           this.inforList(plate_id,this.pageNum);
       },
       parseFun: function(parsehtml){
           let striphtml = require('js-striphtml');
           let parsec = striphtml.stripAttr(parsehtml);
           return parsec.replace(/<[^>]+>/g,"");
       },
       inDetail: function(id){
           //this.$router.push({path:'/detail/'+id+'.html'});
           //window.open("https://news1.zhuniu.com/detail/8272.html")
           window.open("https://news.zhuniu.com/detail/" + id + ".html");
       },
       heatmore(){
           this.$router.push({name:'heat.html'});
       },
       videomore(){
           this.$router.push({name:'video.html'});
       }
    }
}
</script>

<style>
.carousel .el-carousel__indicators{
    top: 0;
    left: 7%;
}
.carousel .el-carousel__button{
    width: 14px;
    height: 6px;
    border-radius: 8px;
}
.carousel .el-carousel__indicators .is-active button{
    width: 24px;
    background: #fd7400;
}
</style>

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
        p{
            // line-height: 60px;
            height: 36px;
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
        ul {
            padding-top: 20px;
            li{
                list-style-type: disc;
                list-style-position: inside;
                color: #ccc;
                height: 30px;
                line-height: 30px;
                overflow: hidden;
                padding-left: 3px;
                &:hover{ 
                    color: #e22014;
                    cursor: pointer;
                }
                span{
                    color: #444;
                    margin-left: -5px;
                    font-weight: bold;
                    &:hover{
                        color: #e22014;
                        cursor: pointer;
                    }
                }
            }
        }
        .ad{
            margin: 20px 0px;
        }
        img{
            width: 100%;
            height: 250px;
            margin: 20px 0px;
            display: block;
            background: #ccc;
        }
        video{
            margin-top: 12px;
        }
    }
    .left{
        width: 68%;
        .carousel{
            width: 100%;
            height: 380px;
            background: #ccc;
            img{
                width: 100%;
                height: 100%;
                display: inline-block;
            }
            p{
                background: rgba(0,0,0,0.5);
                color: #fff;
                margin-top: -68px;
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 68px;
                font-size: 18px;
                text-align: left;
                line-height: 68px;
                padding-left: 30px;
            }
        }
        .news{
            .arrow{
                float: right;
                margin-top: 10px;
                a{
                    width: 20px;
                    height: 18px;
                    display: inline-block;
                    margin-right: 3px;
                    text-decoration: none;
                }
                .prev{
                    background-image: url(../assets/images/prev_icon.png);
                    background-size: 100% 100%;
                }
                .next{
                    background-image: url(../assets/images/next_icon.png);
                    background-size: 100% 100%;
                }
            }
            .Ztheme{
                // border-bottom: 2px solid #999;
                // margin-bottom: 1px;
                .theme{
                    width: 660px;
                    font-size: 14px;
                    margin-top: 15px;
                    text-align: left;
                    height: 40px;
                    overflow: hidden;
                    ul{
                        transition: all 0.3s ease 0s; 
                        /* transform: translateX(0px);
                        -webkit-transform: translateX(0px);  
                        width: 880px;*/
                        height: 40px;
                        li{
                            list-style: none;
                            width: 110px;
                            line-height: 40px;
                            float: left;
                            text-align: center;
                            cursor: pointer;
                            height: 40px;
                            font-weight: bold;
                            color: #6f6f6f;
                        }
                        .active{
                            font-size: 16px;
                            font-weight: bold;
                            color: #e22014;
                            border-bottom: 3px solid #e22014;
                            z-index: 99999;
                        }
                    }
                }
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
}
</style>

