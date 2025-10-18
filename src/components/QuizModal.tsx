import { Quiz } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  isSpecialStage: boolean;
  onAnswer: (answer: 'O' | 'X') => void;
}

const QuizModal = ({ quiz, isSpecialStage, onAnswer }: QuizModalProps) => {
  return (
    <div className="modal-overlay">
      <div className={`modal quiz-modal ${isSpecialStage ? 'special' : ''}`}>
        {isSpecialStage && (
          <div className="special-indicator">
            <div className="hanok-image">🏯</div>
            <p className="special-label">특별 스테이지</p>
          </div>
        )}

        <div className="quiz-category">{quiz.category}</div>
        <h2 className="quiz-question">{quiz.question}</h2>

        <div className="quiz-buttons">
          <button
            onClick={() => onAnswer('O')}
            className="quiz-btn btn-o"
          >
            O
          </button>
          <button
            onClick={() => onAnswer('X')}
            className="quiz-btn btn-x"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
