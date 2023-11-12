const http = require('http');

const token = process.env.PUSHPLUS_TOKEN; // 使用环境变量
const content = '123';
const url = `http://www.pushplus.plus/send?token=${token}&content=${encodeURIComponent(content)}`;

http.get(url, (res) => {
    console.log(`状态码: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
        // 返回成功结果
    return { success: true, data: res };
}).on('error', (error) => {
    console.error(error);
    return { success: false, error: error.message };
});

return ;
