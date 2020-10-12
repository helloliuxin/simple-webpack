const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders(
  {
    resource: path.join(__dirname, './src/demo.txt'),
    loaders: [path.join(__dirname, './src/async-loader.js')],
    // 有的loader是有参数的，怎么获取? 使用loader-utils包  npm i loader-utils -S
    // 在run-loader.js中引入一个参数
    // loaders: [
    //   {
    //     loader: path.join(__dirname, './src/raw-loader.js'),
    //     options: {
    //       name: 'test',
    //     },
    //   },
    // ],
    context: {
      minimize: true,
    },
    readResource: fs.readFile.bind(fs),
  },
  (err, res) => {
    err ? console.log('err => ', err) : console.log('res ==> ', res);
  }
);