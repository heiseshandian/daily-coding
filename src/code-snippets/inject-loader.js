// webpack-inject-loader.js
/**
 * 用于在构建的时候动态注入一些代码，
 * 比如在开发环境下，我们可以注入一些模拟数据，避免把mock相关逻辑直接写入代码中，避免 msw 相关依赖被打入最终产物中。
 argv.mode === "development" && {
    test: /\.js$/,
    include: [
      path.resolve(__dirname, "src/index.js"), // Only apply to the entry file
    ],
    use: [
      {
        loader: path.resolve("./loaders/inject-loader.js"),
        options: {
          injections: [
            "import {worker} from './mocks/browser.js'",
            "await worker.start()",
          ],
        },
      },
    ],
  },
 */

/**
 * A webpack loader that injects code after the last import statement
 * @param {string} source - The source code of the file being processed
 * @returns {string} - The transformed source code
 */
module.exports = function (source, sourceMap) {
  // Make this loader cacheable if possible
  if (this.cacheable) {
    this.cacheable();
  }

  const options = this.getOptions() || {};

  // Default options
  const { injections = [] } = options;

  const injectionCode = injections.join(';\n');

  // Find the position to insert after the last import statement
  const importRegex = /^import\s+.+?['"];?$/gm;
  const matches = [...source.matchAll(importRegex)];

  if (matches.length === 0) {
    // No imports found, prepend to the beginning
    this.callback(null, `${injectionCode}\n${source}`, sourceMap);
    return;
  }

  // Get the last import statement
  const lastImport = matches[matches.length - 1];
  const lastImportEndIndex = lastImport.index + lastImport[0].length;

  // Split the source code at the end of the last import statement
  const beforeInjection = source.substring(0, lastImportEndIndex);
  const afterInjection = source.substring(lastImportEndIndex);

  // Construct the transformed source with injected code
  this.callback(
    null,
    `${beforeInjection}\n${injectionCode}\n${afterInjection}`,
    sourceMap
  );
  return;
};
