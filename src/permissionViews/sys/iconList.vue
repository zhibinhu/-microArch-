<template>
    <div style="font-size:20px;">

        <i @click="getClass" class="el-icon-edit" ></i>
        <i @click="getClass" class="el-icon-delete"></i>
        <i @click="getClass" class="el-icon-edit-outline" ></i>
        <i @click="getClass" class="el-icon-arrow-left"></i>
        <i @click="getClass" class="el-icon-arrow-down" ></i>
        <i @click="getClass" class="el-icon-arrow-right"></i>
        <i @click="getClass" class="el-icon-arrow-up" ></i>
        <i @click="getClass" class="el-icon-caret-left"></i>
        <i @click="getClass" class="el-icon-caret-bottom" ></i>
        <i @click="getClass" class="el-icon-caret-top"></i>
        <i @click="getClass" class="el-icon-caret-right" ></i>
        <i @click="getClass" class="el-icon-minus"></i>
        <i @click="getClass" class="el-icon-plus"></i>
        <i @click="getClass" class="el-icon-tickets"></i>
        <i @click="getClass" class="el-icon-document"></i>
        <i @click="getClass" class="el-icon-date"></i>
        <i @click="getClass" class="el-icon-menu"></i>
        <i @click="getClass" class="el-icon-more"></i>
        <i @click="getClass" class="el-icon-more-outline"></i>
        <i @click="getClass" class="el-icon-location"></i>
        <i @click="getClass" class="el-icon-location-outline"></i>
        <i @click="getClass" class="el-icon-edit-outline"></i>
        <i @click="getClass" class="el-icon-setting"></i>
        <i @click="getClass" class="el-icon-close"></i>
        <i @click="getClass" class="el-icon-check"></i>

    </div>
</template>
<script>
    export default {
        data () {
            return {

            };
        },
        methods: {
            getClass (event) {
                let curI = event.target;
                let curClass = curI.getAttribute('class');
                console.log('curClass------', curClass);
                this.$emit('getIconClass', curClass);
            }
        }

    };
</script>
<style scoped>
    i{
        padding:5px;
        border:1px solid #ccc;
        cursor: pointer;
        margin:2px;
        float:left;
    }
    i:hover{
        border:1px solid #1775ea;
    }
</style>