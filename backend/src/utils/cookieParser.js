import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parses Netscape cookie file format and converts to cookie string
 * @param {string} cookieFilePath - Path to cookie file
 * @returns {string} Cookie string for HTTP headers
 */
const parseCookieFile = (cookieFilePath) => {
  try {
    if (!fs.existsSync(cookieFilePath)) {
      return '';
    }

    const cookieContent = fs.readFileSync(cookieFilePath, 'utf-8');
    const lines = cookieContent.split('\n');
    const cookies = [];

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) {
        continue;
      }

      // Netscape format: domain, flag, path, secure, expiration, name, value
      const parts = line.split('\t');
      if (parts.length >= 7) {
        const name = parts[5];
        const value = parts[6];
        if (name && value) {
          cookies.push(`${name}=${value}`);
        }
      }
    }

    return cookies.join('; ');
  } catch (error) {
    console.error('Error parsing cookie file:', error.message);
    return '';
  }
};

/**
 * Gets YouTube cookies from file or environment variable
 * @returns {string} Cookie string for HTTP headers
 */
const getYouTubeCookies = () => {
  // First, try environment variable (for production/Vercel)
  if (process.env.YT_COOKIE) {
    return process.env.YT_COOKIE;
  }

  // Fallback to cookie file (for local development)
  const cookieFilePath = path.join(__dirname, '../../secure/cookies/youtube.txt');
  return parseCookieFile(cookieFilePath);
};

export { parseCookieFile, getYouTubeCookies };

