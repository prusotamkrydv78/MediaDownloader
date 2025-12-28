const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube';
    } else if (url.includes('tiktok.com') || url.includes('tiktok.app')) {
        return 'tiktok';
    } else if (url.includes('instagram.com') || url.includes('instagram.app')) {
        return 'instagram';
    } else if (url.includes('pinterest.com') || url.includes('pinterest.app')) {
        return 'pinterest';
    } else if (url.includes('reddit.com') || url.includes('reddit.app')) {
        return 'reddit';
    } else if (url.includes('twitter.com') || url.includes('twitter.app') || url.includes('x.com')) {
        return 'twitter';
    } else if (url.includes('facebook.com') || url.includes('facebook.app')) {
        return 'facebook';
    } else if (url.includes('linkedin.com') || url.includes('linkedin.app')) {
        return 'linkedin';
    } else {
        return 'unknown';
    }
}

export default detectPlatform;
