// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
//实例化数据库连接
const db = cloud.database()
// 定义查询指令
const _ = db.command

async function getLargestWordId(word) {
  //word: true时返回word表的最大id，false时返回word_similar_relation的最大id
  if (word) {
    try {
      await db.collection('largest_id')
        .where({
          id: 0
        })
        .get()
        .then(res => {
          console.log(res)
          data = res.data[0].largest_id
          console.log("最大的id是")
          console.log(data)
        })
      return data
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      await db.collection('largest_id')
        .where({
          id: 0
        })
        .get()
        .then(res => {
          console.log(res)
          data = res.data[0].largest_similar_id
          console.log("最大的similar_id是")
          console.log(data)
        })
      return data
    } catch (e) {
      console.error(e)
    }
  }
}

function addOneToLargestWordId(word) {
  //word: true时将word表的最大id + 1 ，false时将word_similar_relation的最大id + 1
  if (word) {
    try {
      db.collection('largest_id')
        .where({
          id: 0
        })
        .update({
          data: {
            largest_id: _.inc(1)
          },
        })
        .then(res => {
          console.log("+1成功")
        })
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      db.collection('largest_id')
        .where({
          id: 0
        })
        .update({
          data: {
            largest_similar_id: _.inc(1)
          },
        })
    } catch (e) {
      console.error(e)
    }
  }
}

async function findWordOrAdd(word) {
  /*在word数据库中查找word，如果存在就返回word的id，如果不存在就加入数据库并返回id*/
  await db.collection('word')
    .where({
      word: word
    })
    .get()
    .then(res => {
      console.log('查词成功')
      data = res.data
      console.log(data)
    })
  if (data.length == 0) {
    //如果不存在该词语
    console.log("词语在数据库中不存在，开始添加")
    var id = await getLargestWordId(true) + 1
    to_add_word = {
      id: id,
      word: word,
      hot: 0
    }
    try {
      await db.collection('word')
        .add({
          data: to_add_word
        })
        .then(res => {
          console.log('添加成功')
        })
      await addOneToLargestWordId(true)
      return id
    } catch (e) {
      console.log("添加失败")
      console.error(e)
    }
  } else {
    console.log("在词库中已经存在词语" + word + "id是")
    console.log(id)
    return data.id
  }
}

// 云函数入口函数
exports.main = async (event, context) => {

  /** 检测是否必传了参数 start */
  if (event.word1 == undefined || event.word2 == undefined) {
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'
    var data = {}
    result.data = data
    return result
  }
  if (event.type == undefined) {
    var result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'
    var data = {}
    result.data = data
    return result
  }
  // 首先检测要添加的词组是否在数据库中已经存在
  await db.collection('word_similar_relation')
    .where(
      _.or([{
          word_name: event.word1,
          similar_word_name: event.word2,
        },
        {
          word_name: event.word2,
          similar_word_name: event.word1,
        }
      ])
    )
    .get()
    .then(res => {
      console.log('查询近义词典成功')
      data = res.data
      console.log(data)

    })
  if (data.length != 0) {
    //词库中已经存在这一对近义词
    var result = {}
    result.errCode = 1
    result.errMsg = '近义词组已存在！'
    var data = {}
    result.data = data
    return result
  } else {
    //如果词库中不存在这一对近义词
    var id1 = await findWordOrAdd(event.word1)
    var id2 = await findWordOrAdd(event.word2)
    var idr = await getLargestWordId(false) + 1
    try {
      to_add_pairs = {
        correlation: 0,
        id: idr,
        similar_word_name: event.word2,
        similar_word_id: id2,
        word_name: event.word1,
        word_id: id1,
        type: 1
      }
    await db.collection('word_similar_relation')
      .add({
        data: to_add_pairs
      })
      .then(res => {
        console.log('添加近义词组成功')
      })
    addOneToLargestWordId(false)
    } catch (e) {
      console.error(e)
    }

    var data = {}

    // 返回执行结果
    var result = {}
    result.errCode = 0
    result.errMsg = '添加近义词成功'

    return result
  }
}