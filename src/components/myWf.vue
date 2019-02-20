<!--
通用组件myTable

一、引入方法


step1 父类组件中

import myTable from '../../components/myTableSys.vue'

step2 中注册

components: {
    myTable
}


二、传入参数说明

ex：

myTableData: {
    url: 'project/getOppoList',                                 //table总数据请求地址
    dlUrl: 'sysData/delProduct',                                //删除单行数据请求地址
    viewName: 'Viewproduct',                                    //单行查看按钮跳转地址路由
    editName: 'Editproduct',                                    //单行编辑按钮跳转地址路由
    addName:'addOppoProject',                                   //table上方新增按钮跳转路由
    exportName:'商机信息管理.xlsx',                               //导出Excel文件名
    tableThead: [                                               //所有列的label、value
        {
            headName: '商机编号',
            headKey: 'oppoNum'
        },
        {
            headName: '机会名称',
            headKey: 'oppoProjectName'
        }
    ],
    checkedThreadData: ['oppoNum','oppoProjectName'],           //默认展示列
    entity:{},
    ext:[],
    myorderBy: ''
}-->

<template>

    <div>


        <el-dialog title="拖动调整顺序" :visible.sync="dialogTableVisible" :modal-append-to-body="false" @close="closeDialog">

            <div style="width: 100%;margin-bottom: 50px;padding-left: 15px">

                <el-checkbox-group v-model="myTableData.checkedThreadData">

                    <draggable v-model="myTableData.tableThead">

                        <el-checkbox
                                style="width: 100%;height: 45px;border: 1px solid #ddd;background: #E9EAEC;border-radius: 5px;margin: 0 13px 10px 0;padding-left: 5px"
                                v-for="(element,index) in myTableData.tableThead" :key="index" :label="element.headKey">
                            <label>

                                <el-slider v-model="element.width" :max="200"
                                           style="margin-bottom: -28px;margin-left: 32%;width: 400px"
                                           show-input></el-slider>

                            </label>
                            {{element.headName}}
                        </el-checkbox>
                    </draggable>
                </el-checkbox-group>


            </div>

            <span slot="footer" class="dialog-footer">

                     <el-button type="primary" @click="confirmCustom()">确 定</el-button>

            </span>
        </el-dialog>


        <el-button @click="handleAdd()" type="primary" size="small" style="margin-top: 10px;margin-bottom: 5px"
                   v-if="myTableData.addName">
            <i style="margin-right: 5px" class="el-icon-circle-plus-outline"></i>{{myTableData.addBtnName||'新增'}}
        </el-button>

        <el-button @click="customColumn()" type="danger" size="small" style="margin-top: 10px;margin-bottom: 5px"
                   v-if="myTableData.custom">
            <i style="margin-right: 5px" class="el-icon-rank"></i>自定义列表
        </el-button>

        <el-button @click="exportExcel()" type="success" size="small" style="margin-top: 10px;margin-bottom: 5px"
                   v-if="myTableData.exportName">
            <i style="margin-right: 5px" class="el-icon-document"></i>报表导出
        </el-button>

        <div style="background-color: white">

            <el-table
                    class="myTable"
                    border stripe
                    :data="tableData"
                    id="myTable"
                    v-if="mark"
                    :style="myTableStyle"
                    size="small"
                    @sort-change="sorthange"
                    :sort-orders="sortOrders"
                    ref="myTable"
                    @selection-change="handleSelectionChange"
            >

                <el-table-column
                        v-for='(items , index) in myTableData.tableThead'
                        v-if="items.selectionCheckbox"
                        :fixed="items.fixedColumn?true:false"
                        :key="index"
                        type="selection"
                        width="55"
                ></el-table-column>
                <el-table-column :prop="items.headKey" :key='index' v-for='(items , index) in myTableData.tableThead'
                                 min-width="180px"
                                 :label="items.headName" :width="items.width*2.5" :align="items.align"
                                 :fixed="items.fixedColumn?true:false"
                                 v-if="!items.isHidden"
                                 :show-overflow-tooltip="items.showToolTipFlag"
                                 :sortable="items.headKey == 'pageIndex'?false:'custom'">
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light"
                                    :disabled="!items.isNeedTips || !scope.row[items.headKey]" :placement="placement">

                            <div v-if="items.dirKey" slot="content">{{scope.row[items.headKey]}}</div>

                            <div v-else slot="content">{{scope.row[items.headKey]}}</div>

                            <p v-if="items.headKey == 'pageIndex'">{{scope.$index+1}}</p>

                            <!--<p v-if="items.dirKey"> {{scope.row[items.headKey] | datafil(items.dirKey)}}</p>-->
                            <p v-if="items.dirKey"> {{scope.row[items.headKey] | datafil(items.headKey)}}</p>
                            <p v-if="items.amoutKey"> {{scope.row[items.headKey] | formatFilNew(items.amoutKey)}}</p>
                            <p v-if="items.isProjectFmt"> {{scope.row[items.headKey] |
                                projectTypeFil(items.amoutKey)}}</p>
                            <p v-if="items.isTimeData">
                                {{scope.row[items.headKey] | prAndOppoTimeFmt(items.amoutKey)}}</p>
                            <p v-if="items.isPersonData">
                                {{scope.row[items.headKey] | prAndOppoPersonFmt(items.amoutKey)}}</p>
                            <p v-if="items.isAmountFmt"> {{scope.row[items.headKey] | amountFmt(items.amoutKey)}}</p>

                            <p v-if="items.headKey == 'isAllowWorkingHours'">{{scope.row[items.headKey]== 'true'? '是':'否'}}</p>

                            <!--<p v-if="items.orgStatus">{{scope.row[items.headKey]== 'Y'? '启用':scope.row[items.headKey]== 'N'?'禁用':''}}</p>-->

                            <!--<p v-if="items.userStatus">{{scope.row[items.headKey]== 'Y'? '启用':scope.row[items.headKey]== 'N'?'停用':''}}</p>-->

                            <!--<p v-if="items.userRoleFlag">{{scope.row[items.headKey] | showUserRole}}</p>-->

                            <!--<p v-if="items.userDepartment">{{scope.row[items.headKey] | showUserDepartment}}</p>-->

                            <p v-if="items.orgtype">{{scope.row[items.headKey]== 'bumen'? '部门':scope.row[items.headKey]== 'gongsi'?'公司':scope.row[items.headKey]}}</p>

                            <!--<p v-if="items.postStatus">{{scope.row[items.headKey]== 'gaoceng'? '高层':scope.row[items.headKey]== 'zhongceng'?'中层':scope.row[items.headKey]== 'jiceng'?'基层':'其他'}}</p>-->

                            <p v-if="items.underline" :class="items.underline?'underline':''" @click="handleView(scope.row)">{{scope.row[items.headKey]}}</p>

                            <p v-if="items.priority">{{scope.row[items.headKey]  | priorityFil}}</p>


                            <p v-else>{{scope.row[items.headKey]}}</p>


                        </el-tooltip>

                    </template>


                </el-table-column>

                <el-table-column
                        label="操作"
                        width="140" v-if="!myTableData.hiddenAction">
                    <template slot-scope="scope">
                        <el-button
                                v-if="myTableData.isShowManageDict"
                                :disabled='scope.row.permission|optfil(1,permission)'
                                size="mini"
                                type="success"
                                circle
                                title="管理字典项"
                                @click="handleDict(scope.row)"><i class="el-icon-setting" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                v-if="!myTableData.isHiddenView || myTableData.viewBtn"
                                :disabled='scope.row.permission|optfil(1,permission)'
                                size="mini"
                                type="success"
                                circle
                                title="查看"
                                @click="handleView(scope.row)"><i class="el-icon-tickets" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                v-if="!myTableData.isHiddenEdit"
                                :disabled='scope.row.permission|optfil(2,permission)'
                                size="mini"
                                type="primary"
                                circle
                                title='编辑'
                                @click="handleEdit(scope.row)"><i class="el-icon-edit" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                v-if="!myTableData.isHiddendelete"
                                :disabled='scope.row.permission|optfil(3,permission)'
                                size="mini"
                                type="danger"
                                circle
                                title="删除"
                                @click="deleteRow(scope.$index, tableData,scope.row)"><i class="el-icon-delete"
                                                                                         style="font-size: 11px"></i>
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>


            <el-pagination
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="total"
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    :current-page="mypage"
                    :page-size="mysize"
                    :style="paginationStyle"
            >
            </el-pagination>
        </div>

    </div>


