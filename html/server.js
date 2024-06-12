const express = require('express');
const path = require('path');

function createHtmlServer(port=3000) {
  const app = express();

  // 注册静态资源目录
  app.use('/', express.static(path.join(__dirname, '../html/military_simulation/Games/')));
  app.use('/assets', express.static(path.join(__dirname, '../html/military_simulation/Games/assets')));
  app.use('/css', express.static(path.join(__dirname, '../html/military_simulation/Games/css')));
  app.use('/js', express.static(path.join(__dirname, '../html/military_simulation/Games/js')));
  // 如果index.html在某个特定的文件夹如'views'
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'../html/military_simulation/Games/index.html'));
  });

  const PORT = process.env.PORT || port;
  app.listen(PORT, function() {
    console.log('Server started on port ' + PORT);
  });

  return 'http://localhost:'+PORT;
}

export default {
  createHtmlServer
};

