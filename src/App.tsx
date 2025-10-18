import { useState, useEffect } from 'react';
import { GameState, Quiz, RewardType } from './types';
import quizzesData from './data/quizzes.json';
import StoneBridge from './components/StoneBridge';
import QuizModal from './components/QuizModal';
import HouseAnimation from './components/HouseAnimation';
import './App.css';

const TOTAL_STAGES = 50;
const SPECIAL_STAGES = [10, 20, 30, 40, 50];
const REQUIRED_HAMMERS = 5;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: 1,
    hearts: 3,
    hammers: 0,
    selectedQuizzes: [],
    gameStatus: 'playing',
    showQuiz: false,
    showSpecialStage: false,
    showRewardChoice: false,
    showVictoryScreen: false,
    showWrongAnswer: false,
    showHouseAnimation: false,
    totalHammers: 0,
  });

  useEffect(() => {
    const savedHammers = localStorage.getItem('totalHammers');
    const totalHammers = savedHammers ? parseInt(savedHammers) : 0;

    // 난이도별로 퀴즈 선택 (10문제씩, 난이도 1-5)
    const selected: Quiz[] = [];
    for (let difficulty = 1; difficulty <= 5; difficulty++) {
      const quizzesOfDifficulty = (quizzesData as Quiz[]).filter(q => q.difficulty === difficulty);
      const shuffled = [...quizzesOfDifficulty].sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, 10));
    }

    setGameState(prev => ({
      ...prev,
      selectedQuizzes: selected,
      totalHammers,
      hammers: totalHammers,
    }));
  }, []);

  const handleStoneClick = (stage: number) => {
    if (stage !== gameState.currentStage || gameState.showQuiz) return;

    const isSpecial = SPECIAL_STAGES.includes(stage);
    setGameState(prev => ({
      ...prev,
      showQuiz: true,
      showSpecialStage: isSpecial,
    }));
  };

  const handleAnswer = (selectedAnswer: 'O' | 'X') => {
    const currentQuiz = gameState.selectedQuizzes[gameState.currentStage - 1];
    const isCorrect = selectedAnswer === currentQuiz.answer;

    if (isCorrect) {
      if (gameState.showSpecialStage) {
        setGameState(prev => ({
          ...prev,
          showQuiz: false,
          showRewardChoice: true,
        }));
      } else {
        moveToNextStage();
      }
    } else {
      setGameState(prev => ({
        ...prev,
        showQuiz: false,
        showWrongAnswer: true,
      }));
    }
  };

  const handleWrongAnswerConfirm = () => {
    const newHearts = gameState.hearts - 1;

    if (newHearts <= 0) {
      setGameState(prev => ({
        ...prev,
        hearts: 0,
        gameStatus: 'gameover',
        showWrongAnswer: false,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        hearts: newHearts,
        showWrongAnswer: false,
      }));
      moveToNextStage();
    }
  };

  const handleRewardChoice = (reward: RewardType) => {
    if (reward === 'heart') {
      setGameState(prev => ({
        ...prev,
        hearts: prev.hearts + 1,
        showRewardChoice: false,
      }));
    } else {
      const newTotalHammers = gameState.totalHammers + 1;
      localStorage.setItem('totalHammers', newTotalHammers.toString());
      setGameState(prev => ({
        ...prev,
        hammers: newTotalHammers,
        totalHammers: newTotalHammers,
        showRewardChoice: false,
      }));
    }
    moveToNextStage();
  };

  const moveToNextStage = () => {
    if (gameState.currentStage === TOTAL_STAGES) {
      if (gameState.totalHammers >= REQUIRED_HAMMERS) {
        setGameState(prev => ({
          ...prev,
          gameStatus: 'victory',
          showHouseAnimation: true,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          showVictoryScreen: true,
        }));
      }
    } else {
      setGameState(prev => ({
        ...prev,
        currentStage: prev.currentStage + 1,
        showQuiz: false,
        showSpecialStage: false,
      }));
    }
  };

  const handleAnimationComplete = () => {
    setGameState(prev => ({
      ...prev,
      showHouseAnimation: false,
      showVictoryScreen: true,
    }));
  };

  const handleRestart = () => {
    // 난이도별로 퀴즈 선택 (10문제씩, 난이도 1-5)
    const selected: Quiz[] = [];
    for (let difficulty = 1; difficulty <= 5; difficulty++) {
      const quizzesOfDifficulty = (quizzesData as Quiz[]).filter(q => q.difficulty === difficulty);
      const shuffled = [...quizzesOfDifficulty].sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, 10));
    }

    setGameState(prev => ({
      ...prev,
      currentStage: 1,
      hearts: 3,
      selectedQuizzes: selected,
      gameStatus: 'playing',
      showQuiz: false,
      showSpecialStage: false,
      showRewardChoice: false,
      showVictoryScreen: false,
      showHouseAnimation: false,
      hammers: prev.totalHammers,
    }));
  };

  const currentQuiz = gameState.selectedQuizzes[gameState.currentStage - 1];

  return (
    <div className="app">
      <div className="header">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{gameState.hearts}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔨</span>
            <span className="stat-value">{gameState.totalHammers}/{REQUIRED_HAMMERS}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Stage {gameState.currentStage}/{TOTAL_STAGES}</span>
          </div>
        </div>
      </div>

      <StoneBridge
        currentStage={gameState.currentStage}
        totalStages={TOTAL_STAGES}
        specialStages={SPECIAL_STAGES}
        onStoneClick={handleStoneClick}
      />

      {gameState.showQuiz && currentQuiz && (
        <QuizModal
          quiz={currentQuiz}
          isSpecialStage={gameState.showSpecialStage}
          onAnswer={handleAnswer}
        />
      )}

      {gameState.showRewardChoice && (
        <div className="modal-overlay">
          <div className="modal reward-modal">
            <h2>정답입니다!</h2>
            <p>보상을 선택하세요</p>
            <div className="reward-buttons">
              <button onClick={() => handleRewardChoice('heart')} className="reward-btn">
                <span className="reward-icon">❤️</span>
                <span>목숨</span>
              </button>
              <button onClick={() => handleRewardChoice('hammer')} className="reward-btn">
                <span className="reward-icon">🔨</span>
                <span>망치</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.showWrongAnswer && currentQuiz && (
        <div className="modal-overlay">
          <div className="modal wrong-answer-modal">
            <h2>❌ 오답입니다!</h2>
            <div className="wrong-answer-content">
              <p className="quiz-question">{currentQuiz.question}</p>
              <p className="correct-answer">정답: <strong>{currentQuiz.answer}</strong></p>
              {currentQuiz.explanation && (
                <p className="explanation">{currentQuiz.explanation}</p>
              )}
              <div className="heart-deduction">
                <p className="heart-message">💔 하트 -1</p>
                <p className="remaining-hearts">남은 하트: {gameState.hearts - 1}개</p>
              </div>
            </div>
            <button onClick={handleWrongAnswerConfirm} className="btn-confirm">확인</button>
          </div>
        </div>
      )}

      {gameState.gameStatus === 'gameover' && (
        <div className="modal-overlay">
          <div className="modal gameover-modal">
            <h2>게임 오버</h2>
            <p>현재 망치: {gameState.totalHammers}/{REQUIRED_HAMMERS}</p>
            <button onClick={handleRestart} className="btn-restart">재도전</button>
          </div>
        </div>
      )}

      {gameState.showHouseAnimation && (
        <div className="modal-overlay">
          <div className="modal animation-modal">
            <HouseAnimation onComplete={handleAnimationComplete} />
          </div>
        </div>
      )}

      {gameState.showVictoryScreen && (
        <div className="modal-overlay">
          <div className="modal victory-modal">
            {gameState.totalHammers >= REQUIRED_HAMMERS ? (
              <>
                <h2>🏡 승리!</h2>
                <p>집짓기 성공!</p>
                <p className="hammer-count">망치 {gameState.totalHammers}개로 멋진 집을 지었습니다!</p>
              </>
            ) : (
              <>
                <h2>아쉬워요!</h2>
                <p>망치가 부족합니다</p>
                <p className="hammer-count">현재: {gameState.totalHammers}/{REQUIRED_HAMMERS}</p>
                <button onClick={handleRestart} className="btn-restart">재도전</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
