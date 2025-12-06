import React, { useState } from 'react';
import { Clock, Calculator, Palette, BookOpen, Settings2 } from 'lucide-react';
import { ClockFace } from './components/ClockFace';
import { ConceptGenerator } from './components/ConceptGenerator';
import { MathExplanation } from './components/MathExplanation';

enum Tab {
  SIMULATION = 'SIMULATION',
  CONCEPT = 'CONCEPT',
  THEORY = 'THEORY'
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);
  const [distributionFactor, setDistributionFactor] = useState<number>(1); // 1 = Linear, >1 = Exp/Antilog, <1 = Log

  return (
    <div className="flex h-full flex-col md:flex-row bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar / Navigation */}
      <nav className="w-full md:w-20 lg:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex md:flex-col justify-between p-4 z-10">
        <div className="flex items-center md:flex-col md:items-start gap-4">
          <div className="flex items-center gap-3 mb-0 md:mb-8">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden lg:block">
              Antilog Chronos
            </h1>
          </div>
          
          <div className="flex md:flex-col gap-2 w-full">
            <NavButton 
              active={activeTab === Tab.SIMULATION} 
              onClick={() => setActiveTab(Tab.SIMULATION)}
              icon={<Settings2 className="w-5 h-5" />}
              label="Simulation"
            />
            <NavButton 
              active={activeTab === Tab.THEORY} 
              onClick={() => setActiveTab(Tab.THEORY)}
              icon={<BookOpen className="w-5 h-5" />}
              label="Theory & Math"
            />
            <NavButton 
              active={activeTab === Tab.CONCEPT} 
              onClick={() => setActiveTab(Tab.CONCEPT)}
              icon={<Palette className="w-5 h-5" />}
              label="Concept Art"
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-4 text-xs text-slate-500 mt-auto">
          <p>Powered by Gemini 2.5 & 3.0</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto p-4 md:p-8 h-full">
          {activeTab === Tab.SIMULATION && (
            <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
                 <h2 className="text-3xl md:text-4xl font-light tracking-wider text-slate-100 mb-2 text-center">
                  {distributionFactor === 1 ? 'Linear Time' : distributionFactor > 1 ? 'Antilogarithmic Time' : 'Logarithmic Time'}
                </h2>
                <p className="text-slate-400 text-center mb-8 max-w-md">
                  {distributionFactor === 1 
                    ? "Standard linear progression. Intervals are equal."
                    : distributionFactor > 1
                      ? "Exponential expansion. Time accelerates visually as the hour increases."
                      : "Logarithmic compression. Early hours are spaced widely, later hours compress."
                  }
                </p>

                <div className="w-full bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800/50 shadow-2xl flex flex-col items-center gap-8">
                  <ClockFace distributionFactor={distributionFactor} />
                  
                  <div className="w-full max-w-xs space-y-4">
                    <div className="flex justify-between text-xs text-slate-400 font-mono uppercase tracking-widest">
                      <span>Logarithmic</span>
                      <span>Linear</span>
                      <span>Exponential</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={distributionFactor}
                      onChange={(e) => setDistributionFactor(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                    />
                    <div className="flex justify-center">
                       <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-indigo-300 border border-indigo-500/20">
                        Factor: {distributionFactor.toFixed(1)}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === Tab.THEORY && (
             <div className="h-full animate-in slide-in-from-bottom-4 duration-300">
               <MathExplanation />
             </div>
          )}

          {activeTab === Tab.CONCEPT && (
            <div className="h-full animate-in slide-in-from-bottom-4 duration-300">
              <ConceptGenerator />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full
        ${active 
          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
    >
      <div className={`${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icon}
      </div>
      <span className={`font-medium hidden lg:block ${active ? 'text-indigo-100' : ''}`}>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 hidden lg:block shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
    </button>
  );
}
