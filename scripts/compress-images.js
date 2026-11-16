const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

async function compressAllImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('Images directory does not exist:', IMAGES_DIR);
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let processedCount = 0;

  console.log(`Starting compression for ${files.length} files in ${IMAGES_DIR}...\n`);

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const stat = fs.statSync(filePath);

    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      continue;
    }

    const beforeSize = stat.size;
    totalBefore += beforeSize;

    try {
      const inputBuffer = fs.readFileSync(filePath);
      let pipeline = sharp(inputBuffer).resize(1400, 1400, {
        fit: 'inside',
        withoutEnlargement: true,
      });

      let compressedBuffer;
      if (ext === '.jpg' || ext === '.jpeg') {
        compressedBuffer = await pipeline
          .jpeg({ quality: 80, progressive: true, mozjpeg: true })
          .toBuffer();
      } else if (ext === '.png') {
        compressedBuffer = await pipeline
          .png({ quality: 80, compressionLevel: 8 })
          .toBuffer();
      } else if (ext === '.webp') {
        compressedBuffer = await pipeline
          .webp({ quality: 80 })
          .toBuffer();
      }

      if (compressedBuffer && compressedBuffer.length < beforeSize) {
        fs.writeFileSync(filePath, compressedBuffer);
        const afterSize = compressedBuffer.length;
        totalAfter += afterSize;
        const savedPercent = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1);
        console.log(
          `✓ ${file}: ${(beforeSize / 1024).toFixed(0)}KB → ${(afterSize / 1024).toFixed(0)}KB (${savedPercent}% smaller)`
        );
        processedCount++;
      } else {
        totalAfter += beforeSize;
        console.log(`- ${file}: already optimal (${(beforeSize / 1024).toFixed(0)}KB)`);
      }
    } catch (err) {
      totalAfter += beforeSize;
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }

  const totalSavedMb = ((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2);
  const totalSavedPercent = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);

  console.log('\n=============================================');
  console.log(`Compression Complete!`);
  console.log(`Processed files: ${processedCount}`);
  console.log(`Original total:  ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized total: ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Saved:           ${totalSavedMb} MB (${totalSavedPercent}% reduction)`);
  console.log('=============================================\n');
}

compressAllImages();
