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
    const visibleRange = 20;
    const startStage = Math.max(1, currentStage - 5);
    const endStage = Math.min(totalStages, currentStage + visibleRange);

    for (let i = startStage; i <= endStage; i++) {
      const distance = i - currentStage;
      const isSpecial = specialStages.includes(i);
      const isCurrent = i === currentStage;
      const isPassed = i < currentStage;

      const scale = Math.max(0.3, 1 - distance * 0.05);
      const translateY = distance * 80;
      const opacity = distance > 15 ? 0.3 : 1;

      stones.push(
        <div
          key={i}
          data-stage={i}
          className={`stone ${isSpecial ? 'special' : ''} ${isCurrent ? 'current' : ''} ${isPassed ? 'passed' : ''}`}
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            opacity,
            cursor: isCurrent ? 'pointer' : 'default',
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
