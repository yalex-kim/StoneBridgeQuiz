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
    const visibleRange = 15;
    const startStage = Math.max(1, currentStage - 2);
    const endStage = Math.min(totalStages, currentStage + visibleRange);

    for (let i = startStage; i <= endStage; i++) {
      const distance = i - currentStage;
      const isSpecial = specialStages.includes(i);
      const isCurrent = i === currentStage;
      const isPassed = i < currentStage;

      // 원근감: 멀리 있을수록 작게, 가까울수록 크게
      const scale = Math.max(0.2, 1.3 - distance * 0.08);
      const translateY = distance * 60;
      const opacity = distance > 12 ? Math.max(0.2, 1 - (distance - 12) * 0.15) : 1;

      stones.push(
        <div
          key={i}
          data-stage={i}
          className={`stone ${isSpecial ? 'special' : ''} ${isCurrent ? 'current' : ''} ${isPassed ? 'passed' : ''}`}
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
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
