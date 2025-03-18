"use client"

import { FileAudio, MessageSquareText, BookOpen } from 'lucide-react';

const Hero = () => {
  return (
    <div className="w-full px-4 py-12 flex flex-col items-center justify-center text-center space-y-2">
      <h1 className="text-4xl font-bold tracking-tighter">
        Get Insider Insights from PDFs
      </h1>
      <p className="text-lg text-muted-foreground max-w-[600px]">
        Transform your PDF experience with AI-powered features for enhanced reading and comprehension
      </p>
      
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px] w-full mt-8">
        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileAudio className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Text-to-Speech</h3>
          <p className="text-sm text-muted-foreground text-center">
            Listen to your documents with natural-sounding voices and adjustable playback speeds
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquareText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">AI Chat Assistant</h3>
          <p className="text-sm text-muted-foreground text-center">
            Ask questions and get instant answers about your document&apos;s content
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Smart Navigation</h3>
          <p className="text-sm text-muted-foreground text-center">
            Easily navigate through pages with an intuitive interface and quick controls
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero; 