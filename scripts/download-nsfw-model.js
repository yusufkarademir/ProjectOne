const fs = require('fs');
const path = require('path');
const https = require('https');

const modelFiles = [
  'model.json',
  'group1-shard1of1.bin'
];

// MobileNetV2 model (default for nsfwjs)
// The default model URL in nsfwjs is:
// https://github.com/infinitered/nsfwjs/blob/master/src/index.ts#L16
// which points to: https://s3.amazonaws.com/ir_public/nsfwjscdn/TFJS_nsfw_mobilenet/tfjs_quant_nsfw_mobilenet/
const baseUrl = 'https://s3.amazonaws.com/ir_public/nsfwjscdn/TFJS_nsfw_mobilenet/tfjs_quant_nsfw_mobilenet/';
const outputDir = path.join(__dirname, 'public', 'models', 'nsfwjs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

modelFiles.forEach(file => {
  const fileUrl = baseUrl + file;
  const filePath = path.join(outputDir, file);
  
  console.log(`Downloading ${file}...`);
  
  const fileStream = fs.createWriteStream(filePath);
  https.get(fileUrl, response => {
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`${file} downloaded to ${filePath}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete partial file
    console.error(`Error downloading ${file}:`, err.message);
  });
});
