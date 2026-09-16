// ==============================================================================
// NURSING STUDY AI — MEDICAL AUDIO PRONUNCIATION ENGINE
// نظام النطق الصوتي الطبي الإنجليزي الدقيق مع التحكم في السرعات (0.75x, 1x, 1.25x)
// ==============================================================================

export type SpeechRate = 0.75 | 1.0 | 1.25;

export class MedicalSpeechService {
  private static synth: SpeechSynthesis | null = null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static preferredVoice: SpeechSynthesisVoice | null = null;

  private static init(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    this.synth = window.speechSynthesis;

    // Try to pick a natural English voice
    if (!this.preferredVoice && this.synth) {
      const voices = this.synth.getVoices();
      this.preferredVoice =
        voices.find((v) => v.lang.startsWith('en-US') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;
    }

    return true;
  }

  static speak(
    text: string,
    rate: SpeechRate = 1.0,
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ): void {
    if (!this.init() || !this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser environment.');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const cleanText = text.replace(/[*_#`~]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  static resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  static isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }

  static isPaused(): boolean {
    return !!(this.synth && this.synth.paused);
  }
}
