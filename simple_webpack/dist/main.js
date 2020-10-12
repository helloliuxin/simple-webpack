(function(modules){
      function require(filename){
          var fn = modules[filename];
          var module = { exports: {}};
          fn(require, module, module.exports)
          return module.exports;
      }
      require('D:\study\simple-webpack\simple_webpack\src\index.js')
    })({'D:\study\simple-webpack\simple_webpack\src\index.js': function(require,module,exports){"use strict";

var _greeting = require("./greeting");

document.write((0, _greeting.greeting)('curry'));},'./greeting': function(require,module,exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;
function greeting(name) {
  return "hello " + name;
}},})