// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  /** 检测用户的openid是否被正确获取 start */
  const wxContext = cloud.getWXContext()

  console.log('成功获取用户信息')
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

  /** 检测用户的openid是否被正确获取 end */



  /** 校验参数是否必传 start */

  if(event.avatarUrl == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data

    return result

  }

  if(event.gender == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data

    return result

  }

  /** 校验参数是否必传 end */


  // 实例化数据库
  const db = cloud.database({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
  //const db = cloud.database()

  /** 根据用户的openid获取用户信息 start */
  var user;
  await db.collection('user')
  .where({
    openid: wxContext.OPENID
  })
  .get()
  .then(res => {

    console.log('获取用户信息操作成功')
    console.log(res.data)

    user = res.data[0]

  })
  /** 根据用户的openid获取用户信息 end */

  
  // 如果没有获取到，则新增数据
  if(user == undefined){

    // 构造要添加的数据
    to_add_data = {
      
      // 昵称
      nickName: event.nickName,
      // 头像
      avatarUrl: event.avatarUrl,
      // 性别
      gender: event.gender,
      // openid
      openid: wxContext.OPENID,
      // 是否为管理员，1是管理员，0是普通用户
      //zyx 待修改
      is_admin: 0,
      // 注册的时间
      signTime: new Date()
    }

    console.log('新构造的用户数据')
    console.log(to_add_data)

    // 新增结果
    var add_result = {}

    await db.collection('user')
    .add({
      data: to_add_data
    })
    .then(res => {
      console.log('新增用户成功')
      console.log(res)
      // 集合中该数据被赋值的_id
      add_result = res._id
    })


  }
  // 如果获取到，则保存最新数据
  else{

    await db.collection('user')
    .where({
      openid: wxContext.OPENID
    })
    .update({
      data: {
        // 头像
        avatarUrl: event.avatarUrl,
        // 性别
        gender: event.gender
      }
    })
    .then(res => {
      console.log('更新成功')
      console.log(res)
    })
  }

  /** 查询用户的最新信息，返回前端 start */
  await db.collection('user')
  .where({
    openid: wxContext.OPENID
  })
  .field({
    nickName: true,
    avatarUrl: true,
    gender: true,
    signTime: true,
    is_admin: true
  })
  .get()
  .then(res => {
    console.log('获取用户最新信息成功')
    console.log(res.data)

    user = res.data[0]
  })

  /** 查询用户的最新信息，返回前端 end */

  // 返回执行结果
  var result = {}

  if(add_result){

    result.errCode = 0
    result.errMsg = '新增用户成功'

  }
  else{
    
    result.errCode = 0
    result.errMsg = '该用户已微信注册过，信息已更新'

  }

  var data = {}
  data.user = user

  result.data = data

  return result
  
}