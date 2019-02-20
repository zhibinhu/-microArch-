<template>

    <el-dialog title="返回参数" :visible.sync="dialogResultVisible" :modal-append-to-body="false" append-to-body  width="1000px" >
        <div>
            <vue-json-viewer
                    :value="jsonData"
                    :expand-depth=5
                    copyable
                    boxed
                    sort
            ></vue-json-viewer>
        </div>
    </el-dialog>



</template>

<script>
    import VueJsonViewer from 'vue-json-viewer';

    export default {

        data () {
            return {
                jsonData: '',
                dialogResultVisible: false
            }
        },

        components: {
            VueJsonViewer
        },
        created: function () {
        },
        watch: {

        },

        methods: {
            init(val) {
                this.dialogResultVisible = true;
                if (typeof val == 'string') {
                    try {
                        this.jsonData = JSON.parse(val);
                    } catch(e) {
                        var json = {"result":val}
                        this.jsonData = json
                    }
                }
                this.$nextTick(()=>{
                    //可以写自己的逻辑
                })
            }
        },
        mounted: function () {

        },

        filters:  {

        }

    }
</script>