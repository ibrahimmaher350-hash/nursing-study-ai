'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { MedicalSpeechService, SpeechRate } from '@/lib/audio/speech';
import { cn } from '@/lib/utils';

interface AudioPronounceProps {
  text: string;
  size?: 'sm' | 'md';
  showSpeedSelector?: boolean;
}

export function AudioPronounce({
  text,
  size = 'md',
  showSpeedSelector = true,
}: AudioPronounceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<SpeechRate>(1.0);

  const handlePlay = () => {
    if (isPlaying) {
      MedicalSpeechService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      MedicalSpeechService.speak(
        text,
        rate,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    MedicalSpeechService.stop();
    setIsPlaying(true);
    MedicalSpeechService.speak(
      text,
      rate,
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const handleRateChange = (newRate: SpeechRate, e: React.MouseEvent) => {
    e.stopPropagation();
    setRate(newRate);
    if (isPlaying) {
      MedicalSpeechService.stop();
      setIsPlaying(true);
      MedicalSpeechService.speak(
        text,
        newRate,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className="inline-flex items-center gap-1.5 direction-ltr">
      {/* Play/Pause Button */}
      <button
        onClick={handlePlay}
        aria-label={isPlaying ? 'إيقاف مؤقت' : 'استماع للنطق الإنجليزي'}
        className={cn(
          'flex items-center justify-center rounded-xl transition-all',
          isSmall
            ? 'w-7 h-7 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
            : 'px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white shadow-sm gap-1.5 text-xs font-bold'
        )}
      >
        {isPlaying ? (
          <Pause className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        ) : (
          <Volume2 className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        )}
        {!isSmall && <span>{isPlaying ? 'إيقاف' : 'نطق'}</span>}
      </button>

      {/* Replay Button */}
      {isPlaying && (
        <button
          onClick={handleReplay}
          aria-label="إعادة النطق"
          className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Speed Selector (0.75x, 1x, 1.25x) */}
      {showSpeedSelector && !isSmall && (
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold font-inter">
          {([0.75, 1.0, 1.25] as SpeechRate[]).map((r) => (
            <button
              key={r}
              onClick={(e) => handleRateChange(r, e)}
              className={cn(
                'px-1.5 py-0.5 rounded transition-all',
                rate === r
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              )}
            >
              {r === 1.0 ? '1x' : `${r}x`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