</template>


<script>
    import Cookies from 'js-cookie';
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    import draggable from 'vuedraggable';
    import util from '../libs/util';

    export default {

        data () {
            return {
                placement: 'right-end',
                dialogTableVisible: false,
                disabled: true,
                mark: true,
                fullHeight: document.documentElement.clientHeight,
                tableData: [],
                dirData: {},
                dirLablArry: [],
                mysize: 10,
                mypage: 1,
                total: 1,
                direction: '',
                field: '',
                myorderBy: '',
                sortOrders: ['ascending', 'descending'],
                paginationStyle: 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100',
                myTableStyle: 'margin-bottom:35px'

            };
        },
        components: {
            draggable
        },
        props: ['myTableData'],
        methods: {

            closeDialog () {
                this.findAllProject(1);
            },
            // 模态框点击确认后逻辑
            confirmCustom () {
                this.dialogTableVisible = false;
                this.refreshMyTable();

                this.myTableData.tableThead.forEach((item) => {
                    if (this.myTableData.checkedThreadData.indexOf(item.headKey) >= '0') {
                        item.isHidden = false;
                    } else {
                        item.isHidden = true;
                    }
                });

                console.log(this.myTableData.tableThead);

                this.findAllProject(1);

                // 将用户选择存储本地
                Cookies.set(this.myTableData.customStyleData[0], this.myTableData.tableThead);
                Cookies.set(this.myTableData.customStyleData[1], this.myTableData.checkedThreadData);
            },

            // 刷新table
            refreshMyTable () {
                this.mark = false;
                this.mark = true;
            },

            // 自定义列
            customColumn () {
                this.dialogTableVisible = true;
            },

            // 新增xx
            handleAdd () {
                let _this = this;
                this.$router.push({
                    'name': _this.myTableData.addName,
                    'params': {
                        'currentPage': _this.currentPage
                    }
                });
            },

            /// 报表导出
            exportExcel () {
                var _this = this;

                var wb = XLSX.utils.table_to_book(document.querySelector('#myTable'));

                var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});

                try {
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), _this.myTableData.exportName);
                } catch (e) {
                    console.log(e, wbout);
                }
                return wbout;
            },

            // 数据字典值请求
            makeDataDictionary: function (dtype) {
                let sysDict = JSON.parse(localStorage.getItem('sysDict'));
                // console.log('sysDict------=======',sysDict)
                for (var items in sysDict) {
                    if (dtype == sysDict[items].dtype) {
                        this.dirData[dtype] = sysDict[items].sysDicts;
                    }
                }
            },
            /**
             * 查询table数据
             */
            findAllProject (mypage) {
                if (mypage != null) { this.mypage = mypage; }
                var _this = this;
                var url = _this.prefix + _this.myTableData.url + window.suffix;
                this.$myHttp({
                    method: 'POST',
                    url: url,
                    data: {
                        'entity': _this.myTableData.entity,
                        'ext': _this.myTableData.ext,
                        'where': _this.myTableData.where,
                        'pageNum': this.mypage - 1,
                        'pageSize': this.mysize,
                        'orderBy': _this.myTableData.myorderBy
                    }
                }).then(res => {
                    // 成功回调方法
                    console.log('tableData-----', res);
                    this.total = Number(res.data.total);
                    this.tableData = res.data.rows;
                    this.setPaginationStyle();
                });
            },
            sizeChange (size) {
                this.mysize = size;
                this.mypage = 1;
                this.findAllProject();
            },
            currentChange (page) {
                this.mypage = page;
                this.findAllProject();
            },
            sorthange (column) {
                if (column.prop !== null) {
                    this.myTableData.myorderBy = column.prop + ' ' + (column.order === 'ascending' ? 'asc' : 'desc');
                }
                this.mypage = 1;
                this.findAllProject();
            },
            // 管理字典项
            handleDict (row) {
                this.$router.push({
                    'name': this.myTableData.dictManagementName,
                    'params': {
                        'id': row.id,
                        'currentPage': this.currentPage
                    }
                });
            },
            // 查看
            handleView (row) {
                this.$router.push({
                    'name': this.myTableData.viewName,
                    'params': {
                        /* "projectName":row.projectName, */
                        'id': row.id,
                        'currentPage': this.currentPage,
                        'row': row
                    }
                });
            },
            // 修改
            handleEdit (row) {
                this.$router.push({
                    'name': this.myTableData.editName,
                    'params': {
                        'type': 'project',
                        'id': row.id,
                        'username': row.username,
                        'code': row.code,
                        'currentPage': this.currentPage,
                        'row': row
                    }
                });
            },
            // 删除
            deleteRow (index, tableData, row) {
                var _this = this;
                this.$confirm('此操作将永久删除项目信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$myHttp({
                        method: 'POST',
                        url: this.prefix + this.myTableData.dlUrl + window.suffix,
                        data: {
                            'entity': {
                                'id': row.id
                            },
                            'ext': [
                                row.id
                            ],
                            'pageNum': 0,
                            'pageSize': 1000
                        }
                    }).then(res => {
                        if (res.data.subCode == 0) {
                            if (_this.total % _this.mysize == 1) { _this.mypage = _this.mypage == 1 ? 1 : _this.mypage - 1; }
                            // 成功回调方法
                            _this.findAllProject();
                        } else {
                            _this.$notify({
                                title: '无法删除',
                                message: res.data.subMsg,
                                type: 'warning'
                            });
                        }
                    });
                }).catch(() => {
                });
            },
            /**
             * 设置分页位置的方法
             */
            setPaginationStyle: function () {
                // 浏览器高度小于 704 直接定位到底部
                if (this.fullHeight < 704) {
                    this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;';
                    this.myTableStyle = 'margin-bottom:35px';
                } else {
                    // table宽度小于 浏览器高度 - （面包屑 + 导航栏的高度）说明需要固定位置
                    if (this.$refs.myTable.$el.clientHeight < this.fullHeight - 320) {
                        this.paginationStyle = 'background-color: white';
                        this.myTableStyle = 'margin-bottom:0px';
                    } else {
                        this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;';
                        this.myTableStyle = 'margin-bottom:35px';
                    }
                }
            },

            /**
             * 读取用户储存后的排序数据
             */
            readCustomStyleData: function () {
                // 初始化读取 用户存储排列顺序
                if ((Cookies.get(this.myTableData.customStyleData[0])) && (Cookies.get(this.myTableData.customStyleData[1]))) {
                    this.myTableData.tableThead = JSON.parse(Cookies.get(this.myTableData.customStyleData[0]));
                    this.myTableData.checkedThreadData = JSON.parse(Cookies.get(this.myTableData.customStyleData[1]));
                }
            },
            handleSelectionChange (val) {
                this.$emit('getSelectionData', val);
            }

        },
        mounted: function () {
            var _this = this, dirArry = [], reqArry = [];

            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight;
                    _this.fullHeight = window.fullHeight;
                    _this.setPaginationStyle();
                })();
            };

            if (this.myTableData.customStyleData) {
                this.readCustomStyleData();
            }

            this.myTableData.tableThead.forEach(function (item) {
                if (item.dirKey) {
                    // dirArry.push(item.dirKey)
                    // _this.dirLablArry.push(item.headKey)
                    _this.makeDataDictionary(item.headKey);
                }
            });
            Cookies.set('dirData', this.dirData);
            this.findAllProject(this.currentPage);
            // 解决表格表头错位的问题
            setTimeout(function () {
                var myTable = document.getElementById('myTable');
                if (myTable) {
                    var thGutter = myTable.getElementsByClassName('gutter')[0];
                    if (thGutter != undefined) { thGutter.style.display = 'table-cell'; }
                }
            }, 500);
            window.onresize = function () {
                setTimeout(function () {
                    var myTable = document.getElementById('myTable');
                    if (myTable) {
                        var thGutter = myTable.getElementsByClassName('gutter')[0];
                        thGutter.style.display = 'table-cell';
                    }
                }, 500);
            };
        },
        filters: {
            optfil (v, idx, perimission) {
                if (perimission == null || perimission == '') perimission = '0';
                if (v == null || v == '') v = '0';
                let num = Number.parseInt(perimission, 2) | Number.parseInt(v, 2);
                v = num.toString(2).length < 4 ? util.addPreZero(num.toString(2)) : num.toString(2);
                return v == null ? true : v.charAt(idx) != 1;
            },
            datafil: function (v1, v2) {
                var data = JSON.parse(Cookies.get('dirData'));
                var res = '';
                if (data[v2]) {
                    data[v2].forEach(function (item) {
                        if (item.dkey == v1) {
                            res = item.dvalue;
                        }
                    });
                }
                return res;
            },
            showUserRole (roles) {
                var arr = [];
                // console.log('roles---',roles)
                if (roles && roles.length > 0) {
                    roles.forEach((item, index) => {
                        arr.push(item.roleName);
                    });
                }
                return arr.join(',');
            },
            showUserDepartment (orgs) {
                var arr = [];
                // console.log('orgs---',orgs)
                if (orgs && orgs.length > 0) {
                    orgs.forEach((item, index) => {
                        arr.push(item.orgName);
                    });
                }
                return arr.join(',');
            },
            priorityFil (val) {
                var fildata = '一般';
                if (val == '50') {
                    fildata = '一般';
                } else if (val == '100') {
                    fildata = '紧急';
                } else if (val == '150') {
                    fildata = '特急';
                } else {
                    fildata = '一般';
                }
                return fildata;
            }
        },
        computed: {
            permission () {
                let nodeCode = this.myTableData.nodeCode == null ? '' : this.myTableData.nodeCode;
                if (this.myGlobal.getPermission) { return this.myGlobal.getPermission(nodeCode); }// 11101
            }
        },
        watch: {
            // 监控屏幕的高度，动态设置分页样式
            fullHeight (val) {
                this.fullHeight = val;
                if (this.$refs.myTable.$el.clientHeight < this.fullHeight - 280) {
                    this.paginationStyle = 'background-color: white';
                    this.myTableStyle = 'margin-bottom:0px';
                } else {
                    this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;';
                    this.myTableStyle = 'margin-bottom:35px';
                }
            },
            clientHeight (val) {
                this.clientHeight = val;
            }

        },
        updated: function () {
            // render完成之后出发调整样式方法
            this.setPaginationStyle();
        }

    };
</script>

<style scoped>
    .el-button.is-circle {
        padding: 7px;
    }

    .el-tooltip {

        height: 28px;
    }

    .myTable .cell {
        overflow-y: hidden !important;
        max-height: 28px !important;
    }
    .underline{
        text-decoration:underline;
        cursor: pointer;
    }

</style>
