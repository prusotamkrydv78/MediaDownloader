import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import detectPlatform from './utils/detectPlatform.js';
import handleYouTubeVideo from './middlewares/youtubeVideoHandler.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.post('/api/v1/download', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const platform = detectPlatform(url);

        let result;

        // Route to appropriate handler based on platform
        switch (platform) {
            case 'youtube':
                result = await handleYouTubeVideo(url);
                break;
            case 'tiktok':
            case 'reddit':
            default:
                return res.status(400).json({ error: 'Unsupported platform' });
        }

        res.json(result);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            error: 'Failed to process video',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
