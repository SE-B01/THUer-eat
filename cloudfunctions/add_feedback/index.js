// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  

  /** 检测是否正确获取到用户的openid start */
  const wxContext = cloud.getWXContext()
  console.log('获取用户微信信息')
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

  /** 检测是否正确获取到用户的openid end */


  /** 检测是否必传了参数 start */
  if(event.content == undefined){

    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data

    return result

  }

  if(event.type == undefined){

    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data

    return result

  }

  /** 检测是否必传了参数 end */

  // 实例化数据库连接
  const db = cloud.database()

  // 构造要添加的数据
  to_add_data = {

    // 内容
    content: event.content,

    // 用户的微信号
    wechat_account: event.wechat_account,

    // 邮箱
    email: event.email,

    // 类型，1表示增加词，2表示加入我们，3商务合作，4其它，5bug反馈
    type: event.type,

    // 反馈的图片的存储地址
    picture_url: event.picture_url,

    // 创建者的openid
    openid: wxContext.OPENID,

    // 创建的时间
    create_time: new Date()


  }

  console.log('要新增的数据')
  console.log(to_add_data)


  // 新增结果
  var add_result = {}

  await db.collection('feedback')
  .add({
    data: to_add_data
  })
  .then(res => {

    console.log('新增成功')
    console.log(res)

    add_result = res._id

  })

  var data = {}

  /** 给当前用户发送微信订阅消息 start */

  var openid = wxContext.OPENID
  var username = event.nickName
  var content = "管理员已经收到你的反馈，谢谢"

  var date = new Date()

  // 格式化创建时间为 2020-08-03 21：40
  var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()

  try{
    var mes_result  = await sendSubsribeMessage(openid, username, content, time)
  }
  catch(e){
    data['user_notice_msg'] = '发送消息失败'
    data['user_notice_error_tip'] = e
  }
  

  /** 给当前用户发送微信订阅消息 end */


  // 返回执行结果
  var result = {}
  result.errCode = 0
  result.errMsg = '反馈成功'

  
  data.feedback_id = add_result

  result.data = data

  return result


}


/**
 * 发送订阅消息
 * @param {*} openid 
 * @param {*} username 
 * @param {*} content 
 * @param {*} time 
 */
async function sendSubsribeMessage(openid, username, content, time){

  // 用户的openid
  const OPENID = openid
  
  // 消息模板
  const templateId = 'QD-hG0e7XRuq679IA7knCxX5n4Q3dWQHtmOhPpMqWGU'

  // 调用发送函数
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    templateId,
    miniprogram_state: 'developer', // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
    page: 'pages/index/index',

    data:{
      name1:{
        value: username,
      },
      thing2:{
        value: content,
      },
      time3:{
        value: time,
      }

    }
  
  
  })

  return sendResult



}