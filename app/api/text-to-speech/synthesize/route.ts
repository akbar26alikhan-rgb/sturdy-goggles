import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_TTS_API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

interface TTSSynthesisRequest {
  text: string;
  languageCode: string;
  voiceName: string;
  ssmlGender: string;
  speakingRate: number;
  pitch: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TTSSynthesisRequest = await request.json();
    const { text, languageCode, voiceName, ssmlGender, speakingRate, pitch } = body;

    if (!text || !languageCode || !voiceName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google TTS API key not configured. Set GOOGLE_TTS_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    const ttsRequest = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch,
        volumeGainDb: 0,
      },
    };

    const response = await fetch(`${GOOGLE_TTS_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google TTS API error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to synthesize speech' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.audioContent) {
      return NextResponse.json(
        { error: 'No audio content received from TTS API' },
        { status: 500 }
      );
    }

    const audioBuffer = Buffer.from(data.audioContent, 'base64');

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mp3',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('TTS synthesis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
