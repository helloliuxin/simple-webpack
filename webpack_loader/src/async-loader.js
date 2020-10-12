const fs = require('fs');
const path = require('path');
module.exports = function (source) {
  // webpack中默认开启loader缓存，可以使用this.cacheable(false)关闭缓存
  this.cacheable(false);
  const callback = this.async();

  fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, data) => {
    callback(null, data);
  });
};