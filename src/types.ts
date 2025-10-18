export interface Quiz {
  category: string;
  question: string;
  answer: 'O' | 'X';
}

export interface GameState {
  currentStage: number;
  hearts: number;
  hammers: number;
  selectedQuizzes: Quiz[];
  gameStatus: 'playing' | 'gameover' | 'victory';
  showQuiz: boolean;
  showSpecialStage: boolean;
  showRewardChoice: boolean;
  showHeartConfirm: boolean;
  showVictoryScreen: boolean;
  totalHammers: number;
}

export type RewardType = 'heart' | 'hammer';
