
<template>

    <el-col :span="24">

        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" style="margin-top: 0px;margin-bottom: 20px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">组织管理</span>
                            </h3>
                        </div>
                    </template>
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8"><div class="grid-content bg-purple">
                            <el-form-item label="组织编码:">
                                {{ruleForm.orgCode}}
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="8"><div class="grid-content bg-purple-light">
                            <el-form-item label="组织名称:">
                                {{ruleForm.orgName}}
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="8"><div class="grid-content bg-purple">
                            <el-form-item label="上级组织:">
                                {{ruleForm.pid}}
                                <!--<el-select v-model="ruleForm.pid" placeholder="请选择上级组织"-->
                                <!--style="width: 95%" :disabled="true">-->
                                <!--<el-option-->
                                <!--v-for="item in channelTypeData"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                                <!--</el-option>-->
                                <!--</el-select>-->
                            </el-form-item>
                        </div></el-col>
                    </el-row>

                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8"><div class="grid-content bg-purple">
                            <el-form-item label="组织简称:">
                                {{ruleForm.orgShortName}}
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="8" :xs="20">
                            <el-form-item label="状态:">
                                <el-switch
                                        v-model="ruleForm.status"
                                        active-text="启用"
                                        inactive-text="禁用"
                                        :disabled="true">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <el-form-item label="组织类型:">
                                    {{ruleForm.type}}
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>

                    <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                        <el-button @click="close()" icon="el-icon-back" style="margin-top: 20px;margin-bottom: 10px" round size="small">返回</el-button>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
    </el-col>
</template>

<script>
    export default {
        name: 'projectManagement-page',
        components: {
        },
        data () {
            return {
                pidData: [],
                channelTypeData: [],
                orgTypeData: [],
                /* State: true, */
                ruleForm: {
                    orgCode: '',
                    orgName: '',
                    orgShortName: '',
                    status: true,
                    type: '',
                    pid: ''
                },
                rules: {
                    orgCode: [
                        { required: true, message: '请输入组织编码', trigger: 'change' }
                    ],
                    orgName: [
                        { required: true, message: '请输入组织名称', trigger: 'change' }
                    ],
                    orgShortName: [
                        { required: true, message: '请输入组织简称', trigger: 'change' }
                    ]
                },
                radio: '1',
                activeNames: ['1']
            };
        },
        methods: {
            close: function () {
                this.$router.push({
                    name: 'sys/org/organizationList'
                });
            },
            handleChange (val) {
                console.log('val---', val);
            }
        },
        created () {
            var _this = this;
            // 上级单位
            this.$myHttp({
                method: 'POST',
                url: this.prefix + '/microarch/sys/sysorg/findAllOrgs',
                data: {}
            }).then(res => {
                // 成功回调方法
                console.log(res);
                var resArry = [];
                for (var items in res.data.rows) {
                    resArry.push({
                        label: res.data.rows[items].orgName,
                        value: res.data.rows[items].id
                    });
                }
                this.channelTypeData = resArry;
            });

            if (this.$route.params.id) {
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/sys/sysorg/view',
                    /* url: "http://192.168.99.24:6004/channel/view", */
                    data: {
                        'entity': {
                            'id': _this.$route.params.id
                        }
                    }
                }).then(res => {
                    // 成功回调方法
                    console.log('chenggongweidiao___res', res.data.entity);
                    _this.ruleForm = res.data.entity;
                    if (res.data.entity.status == 'Y' || res.data.entity.status == 'true') {
                        _this.ruleForm.status = true;
                    } else if (res.data.entity.status == 'N' || res.data.entity.status == 'false') {
                        _this.ruleForm.status = false;
                    };
                    if (res.data.entity.pid) {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix + '/microarch/sys/sysorg/findAllOrgs',
                            data: {}
                        }).then(Res => {
                            // 成功回调方法
                            for (var i = 0; i < Res.data.rows.length; i++) {
                                if (res.data.entity.pid == Res.data.rows[i].id) {
                                    this.ruleForm.pid = Res.data.rows[i].orgName;
                                }
                            }
                        });
                    };
                    const allDicts = JSON.parse(localStorage.getItem('sysDict'));
                    for (let j = 0; j < allDicts.length; j++) {
                        if (allDicts[j].dtype == 'orgType') {
                            for (let i = 0; i < allDicts[j].sysDicts.length; i++) {
                                if (allDicts[j].sysDicts[i].dkey == _this.ruleForm.type) {
                                    _this.ruleForm.type = allDicts[j].sysDicts[i].dvalue;
                                }
                            }
                        }
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .grid-content{
        font-size:16px;
        line-height:40px;
        padding:10px 0;
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
    .moduleTit h3 span.infoIcon{
        float:right;
        font-size:20px;
        padding-right: 20px;
        cursor: pointer;
    }
</style>
