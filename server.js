const express = require('express');
const axios = require('axios');
const AV = require('leancloud-storage');

const app = express();
const PORT = process.env.PORT || 3000;

// LeanCloud 初始化
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  serverURL: process.env.LEANCLOUD_API_SERVER,
});

// 中间件，用于解析请求体中的 JSON 数据
app.use(express.json());

// 定义路由
app.get('/sendDataToPushPlus', async (req, res) => {
  try {
    // 从 Comment 表获取一条数据
    const query = new AV.Query('Comment');
    const comment = await query.first();

    if (!comment) {
      return res.status(404).json({ error: 'No comment found' });
    }

    // 获取 PushPlus Token
    const pushPlusToken = process.env.PUSHPLUS_TOKEN;
    if (!pushPlusToken) {
      return res.status(500).json({ error: 'PushPlus Token is not set' });
    }

    // 构建要发送的数据
    const sendData = {
      token: pushPlusToken,
      title: 'Comment Data',
      content: `Comment: ${comment.get('content')}`, // 请根据 Comment 表的字段调整
    };

    // 发送数据到 PushPlus
    const response = await axios.post('https://pushplus.hxtrip.com/send', sendData);

    // 返回 PushPlus 的响应
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
