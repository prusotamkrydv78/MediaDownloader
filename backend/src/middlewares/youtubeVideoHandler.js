import ytdl from '@distube/ytdl-core';
import { getYouTubeCookies } from '../utils/cookieParser.js';
import fs from 'fs';
import path from 'path';

/**
 * Patches fs methods to redirect writes to /tmp in serverless environments
 * This fixes the EROFS error in Vercel by redirecting cache file writes to /tmp
 */
const patchFileSystemForServerless = () => {
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION;
  
  if (!isServerless) return;

  const tmpDir = '/tmp';
  
  // Set TMPDIR environment variables
  process.env.TMPDIR = tmpDir;
  process.env.TMP = tmpDir;
  process.env.TEMP = tmpDir;

  // Helper to check if path should be redirected to /tmp
  const shouldRedirect = (filePath) => {
    if (typeof filePath !== 'string') return false;
    
    // Redirect relative paths (./filename or just filename)
    if (filePath.startsWith('./') || (!path.isAbsolute(filePath) && !filePath.startsWith('/tmp'))) {
      return true;
    }
    
    // Redirect absolute paths that look like cache files and aren't in writable directories
    if (path.isAbsolute(filePath) && !filePath.startsWith(tmpDir) && !filePath.startsWith('/opt')) {
      // Match patterns like: timestamp-watch.html, player-script.js, etc.
      const fileName = path.basename(filePath);
      if (fileName.match(/\d{13,}/) || fileName.includes('watch.html') || fileName.includes('player-script') || fileName.includes('base.js')) {
        return true;
      }
    }
    
    return false;
  };

  // Helper to get redirected path
  const getRedirectedPath = (filePath) => {
    const fileName = path.basename(filePath);
    return path.join(tmpDir, fileName);
  };

  // Patch fs.writeFileSync
  const originalWriteFileSync = fs.writeFileSync;
  fs.writeFileSync = function(filePath, ...args) {
    if (shouldRedirect(filePath)) {
      const newPath = getRedirectedPath(filePath);
      return originalWriteFileSync.call(this, newPath, ...args);
    }
    return originalWriteFileSync.call(this, filePath, ...args);
  };

  // Patch fs.writeFile
  const originalWriteFile = fs.writeFile;
  fs.writeFile = function(filePath, ...args) {
    if (shouldRedirect(filePath)) {
      const newPath = getRedirectedPath(filePath);
      return originalWriteFile.call(this, newPath, ...args);
    }
    return originalWriteFile.call(this, filePath, ...args);
  };

  // Patch fs.createWriteStream (important for ytdl-core)
  const originalCreateWriteStream = fs.createWriteStream;
  fs.createWriteStream = function(filePath, ...args) {
    if (shouldRedirect(filePath)) {
      const newPath = getRedirectedPath(filePath);
      return originalCreateWriteStream.call(this, newPath, ...args);
    }
    return originalCreateWriteStream.call(this, filePath, ...args);
  };

  // Patch fs.open (used for file creation)
  const originalOpen = fs.open;
  fs.open = function(filePath, ...args) {
    if (shouldRedirect(filePath)) {
      const newPath = getRedirectedPath(filePath);
      return originalOpen.call(this, newPath, ...args);
    }
    return originalOpen.call(this, filePath, ...args);
  };

  // Patch fs.openSync
  const originalOpenSync = fs.openSync;
  fs.openSync = function(filePath, ...args) {
    if (shouldRedirect(filePath)) {
      const newPath = getRedirectedPath(filePath);
      return originalOpenSync.call(this, newPath, ...args);
    }
    return originalOpenSync.call(this, filePath, ...args);
  };
};

// Patch filesystem immediately on module load for serverless environments
// This ensures the patch is applied before ytdl-core tries to write files
patchFileSystemForServerless();

/**
 * Handles YouTube video download requests (production-ready with bot detection bypass)
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} Video info and download links
 */
const handleYouTubeVideo = async (url) => {
  if (!ytdl.validateURL(url)) throw new Error('Invalid YouTube URL');

  // Get cookies from file or environment variable
  const cookieHeader = getYouTubeCookies();

  // Browser-like headers to bypass bot detection
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0'
  };

  // Add cookies if available
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  // Fetch video info with proper headers to bypass bot detection
  const info = await ytdl.getInfo(url, {
    requestOptions: {
      headers: headers
    }
  });

  const { videoDetails, formats } = info;

  if (!formats || formats.length === 0) {
    throw new Error('No downloadable formats found');
  }

  // Best video & audio formats
  const videoFormat = ytdl.chooseFormat(formats, { quality: 'highestvideo', filter: 'video' });
  const audioFormat = ytdl.chooseFormat(formats, { quality: 'highestaudio', filter: 'audioonly' });

  // Available qualities for frontend display
  const availableQualities = formats
    .filter(f => f.hasVideo && f.hasAudio && f.qualityLabel)
    .map(f => ({
      quality: f.qualityLabel,
      container: f.container,
      sizeMB: f.contentLength ? (Number(f.contentLength) / (1024 * 1024)).toFixed(2) : null
    }));

  return {
    platform: 'youtube',
    title: videoDetails.title,
    originalUrl: url,
    description: videoDetails.shortDescription?.slice(0, 500) || null,
    durationSeconds: Number(videoDetails.lengthSeconds),
    author: videoDetails.author?.name || null,
    thumbnail: videoDetails.thumbnails?.at(-1)?.url || null,
    download: {
      video: {
        url: videoFormat.url,
        quality: videoFormat.qualityLabel,
        container: videoFormat.container,
        sizeMB: videoFormat.contentLength ? (Number(videoFormat.contentLength) / (1024 * 1024)).toFixed(2) : null
      },
      audio: {
        url: audioFormat.url,
        container: audioFormat.container,
        bitrate: audioFormat.audioBitrate
      }
    },
    availableQualities
  };
};

export default handleYouTubeVideo;
