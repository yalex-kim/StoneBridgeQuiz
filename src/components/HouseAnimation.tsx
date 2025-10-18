import { useEffect, useState } from 'react';
import './HouseAnimation.css';

interface HouseAnimationProps {
  onComplete?: () => void;
}

// '집' 글자를 성냥개비로 표현 (10개의 선분)
const matchsticks = [
  // 人 부분 (지붕)
  { x1: 150, y1: 80, x2: 100, y2: 150, delay: 0 },    // 왼쪽 지붕
  { x1: 150, y1: 80, x2: 200, y2: 150, delay: 0.3 },  // 오른쪽 지붕

  // 一 (가로선)
  { x1: 80, y1: 150, x2: 220, y2: 150, delay: 0.6 },   // 긴 가로선

  // 至 부분 (집 구조)
  { x1: 110, y1: 170, x2: 190, y2: 170, delay: 0.9 },  // 위 가로선
  { x1: 110, y1: 170, x2: 110, y2: 220, delay: 1.2 },  // 왼쪽 세로선
  { x1: 190, y1: 170, x2: 190, y2: 220, delay: 1.2 },  // 오른쪽 세로선
  { x1: 120, y1: 195, x2: 180, y2: 195, delay: 1.5 },  // 중간 가로선
  { x1: 150, y1: 195, x2: 150, y2: 220, delay: 1.8 },  // 중앙 세로선

  // 아래 부분
  { x1: 100, y1: 220, x2: 200, y2: 220, delay: 2.1 },  // 아래 가로선
  { x1: 120, y1: 235, x2: 180, y2: 235, delay: 2.4 },  // 바닥선
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
