# PlayAI PDF Reader

A modern web application that combines PDF viewing with AI-powered text-to-speech capabilities. Upload your PDFs and listen to them with customizable voice settings.

## Features

- 📱 Responsive PDF viewer with page navigation
- 🔊 AI-powered text-to-speech with multiple voices
- ⚡ Real-time audio generation and playback
- 🎛️ Customizable voice settings (speed, temperature)
- 🌓 Dark/Light mode support

## Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Animations**: GSAP
- **PDF Handling**: React-PDF + PDF.js
  - Uses PDF.js Web Worker to run in separate thread to prevent UI blocking
  - Configured via CDN for optimal loading
- **Audio**: Web Audio API + PlayAI API
  - Text-to-speech powered by PlayAI's advanced neural models
  - Real-time audio streaming with low latency
  - Multiple AI voices with customizable parameters
- **Icons**: Lucide React

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
   touch .env

   # Add the following variables (replace with your actual values)
   PLAYAI_API_KEY=your_api_key_here
   PLAYAI_USER_ID=your_user_id_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Decisions

- **Component Architecture**: Modular components (PDFViewer, AudioControls, FileUpload) for better maintainability and reusability
- **State Management**: React hooks for local state, keeping the implementation simple and efficient
- **UI/UX**: 
  - Clean, minimal interface with smooth animations
  - Consistent design language using Shadcn open-source components + global tailwind css components
  - Responsive layout
  - Singla page layout, with component animation using GSAP
  - Dark mode / light mode

- **Performance**: 
  - Dynamic imports for PDF viewer
  - Blob audio streaming
