// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  // 实例化数据库连接
  const db = cloud.database()

  // 每次至多查询多少个热词，最大值为100
  const MAX_LIMIT = 6

  // 定义一个数组接收查询结果
  var hot_words = [];

  await db.collection('word')
  .orderBy('hot', 'desc')
  .limit(MAX_LIMIT)
  .get()
  .then(res => {

    console.log('操作成功')
    console.log(res.data)

    hot_words = res.data

  })

  var result = {}
  result.errCode = 0
  result.errMsg = '获取热词成功'

  var data = {}
  data.hot_words = hot_words

  result.data = data
  return result

}