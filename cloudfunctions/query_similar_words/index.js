// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  

  /** 传递必要的参数 start */

  if(event.query_word == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data
    
    return result

  }

  // 搜索类型，1表示近义词，2表示反义词
  if(event.query_type == undefined){
    event.query_type = 1
  }
  

  /** 传递必要的参数 end */


  // 实例化数据库连接
  const db = cloud.database()

  /** 是否存在该词 start */
  var word;
  await db.collection('word')
  .where({
    word: event.query_word
  })
  .get()
  .then(res => {
    console.log('查词成功')
    word = res.data[0]
  })


  console.log(word)


  if(word == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 3
    result.errMsg = '不存在该词，可联系我们添加'

    var data = {}
    result.data = data

    return result
  }
  else{

    /** 为该词的热度+1 start */
    await db.collection('word')
    .where({
      id: word.id
    })
    .update({
      data:{
        hot: word['hot'] + 1
      }
    })
    .then(res => {
      console.log('修改热度成功')
      console.log(res)
    })

    /** 为该词的热度+1 end */

  }
  

  /** 是否存在该词 end */

  

  /** 该词是否存在近义词关系 start */

  // 定义查询指令
  const _ = db.command

  await db.collection('word_similar_relation')
  .where(
    _.or([
      {
        word_id: word.id,
        type: event.query_type
      },
      {
        similar_word_id: word.id,
        type: event.query_type
      }
    ])

  )
  .orderBy('correlation', 'desc')
  .get()
  .then(res => {
    console.log('获取近义词关系成功')
    console.log(res.data)

    word.similar_words = res.data

  })

  if(word.similar_words.length == 0){

    var result = {}
    result.errCode = 4
    result.errMsg = '不存在该词的关联词，可以联系我们添加'

    var data = {}
    data.word = word
    
    result.data = data

    return result

  }
  else{

    var result = {}
    result.errCode = 0
    result.errMsg = '查询成功'

    var data = {}
    data.word = word

    result.data = data

    return result


  }

  /** 该词是否存在近义词关系 end */



}