/**
 * Convert images to WebP using PostCSS
-->input
 .image {
  background-image: url('image.jpg');
}
-->output
.image {
  background-image: url('image.jpg');
}
.webp .image {
  background-image: url('image.webp');
}

然后在页面入口使用js检测浏览器是否支持 webp ，支持的话为 body 添加 .webp 类否则添加 .no-webp 类
 */
const postcss = require('postcss');

/**
 * PostCSS plugin to add WebP versions of rules with image URLs
 */
module.exports = postcss.plugin('postcss-webp-images', (opts = {}) => {
  // Default options
  const options = {
    webpClass: 'webp',
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  };

  // Merge user options with defaults
  Object.assign(options, opts);

  // Compile regular expressions once
  const extensionsPattern = options.extensions.join('|');
  const hasImageUrlRegex = new RegExp(
    `url\\([^)]*\\.(${extensionsPattern})`,
    'i'
  );
  const replaceExtensionRegex = new RegExp(`\\.(${extensionsPattern})`, 'gi');

  return (root) => {
    // Process each rule
    root.walkRules((rule) => {
      let containsImageUrl = false;
      let webpRule = null;

      // Check if the rule contains an image URL
      rule.walkDecls((decl) => {
        if (hasImageUrlRegex.test(decl.value)) {
          containsImageUrl = true;

          // Create new rule if not already created
          if (!webpRule) {
            // Clone the original rule
            webpRule = rule.clone();

            // Modify the selector to add webp class
            webpRule.selector = `.${options.webpClass} ${rule.selector}`;
          }

          // Update image extensions in the webp rule
          const webpDecl = webpRule.nodes.find(
            (node) => node.prop === decl.prop
          );
          if (webpDecl) {
            webpDecl.value = decl.value.replace(replaceExtensionRegex, '.webp');
          }
        }
      });

      // Add the new rule if needed
      if (containsImageUrl && webpRule) {
        rule.parent.insertAfter(rule, webpRule);
      }
    });
  };
});
