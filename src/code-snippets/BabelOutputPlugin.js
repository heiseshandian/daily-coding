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
