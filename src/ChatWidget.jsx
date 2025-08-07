import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function ChatWidget({ isOpen, onClose, avatarSpeak, isListening, startListening, stopListening, onVoiceInput }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = useCallback((transcript) => {
    if (!transcript || !transcript.trim()) return;
    const userMessage = { text: transcript, id: Date.now(), type: 'user', isVoice: true };
    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const avatarResponse = generateAvatarResponse(transcript);
      const avatarMessage = { text: avatarResponse, id: Date.now() + 1, type: 'avatar' };
      setMessages(prev => [...prev, avatarMessage]);
      avatarSpeak(avatarResponse);
    }, 1000);
  }, [avatarSpeak]);

  const generateAvatarResponse = (userInput) => {
    const input = userInput.toLowerCase();
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! It's great to hear from you. How can I help you today?";
    } else if (input.includes('how are you')) {
      return "I'm doing well, thank you for asking! I'm here and ready to assist you.";
    } else if (input.includes('name')) {
      return "I'm your AI avatar assistant. You can call me Avatar!";
    } else if (input.includes('weather')) {
      return "I can't check the weather right now, but I'd recommend looking outside or checking a weather app!";
    } else if (input.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (input.includes('thank')) {
      return "You're very welcome! I'm happy to help.";
    } else if (input.includes('bye') || input.includes('goodbye')) {
      return "Goodbye! It was nice talking with you. Have a great day!";
    } else {
      return `I heard you say: "${userInput}". That's interesting! Can you tell me more about that?`;
    }
  };

  const sendMessage = () => {
    const text = inputValue.trim();
    console.log('text-->', text)
    if (!text) return;
    const userMessage = { text, id: Date.now(), type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const avatarResponse = generateAvatarResponse(text);
      const avatarMessage = { text: avatarResponse, id: Date.now() + 1, type: 'avatar' };
      setMessages(prev => [...prev, avatarMessage]);
      avatarSpeak(avatarResponse);
    }, 1000);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (onVoiceInput) {
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, handleVoiceInput]);

  if (!isOpen) return null;

  return (
    <div className="chatbot-widget">
      <div className="chatbot-header">
        <h3>Chat with Avatar</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="chatbot-content">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <p>👋 Hello! I'm your 3D avatar assistant.</p>
              <p>Ask me anything or just chat!</p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type === 'user' ? 'user-message' : 'avatar-message'}`}>
              <div className="message-content">
                {message.text}
                {message.isVoice && <span className="voice-indicator">🎤</span>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <div className="voice-controls">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`voice-button ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}