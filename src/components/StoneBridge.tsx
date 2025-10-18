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

      // 원근감: 위 방향으로 뻗어나가는 효과
      // 간격을 매우 좁게 하여 화면 절반에 모두 표시
      const translateZ = -distance * 30; // 매우 좁은 간격
      const translateY = -distance * 8; // 위 방향으로 이동
      const scale = 1; // scale은 perspective가 자동으로 처리
      const opacity = distance > 40 ? Math.max(0.3, 1 - (distance - 40) * 0.05) : 1;

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
