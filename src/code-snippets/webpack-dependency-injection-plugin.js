/**
 *use case
 new DependencyInjectionPlugin({
  replacements: {
    './src/branding/theme.js': `./src/branding/clients/${clientId}/theme.js`,
    './src/branding/config.js': `./src/branding/clients/${clientId}/config.js`,
  }
})
 */
const { validate } = require('schema-utils');

/**
 * Schema for plugin options validation
 * @type {import("schema-utils/declarations/validate").Schema}
 */
const schema = {
  type: 'object',
  properties: {
    replacements: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
  },
  additionalProperties: false,
};

// Custom dependency injection plugin
class DependencyInjectionPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: 'DependencyInjectionPlugin',
      baseDataPath: 'options',
    });
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      'DependencyInjectionPlugin',
      (nmf) => {
        nmf.hooks.beforeResolve.tap('DependencyInjectionPlugin', (result) => {
          if (!result) return false;

          // Check if this module should be replaced
          if (
            this.options.replacements &&
            this.options.replacements[result.request]
          ) {
            // Replace the request with our custom implementation
            result.request = this.options.replacements[result.request];
          }
        });
      }
    );
  }
}

module.exports = DependencyInjectionPlugin;
