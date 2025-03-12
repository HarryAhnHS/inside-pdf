import voices from '../../models/voices';
import axios from 'axios';

const PLAYAI_API_KEY = process.env.PLAYAI_API_KEY;
const PLAYAI_USER_ID = process.env.PLAYAI_USER_ID;
const PLAYAI_API_URL = 'https://api.play.ai/api/v1/tts/stream';

// POST request handler
export async function POST(request) {
  console.log('TTS API route accessed');

  try {
    // Parse the body of the request
    const { text, voice, speed, temperature } = await request.json();

    console.log("TTS API: ", { text, voice, speed, temperature })

    // Validation
    if (!text || !voice) {
      return new Response(
        JSON.stringify({ error: 'Text and voice are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Select voice based on the voice name
    const selectedVoice = voices.find((v) => v.name === voice)?.value;
    if (!selectedVoice) {
      return new Response(
        JSON.stringify({ error: 'Selected voice not found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('TTS API: Selected voice:', selectedVoice);

    // Make the request to the PlayAI TTS API
    const response = await axios.post(
      PLAYAI_API_URL,
      {
        model: 'PlayDialog',
        text: text,
        voice: selectedVoice,
        outputFormat: 'mp3',
        speed: speed,
        temperature: temperature,
        sampleRate: 24000,
        seed: 0
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PLAYAI_API_KEY}`,
          'X-USER-ID': PLAYAI_USER_ID,
        },
        responseType: 'arraybuffer', // Receiving audio as an arraybuffer
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to generate audio');
    }

    const audioData = response.data;
    console.log('Received audio data, size:', audioData.byteLength);

    // Return the audio file as response
    return new Response(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('TTS API Error:', { message: err.message, stack: err.stack });

    return new Response(
      JSON.stringify({
        error: 'Error generating audio',
        details: err.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};