import { useState } from 'react';
import { HanoiGame } from '../components/games/HanoiGame';
import { TangramGame } from '../components/games/TangramGame';

export const GamesPage = () => {
  const [gameType, setGameType] = useState<'hanoi' | 'tangram'>('tangram');

  return (
    <div className="bg-white rounded-lg p-2 md:p-8 shadow-md min-h-[400px]">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">🎮 算法小游戏</h2>
        <div className="flex gap-2 text-sm">
          <button 
            onClick={() => setGameType('tangram')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              gameType === 'tangram' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            七巧板
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setGameType('hanoi')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              gameType === 'hanoi' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            汉诺塔
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-6">
        {gameType === 'tangram' ? <TangramGame /> : <HanoiGame />}
      </div>
    </div>
  );
};
