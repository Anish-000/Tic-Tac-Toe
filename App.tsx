import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';
import ThemeEditor from './components/ThemeEditor';
import { checkWinner, getBestMove, getRandomMove } from './services/gameLogic';
import { Player, GameMode, Score } from './types';

type View = 'HOME' | 'GAME';

function App() {
  const [view, setView] = useState<View>('HOME');
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PVC_HARD);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [score, setScore] = useState<Score>({ wins: 0, losses: 0, draws: 0 });
  const [customTheme, setCustomTheme] = useState<string | null>(null);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const isAiTurn = gameMode !== GameMode.PVP && currentPlayer === 'O' && !winner && view === 'GAME';

  const handleSquareClick = useCallback((i: number) => {
    if (board[i] || winner || isAiTurn) return;

    const newBoard = [...board];
    newBoard[i] = currentPlayer;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }, [board, winner, isAiTurn, currentPlayer, xIsNext]);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setScore({ wins: 0, losses: 0, draws: 0 });
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine(null);
    setView('GAME');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true); // X always starts
    setWinner(null);
    setWinningLine(null);
  };

  const goHome = () => {
    setView('HOME');
    resetGame();
  };

  // Check for winner
  useEffect(() => {
    const { winner: gameWinner, line } = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      
      // Update Score
      if (gameWinner === 'DRAW') {
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else if (gameWinner === 'X') {
        setScore(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else {
        setScore(prev => ({ ...prev, losses: prev.losses + 1 }));
      }
    }
  }, [board]);

  // AI Turn Handling
  useEffect(() => {
    if (isAiTurn) {
      const timer = setTimeout(() => {
        let moveIndex = -1;
        
        if (gameMode === GameMode.PVC_HARD) {
          moveIndex = getBestMove(board, 'O');
        } else {
          // Easy mode: Random moves occasionally
          if (Math.random() > 0.7) {
            moveIndex = getBestMove(board, 'O');
          } else {
             moveIndex = getRandomMove(board);
          }
        }

        if (moveIndex !== -1) {
          const newBoard = [...board];
          newBoard[moveIndex] = 'O';
          setBoard(newBoard);
          setXIsNext(!xIsNext);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAiTurn, board, gameMode, xIsNext]);

  return (
    <div 
      className="min-h-screen flex flex-col bg-slate-900 text-slate-100 transition-all duration-700 bg-cover bg-center font-sans"
      style={{ 
        backgroundImage: customTheme ? `url(${customTheme})` : 'none',
        backgroundColor: customTheme ? 'rgba(15, 23, 42, 0.95)' : undefined,
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between backdrop-blur-sm bg-black/10 z-20">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goHome}>
          <div className="bg-gradient-to-tr from-cyan-400 to-rose-400 h-8 w-8 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
             <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
            Nebula Tic-Tac-Toe
          </h1>
        </div>
        {view === 'GAME' && (
          <button 
            onClick={goHome}
            className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
          >
            Exit Game
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative w-full z-10">
        
        {view === 'HOME' ? (
          /* Home View */
          <div className="w-full max-w-4xl animate-fadeIn flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-rose-300 drop-shadow-sm">
              Choose Your Opponent
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4 md:px-12">
              {/* Card: VS Human */}
              <button 
                onClick={() => startGame(GameMode.PVP)}
                className="group relative h-64 md:h-80 bg-slate-800/50 rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center gap-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:bg-slate-800 hover:border-cyan-400 hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.3)]"
              >
                {/* Gradient Burst */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon Circle */}
                <div className="relative z-10 h-24 w-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 ring-1 ring-white/5 group-hover:ring-cyan-400/50 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-cyan-500/20 transition-all duration-500 shadow-lg shadow-transparent group-hover:shadow-cyan-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-300 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">Play vs Human</h3>
                  <p className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors duration-300">Challenge a friend on the same device.</p>
                </div>
              </button>

              {/* Card: VS AI */}
              <button 
                onClick={() => startGame(GameMode.PVC_HARD)}
                className="group relative h-64 md:h-80 bg-slate-800/50 rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center gap-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:bg-slate-800 hover:border-rose-400 hover:shadow-[0_0_50px_-10px_rgba(251,113,133,0.3)]"
              >
                {/* Gradient Burst */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon Circle */}
                <div className="relative z-10 h-24 w-24 rounded-full bg-rose-500/10 flex items-center justify-center mb-2 ring-1 ring-white/5 group-hover:ring-rose-400/50 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-rose-500/20 transition-all duration-500 shadow-lg shadow-transparent group-hover:shadow-rose-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-300 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors duration-300">Play vs AI</h3>
                  <p className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors duration-300">Test your skills against Gemini AI.</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Game View */
          <div className="w-full max-w-lg flex flex-col items-center animate-fadeIn">
            <ScoreBoard 
              score={score} 
              mode={gameMode} 
              currentPlayer={currentPlayer} 
              gameOver={!!winner} 
            />
            
            <div className="relative">
              <Board 
                squares={board} 
                onClick={handleSquareClick} 
                winningLine={winningLine}
                xIsNext={xIsNext}
                disabled={!!winner || isAiTurn}
              />
              
              {/* Victory/Winner Overlay */}
              {winner && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                   {/* Confetti Background Effect (Simple CSS dots) */}
                   <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 rounded-full animate-confetti" 
                             style={{
                               left: `${Math.random() * 100}%`,
                               top: `-10px`,
                               backgroundColor: ['#22d3ee', '#f43f5e', '#fbbf24', '#a855f7'][Math.floor(Math.random() * 4)],
                               animationDuration: `${1 + Math.random() * 2}s`,
                               animationDelay: `${Math.random() * 0.5}s`
                             }} 
                        />
                      ))}
                   </div>

                   <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 px-8 py-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center animate-popIn transform">
                    <h2 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-rose-400">
                      {winner === 'DRAW' ? 'It\'s a Draw!' : `Player ${winner} Wins!`}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                       {winner === 'DRAW' ? 'Well played both sides.' : 'Victory is yours!'}
                    </p>
                    <button 
                      onClick={resetGame}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full mt-8 flex flex-col items-center gap-0">
              <GameControls 
                onReset={resetGame} 
                onModeChange={setGameMode} 
                currentMode={gameMode} 
              />
              
              <ThemeEditor onThemeApply={setCustomTheme} currentBg={customTheme} />
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="w-full p-6 text-center text-slate-500 text-sm border-t border-white/5 bg-black/20 backdrop-blur-sm z-20">
        <p className="mb-1">&copy; {new Date().getFullYear()} Nebula Gaming. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1">
          Made with love <span className="text-red-500 animate-pulse">❤️</span> by Anish Chattopadhyay
        </p>
      </footer>
    </div>
  );
}

export default App;