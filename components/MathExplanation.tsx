import React, { useState } from 'react';
import { generateExplanation } from '../services/geminiService';
import { Bot, Calculator, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const MathExplanation: React.FC = () => {
  const [topic, setTopic] = useState("Antilogarithmic");
  const [factor, setFactor] = useState(1.5);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const result = await generateExplanation(topic, factor);
    setContent(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light text-slate-100 mb-2">Theory & Mathematics</h2>
        <p className="text-slate-400">Ask the AI to explain the underlying logic of non-linear time projection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Input Card */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-fit">
          <h3 className="text-sm font-mono uppercase text-slate-500 mb-6 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Parameters
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Clock Type</label>
              <select 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="Linear">Linear (Standard)</option>
                <option value="Logarithmic">Logarithmic</option>
                <option value="Antilogarithmic">Antilogarithmic (Exponential)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Spacing Factor: {factor}</label>
              <input 
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={factor}
                onChange={(e) => setFactor(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Compressed</span>
                <span>Expanded</span>
              </div>
            </div>

            <button
              onClick={handleAsk}
              disabled={loading}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 hover:text-indigo-400 disabled:opacity-50 text-slate-200 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-indigo-400 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Explain Math</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Card */}
        <div className="md:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col overflow-hidden relative min-h-[400px]">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot className="w-32 h-32" />
           </div>

           {!content && !loading && (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
                <BookOpenIcon />
                <p>Set parameters and click "Explain Math" to generate a report.</p>
             </div>
           )}

           {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                 </div>
                 <p className="text-sm text-indigo-400 font-mono">Consulting Gemini 2.5 Flash...</p>
              </div>
           )}

           {content && !loading && (
             <div className="prose prose-invert prose-sm md:prose-base max-w-none overflow-y-auto pr-2 custom-scrollbar z-10">
               <ReactMarkdown>{content}</ReactMarkdown>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const BookOpenIcon = () => (
  <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
