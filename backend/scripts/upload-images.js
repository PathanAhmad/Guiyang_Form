/*
  Upload all images under frontend/src/Images and frontend/public/Images to Cloudinary.
  Usage: node scripts/upload-images.js
*/
const path = require('path');
const fs = require('fs');
const glob = require('glob');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const config = require('../config/environment');

let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
} catch (e) {
  console.error('cloudinary dependency not installed. Run npm i cloudinary');
  process.exit(1);
}

if (!config.CLOUDINARY.cloudName || !config.CLOUDINARY.apiKey || !config.CLOUDINARY.apiSecret) {
  console.error('Cloudinary is not configured. Set CLOUDINARY_* env vars.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: config.CLOUDINARY.cloudName,
  api_key: config.CLOUDINARY.apiKey,
  api_secret: config.CLOUDINARY.apiSecret,
  secure: true,
});

const projectRoot = path.resolve(__dirname, '..', '..');
const patterns = [
  'frontend/src/Images/**/*.{png,jpg,jpeg,svg,gif,webp}',
  'frontend/public/Images/**/*.{png,jpg,jpeg,svg,gif,webp}'
];

async function uploadFile(file) {
  // Normalize to forward slashes first so the stripping below works on Windows too
  const rel = path.relative(projectRoot, file).replace(/\\/g, '/');
  const withoutFrontendPrefix = rel.replace(/^frontend\/(src\/)?(public\/)?/i, '');
  const publicId = withoutFrontendPrefix
    .replace(/^Images\//i, '')
    .replace(/\.(png|jpg|jpeg|gif|svg|webp)$/i, '');
  const folder = config.CLOUDINARY.folder ? `${config.CLOUDINARY.folder}` : '';
  const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

  try {
    const res = await cloudinary.uploader.upload(file, {
      public_id: fullPublicId,
      overwrite: true,
      resource_type: 'image',
    });
    console.log('Uploaded:', res.public_id);
  } catch (err) {
    console.error('Failed:', file, err.message);
  }
}

async function run() {
  const files = patterns.flatMap(p => glob.sync(p, { cwd: projectRoot, nodir: true, absolute: true }));
  console.log(`Found ${files.length} image(s). Uploading to Cloudinary...`);
  for (const f of files) {
    // Skip vite.svg
    if (f.endsWith('vite.svg')) continue;
    await uploadFile(f);
  }
  console.log('Done.');
}

run();


