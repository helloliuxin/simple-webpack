// parser.js
// 这里做的是转换成AST树，将ES6转换成ES5，分析依赖
// 生成AST树，需要借助babylon，先安装下 npm i babylon -S
const babylon = require('babylon'); // 引入babylon
const fs = require('fs');  // 引入node中fs模块
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {
  // 生成AST树，根据文件路径生成
  getAST: path => {
    // 同步读取文件
    const source = fs.readFileSync(path, 'utf-8');
    // 使用babylon的parse方法进行生产AST
    return babylon.parse(source, {
      sourceType: 'module',
    });
  },
  // 分析依赖的方法 进行依赖分析，需要借助babel-traverse，这里安装下
  // npm i babel-traverse -S
  getDependencies: ast => {
    const dependencies = [];
    traverse(ast, {
      // ImportDeclaration: 分析import语句
      ImportDeclaration: ({ node }) => {
        // 将依赖push到dependcies中
        dependencies.push(node.source.value);
      },
    });
    // 将依赖返回
    return dependencies;
  },

  // 现在把ES6转成了AST树，接下来将AST树转换成源码，也就是ES5
  // 将AST树转换成ES5，需要借助babel-core，先安装下 npm i babel-core -S
  // 将AST树转换成ES5
  transform: ast => {
    const { code } = transformFromAst(ast, null , {
      presets: ['env'],
    });
    return code;
    // 此时安装下env npm i @babel/preset-env babel-preset-env -S
  },
};