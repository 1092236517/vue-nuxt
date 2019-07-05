<template>
<div class="loginBg">
    <div class="loginbox">
        <!-- <div class="headLogo">筑牛资讯</div> -->
        <el-tabs v-model="activeName">
            <el-tab-pane label="账户登录" name="account">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="账号" prefix-icon="el-icon-mobile-phone" v-model="account"></el-input>
                    </el-form-item>
                    <el-form-item class="clearfloat">
                        <el-input placeholder="密码" type="password" prefix-icon="el-icon-message" v-model="password"></el-input>                       
                    </el-form-item>
                    <el-form-item>
                        <el-button type="button" class="btn" @click="accountLogin">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="手机快速登录" name="pnone">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="手机号码" prefix-icon="el-icon-mobile-phone" v-model="mobile"></el-input>
                    </el-form-item>
                    <el-form-item class="clearfloat">
                        <el-input placeholder="短信验证码" prefix-icon="el-icon-message" style="width:65%;float:left;margin-right:5%" v-model="smsNumber"></el-input>  
                        <el-button v-show="show" type="button" class="btn" style="width:30%;float:left;" @click="getsms">获取验证码</el-button>
                        <span v-show="!show" class="countTime">{{count}} s</span>                      
                    </el-form-item>
                    <el-form-item>
                        <el-button type="button" class="btn" @click="mobileLogin">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div class="relink clearfloat">
            <a @click="register">注册账号</a>
            <a @click="reset">重置密码</a>
        </div>
        <div class="otherlink">
            <!-- <div>使用其他账号</div> -->
        </div>
    </div>
</div>
</template>

<script>
export default {
    layout: 'login',
    head:{
        title:"筑牛资讯"
    },
    data() {
      return {
        activeName: 'account',
        mobile:"",
        smsNumber:"",
        account:"",
        password:"",
        show:true,
        count:null,
      };
    },
    methods: {
        register(){
            this.$router.push({path:"/register.html"});
        },
        reset(){
            this.$router.push({path:"/reset.html"});
        },
        //倒计时
        getCode(){
            const TIME_COUNT = 60;
            if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
                } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                }
            }, 1000)
            }
        },
        getsms(){
            let that = this;
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(that.mobile))){ 
                that.$message({
                    message:"手机号码有误，请重填",
                    type:"warning"
                })  
                    return false; 
            } 
            let params={
                mobile:that.mobile,
                type:'login'
            }
            that.$request.get('/api/frontend/sms', {params}).then(response=>{
                that.getCode();
            }).catch(error=>{
                that.$alert(error,"警告",{
                    confirmButtonText:"确定",
                })
            })
        },
        mobileLogin(){
            let that = this;
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(that.mobile))){ 
                that.$message({
                    message:"手机号码有误，请重填",
                    type:"warning"
                })  
                    return false; 
            } 
            let params={
                mobile:that.mobile,
                code:that.smsNumber
            }
            that.$request.get('/api/frontend/sms/check', {params}).then(response=>{
                console.log(111)
                if(response.data.msg_code===100000){
                    that.$request.get('/api/frontend/login/mobile', {params:{mobile:that.mobile}}).then(response=>{
                        if(response.data.msg_code===100000){
                            if(response.data.response.token){
                                that.$router.push({name:"index"});
                                that.$store.commit("userInfo",response.data.response);
                                that.$cookies.set("token",response.data.response.token,60 * 60 * 24 * 7);
                                that.$cookies.set("photo",response.data.response.user.photo,60 * 60 * 24 * 7);
                                that.$cookies.set("name",response.data.response.user.account||response.data.response.user.mobile,60 * 60 * 24 * 7);
                            }else{
                                that.$message.warning("请先注册账号");
                            }
                        }else{
                            that.$alert(response.data.message,"警告",{
                                confirmButtonText:"确定",
                            })
                        }
                    }).catch(error=>{
                        that.$alert(error,"警告",{
                            confirmButtonText:"确定",
                        })
                    })
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(error=>{
                that.$alert(error,"警告",{
                    confirmButtonText:"确定",
                })
            })
        },
        accountLogin(){
            let that = this;
            let params={
                account:that.account,
                password:that.password
            }
            that.$request.get('/api/frontend/login/password', {params}).then(response=>{
                if(response.data.msg_code===100000){
                    if(response.data.response.token){
                        that.$router.push({name:"index"});
                        that.$store.commit("userInfo",response.data.response);
                        that.$cookies.set("token",response.data.response.token,60 * 60 * 24 * 7);
                        that.$cookies.set("photo",response.data.response.user.photo,60 * 60 * 24 * 7);
                        that.$cookies.set("name",response.data.response.user.account||response.data.response.user.mobile,60 * 60 * 24 * 7);
                    }else{
                        that.$message.warning("请先注册账号");
                    }
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(error=>{
                that.$alert(error,"警告",{
                    confirmButtonText:"确定",
                })
            })

        }
    }
}
</script>
<style>
.loginbox .el-tabs__nav{
      width: 100%;
 }
.loginbox .el-tabs__item{
    font-size: 18px;
    width: 50%;
}
</style>

<style scoped lang="less">
.loginBg{
    height: 100%;
    width:100%;
    background-image: url("../assets/images/loginBg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
} 
.loginbox{
    height: 340px;
    width: 300px;
    text-align: center;
    position: fixed;
    top: calc(50% - 180px);
    left: 52%;
    .headLogo{
        color:#e61f18;
        font-size: 40px;
        font-weight: bold;
        line-height:100px;
    }
    .countTime{
        background-color: #ffa6a6;
        color: white;
        height: 98%;
        display: inline-block;
        width: 25%;
        border-radius: 4px;
    }
    .relink{
        color: #aaa;
        margin-bottom:20px;
        a{
            cursor: pointer;
            &:first-child{
                float: left;
            }
            &:last-child{
                float: right;
            }
            &:hover{
                color:blue;
                text-decoration: underline;
            }
        }
        
    }
}
    
</style>

