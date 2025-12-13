import React from 'react';
import { Player } from '../types';

interface BoardProps {
  squares: Player[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  xIsNext: boolean;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine, xIsNext, disabled }) => {
  const renderSquare = (i: number) => {
    const isWinningSquare = winningLine?.includes(i);
    const value = squares[i];
    
    return (
      <button
        key={i}
        className={`
          h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 
          rounded-xl text-4xl sm:text-5xl md:text-6xl font-black flex items-center justify-center
          transition-all duration-300 transform 
          ${value === null && !disabled ? 'hover:scale-105 hover:bg-white/10 cursor-pointer' : ''}
          ${value !== null ? 'cursor-default' : ''}
          ${isWinningSquare ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)] scale-105 z-10 border-none' : 'bg-white/5 backdrop-blur-md shadow-lg border border-white/10'}
          ${value === 'X' && !isWinningSquare ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : ''}
          ${value === 'O' && !isWinningSquare ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.5)]' : ''}
          ${disabled && value === null ? 'cursor-not-allowed opacity-40' : ''}
        `}
        onClick={() => !disabled && onClick(i)}
        disabled={disabled || value !== null}
        aria-label={`Square ${i}, ${value ? value : 'empty'}`}
      >
        <span className={`transform transition-all duration-300 ${value ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}>
          {value}
        </span>
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/5 shadow-2xl mx-auto">
      {squares.map((_, i) => renderSquare(i))}
    </div>
  );
};

export default Board;