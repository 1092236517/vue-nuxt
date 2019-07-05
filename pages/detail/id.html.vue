<template>
    <div class="main">
        <div class="right">
            <div>
                <p class="hot">热点<span @click="heatmore">更多</span></p>
                <!-- <img :src="JSON.parse(newsList[0].cover_img)" alt="图片" class="hotimg"> -->
                <section class="ad">
                    <el-carousel height="250px" indicator-position="none" arrow="never">
                        <el-carousel-item v-for="item in adoneList" :key="item.id">
                            <a :href="'https://'+item.redirect_url" target="_blank">
                                <img :src="JSON.parse(item.pic_url)" :alt="item.id">
                            </a>
                        </el-carousel-item>
                    </el-carousel>
                </section>
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
        <div class="left" v-for="item in txtDetail" :key="item.id">
            <h1 class="title">{{item.title}}</h1>
            <p class="time"><span>筑牛网</span>&nbsp;<span class="data-time">{{item.created_at}}</span></p>
            <!-- <video v-show="text_type=='video'" :src="videoUrl" ></video> -->
            <div v-show="text_type=='video'" class="video-player-box title_img"
                :playsinline="playsinline"
                v-video-player:myVideoPlayer="playerOptions">
            </div>
            <img v-show="text_type!='video'" v-if="item.cover_type == 'single'" :src="JSON.parse(item.cover_img)" alt="图片" class="title_img">
            <img v-show="text_type!='video'" v-else v-for="(imgitem,index) in JSON.parse(item.cover_img)" :key="index" :src="imgitem" alt="图片" class="title_img">
            <div class="content" v-html="item.content"></div>
            <div class="article-footer">
                <div class="article-tags" v-if="item.anchor_ids">
                    <a v-for="(anitem,anindex) in item.news_anchor_relation" :key="anindex" :href="anitem.anchor?'https://'+anitem.anchor.url:''" target="_blank" class="tag-link">{{anitem.anchor?anitem.anchor.name:''}}</a>
                </div>
            </div>
            <div class="share">
                <!-- <div v-if="isHiddenCode" class="sharecode">
                    <div id="qrcode"></div>
                </div> -->
                <!-- <p class="collect"><img src="../../assets/images/pinglun.png" alt="评论"><span>0</span><img src="../../assets/images/soucang.png" alt="收藏"><span>1</span></p> -->
                <!-- <p class="shareto"><span>分享到</span><img src="../../assets/images/weixin.png" @mouseenter="isHiddenCode=true" @mouseleave="isHiddenCode=false" alt="微信"><img src="../../assets/images/weibo.png" @click="wbShare" alt="微博"></p> -->
                <p class="shareto"><span>分享到</span>
                    <social-sharing url="https://news.zhuniu.com" :title="item.title" :description="item.content" @open="pc_count(item.id,item.text_type,'transmit')" inline-template>
                        <network network="weibo">
                            <img style="width: 36px;height: 36px;margin-left: 10px;float: left;" src="../../assets/images/weibo.png" alt="微博">
                        </network>
                    </social-sharing>
                </p>
            </div>
            <p class="like givelike" @click="likeFun(item.id)" >
                <!-- <img v-if="isZan" src="../../../assets/images/zan.png" alt="赞"> -->
                <img src="../../assets/images/zan.png" alt="赞">
                <span>{{item.vote_num||0}}&nbsp;赞</span>
            </p>
            <p class="commentnum">{{item.comment_num||0}}&nbsp;条评论</p>
            <div class="comment">
                <textarea placeholder="留下您的观点~" maxlength="200" id="textid" v-model="comment" @input="commentLenFun"></textarea>
                <p>{{commentLen}}/200</p>
            </div>
            <button class="btn_submit" @click="submit(item.id)">提交评论</button>
            <div class="commentshow" >
                <div class="commenttitle">全部评论</div>
                <div v-for="comment in commentList" :key="comment.id" class="usercomment">
                    <img :src="comment.user.photo?comment.user.photo:require('../../assets/images/loginLogo.png')" alt="" class="header">
                    <p class="name">{{comment.user?(comment.user.account||comment.user.mobile):"筑牛君"}}<label class="usertime">{{comment.created_at}}</label></p>
                    <p class="text">{{comment.comment}}</p>
                </div>
            </div>
        </div>
        <!-- SEO优化 -->
        <seo></seo>
    </div>
