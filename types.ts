export type Player = 'X' | 'O' | null;

export enum GameMode {
  PVP = 'PVP',
  PVC_EASY = 'PVC_EASY',
  PVC_HARD = 'PVC_HARD',
}

export interface GameState {
  board: Player[];
  xIsNext: boolean;
  winner: Player | 'DRAW' | null;
  winningLine: number[] | null;
  history: Player[][];
}

export interface Score {
  wins: number;
  losses: number;
  draws: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export enum ThemeType {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM'
}
