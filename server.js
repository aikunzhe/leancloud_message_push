const AV = require('leancloud-storage');
// const axios = require('axios');
const axios = require('axios/dist/node/axios.cjs');

// 初始化 LeanCloud SDK


// 使用查询获取所有 Class Name
const query = new AV.Query('Comment');
// let query = new AV.Query('Comment');
query.find().then(
  // 获取成功
  function (results) {
    const classNames = results.map(result => result.id);
    console.log('所有 Class Name:', classNames);
  },
  // 获取失败
  function (error) {
    console.error('获取 Class Name 失败', error);
  }
);
