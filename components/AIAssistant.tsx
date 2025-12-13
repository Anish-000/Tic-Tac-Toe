import React, { useState } from 'react';
import { getFastStrategyAdvice, getDeepAnalysis } from '../services/geminiService';
import { Player } from '../types';

interface AIAssistantProps {
  board: Player[];
  currentPlayer: Player;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ board, currentPlayer }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'FAST' | 'THINK'>('FAST');

  const handleAskAI = async (selectedMode: 'FAST' | 'THINK') => {
    setLoading(true);
    setMode(selectedMode);
    setAdvice(null);
    
    // Convert board to string representation
    const boardStr = board.map(b => b === null ? '_' : b).join('');
    
    try {
      let response = '';
      if (selectedMode === 'FAST') {
        response = await getFastStrategyAdvice(boardStr, currentPlayer || 'X');
      } else {
        response = await getDeepAnalysis(boardStr);
      }
      setAdvice(response);
    } catch (err) {
      setAdvice("AI is currently offline. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
       <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-xl">
         <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-white flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
             </svg>
             AI Strategist
           </h3>
         </div>

         <div className="flex gap-2 mb-4">
           <button
             onClick={() => handleAskAI('FAST')}
             disabled={loading}
             className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-200 py-2 rounded-lg text-sm font-medium transition-all"
           >
             ⚡ Quick Tip
           </button>
           <button
             onClick={() => handleAskAI('THINK')}
             disabled={loading}
             className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-200 py-2 rounded-lg text-sm font-medium transition-all"
           >
             🧠 Deep Think
           </button>
         </div>

         <div className="min-h-[60px] bg-black/40 rounded-lg p-3 text-sm text-slate-300 border border-white/5">
           {loading ? (
             <div className="flex items-center gap-2 animate-pulse">
               <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
               <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
               <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
               <span className="text-xs text-slate-400 ml-2">
                 {mode === 'THINK' ? 'Thinking intensely (Gemini 3 Pro)...' : 'Generating tip...'}
               </span>
             </div>
           ) : advice ? (
             <p className="leading-relaxed animate-fadeIn">{advice}</p>
           ) : (
             <p className="text-slate-500 italic">Ask for advice to reveal the best moves.</p>
           )}
         </div>
       </div>
    </div>
  );
};

export default AIAssistant;