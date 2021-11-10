// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  /** 检测用户的openid start */
  const wxContext = cloud.getWXContext()

  console.log('获取用户微信信息成功')
  console.log(wxContext)

  if(wxContext.OPENID == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 1
    result.errMsg = '未能正确获取到用户的openid，请退出小程序重试'

    var data = {}
    result.data = data

    return result

  }

  /** 检测用户的openid end */

  /** 校验用户权限，只有管理员才能调用该接口 start */

  // 判断该用户的is_admin是否等于1

  /** 校验用户权限，只有管理员才能调用该接口 end */



  // 实例化数据库
  const db = cloud.database()

  // 每次至多获取多少条记录，最大100
  const MAX_LIMIT = 2


  /** 查询集合中总共有多少条记录 start */
  const countResult = await db.collection('feedback').count()
  const total = countResult.total
  
  console.log('总共有多少条数据')
  console.log(total)

  /** 查询集合中总共有多少条记录 end */


  /** 计算出总共可以分为多少页 start */
  const total_times = Math.ceil(total / MAX_LIMIT)

  console.log('总共可以分为多少页')
  console.log(total_times)

  /** 计算出总共可以分为多少页 end */

  // 保存每次查询的结果
  var feedbacks = []


  // i表示取第几页
  for(let i = 0; i < total_times; i++){
    
    await db.collection('feedback')
    .orderBy('create_time', 'desc')
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .get()
    .then(res => {

      console.log('第' + i + '页')
      console.log(res.data)

      feedbacks = feedbacks.concat(res.data)

    })
    
  }
  console.log(feedbacks)

  // 将时间格式转换
  // Wed Aug 05 2020 00:31:22 GMT+0800 (China Standard Time)
  for(let i = 0; i < feedbacks.length; i++){

    var date = new Date(feedbacks[i].create_time);
    // 格式化创建时间为 2020-05-09 21:30
    feedbacks[i].creat_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()

  }

  console.log(feedbacks)

  var result = {}
  result.errCode = 0
  result.errMsg = '获取所有反馈成功'

  var data = {}
  data.feedbacks = feedbacks

  result.data = data
  
  return result



}