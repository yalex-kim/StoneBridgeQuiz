import { useEffect, useRef } from 'react';

interface StoneBridgeProps {
  currentStage: number;
  totalStages: number;
  specialStages: number[];
  onStoneClick: (stage: number) => void;
}

const StoneBridge = ({ currentStage, totalStages, specialStages, onStoneClick }: StoneBridgeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const currentStone = containerRef.current.querySelector(`[data-stage="${currentStage}"]`);
      if (currentStone) {
        currentStone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStage]);

  const renderStones = () => {
    const stones = [];
    const visibleRange = 50; // 모든 돌 표시
    const startStage = Math.max(1, currentStage - 2);
    const endStage = Math.min(totalStages, currentStage + visibleRange);

    for (let i = startStage; i <= endStage; i++) {
      const distance = i - currentStage;
      const isSpecial = specialStages.includes(i);
      const isCurrent = i === currentStage;
      const isPassed = i < currentStage;

      // 원근감: 지평선에서 다가오는 효과
      // 현재 돌은 아래(화면 앞), 다음 돌들은 위쪽(지평선)에서 다가옴
      const translateZ = -distance * 25; // 좁은 간격
      const translateY = -distance * 12; // 위로 올라감 (지평선)
      const scale = 1; // scale은 perspective가 자동으로 처리
      const opacity = distance > 35 ? Math.max(0.2, 1 - (distance - 35) * 0.08) : 1;

      stones.push(
        <div
          key={i}
          data-stage={i}
          className={`stone ${isSpecial ? 'special' : ''} ${isCurrent ? 'current' : ''} ${isPassed ? 'passed' : ''}`}
          style={{
            transform: `translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`,
            opacity,
            cursor: isCurrent ? 'pointer' : 'default',
            zIndex: 100 - distance,
          }}
          onClick={() => isCurrent && onStoneClick(i)}
        >
          {isSpecial ? (
            <div className="hanok">🏯</div>
          ) : (
            <span className="stage-number">{i}</span>
          )}
        </div>
      );
    }

    return stones;
  };

  return (
    <div className="stone-bridge-container" ref={containerRef}>
      <div className="river-background">
        <div className="stones-path">
          {renderStones()}
        </div>
      </div>
    </div>
  );
};

export default StoneBridge;
