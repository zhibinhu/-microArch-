<template>
  <div>
    <el-row>
      <el-col :span="8" v-for="item in items" :key="item.cfCfieldColumn">
        <el-form-item v-if="item.cfCfieldType==='Text' || item.cfCfieldType==='Number'" :label="labelName(item)" :prop="item.cfCfieldColumn">
          <el-input v-model="item.value" clearable size="small"  :disabled="onlyShow"></el-input>
        </el-form-item>
        <el-form-item v-else-if="item.cfCfieldType==='Date'" :label="labelName(item)" :prop="item.cfCfieldColumn">
          <el-date-picker  v-model="item.value" value-format="yyyy-MM-dd" type="date" size="small" style="width: 100%;" :disabled="onlyShow"></el-date-picker>
        </el-form-item>
        <el-form-item v-else :label="labelName(item)" :prop="item.cfCfieldColumn">
          <el-select v-model="text" placeholder="Please Choose" @change="handleChange" @focus="getDict(item.cfCfieldName)" :disabled="onlyShow">
            <el-option v-for="(item1,index) in dict" :key="index" :label="item1.itemValue" :value="item1.itemCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
      name: 'MyCustomItems',
      data () {
          return {
              id: '',
              items: [],
              text: '',
              dict: [],
              onlyShow: false
          };
      },
      props: {
          value: {
              default: ''
          },
          showType: String,
          mid: String,
          cfObjCode: String,
          type: String,
          dataUrl: String
      },
      activated () {
          this.getInputItem();
      },
      created () {
          console.log(this.mid + '==========');
          this.getInputItem();
          if (this.showType == 'view') {
              this.onlyShow = true;
          }
      },
      methods: {
          getInputItem () {
              this.items = [];
              if (!this.cfObjCode) {
                  console.error('请在父组件中传入 cfObjCode 参数值!');
              }
              this.$myHttp({
                  url: this.prefix + '/microarch/sys/cfields/cfieldsColumn/' + this.cfObjCode,
                  method: 'get',
                  data: {}
              }).then(rep => {
                  if (rep && rep.status === 200) {
                      if (rep.data) {
                          this.items = rep.data;
                          this.setDatas();
                      }
                  } else {
                      console.log('获取失败,请检查服务器端日志!');
                  }
              });
          },
          setDatas () {
              if (this.mid) {
                  this.$myHttp({
                      url: this.prefix + this.dataUrl,
                      method: 'post',
                      data: {
                          'entity': {
                              'userId': this.mid
                          }
                      }
                  }).then(rep => {
                      console.log(rep + '===========');
                      if (rep && rep.status === 200) {
                          var data = rep.data.entity;
                          if (rep.data) {
                              this.id = data.id;
                              this.items.forEach((item) => {
                                  console.log(this.toHump(item.cfCfieldColumn));
                                  this.$set(item, 'value', data[this.toHump(item.cfCfieldColumn)]);
                              });
                          }
                      } else {
                          console.log('获取失败,请检查服务器端日志!');
                      }
                  });
              }
          },
          handleChange (value) {
              this.$emit('input', value);
          },
          getData () {
              var data = {};
              this.items.forEach((item) => {
                  if (item.value) {
                      data[this.toHump(item.cfCfieldColumn)] = item.value;
                  }
              });
              data['id'] = this.id;
              return data;
          },
          setData (objectName, data) {
              this.items.forEach((item) => {
                  this.$set(item, 'value', data[objectName][item.cfCfieldColumn]);
              });
          },
          labelName: function (item) {
              return item.cfCfieldLabel + ':';
          },
          toHump (name) {
              return name.replace(/\_(\w)/g, function (all, letter) {
                  return letter.toUpperCase();
              });
          }

      }
  };
</script>
