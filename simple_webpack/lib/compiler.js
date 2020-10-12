const { getAST, getDependencies, transform } = require("./parser");
const path = require('path');
const fs = require('fs');

// compiler.js
module.exports = class Compiler {
  constructor(options) {
    // 这里的options就是simplepack到处的配置项
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    // 我们需要把依赖全部放到一个数组中，定义this.modules来填充依赖。
    this.modules = [];
  }

  run() {
    const entryModule = this.buildModule(this.entry, true);
    // console.log(entryModule);
    // 把依赖全部push到modules中
    this.modules.push(entryModule);
    // 遍历递归
    this.modules.map(_module => {
      _module.dependencies.map(dependency => {
        this.modules.push(this.buildModule(dependency));
      });
    });
    // console.log(this.modules)
    this.emitFiles();
  }

  // 模板构建
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      // 这里需要找到绝对路径，通过path转换下
      console.log('process.cwd(): ', process.cwd());
      const absolutePath = path.join(process.cwd(), './src', filename + '.js');
      ast = getAST(absolutePath);
    }
    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast),
    };
  }

  // 输出文件
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = '';
    this.modules.map(_module => {
      modules += `'${_module.filename}': function(require,module,exports){${_module.source}},`;
    });
    // 自执行
    const bundle = `(function(modules){
      function require(filename){
          var fn = modules[filename];
          var module = { exports: {}};
          fn(require, module, module.exports)
          return module.exports;
      }
      require('${this.entry}')
    })({${modules}})`;

    console.log('bundle ==> ', bundle);
    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
}