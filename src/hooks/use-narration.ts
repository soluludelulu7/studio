
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useNarration() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported || speaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [supported, speaking]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  useEffect(() => {
    return () => {
      // Cleanup: cancel speech when component unmounts
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  return { speak, cancel, speaking, supported };
}
