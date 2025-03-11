import axios from 'axios';

const PLAYAI_API_KEY = process.env.PLAYAI_API_KEY;
const PLAYAI_API_URL = 'https://api.play.ai/api/v1/tts/stream';

const getTTS = async (req, res) => {
    const { text } = req.body;

    // Validation
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        // Make request to PlayAI TTS API
        const ttsResponse = await axios.post(
        PLAYAI_API_URL,
        {
            // Default voice for now
            voice: 'Angelo',
            accent: 'american',
            language: 'English (US)',
            languageCode: 'EN-US',
            value: 's3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json',
            sample: 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Angelo_Sample.wav',
            gender: 'male',
            style: 'Conversational',
            text: text,
        },
        {
            headers: {
            'Authorization': `Bearer ${PLAYAI_API_KEY}`, // Auth 
            'Content-Type': 'application/json',
            },
            responseType: 'stream',
        }
        );

        // Set headers for audio response
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'inline; filename="audio.mp3"');

        // Pipe the PlayAI audio stream to the client
        ttsResponse.data.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating audio' });
    }
};

export default getTTS;