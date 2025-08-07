# React Avatar Chat

A modern React Three.js application featuring a 3D avatar that can speak and chat seamlessly with users. The interface has no borders and provides a smooth, immersive experience with **voice-to-voice communication**.

## Features

- 🎭 **3D Avatar Rendering**: Displays your GLB model with realistic lighting and animations
- 🗣️ **Speech Synthesis**: Avatar speaks responses using browser's speech synthesis API
- 🎤 **Voice Recognition**: Talk to your avatar using your microphone
- 💬 **Seamless Chat Interface**: Modern, borderless design with smooth animations
- 🎨 **Responsive Design**: Works on desktop and mobile devices
- ✨ **Speaking Animation**: Avatar shows subtle movements when speaking
- 🎯 **Interactive Controls**: Orbit controls for viewing the avatar from different angles
- 🔴 **Voice Indicators**: Visual feedback for voice input and output

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Avatar Model

1. Place your GLB file in the `public/models/` directory
2. Name it `avatar.glb` (or update the path in `src/App.jsx`)

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

### Voice Communication
1. **Click the microphone button** to start voice recognition
2. **Speak your message** clearly into your microphone
3. **Wait for the avatar** to process and respond with speech
4. **Click the microphone again** to stop listening

### Text Communication
1. **Type a message** in the chat input at the bottom right
2. **Press Enter** or click the send button
3. **Watch and listen** as your avatar responds with speech

### Avatar Interaction
- **Mouse/Touch**: Rotate and view the avatar from different angles
- **Voice Commands**: Try saying "hello", "how are you", "what time is it", etc.

## Voice Features

### Supported Voice Commands
- **Greetings**: "Hello", "Hi"
- **Questions**: "How are you?", "What's your name?"
- **Time**: "What time is it?"
- **Weather**: "What's the weather like?"
- **Gratitude**: "Thank you", "Thanks"
- **Farewell**: "Goodbye", "Bye"

### Voice Recognition Tips
- Speak clearly and at a normal pace
- Ensure your microphone is working and permissions are granted
- Use a quiet environment for better recognition
- Wait for the "Listening..." indicator before speaking

## Customization

### Changing the Avatar Model

If your GLB file has a different name or location:

1. Update the path in `src/App.jsx`:
```jsx
const { scene } = useGLTF('/models/your-model-name.glb');
```

### Adjusting Avatar Position/Scale

Modify these values in `src/App.jsx`:
```jsx
<primitive 
  object={scene} 
  scale={[1, 1, 1]}  // Adjust scale
  position={[0, -1, 0]}     // Adjust position
/>
```

### Customizing Speech

The speech synthesis settings can be modified in the `speak` function:
```jsx
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-US';    // Language
utterance.rate = 0.9;        // Speed (0.1 to 10)
utterance.pitch = 1;         // Pitch (0 to 2)
utterance.volume = 0.8;      // Volume (0 to 1)
```

### Adding Custom Voice Responses

Modify the `generateAvatarResponse` function in `src/App.jsx`:
```jsx
const generateAvatarResponse = (userInput) => {
  const input = userInput.toLowerCase();
  
  if (input.includes('your-custom-keyword')) {
    return "Your custom response here!";
  }
  // ... existing responses
};
```

### Styling

The interface uses CSS custom properties for easy theming. Key colors can be modified in `src/style.css`:

- Primary gradient: `#667eea` to `#764ba2`
- Voice button: `#e53e3e` to `#c53030`
- Listening state: `#38a169` to `#2f855a`
- Background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

## Technical Details

### Dependencies

- **React 18**: Modern React with hooks
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for Three.js
- **Three.js**: 3D graphics library
- **Vite**: Fast build tool

### Browser Compatibility

- Modern browsers with WebGL support
- Speech synthesis API support required for voice features
- Speech recognition API support required for voice input
- Works best on Chrome, Firefox, Safari, Edge
- **Note**: Speech recognition may require HTTPS in production

### Performance Tips

- Use optimized GLB files (under 10MB recommended)
- Enable hardware acceleration in your browser
- Close other GPU-intensive applications
- Use a good quality microphone for better voice recognition

## Troubleshooting

### Avatar Not Loading
- Ensure your GLB file is in `public/models/avatar.glb`
- Check browser console for errors
- Verify the GLB file is valid

### Speech Not Working
- Check if your browser supports speech synthesis
- Try refreshing the page
- Ensure microphone permissions are granted

### Voice Recognition Not Working
- Check if your browser supports speech recognition
- Ensure microphone permissions are granted
- Try using Chrome or Edge for best compatibility
- Check if you're on HTTPS (required for some browsers)

### Performance Issues
- Reduce avatar model complexity
- Lower the scale values
- Check for other GPU-intensive applications
- Close other applications using the microphone

## Future Enhancements

- AI integration for more intelligent responses
- Lip-sync animation
- Multiple avatar support
- Voice recognition for hands-free interaction
- Custom animation triggers
- Export chat history
- Multi-language support
- Voice emotion detection

## License

MIT License - feel free to use and modify as needed! 