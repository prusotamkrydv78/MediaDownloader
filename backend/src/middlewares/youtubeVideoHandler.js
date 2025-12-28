import ytdl from '@distube/ytdl-core';

/**
 * Handles YouTube video download requests (production-ready with env variable)
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} Video info and download links
 */
const handleYouTubeVideo = async (url) => {
  if (!ytdl.validateURL(url)) throw new Error('Invalid YouTube URL');

  // Read cookie from environment variable
  const cookieHeader = process.env.YT_COOKIE || '';

  // Fetch video info with cookie header (if provided)
  const info = await ytdl.getInfo(url, {
    requestOptions: cookieHeader ? { headers: { cookie: cookieHeader } } : {}
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
