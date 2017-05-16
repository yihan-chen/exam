<template>
  <div>

      <div class="panel panel-warning">
        <div class="panel-heading">
          书名: <span v-show="!flag">{{book.bookName}}</span>
          <input type="text" v-model="book.bookName" v-show="flag">
        </div>
        <div class="panel-body text-center">
          <img :src="book.bookCover" alt="">
        </div>
        <div class="panel-footer">
          价格: <span v-show="!flag">{{book.bookPrice | currency('￥')}}</span>
          <input type="text" v-model="book.bookPrice" v-show="flag">

          <button class="btn btn-danger" type="button" @click="remove" v-show="!flag">删除</button>
          <button class="btn btn-warning" v-show="!flag" @click="changeFlag">修改</button>
          <button class="btn btn-primary" v-show="flag" @click="update">确认修改</button>

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
      this.id =  this.$route.params.id;
      this.$http.get('/book?id='+this.id).then(res=>{
          this.book =res.body;
      })
    },
    data(){
      return {
          book:{
            bookName:'',
            bookPrice:'',
            bookCover:'',
          },
        id:'',
        flag:false,
      }
    },
    components: {},
    methods: {
      update(){
          //通过url传递id  通过请求提传递数据
          //console.log(this.book);
        this.$http.put('/book?id='+this.id,this.book).then(()=>{
            this.flag = false;//vueresource将then中的this处理掉了
        })
      },
        changeFlag(){
            this.flag = !this.flag
        },
        remove(){
            this.$http.delete('/book?id='+this.id).then(()=>{
                this.$router.push('/list')
            })
        }
    }
  }
</script>
<style scoped>
  img{width: 150px;height: 200px}
</style>
