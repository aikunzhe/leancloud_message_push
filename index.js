const http = require('http');

const token = process.env.PUSHPLUS_TOKEN; // 使用环境变量
const content = '123';
const url = `http://www.pushplus.plus/send?token=${token}&content=${encodeURIComponent(content)}`;

http.get(url, (res) => {
    console.log(`状态码: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
}).on('error', (error) => {
    console.error(error);
});
