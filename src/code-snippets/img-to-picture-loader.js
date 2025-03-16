/**
 * Convert img tags to picture tags
 input
 ```jsx
import React from "react";
import logo from "./assets/logo.pic.jpg";

function App() {
  return (
    <div className="app">
      <img src={logo} alt="logo" />
    </div>
  );
}

export default App;
 ```
 output
 ```jsx
 import React from "react";
import logo from "./assets/logo.pic.jpg";
import logoWebp from "./assets/logo.pic.webp";

function App() {
  return (
    <div className="app">
      <picture>
        <source type="image/webp" srcSet={logoWebp} />
        <img alt="logo" src={logo} />
      </picture>
    </div>
  );
}

export default App;
```
 */
// img-to-picture-loader.js
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

module.exports = function (source, sourceMap) {
  // Tell webpack that the output of this loader can be cached
  this.cacheable && this.cacheable();

  // Parse the source code
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  // Check if the file has any image imports
  const imageImports = new Map();
  let hasImgTags = false;

  // First pass: collect image imports and add WebP imports
  traverse(ast, {
    ImportDeclaration(path) {
      const importPath = path.node.source.value;
      // Check if import is likely an image (excluding WebP)
      if (
        (/\.(jpe?g|png|gif)$/i.test(importPath) ||
          importPath.includes('.pic.')) &&
        !importPath.endsWith('.webp')
      ) {
        const webpPath = importPath.replace(/\.(jpe?g|png|gif)$/i, '.webp');
        path.node.specifiers.forEach((specifier) => {
          if (t.isImportDefaultSpecifier(specifier)) {
            const originalName = specifier.local.name;
            imageImports.set(originalName, {
              original: importPath,
              webp: webpPath,
              webpIdentifier: originalName + 'Webp',
            });

            // Add WebP import
            const webpImport = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(originalName + 'Webp'))],
              t.stringLiteral(webpPath)
            );
            path.insertAfter(webpImport);
          }
        });
      }
    },
    JSXElement(path) {
      if (path.node.openingElement.name.name === 'img') {
        hasImgTags = true;
      }
    },
  });

  // If no image imports or no img tags, return source unchanged
  if (imageImports.size === 0 || !hasImgTags) {
    this.callback(null, source, sourceMap);
    return;
  }

  // Set to track already processed nodes to prevent infinite recursion
  const processedNodes = new WeakSet();

  // Second pass: transform img tags to picture tags
  traverse(ast, {
    JSXElement(path) {
      // Skip if this node has already been processed
      if (processedNodes.has(path.node)) {
        return;
      }

      const openingElement = path.node.openingElement;

      // Check if it's an img tag
      if (openingElement.name.name === 'img') {
        // Find the src attribute
        const srcAttr = openingElement.attributes.find(
          (attr) => t.isJSXAttribute(attr) && attr.name.name === 'src'
        );

        if (!srcAttr || !t.isJSXExpressionContainer(srcAttr.value)) {
          return;
        }

        const srcValue = srcAttr.value.expression;

        // Check if the src value is a variable from our image imports
        if (t.isIdentifier(srcValue) && imageImports.has(srcValue.name)) {
          const imageInfo = imageImports.get(srcValue.name);
          // Get other attributes except src
          const otherAttributes = openingElement.attributes.filter(
            (attr) => !(t.isJSXAttribute(attr) && attr.name.name === 'src')
          );

          // Create the img element for fallback
          const imgElement = t.jsxElement(
            t.jsxOpeningElement(
              t.jsxIdentifier('img'),
              [
                ...otherAttributes,
                t.jsxAttribute(
                  t.jsxIdentifier('src'),
                  t.jsxExpressionContainer(srcValue)
                ),
              ],
              true
            ),
            null,
            [],
            true
          );

          // Mark the img element as processed
          processedNodes.add(imgElement);

          // Create WebP source element
          const webpSource = t.jsxElement(
            t.jsxOpeningElement(
              t.jsxIdentifier('source'),
              [
                t.jsxAttribute(
                  t.jsxIdentifier('type'),
                  t.stringLiteral('image/webp')
                ),
                t.jsxAttribute(
                  t.jsxIdentifier('srcSet'),
                  t.jsxExpressionContainer(
                    t.identifier(imageInfo.webpIdentifier)
                  )
                ),
              ],
              true
            ),
            null,
            [],
            true
          );

          // Mark source element as processed
          processedNodes.add(webpSource);

          // Create the picture element
          const pictureElement = t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('picture'), [], false),
            t.jsxClosingElement(t.jsxIdentifier('picture')),
            [webpSource, imgElement],
            false
          );

          // Mark the picture element as processed
          processedNodes.add(pictureElement);

          // Replace the img element with the picture element
          path.replaceWith(pictureElement);
        }
      }
    },
  });

  // Generate the transformed code
  const output = generate(ast, {}, source);
  this.callback(null, output.code, sourceMap);
  return;
};
