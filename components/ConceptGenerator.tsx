import React, { useState } from 'react';
import { generateClockConcept } from '../services/geminiService';
import { PRESET_PROMPTS, PromptType } from '../types';
import { Wand2, Download, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';

export const ConceptGenerator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PromptType>(PromptType.PHOTOREALISTIC);
  const [customPrompt, setCustomPrompt] = useState(PRESET_PROMPTS[0].text);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useHD, setUseHD] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetChange = (type: PromptType) => {
    setSelectedPreset(type);
    const preset = PRESET_PROMPTS.find(p => p.id === type);
    if (preset) setCustomPrompt(preset.text);
  };

  const handleGenerate = async () => {
    if (!customPrompt) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateClockConcept(customPrompt, useHD);
      if (base64Image) {
        setGeneratedImage(base64Image);
      } else {
        setError("The model generated a response but no image data was found. Try a different prompt.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            Generator Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Style Preset</label>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`px-4 py-2 text-left rounded-lg text-sm border transition-all ${
                      selectedPreset === preset.id
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
               <label className="block text-xs font-mono uppercase text-slate-500 mb-2">Prompt</label>
               <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
               />
            </div>

            <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">HD Quality</span>
                <span className="text-xs text-slate-500">Uses Gemini 3.0 Pro (Slower)</span>
              </div>
              <button 
                onClick={() => setUseHD(!useHD)}
                className={`w-12 h-6 rounded-full transition-colors relative ${useHD ? 'bg-indigo-500' : 'bg-slate-700'}`}
              >
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${useHD ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate Concept'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Display */}
      <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden group">
         {generatedImage ? (
           <div className="relative w-full h-full flex items-center justify-center">
             <img 
              src={generatedImage} 
              alt="Generated Concept" 
              className="max-w-full max-h-full rounded-lg shadow-2xl"
             />
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={generatedImage} 
                  download={`antilog-clock-${Date.now()}.png`}
                  className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white block"
                >
                  <Download className="w-5 h-5" />
                </a>
             </div>
           </div>
         ) : (
           <div className="text-center p-8">
              {loading ? (
                 <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Loader2 className="w-6 h-6 text-indigo-500 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-slate-400 animate-pulse">Dreaming up a design...</p>
                 </div>
              ) : error ? (
                <div className="text-rose-400 max-w-sm">
                   <p className="font-semibold mb-2">Generation Failed</p>
                   <p className="text-sm opacity-80">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-600 gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 opacity-50" />
                  </div>
                  <p>Select a preset and click Generate to see the concept.</p>
                </div>
              )}
           </div>
         )}
      </div>
    </div>
  );
};
