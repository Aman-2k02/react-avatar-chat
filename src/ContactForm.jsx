import React, { useState, useEffect, useCallback } from 'react';

export default function ContactForm({ avatarSpeak, isListening, startListening, stopListening, onVoiceInput }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [currentField, setCurrentField] = useState('name');
  const [isFormActive, setIsFormActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const formFields = [
    { key: 'name', label: 'name', question: "What's your name?", validation: (value) => value && value.length >= 2 },
    { key: 'email', label: 'email address', question: "What's your email address?", validation: (value) => value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
    { key: 'phone', label: 'phone number', question: "What's your phone number?", validation: (value) => value && /^\d{10}$/.test(value.replace(/\D/g, '')) },
    { key: 'message', label: 'message', question: "What message would you like to send?", validation: (value) => value && value.length >= 10 }
  ];

  const startForm = () => {
    setIsFormActive(true);
    setCurrentField('name');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setValidationErrors({});
    avatarSpeak("I'll help you fill out the contact form. Let's start with your name. What's your name?");
  };

  const handleVoiceInput = useCallback((transcript) => {
    if (!isFormActive || !transcript) return;
    const field = formFields.find(f => f.key === currentField);
    if (!field) return;
    const value = transcript.trim();
    setFormData(prev => ({ ...prev, [currentField]: value }));
    const isValid = field.validation(value);
    if (!isValid) {
      setValidationErrors(prev => ({ ...prev, [currentField]: `Please provide a valid ${field.label}` }));
      avatarSpeak(`I didn't catch that properly. ${field.question}`);
      return;
    }
    setValidationErrors(prev => ({ ...prev, [currentField]: null }));
    const currentIndex = formFields.findIndex(f => f.key === currentField);
    if (currentIndex < formFields.length - 1) {
      const nextField = formFields[currentIndex + 1];
      setCurrentField(nextField.key);
      avatarSpeak(`Great! Now ${nextField.question}`);
    } else {
      const summary = Object.entries(formData).map(([key, val]) => `${key}: ${val}`).join(', ');
      avatarSpeak(`Perfect! I've collected all your information. Here's what you provided: ${summary}. Thank you for your message!`);
      setIsFormActive(false);
      setCurrentField('name');
    }
  }, [isFormActive, currentField, formData, avatarSpeak]);

  const handleSubmit = (e) => {
    e.preventDefault();
    avatarSpeak("Thank you! Your message has been sent successfully.");
  };

  useEffect(() => {
    if (isFormActive && !isListening) {
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  }, [isFormActive, currentField, isListening, startListening]);

  useEffect(() => {
    if (onVoiceInput) {
      onVoiceInput(handleVoiceInput);
    }
  }, [onVoiceInput, handleVoiceInput]);

  return (
    <div className="contact-form-section">
      <h2>Contact Us</h2>
      {isFormActive && (
        <div className="form-progress">
          <div className="progress-bar">
            {formFields.map((field, index) => (
              <div
                key={field.key}
                className={`progress-step ${currentField === field.key ? 'active' : ''} ${formData[field.key] ? 'completed' : ''}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="current-field">
            <h4>Current: {formFields.find(f => f.key === currentField)?.label}</h4>
            {validationErrors[currentField] && (
              <p className="error">{validationErrors[currentField]}</p>
            )}
            {isListening && <p className="listening-status">🎤 Listening...</p>}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="webpage-contact-form">
        {formFields.map(field => (
          <div key={field.key} className="form-field">
            <label htmlFor={field.key}>{field.label}</label>
            <input
              type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
              id={field.key}
              name={field.key}
              value={formData[field.key]}
              onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={`Enter your ${field.label}`}
              className={validationErrors[field.key] ? 'error' : ''}
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="submit-btn">Send Message</button>
          {!isFormActive && (
            <button type="button" onClick={startForm} className="voice-form-btn">
              Start Voice Form
            </button>
          )}
        </div>
      </form>
    </div>
  );
}