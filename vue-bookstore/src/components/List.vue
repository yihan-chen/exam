<template>
  <div>
    <div class="col-md-3" v-for="book in books">
      <div class="panel panel-warning">
        <div class="panel-heading">
          书名:{{book.bookName}}
        </div>
        <div class="panel-body text-center">
          <img :src="book.bookCover" alt="">
        </div>
        <div class="panel-footer">
          价格:{{book.bookPrice | currency('￥')}}
          <router-link :to="{name:'detail',params:{id:book.id}}">请进入详情页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    filters:{
      currency(input,param1){
        return param1 + input;
      }
    },
    /*获取数据*/
    created(){
        /*配置代理 解决跨域问题*/
        this.$http.get('./book').then((res)=>{
           this.books = res.body;//数据会挡在res.body的对象上
        })
    },
    data(){
      return {books:[

      ]}
    },
    components: {},
    methods: {}
  }
</script>
<style scoped>
img{width: 150px;height: 200px}
</style>
