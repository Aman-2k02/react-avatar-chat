import React, { useState } from 'react';
import AvatarViewer from './AvatarViewer';
import ContactForm from './ContactForm';
import ChatWidget from './ChatWidget';
import VoiceProvider from './VoiceProvider';

export default function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isBlinking] = useState(true);

  return (
    <VoiceProvider isWidgetOpen={isWidgetOpen}>
      {({
        isSpeaking,
        isListening,
        startListening,
        stopListening,
        speak,
        setFormVoiceHandler,
        setChatVoiceHandler
      }) => (
        <div className="app-container">
          <div className="avatar-section">
            <AvatarViewer isSpeaking={isSpeaking} isBlinking={isBlinking} />
            {isSpeaking && (
              <div className="speaking-indicator">
                <div className="speaking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            {isListening && (
              <div className="listening-indicator">
                <div className="listening-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Listening...</p>
              </div>
            )}
          </div>

          <div className="content-section">
            <ContactForm
              avatarSpeak={speak}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              onVoiceInput={setFormVoiceHandler}
            />
          </div>

          {/* Chatbot Widget */}
          <div className="chatbot-widget-container">
            <button
              onClick={() => setIsWidgetOpen(!isWidgetOpen)}
              className="chatbot-toggle"
              title="Chat with Avatar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <ChatWidget
              isOpen={isWidgetOpen}
              onClose={() => setIsWidgetOpen(false)}
              avatarSpeak={speak}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              onVoiceInput={setChatVoiceHandler}
            />
          </div>
        </div>
      )}
    </VoiceProvider>
  );
}
