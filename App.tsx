import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { generateMillionkaStyle } from './services/geminiService';
import { AppState } from './types';
// FIX: Added Image as ImageIcon to imports
import { Wand2, Download, Loader2, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [promptModifier, setPromptModifier] = useState<string>('Historical 19th century look');

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg('');
  };

  const handleClear = () => {
    setSelectedFile(null);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg('');
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setAppState(AppState.PROCESSING);
    setErrorMsg('');

    try {
      const fullPrompt = `Change the background to the historic Millionka district in Vladivostok. ${promptModifier}. Keep the person in the foreground exactly as is, matching lighting to the scene. High quality, realistic, cinematic.`;
      
      const resultUrl = await generateMillionkaStyle(selectedFile, fullPrompt);
      setGeneratedImage(resultUrl);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Failed to generate image. Please try again.");
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'millionka-style.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-red-200 to-red-400 mb-4">
            Walk the Streets of Millionka
          </h1>
          <p className="text-slate-400 text-lg">
            Upload your selfie and let Gemini AI transport you to the historic red-brick alleyways of old Vladivostok.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                selectedImage={selectedFile} 
                onClear={handleClear}
              />
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Atmosphere Settings
              </label>
              <select 
                value={promptModifier}
                onChange={(e) => setPromptModifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Historical 19th century look, sepia tones, old brick">Vintage Sepia (19th Century)</option>
                <option value="Sunny day, vibrant colors, detailed brickwork, bustling street">Sunny Afternoon</option>
                <option value="Night time, lanterns, foggy atmosphere, mysterious alley">Mysterious Night (Noir)</option>
                <option value="Snowy winter day in Vladivostok, cozy atmosphere">Snowy Winter</option>
              </select>
              
              <button
                onClick={handleGenerate}
                disabled={!selectedFile || appState === AppState.PROCESSING}
                className={`w-full mt-6 py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                  ${!selectedFile || appState === AppState.PROCESSING 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white hover:shadow-red-900/20"
                  }`}
              >
                {appState === AppState.PROCESSING ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Transporting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Scene
                  </>
                )}
              </button>
              
              {appState === AppState.ERROR && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-6">
             <div className="relative w-full aspect-[4/3] md:aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
                {appState === AppState.PROCESSING ? (
                  <div className="text-center space-y-4 p-8">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400 animate-pulse">Rebuilding the streets of Millionka...</p>
                  </div>
                ) : generatedImage ? (
                  <>
                    <img 
                      src={generatedImage} 
                      alt="Generated Millionka Scene" 
                      className="w-full h-full object-cover"
                    />
                     <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
                      AI Generated
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 text-slate-500">
                    <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                       <ImageIcon className="w-10 h-10 opacity-50" />
                    </div>
                    <p>Your generated image will appear here</p>
                  </div>
                )}
             </div>

             {appState === AppState.SUCCESS && generatedImage && (
               <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={handleDownload}
                   className="flex-1 bg-slate-100 text-slate-900 hover:bg-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                 >
                   <Download className="w-5 h-5" />
                   Download
                 </button>
                 <button 
                   onClick={handleGenerate}
                   className="flex-1 bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                 >
                   <RefreshCw className="w-5 h-5" />
                   Regenerate
                 </button>
               </div>
             )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-slate-900 py-8 mt-8 bg-slate-950">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Millionka AI. Powered by Google Gemini 2.5 Flash Image.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;