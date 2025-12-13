import { Player } from '../types';

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const checkWinner = (squares: Player[]): { winner: Player | 'DRAW' | null, line: number[] | null } => {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: WINNING_LINES[i] };
    }
  }

  if (!squares.includes(null)) {
    return { winner: 'DRAW', line: null };
  }

  return { winner: null, line: null };
};

// Minimax Algorithm for Unbeatable AI
const scores = {
  X: -10, // AI is O (minimizing player usually, but lets make AI flexible)
  O: 10,
  TIE: 0
};

// Assume AI is 'O' for this implementation standard
export const getBestMove = (squares: Player[], aiPlayer: Player): number => {
  // Opening book: Center is best if available
  if (squares[4] === null) return 4;

  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      squares[i] = aiPlayer;
      const score = minimax(squares, 0, false, aiPlayer);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

const minimax = (squares: Player[], depth: number, isMaximizing: boolean, aiPlayer: Player): number => {
  const { winner } = checkWinner(squares);
  const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';

  if (winner === aiPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (winner === 'DRAW') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = aiPlayer;
        const score = minimax(squares, depth + 1, false, aiPlayer);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = humanPlayer;
        const score = minimax(squares, depth + 1, true, aiPlayer);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export const getRandomMove = (squares: Player[]): number => {
  const availableMoves = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
  if (availableMoves.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};
