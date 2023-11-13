const AV = require('leancloud-storage');
// const axios = require('axios');
const axios = require('axios/dist/node/axios.cjs');

// LeanCloud 初始化
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  serverURL: process.env.LEANCLOUD_API_SERVER,
});
pushplusToken =  process.env.PUSHPLUS_TOKEN;

async function getCommentMesspushData() {

// 获取 Comment_messpush 表的一条数据
  const CommentMesspush = AV.Object.extend('Comment_messpush');
  const query = new AV.Query(CommentMesspush);
  query.descending('createdAt');  // 按创建时间降序排序
  query.limit(1);  // 获取一条数据
  const commentMesspushObject = await query.first();
  // 打印 Comment_messpush 表的内容
  // console.log('Comment_messpush data:', commentMesspushObject.toJSON());
  commentMesspushObjectjson = commentMesspushObject.toJSON();
  // console.log('Comment_messpush data:', commentMesspushObjectjson);



  // 搜索 Comment 表的数据
  const Comment = AV.Object.extend('Comment');
  const commentQuery = new AV.Query(Comment);

  commentQuery.greaterThan('insertedAt',  new Date(commentMesspushObjectjson.time));
  commentQuery.descending('insertedAt'); // 按 insertedAt 降序排序
  const commentObjects = await commentQuery.find();
  newTime = 0;

  const length = commentObjects.length;
  let content = '';
  if(length){
    // 将 commentObjects 数组转换为 JSON 字符串
    content = JSON.stringify(commentObjects.map(commentObject => commentObject.toJSON('\n\n')), null, 2);

    // 提取关键信息并整理格式
    content = commentObjects.map(commentObject => {
        return `
        Nick: ${commentObject.get('nick')},<br>
        Mail: ${commentObject.get('mail')},<br>
        Comment: ${commentObject.get('comment')},<br>
        URL: ${commentObject.get('url')}<br>
        `;
    }).join('<br>');

  }

  // 发送数据到 PushPlus
  const pushplusUrl = `https://pushplus.plus/send?token=${pushplusToken}&title=LeanCloud${commentObjects.length}条评论回66复&content=${content}`;
  await axios.get(pushplusUrl);

}


// 执行函数
getCommentMesspushData();

