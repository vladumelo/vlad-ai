import React from 'react';
import { Camera, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 max-w-6xl mx-auto px-4">
        <div className="flex gap-2 items-center md:gap-4">
          <div className="bg-red-900/20 p-2 rounded-lg border border-red-900/50">
            <MapPin className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-100">
              Millionka <span className="text-red-500">AI</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Vladivostok Historic District Generator
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
             <div className="text-xs font-medium text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
                Powered by Gemini 2.5
             </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
