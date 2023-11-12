const http = require('http');

const token = process.env.PUSHPLUS_TOKEN;
const message = "123";
const url = `http://www.pushplus.plus/send?token=${token}&content=${message}`;

http.get(url, (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    console.log('Message sent successfully:', data);
  });
}).on("error", (err) => {
  console.error('Error sending message to PushPlus:', err);
});
