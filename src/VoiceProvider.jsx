import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

export default function VoiceProvider({ isWidgetOpen, children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isComponentMounted = useRef(true);
  const currentHandlerRef = useRef(null);

  // Memoize Indian voice selection
  const indianVoice = useMemo(() => {
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(voice =>
      voice.lang.includes('en-IN') ||
      voice.name.toLowerCase().includes('indian') ||
      voice.name.toLowerCase().includes('india')
    );
    return indianVoice || voices.find(voice => voice.lang.includes('en')) || voices[0];
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      if (isComponentMounted.current) {
        setIsListening(true);
      }
    };

    recognitionRef.current.onresult = (event) => {
      if (!isComponentMounted.current) return;
      
      const transcript = event.results[0][0].transcript;
      console.log('Voice transcript:', transcript);
      
      // Call the current handler if it exists
      if (currentHandlerRef.current) {
        currentHandlerRef.current(transcript);
      }
      
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (isComponentMounted.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current.onend = () => {
      if (isComponentMounted.current) {
        setIsListening(false);
      }
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      utterance.onstart = () => {
        if (isComponentMounted.current) {
          setIsSpeaking(true);
        }
      };

      utterance.onend = () => {
        if (isComponentMounted.current) {
          setIsSpeaking(false);
        }
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        if (isComponentMounted.current) {
          setIsSpeaking(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speak function:', error);
    }
  }, [indianVoice]);

  const startListening = useCallback((handler) => {
    if (!recognitionRef.current || isListening || isSpeaking) {
      return;
    }

    // Set the current handler
    currentHandlerRef.current = handler;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  }, [isListening, isSpeaking]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) {
      return;
    }

    try {
      recognitionRef.current.stop();
      currentHandlerRef.current = null;
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, [isListening]);

  return children({
    isSpeaking,
    isListening,
    startListening,
    stopListening,
    speak
  });
}
