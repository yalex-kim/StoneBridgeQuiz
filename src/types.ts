export interface Quiz {
  category: string;
  question: string;
  answer: 'O' | 'X';
  difficulty: number;
  explanation?: string;
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
  showWrongAnswer: boolean;
  showHouseAnimation: boolean;
  totalHammers: number;
}

export type RewardType = 'heart' | 'hammer';
