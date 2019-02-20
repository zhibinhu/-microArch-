<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
        <el-dialog id="changePassword" :visible.sync="dialogVisible" append-to-body  :modal-append-to-body="false" >
            <change-password :userName="form.userName" @closePage='close'></change-password>
        </el-dialog>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
import util from '../libs/util.js';
import changePassword from '@/permissionViews/popChangePassword';
export default {
    components: {
        changePassword
    },
    data () {
        return {
            dialogVisible: false,
            form: {
                userName: '',
                password: '123456'
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            var that = vm;
            // 防止火狐浏览器连续多次刷新页面后跳登录页
            if (sessionStorage.getItem('token')) {
                let pathArr = JSON.parse(localStorage.getItem('pageOpenedList'));
                if (pathArr.length >= 2) {
                    let currentPageName = localStorage.getItem('currentPageName');
                    that.$router.push({
                        name: currentPageName
                    });
                } else {
                    that.$router.push({
                        name: 'home_index'
                    });
                }
            }
        });
    },
    mounted () {
        window.onload = function () {
            if (!window.sessionStorage['tempFlag']) {
                // console.log('关闭了！')
                location.reload(); // 不能省，强制跳到登陆页
            } else {
                window.sessionStorage.removeItem('tempFlag');
                // console.log('刷新了---')
            }
        };
        window.onunload = function () {
            window.sessionStorage['tempFlag'] = true;
        };
        window.onbeforeunload = function () {
            window.sessionStorage['tempFlag'] = true;
        };
    },
    methods: {
        close() {
            this.dialogVisible = false;
        },
        handleSubmit () {
            var _this = this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    axios({
                        method: 'post',
                        timeout: 20000000,
                        withCredentials: true,
                        url: this.loginPrefix + '/microarch/sys/login',
                        data: {
                            'userName': this.form.userName,
                            'password': this.form.password
                        }
                    }).then(res => {
                        // 成功回调方法
                        console.log('login--res--', res);
                        if (res.data) {

                            if(res.data.code == '28002') {
                                _this.$message({
                                    message: '密码过期,请修改密码！',
                                    type: 'warning',
                                    duration: 1000,
                                    onClose: () => {
                                        this.dialogVisible = true;
                                    }
                                });
                            }else{
                                sessionStorage.token = res.data.token;
                                // sessionStorage.uid = res.data.uid;
                                sessionStorage.userName = this.form.userName;
                                if (sessionStorage.token) {
                                    // 调用方法，动态生成路由
                                    util.ajax = axios.create({
                                        timeout: 30000,
                                        headers: {Authorization: 'Sys ' + sessionStorage.getItem('token')}
                                    });
                                    util.initRouter(this);
                                    console.log('this.$store.state.app.routers[1]---', this.$store.state.app.routers[1]);
                                    this.$myHttp({
                                        method: 'POST',
                                        url: this.prefix + '/microarch/sys/sysuser/findCname',
                                        data: {'entity': {'userName': this.form.userName}}
                                    }).then(rescname => {
                                        Cookies.set('user', rescname.data.rows[0].cname);
                                        _this.$router.push({
                                            name: 'home_index'
                                        });
                                    })
                                } else {
                                    this.$router.replace('/login');
                                }
                            }

                        } else {
                            alert('无token值返回！');
                        }
                    }).catch(function (err) {
                        console.log('errr---', err);
                        _this.$Notice.warning({
                            title: '账号或密码错误',
                            desc: '请输入正确账号或密码！'
                        });
                    });
                }
            });
        }

    }
};
</script>

<style>

   #changePassword .el-dialog__header {
        padding: 0px 20px 10px;
    }
   #changePassword .el-dialog__body {
       padding: 0px 0px;
       color: #606266;
       line-height: 24px;
       font-size: 14px;
   }
</style>
