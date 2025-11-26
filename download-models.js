const fs = require('fs');
const https = require('https');
const path = require('path');

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const outputDir = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Downloading models to ${outputDir}...`);

let completed = 0;

models.forEach(file => {
  const url = `${baseUrl}/${file}`;
  const dest = path.join(outputDir, file);
  
  const fileStream = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed to download ${file}: Status ${response.statusCode}`);
        return;
    }
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${file}`);
      completed++;
      if (completed === models.length) {
          console.log('All downloads completed!');
      }
    });
  }).on('error', (err) => {
    fs.unlink(dest);
    console.error(`Error downloading ${file}: ${err.message}`);
  });
});
