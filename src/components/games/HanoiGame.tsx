import { useState, useRef } from 'react';
import { HanoiLogic } from '../../models/HanoiLogic';

export const HanoiGame = () => {
  const gameLogic = useRef(new HanoiLogic(3));
  const [towers, setTowers] = useState<number[][]>(gameLogic.current.getTowers());
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [message, setMessage] = useState('点击柱子选择/放置盘子');

  const handleTowerClick = (index: number) => {
    const logic = gameLogic.current;

    if (selectedTower === null) {
      if (towers[index].length === 0) return;
      setSelectedTower(index);
      setMessage('请选择目标柱子');
    } else {
      if (selectedTower === index) {
        setSelectedTower(null);
        setMessage('已取消选择');
        return;
      }

      if (logic.move(selectedTower, index)) {
        setTowers(logic.getTowers());
        setMessage(logic.isWon() ? '恭喜通关！🎉' : '移动成功');
      } else {
        setMessage('无效移动：大盘不能压在小盘上');
      }
      setSelectedTower(null);
    }
  };

  const resetGame = () => {
    gameLogic.current.reset();
    setTowers(gameLogic.current.getTowers());
    setSelectedTower(null);
    setMessage('游戏已重置');
  };

  return (
    <div className="text-center p-5">
      <h3 className="text-xl font-bold mb-2">🗼 汉诺塔</h3>
      <p className="h-6 text-blue-600 mb-8">{message}</p>
      
      {/* 增加 gap-48 (12rem) 确保大盘子不打架，增加 h-64 拉高显示区域 */}
      <div className="flex justify-center items-end gap-48 mt-5 h-64 border-b border-gray-200 pb-4 mx-auto max-w-4xl">
        {towers.map((disks, i) => (
          <div 
            key={i} 
            onClick={() => handleTowerClick(i)}
            className={`w-4 h-full bg-gray-200 relative flex flex-col-reverse items-center cursor-pointer rounded-t-lg transition-all duration-200 ${
              selectedTower === i ? 'ring-4 ring-blue-200 bg-blue-50' : 'hover:bg-gray-300'
            }`}
          >
            {/* 柱子底座 */}
            <div className="absolute -bottom-4 w-40 h-4 bg-gray-400 rounded shadow-sm"></div>
            
            {disks.map((disk, j) => (
              <div key={j} 
                className="h-8 mb-1 rounded-md z-10 shadow-sm border border-black/10 transition-all"
                style={{
                  // 调整宽度系数，让盘子看起来更宽厚
                  width: `${disk * 45 + 20}px`, 
                  backgroundColor: ['#4285f4', '#ea4335', '#fbbc04'][disk - 1] || '#34a853'
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      
      <button 
        onClick={resetGame} 
        className="mt-12 px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
      >
        重置游戏
      </button>
    </div>
  );
};
