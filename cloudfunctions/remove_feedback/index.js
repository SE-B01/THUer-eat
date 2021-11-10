// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  
  /** 是否获取了用户openid start */
  const wxContext = cloud.getWXContext()

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

  /** 是否获取了用户openid end */


  /** 前端是否必传了参数 start */
  if(event.feedback_id == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data

    return result

  }

  /** 前端是否必传了参数 end */


  /** 校验管理员权限 start */

  /** 校验管理员权限 end */


  // 实例化数据库连接
  const db = cloud.database()

  // 保存删除了多少条数据
  var total_removed = 0

  await db.collection('feedback')
  .where({
    _id: event.feedback_id
  })
  .remove()
  .then(res => {
    console.log('删除操作成功')
    console.log(res)

    total_removed = res.stats.removed

  })


  // 删除该反馈对应的图片 TODO

  var result = {}

  if(total_removed == 0){

    result.errCode = 3
    result.errMsg = '不存在该反馈'


  }
  else{
    result.errCode = 0
    result.errMsg = '删除成功'
  }

  var data = {}
  data.total_removed = total_removed

  result.data = data


  return result

}