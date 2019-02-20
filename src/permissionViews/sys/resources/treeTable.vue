<template>
    <el-table id="curTable" :data="formatData" :header-cell-style="{padding:'5px 0',background:'#dfebf9',fontSize:'12px'}" :cell-style="{fontSize:'12px',padding:'5px 0'}" :row-style="showRow" v-bind="$attrs" @row-click="selectCurrentLine">
        <el-table-column label="选择" width="55">
            <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row.id" :name="radioName" @change.native="getCurrentRow(scope.row)"></el-radio>
            </template>
        </el-table-column>
        <el-table-column v-if="columns.length===0" width="150">
            <template slot-scope="scope">
                <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
                <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
                {{ scope.$index }}
            </template>
        </el-table-column>
        <el-table-column v-for="(column, index) in columns" v-else :show-overflow-tooltip="column.value=='resCode' || column.value=='resUrl' || column.value=='authority'" :key="column.value" :label="column.text" :width="column.width">
            <template slot-scope="scope">
                <div v-if="column.iconFlag" slot="content" ><i :class="scope.row[column.value]"></i></div>
                <div v-else-if="column.value=='resType'" slot="content">
                    <span :class="['commonBackground',scope.row[column.value]=='directory'?'directory':scope.row[column.value]=='menu'?'menu':'btnStyle']">{{scope.row[column.value]=='directory'?'目录':scope.row[column.value]=='menu'?'菜单':'按钮'}}</span>
                </div>
                <div v-else-if="column.value!='resCode' && column.value!='resUrl' && column.value!='authority'">
                    <!-- Todo -->
                    <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
                    <span v-for="space in scope.row._level" v-if="index === 1" :key="space" class="ms-tree-space"/>
                    <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
                      <i v-if="!scope.row._expanded" class="el-icon-plus"/>
                      <i v-else class="el-icon-minus"/>
                    </span>
                    {{ scope.row[column.value] }}
                </div>
                <span v-else>
                    {{ scope.row[column.value] }}
                </span>
            </template>
        </el-table-column>
        <slot/>
    </el-table>
</template>

<script>
    /**
     Auth: Lei.j1ang
     Created: 2018/1/19-13:59
     */
    import treeToArray from '../eval';
    export default {
        name: 'treeTable',
        props: {
            /* eslint-disable */
            data: {
                type: [Array, Object],
                required: true
            },
            columns: {
                type: Array,
                default: () => []
            },
            evalFunc: Function,
            evalArgs: Array,
            expandAll: {
                type: Boolean,
                default: false
            }
        },
        data(){
          return{
              radio:'',
              radioName:'a1',
          }
        },
        mounted(){
            var that=this;
            // this.toggleExpanded(0);
            //解决表格表头错位的问题
            setTimeout(function () {
                var curTable=document.getElementById('curTable');
                if(curTable) {
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }
            },500)
            window.onresize=function () {
                setTimeout(function () {
                    var curTable=document.getElementById('curTable');
                    if(curTable) {
                        var thGutter = curTable.getElementsByClassName('gutter')[0];
                        thGutter.style.display = 'table-cell';
                    }
                },500)
            }
            setTimeout(function () {
                that.hideRadioLabel();//隐藏radiobutton的LABEL
            },0)

        },
        computed: {
            // 格式化数据源
            formatData: function() {
                // console.log('uuuuuuu,,,',this.data)
                let tmp
                if (!Array.isArray(this.data)) {
                    tmp = [this.data]
                } else {
                    tmp = this.data
                }
                const func = this.evalFunc || treeToArray
                const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
                return func.apply(null, args)
            }
        },
        methods: {
            getCurrentRow(val){
                console.log('treetable--val---',val)
                // this.managerName=val;
                this.$emit('getMenuId',val);
            },
            showRow: function(row) {
                const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
                row.row._show = show
                return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
            },
            // 切换下级是否展开
            toggleExpanded: function(trIndex) {
                const record = this.formatData[trIndex]
                record._expanded = !record._expanded
            },
            // 图标显示
            iconShow(index, record) {
                return (index === 1 && record.childrens && record.childrens.length > 0)
            },
            hideRadioLabel(){
                var labels=document.getElementsByClassName('el-radio__label');
                for(var i=0;i<labels.length;i++){
                    labels[i].style.display='none';
                }

            },
            selectCurrentLine(row, event, column){
                console.log('row--',row,'event--',event,'column--',column)
                this.getCurrentRow(row);
                this.radio=row.id;
            }

        }
    }
</script>
<style rel="stylesheet/css">
    @keyframes treeTableShow {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    @-webkit-keyframes treeTableShow {
        from {opacity: 0;}
        to {opacity: 1;}
    }
</style>

<style lang="less" rel="stylesheet/less" scoped>
    @color-blue: #2196F3;
    @space-width: 18px;
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: @space-width;
        height: 14px;
        &::before {
            content: ""
        }
    }
    .processContainer{
        width: 100%;
        height: 100%;
    }
    table td {
        line-height: 26px;
    }

    .tree-ctrl{
        position: relative;
        cursor: pointer;
        color: @color-blue;
        margin-left: -@space-width;
    }
    span.commonBackground{
        color:#fff;
        border-radius:2px;
        font-size:12px;
        padding:3px;
    }
    span.directory{
        background:#337ab7;
    }
    span.menu{
        background: #5cb85c;
    }
    span.btnStyle{
        background:#f0ad4e;
    }
</style>
