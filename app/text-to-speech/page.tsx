'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Mic, 
  Play, 
  Pause, 
  StopCircle, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun, 
  Volume2,
  Languages,
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  History,
  X
} from 'lucide-react';

interface Language {
  code: string;
  name: string;
  voices: Voice[];
}

interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ssmlGender: string;
}

interface SpeechHistory {
  id: string;
  text: string;
  language: string;
  voice: string;
  timestamp: number;
  audioUrl: string;
}

const INDIAN_LANGUAGES: Language[] = [
  {
    code: 'hi-IN',
    name: 'Hindi',
    voices: [
      { id: 'hi-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'hi-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'hi-IN-Standard-C', name: 'Standard C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'hi-IN-Standard-D', name: 'Standard D', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'hi-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'hi-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'hi-IN-Wavenet-C', name: 'Wavenet C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'hi-IN-Wavenet-D', name: 'Wavenet D', gender: 'female', ssmlGender: 'FEMALE' },
    ]
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    voices: [
      { id: 'mr-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'mr-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'mr-IN-Standard-C', name: 'Standard C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'mr-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'mr-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'mr-IN-Wavenet-C', name: 'Wavenet C', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    voices: [
      { id: 'gu-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'gu-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'gu-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'gu-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    voices: [
      { id: 'ta-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ta-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'ta-IN-Standard-C', name: 'Standard C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'ta-IN-Standard-D', name: 'Standard D', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ta-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ta-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'ta-IN-Wavenet-C', name: 'Wavenet C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'ta-IN-Wavenet-D', name: 'Wavenet D', gender: 'female', ssmlGender: 'FEMALE' },
    ]
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    voices: [
      { id: 'te-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'te-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'te-IN-Standard-C', name: 'Standard C', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'te-IN-Standard-D', name: 'Standard D', gender: 'male', ssmlGender: 'MALE' },
      { id: 'te-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'te-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'te-IN-Wavenet-C', name: 'Wavenet C', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'te-IN-Wavenet-D', name: 'Wavenet D', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'kn-IN',
    name: 'Kannada',
    voices: [
      { id: 'kn-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'kn-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'kn-IN-Standard-C', name: 'Standard C', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'kn-IN-Standard-D', name: 'Standard D', gender: 'male', ssmlGender: 'MALE' },
      { id: 'kn-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'kn-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'kn-IN-Wavenet-C', name: 'Wavenet C', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'kn-IN-Wavenet-D', name: 'Wavenet D', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'ml-IN',
    name: 'Malayalam',
    voices: [
      { id: 'ml-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ml-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'ml-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ml-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    voices: [
      { id: 'bn-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'bn-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'bn-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'bn-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'pa-IN',
    name: 'Punjabi',
    voices: [
      { id: 'pa-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'pa-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'pa-IN-Standard-C', name: 'Standard C', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'pa-IN-Standard-D', name: 'Standard D', gender: 'male', ssmlGender: 'MALE' },
      { id: 'pa-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'pa-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'pa-IN-Wavenet-C', name: 'Wavenet C', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'pa-IN-Wavenet-D', name: 'Wavenet D', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'ur-IN',
    name: 'Urdu (India)',
    voices: [
      { id: 'ur-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ur-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'ur-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'ur-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
    ]
  },
  {
    code: 'en-IN',
    name: 'English (India)',
    voices: [
      { id: 'en-IN-Standard-A', name: 'Standard A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'en-IN-Standard-B', name: 'Standard B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'en-IN-Standard-C', name: 'Standard C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'en-IN-Standard-D', name: 'Standard D', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'en-IN-Wavenet-A', name: 'Wavenet A', gender: 'female', ssmlGender: 'FEMALE' },
      { id: 'en-IN-Wavenet-B', name: 'Wavenet B', gender: 'male', ssmlGender: 'MALE' },
      { id: 'en-IN-Wavenet-C', name: 'Wavenet C', gender: 'male', ssmlGender: 'MALE' },
      { id: 'en-IN-Wavenet-D', name: 'Wavenet D', gender: 'female', ssmlGender: 'FEMALE' },
    ]
  },
];

const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x - Slow' },
  { value: 0.75, label: '0.75x' },
  { value: 1.0, label: '1.0x - Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x - Fast' },
  { value: 1.75, label: '1.75x' },
  { value: 2.0, label: '2.0x - Very Fast' },
];

const PITCH_OPTIONS = [
  { value: -6, label: 'Very Low' },
  { value: -4, label: 'Low' },
  { value: -2, label: 'Slightly Low' },
  { value: 0, label: 'Normal' },
  { value: 2, label: 'Slightly High' },
  { value: 4, label: 'High' },
  { value: 6, label: 'Very High' },
];

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(INDIAN_LANGUAGES[0]);
  const [selectedVoice, setSelectedVoice] = useState<Voice>(INDIAN_LANGUAGES[0].voices[0]);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<SpeechHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [useWebSpeech, setUseWebSpeech] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('tts-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        console.error('Failed to parse history');
      }
    }
    
    const savedDarkMode = localStorage.getItem('tts-darkmode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tts-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('tts-darkmode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    setSelectedVoice(selectedLanguage.voices[0]);
  }, [selectedLanguage]);

  useEffect(() => {
    return () => {
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [audioUrl]);

  const handleLanguageChange = (code: string) => {
    const lang = INDIAN_LANGUAGES.find(l => l.code === code);
    if (lang) {
      setSelectedLanguage(lang);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/text-to-speech/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from file');
      }

      const data = await response.json();
      setText(data.text);
      setSuccess(`Successfully extracted text from ${file.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const synthesizeWithWebSpeech = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code;
      utterance.rate = speed;
      utterance.pitch = pitch === 0 ? 1 : pitch > 0 ? 1 + (pitch / 10) : 1 - (Math.abs(pitch) / 20);

      const voices = window.speechSynthesis.getVoices();
      const langVoices = voices.filter(v => v.lang.startsWith(selectedLanguage.code.split('-')[0]));
      
      if (langVoices.length > 0) {
        const preferredVoice = selectedVoice.gender === 'female' 
          ? langVoices.find(v => v.name.toLowerCase().includes('female'))
          : langVoices.find(v => v.name.toLowerCase().includes('male'));
        utterance.voice = preferredVoice || langVoices[0];
      }

      const audioChunks: Blob[] = [];
      const mediaRecorder: MediaRecorder | null = null;

      utterance.onend = () => {
        resolve('');
      };

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const convertToSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      if (useWebSpeech) {
        await synthesizeWithWebSpeech(text);
        setSuccess('Speech generated using Web Speech API');
        setIsLoading(false);
        return;
      }

      const chunks: string[] = [];
      const maxChunkLength = 4500;
      for (let i = 0; i < text.length; i += maxChunkLength) {
        chunks.push(text.slice(i, i + maxChunkLength));
      }

      const audioBlobs: Blob[] = [];

      for (let i = 0; i < chunks.length; i++) {
        setProgress(Math.round((i / chunks.length) * 100));
        
        const response = await fetch('/api/text-to-speech/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: chunks[i],
            languageCode: selectedLanguage.code,
            voiceName: selectedVoice.id,
            ssmlGender: selectedVoice.ssmlGender,
            speakingRate: speed,
            pitch: pitch,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to synthesize speech');
        }

        const blob = await response.blob();
        audioBlobs.push(blob);
      }

      setProgress(100);

      const combinedBlob = new Blob(audioBlobs, { type: 'audio/mp3' });
      const url = URL.createObjectURL(combinedBlob);
      setAudioUrl(url);

      const newHistoryItem: SpeechHistory = {
        id: Date.now().toString(),
        text: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
        language: selectedLanguage.name,
        voice: selectedVoice.name,
        timestamp: Date.now(),
        audioUrl: url,
      };

      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
      setSuccess('Speech generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setAudioDuration(audioRef.current.duration || 0);
        }
      }, 100);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `speech-${selectedLanguage.code}-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearText = () => {
    setText('');
    setError(null);
    setSuccess(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const subTextClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBgClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className={`${cardClass} rounded-2xl shadow-lg border p-6 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-indigo-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}>
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${textClass}`}>Text to Speech</h1>
                <p className={`${subTextClass}`}>Convert text to natural speech in Indian languages</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  showHistory 
                    ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700') 
                    : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                <History className="w-5 h-5" />
                History
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-all ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {showHistory && (
          <div className={`${cardClass} rounded-2xl shadow-lg border p-6 mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${textClass} flex items-center gap-2`}>
                <History className="w-5 h-5" />
                Recent Conversions
              </h2>
              <button
                onClick={() => setHistory([])}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            {history.length === 0 ? (
              <p className={`${subTextClass} text-center py-8`}>No history yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex-1 min-w-0 mr-4">
                      <p className={`${textClass} truncate font-medium`}>{item.text}</p>
                      <p className={`text-sm ${subTextClass}`}>{item.language} • {item.voice}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAudioUrl(item.audioUrl)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <a
                        href={item.audioUrl}
                        download={`speech-${item.id}.mp3`}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`${cardClass} rounded-2xl shadow-lg border p-6`}>
              <div className="flex items-center justify-between mb-4">
                <label className={`text-lg font-semibold ${textClass} flex items-center gap-2`}>
                  <FileText className="w-5 h-5" />
                  Enter Text
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${subTextClass}`}>{text.length} characters</span>
                  <button
                    onClick={clearText}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear text"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here in Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi, Urdu, or English (India)..."
                className={`w-full h-64 p-4 rounded-xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${inputBgClass}`}
                spellCheck={false}
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <span className={`text-sm ${subTextClass}`}>Supports TXT, DOCX, PDF</span>
              </div>
            </div>

            {audioUrl && (
              <div className={`${cardClass} rounded-2xl shadow-lg border p-6 mt-6`}>
                <h3 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
                  <Volume2 className="w-5 h-5" />
                  Audio Player
                </h3>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  <button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    className={`p-4 rounded-full ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={stopAudio}
                    className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    <StopCircle className="w-5 h-5" />
                  </button>

                  <div className="flex-1">
                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-indigo-500 transition-all duration-100"
                        style={{ width: `${audioDuration ? (currentTime / audioDuration) * 100 : 0}%` }}
                      />
                    </div>
                    <div className={`flex justify-between mt-1 text-sm ${subTextClass}`}>
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(audioDuration)}</span>
                    </div>
                  </div>

                  <button
                    onClick={downloadAudio}
                    className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                    title="Download MP3"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className={`${cardClass} rounded-2xl shadow-lg border p-6`}>
              <h3 className={`text-lg font-semibold ${textClass} mb-6 flex items-center gap-2`}>
                <Settings className="w-5 h-5" />
                Voice Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${subTextClass} mb-2`}>
                    <Languages className="w-4 h-4 inline mr-1" />
                    Language
                  </label>
                  <select
                    value={selectedLanguage.code}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBgClass}`}
                  >
                    {INDIAN_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${subTextClass} mb-2`}>
                    Voice
                  </label>
                  <select
                    value={selectedVoice.id}
                    onChange={(e) => {
                      const voice = selectedLanguage.voices.find(v => v.id === e.target.value);
                      if (voice) setSelectedVoice(voice);
                    }}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBgClass}`}
                  >
                    {selectedLanguage.voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} ({voice.gender === 'female' ? '♀' : '♂'})
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs mt-1 ${subTextClass}`}>
                    {selectedVoice.id.includes('Wavenet') ? 'High quality neural voice' : 'Standard voice'}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${subTextClass} mb-2`}>
                    Speaking Speed
                  </label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBgClass}`}
                  >
                    {SPEED_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${subTextClass} mb-2`}>
                    Pitch
                  </label>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="1"
                    value={pitch}
                    onChange={(e) => setPitch(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className={`flex justify-between text-xs ${subTextClass} mt-1`}>
                    <span>Low</span>
                    <span className="font-medium text-indigo-500">
                      {PITCH_OPTIONS.find(p => p.value === pitch)?.label || 'Normal'}
                    </span>
                    <span>High</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWebSpeech}
                      onChange={(e) => setUseWebSpeech(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${subTextClass}`}>
                      Use browser TTS (no API key needed)
                    </span>
                  </label>
                </div>

                <button
                  onClick={convertToSpeech}
                  disabled={isLoading || !text.trim()}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting... {progress > 0 && `${progress}%`}
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Convert to Speech
                    </>
                  )}
                </button>

                {isLoading && progress > 0 && (
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <p className={`text-xs ${subTextClass} text-center`}>
                  No character limit. Long text will be processed in chunks.
                </p>
              </div>
            </div>

            <div className={`${cardClass} rounded-2xl shadow-lg border p-6 mt-6`}>
              <h4 className={`text-sm font-semibold ${textClass} mb-3`}>Supported Languages</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {INDIAN_LANGUAGES.map((lang) => (
                  <div 
                    key={lang.code} 
                    className={`flex items-center gap-2 p-2 rounded-lg ${selectedLanguage.code === lang.code ? (darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50') : ''}`}
                  >
                    <span className={selectedLanguage.code === lang.code ? 'text-indigo-500' : subTextClass}>
                      {selectedLanguage.code === lang.code && '✓ '}
                      {lang.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className={`mt-12 text-center ${subTextClass} text-sm`}>
          <p>Powered by Google Cloud Text-to-Speech API • Web Speech API fallback available</p>
        </footer>
      </div>
    </div>
  );
}