</template>

<script>
import SocialSharing from 'vue-social-sharing'
import axios from 'axios'
// import "video.js/dist/video-js.css"
// import {videoPlayer} from 'vue-video-player'
import Seo from '../../components/SEO'
export default {
    name:"index-detail-id",
    components:{SocialSharing,Seo},
    async asyncData ({params,app,store}) {
        let [response1,response2,response3,response4] = await Promise.all([
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{per_page:10}}),
            app.$request.get('/api/frontend/news/text/pc_lists',{params:{id:params.id}}),
            app.$request.get('/api/frontend/news/comment/lists',{params:{news_id:params.id}}).then(response=>{
                let data = response.data.response;
                if(!data){
                    data.user={}
                }
                return data
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
        ]);
        return{
            id:params.id,
            text_type:response2.data.response.data[0].text_type,
            videoUrl:response2.data.response.data[0].video_url,
            cover_img:response2.data.response.data[0].cover_img,
            newsList: response1.data.response.data,
            txtDetail: response2.data.response.data,
            commentList: response3.data,
            adoneList: response4
        }
        // called every time before loading the component
    },
    fetch () {
        // The fetch method is used to fill the store before rendering the page
    },
    head(){
        const seoInfo = this.txtDetail[0].seo_relation;
        const seoTitle = this.txtDetail[0].seo_title;
        const titleCategory = seoInfo.title_category ? seoInfo.title_category.name : '';
        const titlePlate = seoInfo.title_plate ? seoInfo.title_plate.name : '';
        const titleSlogan = seoInfo.title_slogan ? seoInfo.title_slogan.name : '';
        const titleType = seoInfo.title_type ? seoInfo.title_type.name : '';
        const seoKeywords = this.txtDetail[0].seo_keywords;
        const keywordsCategory = seoInfo.keywords_category ? seoInfo.keywords_category.name : '';
        const keywordsPlate = seoInfo.keywords_plate ? seoInfo.keywords_plate.name : '';
        const keywordsSlogan = seoInfo.keywords_slogan ? seoInfo.keywords_slogan.name : '';
        const keywordsType = seoInfo.keywords_type ? seoInfo.keywords_type.name : '';
        const seoDescription = this.txtDetail[0].seo_description;
        const descriptionCategory = seoInfo.description_category ? seoInfo.description_category.name : '';
        const descriptionPlate = seoInfo.description_plate ? seoInfo.description_plate.name : '';
        const descriptionSlogan = seoInfo.description_slogan ? seoInfo.description_slogan.name : '';
        const descriptionType = seoInfo.description_type ? seoInfo.description_type.name : '';
        return{
            title:  `${seoTitle},${titleCategory},${titlePlate},${titleSlogan},${titleType}`,
            meta:[
                {hid: 'keywords', name: 'keywords', content: `${seoKeywords},${keywordsCategory},${keywordsPlate},${keywordsSlogan},${keywordsType}`},
                {hid: 'description', name: 'description', content:`${seoDescription},${descriptionCategory},${descriptionPlate},${descriptionSlogan},${descriptionType}`}
            ]
        }
    },
    data(){
        return{
            id:"",
            text_type:"",
            newsList: [],     //right
            adoneList:[],
            txtDetail: [],    //left
            isHiddenCode: false,
            QueryDetail: '',   //二维码配置
            isZan: false,
            comment: '',
            commentLen: 0,
            dialogVisible: true,
            commentList: [],
            videoUrl:"",
            playsinline: true,
            playerOptions: {
                width:'630px',
                height:'406px',
                autoplay: true,
                muted: true,
                language: 'cn',
                // playbackRates: [0.7, 1.0, 1.5, 2.0],
            }
        }
    },
    created(){
        if(this.text_type=="video"){
            let vid = this.getvideoid(this.videoUrl);
            this.getVideoInfo(vid);
        }
    },
    mounted(){
        this.pc_count(this.id,this.text_type,"read")
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods:{
        heatmore(){
            this.$router.push({name:'heat.html'});
        },
        inDetail: function(id){
           this.$router.push({path:'/detail/'+id+'.html'});
           //window.location.reload();
        },
    //     wxShare(){

    //     },
    //     //动态生成二维码
    //     useqrcode(){ 
    //     //生成的二维码内容，可以添加变量
    // 　　　　this.QueryDetail='fghgjhkjhkl';
    //        let canvas = document.getElementById('canvas');
    //         QRCode.toCanvas(canvas, this.QueryDetail, function (error) {
    //             if (error) console.error(error)
    //             console.log('success!');
    //         })
    //     },
        wbShare(){
            // let flink = JSON.parse(this.txtDetail[0].cover_img);
            // window.open('http://service.weibo.com/share/share.php?url=' + encodeURIComponent(document.location) + '?sharesource=weibo&title=' + this.txtDetail[0].title + '&pic=' + flink + '&appkey=**********',"_blank","scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes,width=650px,height=520px");
        },
        likeFun: function(id){
            let that = this;
            if(that.$cookies.get("token")){
                // console.log(that.$store.state.token);
                // if(this.isZan == false){
                    this.$request.get('/api/frontend/news/text/vote',{params:{token: that.$cookies.get("token"),id:id}}).then(function(response){
                        if(response.data.msg_code == 100000){
                            //that.isZan = true;
                            that.txtDetail[0].vote_num = that.txtDetail[0].vote_num + 1;
                            that.count(id,that.text_type,"vote");
                        }else{
                            that.$alert(response.data.message,"警告",{
                                confirmButtonText:"确定",
                            })
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                //}
            }else{
                //that.$router.push({name:"login.html"});
                that.$message({
                    message:"请先登录用户信息",
                    type:"warning"
                }) 
            }
        },
        commentLenFun: function(){
            let textVal = this.comment.length;
            this.commentLen = textVal;
        },
        submit: function(id){
            let that = this;
            if(that.$cookies.get("token")){
                if(that.comment){
                    this.$request.get('/api/frontend/news/text/comment',{params:{token: that.$cookies.get("token"),id:id,comment:that.comment}}).then(function(response){
                        if(response.data.msg_code == 100000){
                            that.comment = '';
                            that.count(id,that.txtDetail[0].text_type,"comment");
                        }else{
                            that.$alert(response.data.message,"警告",{
                                confirmButtonText:"确定",
                            })
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                }else{
                    alert("评论内容不能为空！");
                }
            }else{
                //that.$router.push({name:"login.html"});
                that.$message({
                    message:"请先登录用户信息",
                    type:"warning"
                }) 
            }
        },
        getcommentList(id){
            let that = this;
           this.$request.get('/api/frontend/news/comment/lists',{params:{news_id:id}}).then(function(response){
                if(response.data.msg_code == 100000){
                    that.commentList = response.data.response;
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(function(error){
                console.log(error);
            });
        },
        getDetail(id){
            let that = this;
           this.$request.get('/api/frontend/news/text/pc_lists',{params:{id:id}}).then(function(response){
                if(response.data.msg_code == 100000){
                    that.txtDetail = response.data.response.data;
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(function(error){
                console.log(error);
            });
        },
        //计数
        count(id,text_type,type){
            let that = this;
            let params={
                token:that.$cookies.get("token"),
                id:id,
                text_type:text_type,
                type:type
            }
            that.$request.post("/api/frontend/news/text/count",params).then(response=>{
                if(response.data.msg_code===100000){
                    console.log("计数成功");
                    that.getcommentList(id);
                    that.getDetail(id);
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(function(error){
                console.log(error);
            });

        },
        pc_count(id,text_type,type){
            let that = this;
            let params={
                id:id,
                text_type:text_type,
                type:type
            }
            that.$request.post("/api/frontend/news/text/pc_count",params).then(response=>{
                if(response.data.msg_code===100000){
                    console.log("计数成功");
                    that.getcommentList(id);
                    that.getDetail(id);
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(function(error){
                console.log(error);
            });

        },
        //视频播放
        getvideoid(video_url){
            let arrvid=[];
            arrvid = video_url.split("vid=");
            return arrvid[1];
        },
        getVideoInfo: function (vid) {
            var that = this;
            //var urlString = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;
            that.$request.post("/api/frontend/news/video/info",{
                vid:vid
            }).then(res=>{
                var dataJson = res.data.response.replace(/QZOutputJson=/, '') + "qwe";
                var dataJson1 = dataJson.replace(/;qwe/, '');
                var data = JSON.parse(dataJson1);
                var fn_pre = data.vl.vi[0].lnk
                var host = data['vl']['vi'][0]['ul']['ui'][0]['url']
                var streams = data['fl']['fi']
                var seg_cnt = data['vl']['vi'][0]['cl']['fc']
                if (parseInt(seg_cnt) == 0) {
                    seg_cnt = 1
                }
                var best_quality = streams[streams.length - 1]['name']
                var part_format_id = streams[streams.length - 1]['id']
                for (var i = 1; i < (seg_cnt + 1); i++) {
                    var filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
                    that.requestVideoUrls(part_format_id, vid, filename, 'index' + i,host);
                }
            }).catch(error=>{
                console.log(error)
                that.$alert("视频地址解析不到vid","警告",{
                    confirmButtonText:"确定",
                })
            })
        },
        requestVideoUrls: function (part_format_id, vid, fileName, index, host) {
            //var keyApi = "https://vv.video.qq.com/getkey?otype=json&platform=11&format=" + part_format_id + "&vid=" + vid + "&filename=" + fileName + "&appver=3.2.19.333"
            var that = this;
            that.$request.post("/api/frontend/news/video/key",{
                part_format_id:part_format_id,
                vid:vid,
                fileName:fileName
            }).then(res=>{
                var dataJson = res.data.response.replace(/QZOutputJson=/, '') + "qwe";
                var dataJson1 = dataJson.replace(/;qwe/, '');
                var data = JSON.parse(dataJson1);
                if (data.key != undefined) {
                    var vkey = data['key']
                    var url = host + fileName + '?vkey=' + vkey;
                    var part_urls;
                    part_urls = String(url);
                    that.playerOptions= {
                        width:'630px',
                        height:'406px',
                        autoplay: true,
                        muted: true,
                        language: 'cn',
                        // playbackRates: [0.7, 1.0, 1.5, 2.0],
                        sources: [{
                            //type: "",
                            // mp4
                            src: part_urls,
                            // webm
                            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                        }],
                        poster: JSON.parse(that.cover_img)[0],
                    }
                }
            }).catch(error=>{
                console.log(error)
            });
        },
    }
}
</script>
<style>
.video-js {
    width: 100%;
    height: 100%;
}
</style>
<style scoped>
.content>>>img{
    max-width: 80%;
}
.sharelogo{
    width: 36px;
    height: 36px;
    margin-left: 10px;
    float: left;
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
                        background-image: url(../../assets/images/comment_icon.png);
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
        .title{
            font-size: 28px;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        .time{
            text-align: left;
            font-size: 14px;
            padding-left: 10px;
            margin-bottom: 25px;
            span{
                float:left;
                display: inline-block;
                line-height: 30px;
                margin-right: 10px;
                font-size: 16px;
            }
            .data-time{
                vertical-align: middle;
                font-size: 12px;
                color: #999;
            }
        }
        .title_img{
            width: 630px;
            height: 406px;
            // background: #ccc;
            display: inline-block;
            margin-bottom: 30px;
        }
        .content{
            margin-bottom: 60px;
            text-align: left;
        }
        .article-footer{
            margin-top:16px;
            .article-tags{
                border-top:1px solid #f2f2f2;
                overflow:hidden;
                margin:0 0 40px 0;
                padding-top:20px;
                text-align: left;
                a{
                    color:#999;
                    height:24px;
                    line-height:24px;
                    font-size:12px;
                    vertical-align:middle;
                    padding:0 10px;
                    background:#f5f6fa;
                    display:inline-block;
                    margin-right:20px;
                    text-decoration: none;
                    &:hover {
                        color:#f60
                    }
                }
                :last-child {
                    margin-right:0px
                }
            }
        }
        .share{
            background: #fafafa;
            height: 58px;
            padding: 11px 5px;
            color: #6c6c6c;
            .sharecode{
                background: rgba(255,255,255,0.6);
                padding: 8px 8px;
                position: absolute;
                margin: -125px 0px 0px 20px;
                box-shadow: 0px 0px 1px 1px #ccc;
                div{
                    width: 100px;
                    height: 100px;
                    background: #e22014;
                }
            }
            .collect{
                float: right;
                line-height: 36px;
                span{
                    font-size: 12px;
                    float: left;
                }
                img{
                    width: 30px;
                    height: 30px;
                    margin: 3px 8px 0px 15px;
                    float: left;
                    padding: 3px 3px;
                }
            }
            .shareto{
                font-size: 16px;
                line-height: 36px;
                span{
                    float: left;
                }
                img{
                    width: 36px;
                    height: 36px;
                    margin-left: 10px;
                    float: left;
                }
                
            }
        }
        .like{
            font-size: 13px;
            // color: #fd3c33;
            color: #6c6c6c;
            margin-top: 30px;
            cursor: pointer;
            img{
                width: 48px;
                height: 48px;
                display: inline-block;
                margin-right: 15px;
                border-radius: 48px;
                padding: 6px;
            }
            span{
                line-height: 38px;
                position: absolute;
                margin-top: 10px;
            }
        }
        .givelike{
            color: #fd3c33;
        }
        .commentnum{
            font-size: 20px;
            color: #000;
            line-height: 70px;
            text-align: left;
            margin-top: 100px;
            padding-left: 10px;
            font-weight: bold;
        }
        .comment{
            background: #fafafa;
            padding: 10px 10px;
            color: #6c6c6c;
            textarea{
                resize: none;
                width: 100%;
                height: 88px;
                border: 0px;
                background: #fafafa;
                outline: none;
                font-size: 14px;
                line-height: 22px;
            }
            p{
                font-size: 12px;
                line-height: 12px;
                text-align: right;
            }
        }
        .btn_submit{
            float: right;
            width: 80px;
            height: 30px;
            line-height: 30px;
            border: 0px;
            border-radius: 30px;
            color: #fff;
            background: #fd3c33;
            margin-top: 10px;
        }
        .commentshow{
            margin-top: 50px;
            .commenttitle{
                font-size: 20px;
                color: #000;
                line-height: 70px;
                text-align: left;
                padding-left: 10px;
                font-weight: bold;
            }
            .usercomment{
                font-size: 14px;
                border-radius: 3px;
                padding: 10px 10px 15px 50px;
                text-align: left;
                /* box-shadow: 0px 0px 16px 0px #ddd; */
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
                .header{
                    width: 30px;
                    height: 30px;
                    background: paleturquoise;
                    float: left;
                    margin-left: -40px;
                    border-radius: 30px;
                }
                .name{
                    color: #6c6c6c;
                    line-height: 30px;
                    .usertime{
                        font-size: 12px;
                        float: right;
                        color: #999;
                    }
                }
                .text{
                    width: 100%;
                    word-wrap: break-word;
                    word-break: break-all;
                    overflow: hidden;
                }
            }
        }
    }
}
</style>

