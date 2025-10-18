import { useEffect, useState } from 'react';
import './HouseAnimation.css';

interface HouseAnimationProps {
  onComplete?: () => void;
}

// 단순한 집 모양을 성냥개비로 표현 (5개의 선분)
const matchsticks = [
  // 지붕 (삼각형)
  { x1: 150, y1: 80, x2: 100, y2: 150, delay: 0 },    // 왼쪽 지붕
  { x1: 150, y1: 80, x2: 200, y2: 150, delay: 0.5 },  // 오른쪽 지붕

  // 집 벽 (사각형)
  { x1: 100, y1: 150, x2: 100, y2: 230, delay: 1.0 }, // 왼쪽 벽
  { x1: 200, y1: 150, x2: 200, y2: 230, delay: 1.0 }, // 오른쪽 벽

  // 바닥
  { x1: 100, y1: 230, x2: 200, y2: 230, delay: 1.5 }, // 바닥
];

function HouseAnimation({ onComplete }: HouseAnimationProps) {
  const [visibleSticks, setVisibleSticks] = useState<number>(0);

  useEffect(() => {
    if (visibleSticks < matchsticks.length) {
      const timer = setTimeout(() => {
        setVisibleSticks(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (visibleSticks === matchsticks.length && onComplete) {
      const completeTimer = setTimeout(onComplete, 1000);
      return () => clearTimeout(completeTimer);
    }
  }, [visibleSticks, onComplete]);

  return (
    <div className="house-animation-container">
      <h3 className="animation-title">망치로 집을 짓는 중...</h3>
      <svg width="300" height="320" viewBox="0 0 300 320" className="house-svg">
        {matchsticks.map((stick, index) => (
          <g key={index} className={index < visibleSticks ? 'visible' : 'hidden'}>
            <line
              x1={stick.x1}
              y1={stick.y1}
              x2={stick.x2}
              y2={stick.y2}
              className="matchstick"
              style={{ animationDelay: `${stick.delay}s` }}
            />
            <circle cx={stick.x1} cy={stick.y1} r="4" className="matchstick-head" />
            <circle cx={stick.x2} cy={stick.y2} r="4" className="matchstick-head" />
          </g>
        ))}
      </svg>
      <div className="hammer-counter">
        <span className="hammer-icon">🔨</span>
        <span className="hammer-count">{visibleSticks} / {matchsticks.length}</span>
      </div>
    </div>
  );
}

export default HouseAnimation;
