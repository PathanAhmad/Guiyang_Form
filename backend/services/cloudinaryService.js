const config = require('../config/environment');

let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
} catch (err) {
  cloudinary = null;
}

function parseCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const match = /^cloudinary:\/\/([^:]+):([^@]+)@([^\/?]+)(?:[\/?].*)?$/i.exec(url);
  if (!match) return null;
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
}

function isConfigured() {
  const { cloudName, apiKey, apiSecret, url } = config.CLOUDINARY || {};
  const parsed = (!cloudName || !apiKey || !apiSecret) ? parseCloudinaryUrl(url) : null;
  const resolvedCloudName = cloudName || (parsed && parsed.cloudName);
  const resolvedApiKey = apiKey || (parsed && parsed.apiKey);
  const resolvedApiSecret = apiSecret || (parsed && parsed.apiSecret);
  return Boolean(resolvedCloudName && resolvedApiKey && resolvedApiSecret && cloudinary);
}

function getClient() {
  if (!isConfigured()) {
    throw new Error('Cloudinary is not configured');
  }
  const { cloudName, apiKey, apiSecret, url } = config.CLOUDINARY || {};
  const parsed = parseCloudinaryUrl(url) || {};
  cloudinary.config({
    cloud_name: cloudName || parsed.cloudName,
    api_key: apiKey || parsed.apiKey,
    api_secret: apiSecret || parsed.apiSecret,
    secure: true,
  });
  return cloudinary;
}

function getDeliveryBase() {
  let cloudName = config.CLOUDINARY.cloudName;
  if (!cloudName && config.CLOUDINARY.url) {
    const parsed = parseCloudinaryUrl(config.CLOUDINARY.url);
    cloudName = parsed && parsed.cloudName ? parsed.cloudName : '';
  }
  if (!cloudName) return '';
  return `https://res.cloudinary.com/${cloudName}/image/upload`;
}

module.exports = {
  isConfigured,
  getClient,
  getDeliveryBase,
};


