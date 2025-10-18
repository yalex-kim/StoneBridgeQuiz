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

      // 원근감: 전면에서 다가오는 효과 (translateZ 사용)
      // 멀리 있을수록 Z축 깊이가 크고, 가까울수록 앞으로 나옴
      const translateZ = -distance * 200; // 뒤로 갈수록 음수값이 커짐
      const translateY = distance * 30; // 약간의 수직 이동
      const scale = 1; // scale은 perspective가 자동으로 처리
      const opacity = distance > 12 ? Math.max(0.2, 1 - (distance - 12) * 0.15) : 1;

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
