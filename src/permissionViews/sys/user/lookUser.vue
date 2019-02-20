<template>
    <div>
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">用户信息</span>
                            </h3>
                        </div>
                    </template>
                    <div class="moduleWhite" style="margin-top:20px;">
            <el-row type="flex" class="row-bg" justify="space-around" style="background: #fff;">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">所在部门：</span>{{ruleForm.deparment}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">
                    <span class="userInfoTit">登录名：</span>{{ruleForm.loginName}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">姓名：</span>{{ruleForm.fullName}}
                </div></el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-around" style="background: #fff;">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">性别：</span>{{ruleForm.sex}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">
                    <span class="userInfoTit">出生日期：</span>{{ruleForm.birthday}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">移动电话：</span>{{ruleForm.mobile}}
                </div></el-col>
            </el-row>
            <div class="sliceLine"></div>
            <el-row type="flex" class="row-bg" justify="space-around" style="background: #fff;">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">固定电话：</span>{{ruleForm.tel}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">邮件：</span>{{ruleForm.mail}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">
                    <span class="userInfoTit">用户编码：</span>{{ruleForm.userCode}}
                </div></el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-around" style="background: #fff;">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">状态：</span>{{ruleForm.status}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">用户类型：</span>{{ruleForm.userType==1?'内部':'外部'}}
                </div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">
                    <span class="userInfoTit">主管：</span>{{ruleForm.mainManager}}
                </div></el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-around" style="background: #fff;">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <span class="userInfoTit">职位：</span>{{ruleForm.positionName}}
                </div></el-col>
                <el-col :span="16"><div class="grid-content bg-purple" style="text-align: left;">
                    <span class="userInfoTit">角色：</span>{{ruleForm.roles}}
                </div></el-col>
            </el-row>
                    </div>
                </el-collapse-item>
                <hr/>
            <el-collapse-item style="padding:0 20px;background: #fff;margin-bottom: 50px;" name="2">
                <template slot="title">
                    <div class="moduleTit">
                        <h3>
                            <span class="infoTit">用户扩展信息</span>
                        </h3>
                    </div>
                </template>
                <div class="moduleWhite" style="margin-top:20px;">
                    <my-custom-items cfObjCode="SYS_USER_EXT_" :mid="ruleForm.id" :dataUrl="extDataUrl" showType="view">
                    </my-custom-items>
                </div>
            </el-collapse-item>
            </el-collapse>

            <el-row type="flex" class="row-bg" justify="space-around" style="background: #fff;">
                <el-col :span="6"><div class="grid-content bg-purple" style="text-align: left;"></div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple" style="text-align: center;">
                    <el-button class="el-icon-back" size="medium" round @click="goBack">返回</el-button>
                </div>
                </el-col>
                <el-col :span="6"><div class="grid-content bg-purple" style="text-align: left;"></div></el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import myCustomItems from '@/components/myCustomItems';
export default {
    components: {myCustomItems},
    data () {
        return {
            activeNames: ['1', '2'],
            extDataUrl: '/microarch/sys/userext/view',
            ruleForm: {
                id: '',
                deparment: '',
                status: '启用',
                fullName: '',
                sex: '男',
                loginName: '',
                mobile: '',
                birthday: '',
                mail: '',
                userCode: '',
                userType: '',
                mainManager: '',
                position: '',
                positionName: '',
                roles: ''
            }
        };
    },
    mounted () {
        this.backfilleditData();
    },
    created () {
        this.ruleForm.id = this.$route.params.id;
    },
    methods: {
        backfilleditData () {
            if (this.$route.params.id) {
                sessionStorage.setItem('look_dataId', this.$route.params.id);
            }
            var getDataId = sessionStorage.getItem('look_dataId');
            var dataId = this.$route.params.id ? this.$route.params.id : getDataId;
            if (dataId) {
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/sysuser/view',
                    data: {
                        'entity': {
                            'id': getDataId
                        }
                    }
                }).then(res => {
                    console.log('edit--------', res);
                    var backData = res.data.entity;
                    this.ruleForm.id = backData.id;
                    this.ruleForm.deparment = backData.orgs && backData.orgs.length > 0 ? backData.orgs[0].orgName : '';
                    this.ruleForm.status = backData.status == 'Y' ? '启用' : backData.status == 'N' ? '停用' : '';
                    this.ruleForm.fullName = backData.cname ? backData.cname : '';
                    this.ruleForm.sex = backData.gender;
                    this.ruleForm.loginName = backData.userName ? backData.userName : '';
                    this.ruleForm.mobile = backData.mobile ? backData.mobile : backData.tel ? backData.tel : '';
                    this.ruleForm.tel = backData.tel ? backData.tel : '';
                    this.ruleForm.birthday = backData.birthday ? backData.birthday.split(' ')[0] : '';
                    this.ruleForm.mail = backData.email ? backData.email : '';
                    this.ruleForm.userCode = backData.userCode ? backData.userCode : '';
                    this.ruleForm.userType = backData.userType ? backData.userType : '';
                    this.ruleForm.mainManager = backData.directManager ? backData.directManager : '';
                    this.ruleForm.position = backData.position ? backData.position : '';
                    this.getPost();// 根据职位ID获取职位名称
                    if (backData.roles && backData.roles.length) {
                        var roleData = [];
                        for (var i = 0; i < backData.roles.length; i++) {
                            roleData.push(backData.roles[i].roleName);
                        }
                        this.ruleForm.roles = roleData.join(',');
                    }
                });
            }
        },
        goBack () {
            this.$router.push({
                name: 'sys/user/userManagement'
            });
        },
        getPost () {
            var that = this;
            this.$myHttp({
                method: 'post',
                url: this.permissionPrefix + '/microarch/sys/syspost/findAllPosts'
            }).then(res => {
                // console.log('post-----',res);
                if (res.data && res.data.rows) {
                    res.data.rows.forEach((item, index) => {
                        if (item.postCode == this.ruleForm.position) {
                            this.ruleForm.positionName = item.postName;
                        }
                    });
                }
            });
        },
        handleChange (val) {

        }
    }
};
</script>
<style scoped>
.grid-content{
    font-size:14px;
    line-height:40px;
    padding:5px 0;
}
.moduleTit h3{
    border-bottom: 1px solid #ccc;
    font-weight:normal;
    font-size:16px;
    color:#333;
    line-height: 25px;
    margin-bottom: 20px;
    padding:10px 0;
}
.moduleTit h3 span.infoTit{
    font-size:14px;
    padding-left:15px;
    border-left: 5px solid #2d8cf0;
}
.sliceLine{
    border-top:1px dashed #ddd;
    margin:12px 0;
}
.userInfoTit{
    display:inline-block;
    width:100px;
    text-align: right;
}
</style>