// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  /** 检测是否必传了参数 start */
  if(event.relation_id == undefined){

    // 返回执行结果
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'

    var data = {}
    result.data = data

    return result

  }
  /** 检测是否必传了参数 end */


  // 查出该近义词关系
  
  // 实例化数据库
  const db = cloud.database()

  var relation;

  await db.collection('word_similar_relation')
  .where({
    id: parseInt(event.relation_id)
  })
  .get()
  .then(res =>{
    console.log('查询关系成功')
    console.log(res.data)

    relation = res.data[0]

  })

  /** 判断该关系是否存在 start */
  if(relation == undefined){

    var result = {}
    result.errCode = 3
    result.errMsg = '不存在该关系，更新失败'

    var data = {}
    data.relation_id = event.relation_id

    result.data = data

    return result
  }
  /** 判断该关系是否存在 end */

  
  /** 为该关系的强度+1 start */
  await db.collection('word_similar_relation')
  .where({
    id: relation.id
  })
  .update({
    data: {
      correlation: relation.correlation + 1
    }
  })
  .then(res => {
    console.log('修改关系操作成功')
    console.log(res)

    relation.correlation += 1

  })

  /** 为该关系的强度+1 end */

  var result = {}

  result.errCode = 0
  result.errMsg = '相关性更新成功'

  var data = {}
  data.relation = relation

  result.data = data

  return result


}