// font-subsetting-plugin.js
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { execSync } = require('child_process');
const { RawSource } = require('webpack').sources;
const { createHash } = require('crypto');
const { validate } = require('schema-utils');

/**
 * Schema for plugin options validation
 * @type {import("schema-utils/declarations/validate").Schema}
 */
const schema = {
  type: 'object',
  properties: {
    fonts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          family: { type: 'string' },
          source: { type: 'string' },
        },
        required: ['family', 'source'],
        additionalProperties: false,
      },
    },
    include: { instanceof: 'RegExp' },
    exclude: { instanceof: 'RegExp' },
    outputDir: { type: 'string' },
    formats: {
      type: 'array',
      items: { enum: ['woff2', 'woff', 'ttf', 'otf'] },
    },
    forceInclude: { type: 'string' },
    persistent: { type: 'boolean' },
    replaceCssReferences: { type: 'boolean' },
    i18n: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        locales: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

/**
 * FontSubsettingPlugin - A webpack plugin that creates optimized font subsets
 * based on the actual text content used in your application.
 */
class FontSubsettingPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: 'FontSubsettingPlugin',
      baseDataPath: 'options',
    });
    this.options = {
      // Font files to process
      fonts: [], // Array of {family: 'Font Name', source: '/path/to/font.ttf|woff|woff2'}
      // Files to scan for used characters
      include: /\.(js|jsx|ts|tsx|html|css|scss|less|vue|svelte)$/,
      // Files to ignore
      exclude: /node_modules/,
      // Output directory for subset fonts (relative to webpack output path)
      outputDir: 'fonts',
      // Output formats
      formats: ['woff2', 'woff'],
      // Characters that should always be included (e.g., common punctuation)
      forceInclude:
        ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:!?-_"\'()[]{}#@$%^&*+=/<>\\|~`',
      // Remember used characters between builds (for watch mode)
      persistent: true,
      // Replace font references in CSS files
      replaceCssReferences: true,
      // Add used characters from translated content
      i18n: {
        enabled: false,
        locales: [], // Array of locale files to scan
      },
      // Override with user options
      ...options,
    };

    // Set for tracking used characters
    this.usedChars = new Set(this.options.forceInclude.split(''));

    // Cache for storing and retrieving processed font information
    this.fontCache = new Map();

    // Persistent cache file path
    this.cacheFile = path.resolve(
      process.cwd(),
      'node_modules/.cache/font-subsetting-plugin-cache.json'
    );

    // Load persistent cache if enabled
    if (this.options.persistent && fs.existsSync(this.cacheFile)) {
      try {
        const cachedData = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        if (cachedData && cachedData.chars) {
          cachedData.chars.forEach((char) => this.usedChars.add(char));
        }
      } catch (e) {
        // Ignore cache loading errors
        console.warn('Font subsetting plugin: Failed to load cache file');
      }
    }
  }

  /**
   * Apply the plugin to webpack
   * @param {Object} compiler - Webpack compiler instance
   */
  apply(compiler) {
    const pluginName = 'FontSubsettingPlugin';

    // Access webpack's compilation process
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Hook into the optimize assets phase
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        (assets, callback) => {
          this.processAssets(assets, compilation)
            .then(() => callback())
            .catch((err) => {
              compilation.errors.push(
                new Error(`Font subsetting failed: ${err.message}`)
              );
              callback();
            });
        }
      );
    });

    // Hook into the watchRun for watch mode support
    compiler.hooks.watchRun.tapAsync(pluginName, (compilation, callback) => {
      // Reset the used characters set if not using persistent cache
      if (!this.options.persistent) {
        this.usedChars = new Set(this.options.forceInclude.split(''));
      }
      callback();
    });

    // Save the cache when compilation is done
    compiler.hooks.done.tap(pluginName, (stats) => {
      if (this.options.persistent) {
        this.savePersistentCache();
      }
    });
  }

  /**
   * Process webpack assets to collect used characters and create font subsets
   * @param {Object} assets - Webpack assets
   * @param {Object} compilation - Webpack compilation
   */
  async processAssets(assets, compilation) {
    // Step 1: Extract characters from source files
    this.extractCharsFromAssets(assets);

    // Step 2: Extract characters from i18n files if enabled
    if (this.options.i18n.enabled) {
      await this.extractCharsFromI18n();
    }

    // Step 3: Create font subsets for each font and format
    await Promise.all(
      this.options.fonts.map(async (font) => {
        await this.createFontSubsets(font, compilation);
      })
    );

    // Step 4: Update CSS references if enabled
    if (this.options.replaceCssReferences) {
      this.replaceFontReferencesInCss(assets, compilation);
    }
  }

  /**
   * Extract used characters from webpack assets
   * @param {Object} assets - Webpack assets
   */
  extractCharsFromAssets(assets) {
    for (const [filename, asset] of Object.entries(assets)) {
      // Skip files that don't match our include pattern or match exclude
      if (
        !this.options.include.test(filename) ||
        (this.options.exclude && this.options.exclude.test(filename))
      ) {
        continue;
      }

      const content = asset.source().toString();
      this.extractCharsFromString(content);
    }
  }

  /**
   * Extract characters from a string
   * @param {String} text - Text to extract characters from
   */
  extractCharsFromString(text) {
    // Extract all unique characters and add to the set
    for (const char of text) {
      this.usedChars.add(char);
    }
  }

  /**
   * Extract characters from i18n files
   */
  async extractCharsFromI18n() {
    if (!this.options.i18n.enabled || !this.options.i18n.locales.length) {
      return;
    }

    for (const localeFile of this.options.i18n.locales) {
      try {
        if (fs.existsSync(localeFile)) {
          const content = fs.readFileSync(localeFile, 'utf8');

          // Handle JSON format
          if (localeFile.endsWith('.json')) {
            try {
              const localeData = JSON.parse(content);
              this.extractCharsFromLocaleObject(localeData);
            } catch (e) {
              console.warn(
                `Failed to parse locale file ${localeFile}: ${e.message}`
              );
            }
          } else {
            // For other formats, just extract all characters
            this.extractCharsFromString(content);
          }
        }
      } catch (e) {
        console.warn(`Failed to read locale file ${localeFile}: ${e.message}`);
      }
    }
  }

  /**
   * Extract characters from a locale object recursively
   * @param {Object} obj - Locale data object
   */
  extractCharsFromLocaleObject(obj) {
    if (typeof obj === 'string') {
      this.extractCharsFromString(obj);
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item) => this.extractCharsFromLocaleObject(item));
      return;
    }

    if (obj && typeof obj === 'object') {
      Object.values(obj).forEach((value) =>
        this.extractCharsFromLocaleObject(value)
      );
    }
  }

  /**
   * Create font subsets for a specific font
   * @param {Object} font - Font configuration
   * @param {Object} compilation - Webpack compilation
   */
  async createFontSubsets(font, compilation) {
    const { family, source } = font;

    if (!fs.existsSync(source)) {
      compilation.errors.push(new Error(`Font file not found: ${source}`));
      return;
    }

    // Read the source font file
    const fontBuffer = fs.readFileSync(source);

    // Generate cache key based on font file and used characters
    const cacheKey = this.generateFontCacheKey(
      family,
      fontBuffer,
      this.usedChars
    );

    // Check if we already have this font subset in cache
    if (this.fontCache.has(cacheKey)) {
      const cachedFonts = this.fontCache.get(cacheKey);

      // Emit the cached font subsets
      for (const { format, buffer } of cachedFonts) {
        const outputPath = path.join(
          this.options.outputDir,
          `${family}-subset.${format}`
        );
        compilation.emitAsset(outputPath, new RawSource(buffer));
      }

      return;
    }

    try {
      // Load the font using fontkit
      const font = fontkit.openSync(source);

      // Get the Unicode codepoints for all characters in our set
      const codepoints = [];
      for (const char of this.usedChars) {
        try {
          const glyph = font.glyphForCodepoint(char.codePointAt(0));
          if (glyph) {
            codepoints.push(char.codePointAt(0));
          }
        } catch (e) {
          // Ignore characters not in the font
        }
      }

      // Create a temporary directory for font processing
      const tempDir = path.resolve(process.cwd(), '.font-subset-temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Write the temporary font file
      const tempFontPath = path.join(tempDir, path.basename(source));
      fs.writeFileSync(tempFontPath, fontBuffer);

      // Create a Unicode range string for pyftsubset
      const unicodeRange = this.createUnicodeRangeString(codepoints);

      // Store output font buffers
      const outputFonts = [];

      // Create subsets for each requested format
      for (const format of this.options.formats) {
        const outputPath = path.join(
          this.options.outputDir,
          `${family}-subset.${format}`
        );
        const fullOutputPath = path.join(
          compilation.outputOptions.path,
          outputPath
        );

        // Ensure output directory exists
        const outputDir = path.dirname(fullOutputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Use pyftsubset to create the subset
        // This requires fonttools to be installed: pip install fonttools
        const tempOutputPath = path.join(tempDir, `${family}-subset.${format}`);

        try {
          const cmd = `pyftsubset "${tempFontPath}" --output-file="${tempOutputPath}" --unicodes=${unicodeRange} --flavor=${format}`;
          execSync(cmd, { stdio: 'pipe' });

          if (fs.existsSync(tempOutputPath)) {
            // Read the subset font and emit it as a webpack asset
            const subsetBuffer = fs.readFileSync(tempOutputPath);

            // Store in output fonts array for caching
            outputFonts.push({
              format,
              buffer: subsetBuffer,
            });

            // Emit the asset
            compilation.emitAsset(outputPath, new RawSource(subsetBuffer));
          } else {
            throw new Error(`Subset file not created: ${tempOutputPath}`);
          }
        } catch (e) {
          compilation.errors.push(
            new Error(
              `Failed to create font subset for ${family}: ${e.message}`
            )
          );
        }
      }

      // Clean up the temporary directory
      try {
        this.cleanupTempDir(tempDir);
      } catch (e) {
        // Ignore cleanup errors
      }

      // Cache the resulting fonts
      if (outputFonts.length > 0) {
        this.fontCache.set(cacheKey, outputFonts);
      }
    } catch (e) {
      compilation.errors.push(
        new Error(`Font processing error for ${family}: ${e.message}`)
      );
    }
  }

  /**
   * Replace font references in CSS files
   * @param {Object} assets - Webpack assets
   * @param {Object} compilation - Webpack compilation
   */
  replaceFontReferencesInCss(assets, compilation) {
    for (const [filename, asset] of Object.entries(assets)) {
      // Only process CSS files
      if (!filename.endsWith('.css')) {
        continue;
      }

      let cssContent = asset.source().toString();
      let modified = false;

      // Replace @font-face declarations for each font
      for (const { family } of this.options.fonts) {
        // Create a regex to find @font-face blocks for this font family
        const fontFaceRegex = new RegExp(
          `@font-face\\s*{[^}]*font-family\\s*:\\s*(['"])${family}\\1[^}]*}`,
          'gi'
        );

        // Find all @font-face blocks
        const matches = cssContent.match(fontFaceRegex);

        if (matches) {
          modified = true;

          // Generate replacement @font-face rules with subset fonts
          const fontFormats = {
            woff2: 'woff2',
            woff: 'woff',
            ttf: 'truetype',
            otf: 'opentype',
          };

          const subsetSources = this.options.formats
            .map((format) => {
              const formatType = fontFormats[format] || format;
              return `url("${this.options.outputDir}/${family}-subset.${format}") format("${formatType}")`;
            })
            .join(', ');

          // Replace each matched @font-face block
          for (const match of matches) {
            // Extract font-weight and font-style if present
            const weightMatch = match.match(/font-weight\s*:\s*([^;]+)/i);
            const styleMatch = match.match(/font-style\s*:\s*([^;]+)/i);

            const weight = weightMatch ? weightMatch[1].trim() : 'normal';
            const style = styleMatch ? styleMatch[1].trim() : 'normal';

            // Create new @font-face rule
            const replacement = `@font-face {
  font-family: "${family}";
  font-weight: ${weight};
  font-style: ${style};
  src: ${subsetSources};
  font-display: swap;
}`;

            cssContent = cssContent.replace(match, replacement);
          }
        }
      }

      // Update the asset if modifications were made
      if (modified) {
        compilation.updateAsset(filename, new RawSource(cssContent));
      }
    }
  }

  /**
   * Create a Unicode range string for pyftsubset
   * @param {Array} codepoints - Array of Unicode codepoints
   * @returns {String} - Unicode range string
   */
  createUnicodeRangeString(codepoints) {
    if (codepoints.length === 0) {
      // Include at least the space character
      return 'U+0020';
    }

    // Sort codepoints
    codepoints.sort((a, b) => a - b);

    // Create range string
    const ranges = [];
    let rangeStart = codepoints[0];
    let rangeEnd = codepoints[0];

    for (let i = 1; i < codepoints.length; i++) {
      if (codepoints[i] === rangeEnd + 1) {
        // Continue the current range
        rangeEnd = codepoints[i];
      } else {
        // End the current range and start a new one
        if (rangeStart === rangeEnd) {
          ranges.push(`U+${rangeStart.toString(16).padStart(4, '0')}`);
        } else {
          ranges.push(
            `U+${rangeStart.toString(16).padStart(4, '0')}-${rangeEnd
              .toString(16)
              .padStart(4, '0')}`
          );
        }

        rangeStart = codepoints[i];
        rangeEnd = codepoints[i];
      }
    }

    // Add the last range
    if (rangeStart === rangeEnd) {
      ranges.push(`U+${rangeStart.toString(16).padStart(4, '0')}`);
    } else {
      ranges.push(
        `U+${rangeStart.toString(16).padStart(4, '0')}-${rangeEnd
          .toString(16)
          .padStart(4, '0')}`
      );
    }

    return ranges.join(',');
  }

  /**
   * Generate a cache key for a font subset
   * @param {String} family - Font family name
   * @param {Buffer} fontBuffer - Font file buffer
   * @param {Set} chars - Set of used characters
   * @returns {String} - Cache key
   */
  generateFontCacheKey(family, fontBuffer, chars) {
    const charString = Array.from(chars).sort().join('');

    return createHash('md5')
      .update(family)
      .update(fontBuffer)
      .update(charString)
      .digest('hex');
  }

  /**
   * Save the persistent cache to disk
   */
  savePersistentCache() {
    try {
      const cacheDir = path.dirname(this.cacheFile);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const cacheData = {
        chars: Array.from(this.usedChars),
      };

      fs.writeFileSync(this.cacheFile, JSON.stringify(cacheData, null, 2));
    } catch (e) {
      console.warn('Font subsetting plugin: Failed to save cache file');
    }
  }

  /**
   * Clean up temporary directory
   * @param {String} tempDir - Path to temporary directory
   */
  cleanupTempDir(tempDir) {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
      fs.rmdirSync(tempDir);
    }
  }
}

module.exports = FontSubsettingPlugin;
