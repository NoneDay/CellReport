<template>
  <el-dialog title="图库"
             width="80%" append-to-body
             :close-on-click-modal="false"
             :visible.sync="imgVisible">
    <div style="margin:0 auto;">
      <el-upload class="upload-demo"
                 :on-success="onSuccess"
                 :show-file-list="false"
                 :action="baseUrl+'/design/putFile?file_type='+type"
                 multiple
                 :headers="headers"
                 list-type="picture">
        <el-button size="small"
                   icon="el-icon-upload"
                   type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-scrollbar class="imgList">
      <img :src="item"
           :style="styleName"
           @click="handleSetimg(item)"
           v-for="(item,index) in imgList"
           :key="index" />
    </el-scrollbar>
  </el-dialog>
</template>

<script>
//import cookies from "vue-cookies";
//const baseUrl=""
import { baseUrl } from '@/config/env'; 
import {getImgFileList} from "../api/report_api"

export default {
  name:'imglist',
  data () {
    return {
      imgVisible: false,
      imgObj: '',
      type: '',
      imgList:[],      
    }
  },
  computed: {
    styleName () {
      if (this.type === 'background') {
        return {
          width: '200px'
        }
      }
      return {}
    },
    headers() {
      return {
        
      }
    }
  },
  watch: {
  },
  methods: {
    onSuccess (res) {
      this.imgList.push(res.url)
      //const url = res.data.link;
      //this.imgOption[this.imgActive].unshift({
      //  label: url,
      //  value: url
      //});
    },
    openImg (item, type) {
      getImgFileList(type).then(data=>{
        this.imgList=data.data
      })
      this.type = type;
      this.imgObj = item
      this.imgVisible = true;
    },
    handleSetimg (item) {
      this.imgVisible = false;
      this.$emit('change', item, this.imgObj);
    }
  }
}
</script>

<style>

.imgList {
    height: 350px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between
}

.imgList img {
    width: 100px;
    height: 100px;
    margin: 20px 10px
}
</style>
