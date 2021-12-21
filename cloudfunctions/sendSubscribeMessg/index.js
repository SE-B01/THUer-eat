// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event')
    console.log(event)
    date = new Date()
    time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
    console.log('opennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
    return await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        templateId: 'Yv59njM4WU9VKlileHqg0ceX12mJPnBoKTdLLoQ6fAM',
        miniprogram_state: 'developer',
        // 此处字段应修改为所申请模板所要求的字段
        data: {
        thing2: {
            value: '近义词小程序问题反馈',
        },
        time4: {
            value: time,
        },
        thing9: {
            value: 'hellow',
        },
        }
    })
}