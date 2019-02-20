<style lang="less">
    input{
        font-size: 11px;
    }
</style>

<template>


    <el-col :span="24" style="background-color: white" >

        <h2 style="margin-top: 30px;margin-left: 10px;margin-bottom: 50px">
            修改密码
        </h2>

        <el-col :span="10" :offset="6">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">

                <el-form-item label="原密码" prop="pwdCur">
                    <el-input v-model="form.pwdCur" type="password"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="pwdNew">
                    <el-input v-model="form.pwdNew"  type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="pwdConfirm">
                    <el-input v-model="form.pwdConfirm"  type="password"></el-input>
                </el-form-item>


            </el-form>

        </el-col>

        <el-col :span="24" :offset="10">
            <el-button @click="savePassInfo()" type="primary" style="margin-top: 20px;margin-bottom: 10px" >提交</el-button>
            <el-button @click="cancle()"  style="margin-top: 20px;margin-bottom: 10px" >取消</el-button>
        </el-col>

    </el-col>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        components: {
        },
        props: {
            userName: {
                type: String
            }
        },
        data () {
            return {
                form: {
                    userName: '',
                    pwdCur: '',
                    pwdNew: '',
                    pwdConfirm: ''
                },
                rules: {
                    pwdCur: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    pwdNew: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    pwdConfirm: [
                        {required: true, message: '请输入确认密码', trigger: 'blur'}
                    ]
                }
            };
        },
        watch: {
            userName: function (val, oldVla) {
                this.form.pwdCur = "";
                this.form.pwdNew = "";
                this.form.pwdConfirm = "";
            }
        },
        created() {
            this.form.pwdCur = "";
            this.form.pwdNew = "";
            this.form.pwdConfirm = "";
        },
        methods: {
            savePassInfo: function () {
                // alert(Cookies.get('userName'));
                var _this = this;
                _this.form.userName = this.userName;
                this.$myHttp({
                    method: 'post',
                    url: _this.permissionPrefix + '/microarch/sys/sysuser/checkPassword',
                    data: {
                        'entity': {
                            'userName': _this.form.userName,
                            'password': _this.form.pwdCur
                        }
                    }
                }).then(res => {
                    console.log('res', res.data);
                    if (res.data) {
                        if (this.ruleForm) {
                            if (_this.form.pwdNew == _this.form.pwdConfirm) {
                                if ((_this.form.pwdNew == _this.form.pwdCur)) {
                                    this.$message({
                                        type: 'info',
                                        message: '新密码与原密码一样，请重新输入或取消'
                                    });
                                } else {
                                    this.$myHttp({
                                        method: 'post',
                                        url: this.prefix + '/microarch/sys/sysuser/changePassword',
                                        data: {
                                            'entity': {
                                                'userName': _this.form.userName,
                                                'password': _this.form.pwdNew
                                            }
                                        }
                                    }).then(res => {
                                        // 成功回调方法
                                        this.$message({
                                            type: 'success',
                                            message: '修改密码成功，请重新登陆'
                                        });
                                        this.form.pwdCur = "";
                                        this.form.pwdNew = "";
                                        this.form.pwdConfirm = "";
                                        this.$emit('closePage');
                                        // window.location = this.prefix + 'sys/logout';
                                        this.$router.push({
                                            name: 'login'
                                        });
                                        sessionStorage.clear();
                                        localStorage.clear();
                                        // console.log('frontRouters:',this.$store.state.app.routers)
                                        this.$store.state.app.routers.splice(1);
                                        this.$store.commit('clearAllTags');// 清除上次登录后打开的标签
                                        // console.log('afterRouters:',this.$store.state.app.routers)
                                    }).catch(() => {
                                        this.$message({
                                            type: 'info',
                                            message: '修改密码失败'
                                        });
                                    });
                                }
                            } else {
                                this.$message({
                                    type: 'info',
                                    message: '确认密码与新密码不一致，请重新输入'
                                });
                            }
                        }
                    } else {
                        this.$message({
                            type: 'info',
                            message: '原始密码错误，请重新输入'
                        });
                    }
                });
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.ruleForm = true;
                    }
                });
            },
            cancle: function () {
                this.$router.push({
                    name: 'login'
                });
                this.form.pwdCur = "";
                this.form.pwdNew = "";
                this.form.pwdConfirm = "";
                this.$emit('closePage');
            }

        },
        mounted () {
            /* console.log(Cookies.get('user')); */

        }
    };
</script>

<style>

</style>
