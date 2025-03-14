/**
 * 用于查看某个 loader 执行前后的输入输出
 * 比如说我们想看 babel-loader 的输出
 * 
 {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
    // loader 的执行顺序是从后向前，直接把 babel-loader 放到 inspector-loader 前面即可看到 babel-loader 的输出
    // 可用于排查 tree-shaking 不生效之类的问题，（如果 import/export 被转成 require 了就会导致 tree-shaking 失效）
      path.resolve(__dirname, "./inspector-loader.js"),
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
 */
const fs = require('fs');
const path = require('path');

module.exports = function (source, sourceMap) {
  const options = this.getOptions() || {};
  const outputDir = options.outputDir || 'inspector-output';

  // Create absolute output directory path
  const absOutputDir = path.isAbsolute(outputDir)
    ? outputDir
    : path.resolve(process.cwd(), outputDir);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(absOutputDir)) {
    fs.mkdirSync(absOutputDir, { recursive: true });
  }

  // Generate output file path based on resource path
  const relativePath = path.relative(process.cwd(), this.resourcePath);
  const outputPath = path.join(absOutputDir, relativePath);

  // Create parent directories if they don't exist
  const outputDirname = path.dirname(outputPath);
  if (!fs.existsSync(outputDirname)) {
    fs.mkdirSync(outputDirname, { recursive: true });
  }

  // Write source to file
  fs.writeFileSync(outputPath, source, 'utf8');
  console.log(`Wrote inspected source to: ${outputPath}`);

  this.callback(null, source, sourceMap);
  return;
};
