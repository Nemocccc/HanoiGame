import React, { useState, useRef } from 'react';

interface Piece {
  id: string;
  path: string;
  fill: string;
  x: number;
  y: number;
  rotation: number;
}

export const TangramGame = () => {
  // 初始状态：拼成一个正方形
  const initialPieces: Piece[] = [
    { id: "t1", path: "M0 0 L100 0 L50 50 Z", fill: "#ea4335", x: 0, y: 0, rotation: 0 }, // 大三角1
    { id: "t2", path: "M0 0 L0 100 L50 50 Z", fill: "#fbbc05", x: 0, y: 0, rotation: 0 }, // 大三角2
    { id: "m1", path: "M50 50 L100 0 L100 100 L50 150 Z", fill: "#34a853", x: 0, y: 0, rotation: 0 }, // 平行四边形 (示意)
    { id: "t3", path: "M0 100 L50 150 L0 200 Z", fill: "#4285f4", x: 0, y: 0, rotation: 0 }, // 中三角
    { id: "s1", path: "M50 50 L100 100 L50 150 L0 100 Z", fill: "#9334e6", x: 0, y: 0, rotation: 0 }, // 正方形 (示意)
    // 补充两个小三角以凑齐七巧板元素（简化版坐标）
    { id: "t4", path: "M100 0 L150 50 L100 100 Z", fill: "#ff6d01", x: 0, y: 0, rotation: 0 }, 
    { id: "t5", path: "M0 200 L50 150 L100 200 Z", fill: "#46bdc6", x: 0, y: 0, rotation: 0 },
  ];

  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // 用于计算拖拽偏移量
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    const piece = pieces.find(p => p.id === id);
    if (!piece) return;

    // 捕获指针，确保快速移动时不会丢失焦点
    (e.target as Element).setPointerCapture(e.pointerId);
    
    setDraggingId(id);
    // 记录点击点相对于图形位置的偏移
    dragOffset.current = {
      x: e.clientX - piece.x,
      y: e.clientY - piece.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;

    setPieces(prev => prev.map(p => {
      if (p.id === draggingId) {
        return {
          ...p,
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        };
      }
      return p;
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      (e.target as Element).releasePointerCapture(e.pointerId);
      setDraggingId(null);
    }
  };

  const handleDoubleClick = (id: string) => {
    setPieces(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, rotation: (p.rotation + 45) % 360 };
      }
      return p;
    }));
  };

  const scatterPieces = () => {
    setPieces(prev => prev.map(p => ({
      ...p,
      x: Math.random() * 300,
      y: Math.random() * 200,
      rotation: Math.floor(Math.random() * 8) * 45
    })));
  };

  const resetPieces = () => {
    setPieces(initialPieces);
  };

  return (
    <div className="text-center p-5 select-none">
      <h3 className="text-xl font-bold mb-2">🧩 七巧板拼图</h3>
      <p className="text-gray-600 mb-5 text-sm">
        拖拽移动，<span className="font-bold text-blue-600">双击旋转</span> (45度)
      </p>
      
      <div className="w-full max-w-[600px] h-[400px] mx-auto relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden touch-none">
        <svg width="100%" height="100%" viewBox="0 0 600 400">
          {pieces.map((piece) => (
            <g
              key={piece.id}
              transform={`translate(${piece.x + 150}, ${piece.y + 50}) rotate(${piece.rotation})`}
              style={{ cursor: draggingId === piece.id ? 'grabbing' : 'grab', transition: draggingId === piece.id ? 'none' : 'transform 0.1s' }}
              onPointerDown={(e) => handlePointerDown(e, piece.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onDoubleClick={() => handleDoubleClick(piece.id)}
            >
              <path
                d={piece.path}
                fill={piece.fill}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-90"
                // 确保变换中心在图形中心附近，这里简化处理，实际可能需要计算bbox中心
                transform="translate(-50, -50)" 
              />
            </g>
          ))}
        </svg>
      </div>
      
      <div className="flex justify-center gap-4 mt-6">
        <button 
          onClick={scatterPieces} 
          className="px-4 py-2 border border-blue-200 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer"
        >
          打乱拼图
        </button>
        <button 
          onClick={resetPieces} 
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100 cursor-pointer"
        >
          复原
        </button>
      </div>
    </div>
  );
};
