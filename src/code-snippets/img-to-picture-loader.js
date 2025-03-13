const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    // 是否处理以 https:// 或 // 开头的图片资源
    processRemoteImages: {
      type: 'boolean',
    },
  },
};

module.exports = function (source, sourceMap) {
  this.cacheable && this.cacheable();

  const callback = this.async();
  const options = getOptions(this) || { processRemoteImages: false };
  validate(schema, options, {
    name: 'img-to-picture-loader',
  });

  // Default options
  const defaultOptions = {
    processRemoteImages: false,
  };

  const config = { ...defaultOptions, ...options };

  try {
    // Regular expression to find <img> tags with src attributes
    const imgRegex = /<img([^>]*)src=(['"])([^'"]+)(['"])([^>]*)>/g;

    // Transform the source
    const transformedSource = source.replace(
      imgRegex,
      (match, beforeSrc, quote1, src, quote2, afterSrc) => {
        // Get file extension
        const extension = path.extname(src).toLowerCase();

        // Skip transformation for SVGs or already processed pictures
        if (extension === '.svg' || match.includes('<picture>')) {
          return match;
        }
        // Skip remote images if not configured to process them
        if (
          !config.processRemoteImages &&
          (src.startsWith('http') || src.startsWith('//'))
        ) {
          return match;
        }

        // 直接替换扩展名生成 webp 路径
        const webpSrc = src.replace(extension, '.webp');

        // Construct the picture element
        return `
            <picture>
                <source srcset=${quote1}${webpSrc}${quote2} type="image/webp" />
                <img${beforeSrc}src=${quote1}${src}${quote2}${afterSrc}>
            </picture>
        `;
      }
    );

    callback(null, transformedSource, sourceMap);
  } catch (err) {
    callback(err);
  }
};
