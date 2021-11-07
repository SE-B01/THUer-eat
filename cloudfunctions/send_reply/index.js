// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
// 云函数入口函数

exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": event.openid,
        "page": 'Pages/index/index',
        "lang": 'zh_CN',
        "data": {
          "thing3":{
            value:event.content,
          },
          "time4":{
            value:dateToString(),
          },
          "thing2":{
            value:"管理员",
          }
        },
        "templateId": 'D_PqIP5uKT3kw_RpcVuWg-qcdu_YklFu5DeDeXvxZE8',
        "miniprogramState": 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}
function dateToString(){
  now = new Date()
  var year = now.getFullYear();
  var month =(now.getMonth() + 1).toString();
  var day = (now.getDate()).toString();
  var hour = (now.getHours()).toString();
  var minute = (now.getMinutes()).toString();
  var second = (now.getSeconds()).toString();
  if (month.length == 1) {
      month = "0" + month;
  }
  if (day.length == 1) {
      day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
   var dateTime = year + "-" + month + "-" + day +" "+ hour +":"+minute+":"+second;
   return dateTime;
}