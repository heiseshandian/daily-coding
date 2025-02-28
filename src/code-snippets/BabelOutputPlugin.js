/**
 * `BabelOutputPlugin` 是一个 Webpack 插件，主要功能是：

1. 收集经过 Babel 转换后的 JavaScript 代码输出
2. 将转换后的代码保存到指定的 `babel-output` 目录中
3. 保持原始文件名，但存放在新的目录下

具体工作流程：

1. 插件通过 Webpack 的 `emit` 钩子（在生成资源到 output 目录之前触发）来执行
2. 遍历所有的模块（`compilation.modules`）
3. 针对每个 `.js` 文件：
   - 获取经过 Babel 转换后的源代码
   - 在 `babel-output` 目录下创建对应的输出文件
   - 保存转换后的代码内容

这个插件的主要用途是帮助开发者查看和调试 Babel 转换后的代码，可以方便地比对转换前后的差异，
对于理解 Babel 的转换过程和调试转换问题很有帮助。
 */
const path = require('path');

class BabelOutputPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'BabelOutputPlugin',
      (compilation, callback) => {
        compilation.modules.forEach((module) => {
          module = module.rootModule || module;
          if (module.resource && module.resource.endsWith('.js')) {
            const outputPath = path.join(
              'babel-output',
              path.basename(module.resource)
            );
            // Get the transformed source
            const source = module._source ? module._source._value : '';
            compilation.assets[outputPath] = {
              source: () => source,
              size: () => source.length,
            };
          }
        });
        callback();
      }
    );
  }
}

module.exports = BabelOutputPlugin;
