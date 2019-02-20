<template>
    <el-row :gutter="0" class="cucarousel">
        <el-carousel :interval="3000">
            <el-carousel-item v-for="(item,index) in imagelist" :key="index">
                <div class="img-content">
                    <img ref="imgHeight" :src="item.src">
                    <!--<p class="italictext">{{item.txt}}</p>-->
                </div>
            </el-carousel-item>
        </el-carousel>
    </el-row>
</template>
<script>
    export default {
        name: 'homeCarousel',
        data () {
            return {
                id: '',
                imagelist: '',
                imgHeight: ''
            };
        },
        activated () {
            this.getList();
        },
        created () {
            this.getList();
        },
        mounted () {

        },
        methods: {
            getList () {
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/images/carousel?type=01',
                    data: {}
                }).then(res => {
                    var backData = res.data;
                    if (backData) {
                        var resArray = [];

                        for (var i = 0; i < backData.length; i++) {
                            this.$myHttp({
                                method: 'get',
                                url: this.prefixWork + '/microarch/sys/images/img?id=' + backData[i].id,
                                responseType: 'arraybuffer'
                            }).then(res => {
                                // console.log('imgsrc---',res)
                                return 'data:image/png;base64,' + btoa(
                                    new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                                );
                            }).then(data => {
                                var con = data;
                                resArray.push({
                                    src: con,
                                    txt: '"Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna."'
                                });
                            });
                        }
                        this.imagelist = resArray;
                    }
                }).catch(e => {
                    // 打印一下错误
                    console.log('catch->' + e);
                });
            }

        }
    };
</script>
<style>
    .img-content{
        padding-bottom:100%;
    }

    .img-content img{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        width:100%;
        margin:auto;
    }
    .cucarousel .el-carousel {
        overflow-x: hidden;
        position: relative;
        padding: 4px;
    }

    .cucarousel .el-carousel__container {
        position: relative;
        height: 300px;
        border: 1px solid;
    }
</style>