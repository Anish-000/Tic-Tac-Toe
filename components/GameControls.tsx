import React from 'react';
import { GameMode } from '../types';

interface GameControlsProps {
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  currentMode: GameMode;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onModeChange, currentMode }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mb-6">
      <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-1 rounded-xl">
        <button
          onClick={() => onModeChange(GameMode.PVP)}
          className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${currentMode === GameMode.PVP ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          PvP Local
        </button>
        <button
          onClick={() => onModeChange(GameMode.PVC_EASY)}
          className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${currentMode === GameMode.PVC_EASY ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          PvC (Easy)
        </button>
        <button
          onClick={() => onModeChange(GameMode.PVC_HARD)}
          className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${currentMode === GameMode.PVC_HARD ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          PvC (Hard)
        </button>
      </div>
      
      <button
        onClick={onReset}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg border border-white/10 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        New Game
      </button>
    </div>
  );
};

export default GameControls;