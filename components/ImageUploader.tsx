import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full aspect-[4/3] md:aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 group">
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onClear}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
          Original Image
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-[4/3] md:aspect-square rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-6 cursor-pointer
        ${dragActive 
          ? "border-red-500 bg-red-500/10 scale-[1.02]" 
          : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800"
        }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-lg">
        <Upload className={`w-8 h-8 ${dragActive ? 'text-red-500' : 'text-slate-400'}`} />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">
        Upload your photo
      </h3>
      <p className="text-sm text-slate-400 max-w-xs">
        Drag & drop or click to browse. Portraits or selfies work best.
      </p>
    </div>
  );
};
