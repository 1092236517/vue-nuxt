<template>
<div class="resetBg">
    <div class="loginbox">
        <div class="headLogo">筑牛资讯</div>
        
        <div v-show="!isaccount">
            <el-form :rules="rules" :model="form">
                <el-form-item><span class="tips">重置账号密码</span></el-form-item>
                <el-form-item>
                    <el-input placeholder="账号" v-model="account" :disabled="hasaccount"></el-input>
                </el-form-item>
                <div style="color:red;font-size:12px;text-align:left;margin-bottom:10px;">密码必须包括数字，大小写的英文字母</div>
                <el-form-item class="clearfloat" prop="password">
                    <el-input placeholder="新密码（密码长度8-20个字符）" type="password" v-model="form.password"></el-input>                       
                </el-form-item>
                <el-form-item class="clearfloat" prop="repassword">
                    <el-input placeholder="确认新密码" type="password" v-model="form.repassword"></el-input>                       
                </el-form-item>
                <el-form-item>
                    <el-button type="button" class="btn" @click="mobileLogin">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-show="isaccount">
            <el-form>
                <el-form-item><span class="tips">手机号验证</span></el-form-item>
                <el-form-item>
                    <el-input placeholder="手机号码" v-model="mobile"></el-input>
                </el-form-item>
                <el-form-item class="clearfloat">
                    <el-input placeholder="短信验证码" style="width:70%;float:left;margin-right:5%" v-model="smsNumber"></el-input>  
                    <el-button v-show="show" type="button" class="btn" style="width:25%;float:left;" @click="getsms">获取验证码</el-button>
                    <span v-show="!show" class="countTime">{{count}} s</span>                      
                </el-form-item>
                <el-form-item>
                    <el-button type="button" class="btn" @click="checksms">提交登录</el-button>
                </el-form-item>
            </el-form>
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
        isaccount: true,
        hasaccount:false,
        mobile:"",
        smsNumber:"",
        account:"",
        form:{
            password:"",
            repassword:""
        },
        show:true,
        count:null,
        rules:{
            password: [
                { required: true, message: '请输入正确的密码', trigger: 'blur' },
                { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
            ],
            repassword: [
                { required: true, message: '请输入正确的重复密码', trigger: 'blur' },
                { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
            ],
        }
      };
    },
    methods: {
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
                type:'reset'
            }
            that.$request.get('/api/frontend/sms', {params}).then(response=>{
                if(response.data.msg_code===100000){
                    that.getCode();
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
        checksms(){
            let that = this;
            if(that.mobile&&that.smsNumber){
                let params={
                    mobile:that.mobile,
                    code:that.smsNumber
                }
                that.$request.get('/api/frontend/sms/check', {params}).then(response=>{
                    if(response.data.msg_code===100000){
                        that.$request.get("/api/frontend/login/member_info",{params:{mobile:that.mobile}}).then(response=>{
                            if(response.data.msg_code===100000){
                                that.isaccount=false;
                                that.hasaccount=true;
                                that.account = response.data.response.account;
                            }else{
                                that.$message({
                                    message:"该手机号不存在，请重新注册",
                                    type:"warning"
                                })
                            }
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
            }else{
                that.$message({
                    message:"请输入手机号或验证码",
                    type:"warning"
                });
            }
            
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
            // if(!/(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(that.password)){
            //     that.$message({
            //         message:"请输入正确的密码",
            //         type:"warning"
            //     })  
            //         return false; 
            // }
            if(that.form.password!=that.form.repassword){
                that.$message({
                    message:"请输入正确的重复密码",
                    type:"warning"
                })  
                    return false; 
            }
            that.$request.get('/api/frontend/login/modify_password', {params:{account:that.account,password:that.form.password,re_password:that.form.repassword}}).then(response=>{
                if(response.data.msg_code===100000){
                    if(response.data.response.token){
                        that.$router.push({name:"index"});
                        that.$store.commit("userInfo",response.data.response);
                        that.$cookies.set("token",response.data.response.token,60 * 60 * 24 * 7);
                        that.$cookies.set("photo",response.data.response.user.photo,60 * 60 * 24 * 7);
                        that.$cookies.set("name",response.data.response.user.account||response.data.response.user.mobile,60 * 60 * 24 * 7);
                    }else{
                        that.$router.push({name:"login.html"})
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
        },

    }
}
</script>
<style scoped lang="less">
.resetBg{
    height: 100%;
    width:100%;
    background-image: url("../assets/images/resetBg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}  
.loginbox{
    height: 500px;
    width: 400px;
    text-align: center;
    position: absolute;
    top: calc(50% - 250px);
    left: calc(50% - 200px);
    .headLogo{
        color:#e61f18;
        font-size: 40px;
        font-weight: bold;
        line-height:100px;
    }
    .tips{
        font-size: 18px;
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

