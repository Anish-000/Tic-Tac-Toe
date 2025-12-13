import React from 'react';
import { Score, GameMode, Player } from '../types';

interface ScoreBoardProps {
  score: Score;
  mode: GameMode;
  currentPlayer: Player;
  gameOver: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, mode, currentPlayer, gameOver }) => {
  return (
    <div className="flex justify-center gap-6 mb-8 w-full max-w-md mx-auto">
      <div className={`
        flex flex-col items-center p-4 rounded-xl w-1/3 transition-all duration-300 border border-white/10
        ${!gameOver && currentPlayer === 'X' ? 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' : 'bg-white/5'}
      `}>
        <span className="text-xs uppercase tracking-wider text-cyan-200 font-semibold mb-1">Player X</span>
        <span className="text-3xl font-bold text-cyan-400">{score.wins}</span>
        <span className="text-[10px] text-slate-400 mt-1">
          {mode === GameMode.PVP ? '(Human)' : '(Human)'}
        </span>
      </div>

      <div className="flex flex-col items-center p-4 rounded-xl w-1/3 bg-white/5 border border-white/10">
        <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">Draws</span>
        <span className="text-3xl font-bold text-slate-200">{score.draws}</span>
      </div>

      <div className={`
        flex flex-col items-center p-4 rounded-xl w-1/3 transition-all duration-300 border border-white/10
        ${!gameOver && currentPlayer === 'O' ? 'bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-105' : 'bg-white/5'}
      `}>
        <span className="text-xs uppercase tracking-wider text-rose-200 font-semibold mb-1">Player O</span>
        <span className="text-3xl font-bold text-rose-400">{score.losses}</span>
        <span className="text-[10px] text-slate-400 mt-1">
          {mode === GameMode.PVP ? '(Human)' : '(AI)'}
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;