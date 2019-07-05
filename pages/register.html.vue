<template>
<div class="resetBg">
    <div class="loginbox">
        <div class="headLogo">筑牛资讯</div>
        
        <div v-show="!isaccount">
            <el-form :rules="rules" :model="form">
                <el-form-item><span class="tips">账号密码设置</span></el-form-item>
                <el-form-item>
                    <el-input placeholder="用户名" v-model="account"></el-input>
                </el-form-item>
                <div style="color:red;font-size:12px;text-align:left;margin-bottom:10px;">密码必须包括数字，大小写的英文字母</div>
                <el-form-item class="clearfloat" prop="password">
                    <el-input placeholder="密码" type="password" v-model="form.password"></el-input>                       
                </el-form-item>
                <el-form-item class="clearfloat" prop="repassword">
                    <el-input placeholder="确认密码" type="password" v-model="form.repassword"></el-input>                       
                </el-form-item>
                <el-form-item>
                    <el-button type="button" class="btn" @click="mobileLogin">提交登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-show="isaccount">
            <el-form>
                <el-form-item><span class="tips">手机号绑定</span></el-form-item>
                <el-form-item>
                    <el-input placeholder="手机号码" v-model="mobile"></el-input>
                </el-form-item>
                <el-form-item class="clearfloat">
                    <el-input placeholder="短信验证码" style="width:70%;float:left;margin-right:5%" v-model="smsNumber"></el-input>  
                    <el-button v-show="show" type="button" class="btn" style="width:25%;float:left;" @click="getsms">获取验证码</el-button>
                    <span v-show="!show" class="countTime">{{count}} s</span>                      
                </el-form-item>
                <el-form-item>
                    <el-button type="button" class="btn" @click="sub">提交</el-button>
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
        mobile:"",
        smsNumber:"",
        account:"",
        form:{
            password:"",
            repassword:"",
        },
        show:true,
        count:null,
        rules:{
            password: [
                { required: true, message: '请输入正确的密码', trigger: 'blur' },
                { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
            ],
            repassword: [
                { required: true, message: '请输入正确的密码', trigger: 'blur' },
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
        sub(){
            let that = this;
            let params={
                mobile:that.mobile,
                code:that.smsNumber
            }
            that.$request.get('/api/frontend/sms/check', {params}).then(response=>{
                if(response.data.msg_code===100000){
                    this.isaccount=false;
                }else{
                    that.$alert(response.data.message,"警告",{
                        confirmButtonText:"确定",
                    })
                }
            }).catch(error=>{
                that.$alert(error,"警告",{
                    confirmButtonText:"确定",
                })
            });
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
                type:'register'
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
        mobileLogin(){
            let that = this;
            if(that.form.password!=that.form.repassword){
                that.$message({
                    message:"请输入正确的重复密码",
                    type:"warning"
                })  
                    return false; 
            }
            that.$request.get('/api/frontend/login/register', {params:{account:that.account,password:that.form.password,mobile:that.mobile}}).then(response=>{
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

