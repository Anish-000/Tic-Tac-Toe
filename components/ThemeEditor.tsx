import React, { useState, useRef } from 'react';
import { editGameTheme } from '../services/geminiService';

interface ThemeEditorProps {
  onThemeApply: (imageUrl: string) => void;
  currentBg: string | null;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ onThemeApply, currentBg }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default abstract tech background for demo purposes if none uploaded
  const defaultBg = "https://picsum.photos/800/800"; 

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Use uploaded preview or current bg or default
    const sourceImage = preview || currentBg || defaultBg;
    
    // If it's a remote URL (picsum), we can't easily edit it via client-side Canvas safely without CORS issues
    // For this demo, we'll assume the user UPLOADS an image to edit, or we use a hardcoded base64 placeholder if available.
    // To keep it robust: We strictly require an uploaded file or previously generated file (base64) for editing.
    // If sourceImage is a URL (http), we might fail. 
    // Let's enforce upload for the first edit.
    
    let base64ToSend = sourceImage;
    
    // Simple check if it's a URL and not base64
    if (sourceImage.startsWith('http')) {
        // In a real app, we'd fetch and convert to blob, but CORS prevents this on random URLs.
        // We will ask user to upload if they haven't yet.
        if (!preview) {
             setError("Please upload an image to start editing.");
             return;
        }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await editGameTheme(base64ToSend, prompt);
      if (result) {
        setPreview(result);
        onThemeApply(result);
      } else {
        setError("Could not generate image. Try a different prompt.");
      }
    } catch (err) {
      setError("Failed to process image. API Key might be missing or invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full max-w-md mx-auto mt-8">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
        </svg>
        Theme Studio
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        Upload a base image and use AI to edit it (e.g., "Add neon lights", "Make it look like wood").
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
           <div 
             className="h-20 w-20 rounded-lg bg-slate-700 border-2 border-dashed border-slate-500 flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-400 transition-colors"
             onClick={() => fileInputRef.current?.click()}
           >
             {preview ? (
               <img src={preview} alt="Preview" className="h-full w-full object-cover" />
             ) : (
               <span className="text-xs text-slate-500 text-center px-1">Upload Base</span>
             )}
           </div>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleImageUpload} 
             className="hidden" 
             accept="image/*"
           />
           
           <div className="flex-1">
             <input
               type="text"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="E.g., Make it look like a sci-fi HUD"
               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none"
             />
           </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={isLoading || !preview}
          className={`
            w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
            ${isLoading || !preview 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:from-yellow-400 hover:to-orange-400'}
          `}
        >
          {isLoading ? (
             <>
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Editing...
             </>
          ) : (
             'Generate Theme'
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeEditor;