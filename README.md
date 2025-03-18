# PlayAI PDF Reader

A modern web application that combines PDF viewing with AI-powered text-to-speech capabilities. Upload your PDFs and listen to them with customizable voice settings.

## Features

- 📱 Responsive PDF viewer with page navigation
- 🔊 AI-powered text-to-speech with multiple voices
- ⚡ Real-time audio generation and playback
- 🎛️ Customizable voice settings (speed, temperature)
- 🌓 Dark/Light mode support
- 💬 Interactive AI chat assistant
- 🎯 Smart page navigation

## Design Principles

### 1. User Experience
- **Minimalist Interface**: Clean, distraction-free design focusing on content
- **Progressive Enhancement**: Core features work without JavaScript, enhanced with JS
- **Responsive Design**: Fluid layouts that work across all device sizes
- **Intuitive Navigation**: Clear hierarchy and consistent interaction patterns
- **Visual Feedback**: Smooth animations and transitions using GSAP
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### 2. Performance
- **Optimized Loading**: Dynamic imports and code splitting
- **Worker Threads**: PDF.js Web Worker for non-blocking PDF processing
- **Real-time Processing**: Immediate audio generation on page changes
- **Efficient State Management**: React hooks for local state management
- **Resource Management**: Proper cleanup of WebSocket connections and audio resources

### 3. Architecture
- **Component-Based**: Modular, reusable components
- **Separation of Concerns**: Clear distinction between UI, business logic, and data
- **Type Safety**: TypeScript for better developer experience and code reliability
- **Error Boundaries**: Graceful error handling and user feedback
- **Security First**: Environment variables for sensitive data, proper API key management

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Components**: 
  - Shadcn/UI (Radix UI primitives)
  - Tailwind CSS for styling
  - GSAP for animations
- **State Management**: React Hooks
- **PDF Processing**: 
  - React-PDF
  - PDF.js Web Worker
- **Audio**: 
  - Web Audio API
  - PlayAI API for text-to-speech
- **Icons**: Lucide React

### Development Tools
- **Language**: TypeScript/JavaScript
- **Linting**: ESLint with Next.js config
- **Package Management**: npm
- **Build Tool**: Next.js built-in compiler
- **Version Control**: Git

### APIs and Services
- **Text-to-Speech**: PlayAI API
- **Chat Interface**: PlayAI Agent API
- **PDF Processing**: PDF.js CDN

## Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/playai-pdf-reader.git
   cd playai-pdf-reader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Create a .env.local file in the root directory
   touch .env.local

   # Add the following variables (replace with your actual values)
   NEXT_PUBLIC_PLAYAI_API_KEY=your_api_key_here
   NEXT_PUBLIC_PLAYAI_USER_ID=your_user_id_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
