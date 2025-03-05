# Sourcemaps

正常情况下 node_modules 下的模块不会被 webpack 添加 sourcemap，只会直接加载内容
如果需要调试 node_modules 下的模块，需要通过如下方式处理 node_modules 下的模块

Working process of sourcemaploader
1.Initial Setup and Source Map URL Extraction :

The loader receives input code and an optional input source map
Gets options using this.getOptions(schema)
Extracts the source mapping URL from the input using getSourceMappingURL

2.Source Map URL Handling :

If no source mapping URL is found, returns the original input and map
Checks the filterSourceMappingUrl option to determine behavior:

"skip" : Returns original input and map
"remove" : Removes the source map URL comment and returns
"consume" : (default) Proceeds to process the source map

3.Source Map Fetching and Parsing :

Fetches the source map content using fetchFromURL
Parses the JSON content into a map object
If parsing fails, emits a warning and returns original input

4.Source Map Processing :

If the map contains sections, flattens it using flattenSourceMap
Processes each source in the map:

Resolves source URLs
Fetches source contents
Adds dependencies for local files
Handles source content from the original map

5.Final Map Generation :

Creates a new map object with resolved sources
Removes the sourceRoot property
Updates sources and sourcesContent arrays
Removes sourcesContent if all entries are empty

6.Output :

Returns the processed input (with source map URL removed) and the new source map

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        include: /node_modules/, // Apply to node_modules
      },
    ],
  },
};
```
