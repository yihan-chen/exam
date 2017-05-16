
//主要是提供接口
//  /book?id=1 get post delete put

/*封装写和读取*/
let http = require('http');
let url = require('url');
let fs = require('fs');
//我们对数的增删改查 操作的都是books.json文件
function readBooks(callback) {
  fs.readFile('./books.json','utf8',function (err,data) {
    if(err||data.length===0) data='[]';//报错和长度为0 时 是字符串数组
    callback(JSON.parse(data));//回掉函数  转化成JSON字符串
  })
}
/*readBooks(function (data) { console.log(data)})*/


function writeBooks(data,callback) {
  fs.writeFile('./books.json',JSON.stringify(data),callback)
}
//writeBook([{}{}{}],function(){})

http.createServer(function (req,res) {
  //解析路径 查看是否为id
  let {pathname,query} =  url.parse(req.url,true);
  if(pathname==='/book'){
    let id = query.id;
    switch (req.method){
      //查找
      case 'GET':
        if(id){
          readBooks(function (data) {
            var book = data.find(item=>item.id==id);
            res.end(JSON.stringify(book))
          });
        }else {
          readBooks(function (data) {
            res.end(JSON.stringify(data));
          })
        }
        readBooks(function (data) {//data代表所有图书
          res.end(JSON.stringify(data));

        });
        break;
      /*添加*/
      case 'POST':
        /*获取请求体数据*/
        var str ='';
        req.on('data',function (data) {
          str +=data;
        });
        req.on('end',function () {
          var book = JSON.parse(str);
          console.log(book)
          readBooks(function (books) {
            book.id = books.length?books[books.length-1].id+1:1;
            books.push(book);
            /*成功后的回调*/
            writeBooks(books,function () {
              console.log(books)
              //一般添加成功后 返回添加的那一项
              res.end(JSON.stringify(book))

            })

          })

        });
        break;
      /*修改*/
      case 'PUT':
        /*读数据*/
        var str = '';
        req.on('data',function (data) {
          str+=data
        });
        req.on('end',function () {
          //book代表前台要我们改成这个结果
          var book = JSON.parse(str);

          readBooks(function (books) {
            books = books.map(item=>{
                if(item.id==id){
              /*读取发来的数据*/

              return book;

            }
            return item;
          });
            writeBooks(books,function () {
              console.log(books);
              res.end(JSON.stringify(book))
            })
          })
        });
        break;
      /*删除*/
      case 'DELETE':
        readBooks(function (books) {
          books=books.filter(item=>item.id!=id);
          writeBooks(books,function () {
            //删除成功后返回空对象
            // console.log(books);
            res.end(JSON.stringify({}))
          })
        });
        break;

    }
  }else{
    res.statusCode = 404;
    res.end()
  }
}).listen(8888);
