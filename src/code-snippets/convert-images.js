/**
 * 给定图片目录，将图片转换为 webp 格式
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

// Configuration options
const config = {
  formats: ['webp'],
  quality: {
    webp: 80,
  },
  concurrency: Math.max(1, os.cpus().length - 1),
};

/**
 * Process a single image file
 * @param {string} imagePath - Path to the source image
 */
async function processImage(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const sharpInstance = sharp(imageBuffer);

    // Process each target format
    for (const format of config.formats) {
      const outputPath = imagePath.replace(/\.[^\.]+$/, `.${format}`);

      // Skip if output file already exists
      try {
        await fs.access(outputPath);
        console.log(`Skipping ${outputPath} - file already exists`);
        continue;
      } catch {}

      const converter = sharpInstance.clone();

      // Configure format-specific options
      if (format === 'webp') {
        converter.webp({ quality: config.quality.webp });
      }

      await converter.toFile(outputPath);
      console.log(`Converted ${imagePath} -> ${outputPath}`);
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
  }
}

/**
 * Process all images in the given directories
 * @param {string[]} directories - Array of directory paths
 */
async function processDirectories(directories) {
  try {
    const imageFiles = [];

    // Collect all image files from directories that need processing
    for (const dir of directories) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isFile() && /\.(jpe?g|png|gif)$/i.test(file)) {
          // Check if all format versions already exist
          const needsProcessing = config.formats.some((format) => {
            const outputPath = filePath.replace(/\.[^\.]+$/, `.${format}`);
            try {
              fs.accessSync(outputPath);
              return false; // Format version exists
            } catch {
              return true; // Format version doesn't exist
            }
          });

          if (needsProcessing) {
            imageFiles.push(filePath);
          } else {
            console.log(`Skipping ${filePath} - all formats already exist`);
          }
        }
      }
    }

    if (imageFiles.length === 0) {
      console.log('No image files found in the specified directories');
      return;
    }

    console.log(`Found ${imageFiles.length} images to process`);

    // Process images with concurrency limit
    const chunks = [];
    for (let i = 0; i < imageFiles.length; i += config.concurrency) {
      chunks.push(imageFiles.slice(i, i + config.concurrency));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(processImage));
    }

    console.log('All images processed successfully');
  } catch (error) {
    console.error('Error processing directories:', error.message);
  }
}

// Example usage
if (require.main === module) {
  const directories = process.argv.slice(2);
  if (directories.length === 0) {
    console.log('Usage: node convert-images.js <directory1> <directory2> ...');
    process.exit(1);
  }
  processDirectories(directories);
}

module.exports = { processDirectories, processImage };
