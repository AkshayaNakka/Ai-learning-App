type SpeechListener = (isSpeaking: boolean, currentText: string) => void;

class SpeechService {
  private isSupported: boolean = false;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentText: string = '';
  private listeners: Set<SpeechListener> = new Set();
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.isSupported) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer clear English voices
    const preferred = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    this.selectedVoice = preferred || null;
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeaking, this.currentText);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isSpeaking, this.currentText));
  }

  public speak(text: string): boolean {
    if (!this.isSupported) return false;

    // Clean markdown asterisks or special characters for smooth narration
    const cleanText = text
      .replace(/[*_~`#]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return false;

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = 0.96; // slightly measured pace for educational comprehension
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentText = cleanText;
        this.notify();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentText = '';
        this.currentUtterance = null;
        this.notify();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.isSpeaking = false;
        this.currentText = '';
        this.currentUtterance = null;
        this.notify();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Speech synthesis execution failed:', e);
      this.isSpeaking = false;
      this.notify();
      return false;
    }
  }

  public stop(): void {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    this.isSpeaking = false;
    this.currentText = '';
    this.currentUtterance = null;
    this.notify();
  }

  public toggle(text: string): void {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speak(text);
    }
  }

  public getStatus(): { isSpeaking: boolean; isSupported: boolean; currentText: string } {
    return {
      isSpeaking: this.isSpeaking,
      isSupported: this.isSupported,
      currentText: this.currentText
    };
  }
}

export const speechService = new SpeechService();
