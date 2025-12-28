import ytdl from '@distube/ytdl-core';
import { getYouTubeCookies } from '../utils/cookieParser.js';

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
