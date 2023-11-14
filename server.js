const AV = require('leancloud-storage');
const axios = require('axios');
// const axios = require('axios/dist/node/axios.cjs');

// 初始化 LeanCloud SDK
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  serverURL: process.env.LEANCLOUD_API_SERVER,
});
pushplusToken =  process.env.PUSHPLUS_TOKEN;
siteUrl  =  process.env.SITE_URL;

async function getCommentMesspushData() {

  // 获取 Comment_messpush 表的一条数据
  const CommentMesspush = AV.Object.extend('Comment_messpush');
  const query = new AV.Query(CommentMesspush);
  query.descending('createdAt');  // 按创建时间降序排序
  query.limit(1);  // 获取一条数据
  const commentMesspushObject = await query.first();
  commentMesspushObjectjson = commentMesspushObject.toJSON();
  console.log('打印 Comment_messpush 表的内容:', commentMesspushObjectjson.time);

  // 搜索 Comment 表的数据
  const Comment = AV.Object.extend('Comment');
  const commentQuery = new AV.Query(Comment);
  // 创建一个 Date 对象，表示 '2023-11-12 23:34:55'
  let dateObject = new Date(commentMesspushObjectjson.time);
  console.log('打印 dateObject 表的内容:', dateObject);
  commentQuery.greaterThan('insertedAt', dateObject);  //where条件
  commentQuery.descending('insertedAt'); // 按 insertedAt 降序排序
  const commentObjects = await commentQuery.find();
  newTime = 0;

  const length = commentObjects.length;
  console.log('length data:', length);
  let content = '';
  if(length){

    const firstComment = commentObjects[0];
    newTime = firstComment.get('insertedAt');

    // 将 commentObjects 数组转换为 JSON 字符串
    content = JSON.stringify(commentObjects.map(commentObject => commentObject.toJSON('\n\n')), null, 2);
    console.log('contentdata:',  content);

    // 提取关键信息并整理格式
    content = commentObjects.map(commentObject => {
        return `
        Nick: ${commentObject.get('nick')},<br>
        Mail: ${commentObject.get('mail')},<br>
        Comment: ${commentObject.get('comment')},<br>
        URL:<a href="${siteUrl+commentObject.get('url')}">${siteUrl+commentObject.get('url')}</a><br>
        `;
    }).join('<br>');
    // console.log('content data:', content);

    // 发送数据到 PushPlus
    const pushplusUrl = `https://pushplus.plus/send?token=${pushplusToken}&title=博客收到${commentObjects.length}条评论回复&content=${content}`;
    await axios.get(pushplusUrl);

    // 更新 time 字段
    // 获取年、月、日、时、分、秒
    const year = newTime.getFullYear();
    const month = String(newTime.getMonth() + 1).padStart(2, '0');
    const day = String(newTime.getDate()).padStart(2, '0');
    const hours = String(newTime.getHours()).padStart(2, '0');
    const minutes = String(newTime.getMinutes()).padStart(2, '0');
    const seconds = String(newTime.getSeconds()+1).padStart(2, '0'); // 增加一秒
    // 构建日期时间字符串
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    commentMesspushObject.set('time', formattedDateString);
    await commentMesspushObject.save();
    console.log('更新 time data:', formattedDateString);
  }else{
    console.log('暂时没有数据更新');
  }
}
// 执行函数
getCommentMesspushData();
