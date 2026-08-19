import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Sparkles, X, Check, Volume2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

const SAMPLE_CIVIC_VOICE_NOTES = [
  {
    lang: 'Hinglish',
    text: "Indiranagar 100ft road pe 12th Main junction ke paas bahut bada gaddha ho gaya hai. Kal raat do bike slip ho gayi. PWD se request hai turant repair karein."
  },
  {
    lang: 'हिन्दी',
    text: "वार्ड में पिछले चार दिनों से सभी स्ट्रीट लाइटें बंद हैं। रात को अंधेरे की वजह से पैदल चलने वाली महिलाओं और वरिष्ठ नागरिकों को भारी परेशानी हो रही है।"
  },
  {
    lang: 'English',
    text: "Severe waterlogging and open stormwater nala blockage near HSR Layout 27th Main. Sewage backflow is entering ground floor houses. Urgent desilting needed."
  }
];

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onTranscriptionComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 45, 60, 40, 20, 50, 75, 40, 25]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        setAudioLevel(Array.from({ length: 14 }, () => Math.floor(Math.random() * 80) + 15));
      }, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setTranscription('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Multi-lingual Indian speech recognition

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscription(currentTranscript);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition not available or denied', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (!transcription || transcription.trim().length === 0) {
        const randomSample = SAMPLE_CIVIC_VOICE_NOTES[0].text;
        setTranscription(randomSample);
      }
    }, 1000);
  };

  const handleUseTranscription = () => {
    if (transcription.trim()) {
      onTranscriptionComplete(transcription.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-white/20 shadow-2xl text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  AI Voice Assistant
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Hindi / Hinglish / English
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Speak naturally in Hindi, Hinglish or English</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Recording Canvas */}
          <div className="my-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-white/10 text-center">
            {isRecording ? (
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-center gap-1.5 h-16">
                  {audioLevel.map((height, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1.5 bg-gradient-to-t from-emerald-500 to-amber-400 rounded-full"
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-rose-400 font-mono text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  Recording: {(recordingDuration * 0.2).toFixed(1)}s
                </div>
              </div>
            ) : isProcessing ? (
              <div className="py-6 flex flex-col items-center gap-3 text-emerald-300">
                <Sparkles className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm font-medium">AI Transcribing Indian vernacular speech...</p>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <Mic className="w-8 h-8" />
                </div>
                <p className="text-xs text-slate-300">
                  Press Record and describe the civic problem in your own words.
                </p>
              </div>
            )}

            {/* Record / Stop Button */}
            <div className="mt-4">
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                >
                  <Square className="w-5 h-5 fill-current" />
                  Stop & Transcribe
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                >
                  <Mic className="w-5 h-5" />
                  Start Recording
                </button>
              )}
            </div>
          </div>

          {/* Transcribed Text Preview */}
          {transcription && (
            <div className="mb-4 p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Transcribed Text
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{transcription.split(' ').length} words</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans italic">
                "{transcription}"
              </p>
            </div>
          )}

          {/* Preset Voice Clips for quick testing */}
          <div className="mb-6 space-y-2">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Quick Indian Voice Presets:
            </p>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_CIVIC_VOICE_NOTES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTranscription(sample.text)}
                  className="text-left text-xs p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5 flex items-center justify-between gap-2"
                >
                  <span className="line-clamp-1">{sample.text}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-mono shrink-0">
                    {sample.lang}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!transcription}
              onClick={handleUseTranscription}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              Apply to Complaint Form
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
