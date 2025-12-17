import React, { useState, useRef, useEffect } from 'react';
import SAT from 'sat';

// 七巧板的7个基本形状（标准尺寸）
const TANGRAM_PIECES = [
  // 移除大三角形
  // { id: 1, type: 'large-triangle', ... },
  // { id: 2, type: 'large-triangle', ... },
  
  // 保留中三角形作为基础参考
  {
    id: 3,
    type: 'medium-triangle',
    points: [0, 0, 70.7, 70.7, 0, 70.7],
    color: '#FF9F43', // 亮橙色
    initialX: 100,
    initialY: 50,
  },
  
  // 生成8个小三角形
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: 100 + i,
    type: 'small-triangle',
    points: [0, 0, 50, 0, 0, 50],
    color: '#48DBFB', // 亮青色
    initialX: 50 + (i % 4) * 60,
    initialY: 150 + Math.floor(i / 4) * 60,
  })),

  // 生成8个正方形
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: 200 + i,
    type: 'square',
    points: [0, 0, 50, 0, 50, 50, 0, 50],
    color: '#FF6B6B', // 亮红色
    initialX: 350 + (i % 4) * 60,
    initialY: 150 + Math.floor(i / 4) * 60,
  })),

  // 生成8个平行四边形
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: 300 + i,
    type: 'parallelogram',
    points: [0, 0, 50, 0, 70.7, 35.35, 20.7, 35.35],
    color: '#1DD1A1', // 亮绿色
    initialX: 650 + (i % 2) * 80, // 平行四边形宽一点，排两列
    initialY: 50 + Math.floor(i / 2) * 50,
  })),
];

// 目标图形示例（已移除，设为 null）
const TARGET_SHAPE: { name: string; outline: number[] } | null = null;

interface Piece {
  id: number;
  type: string;
  points: number[];
  color: string;
  x: number;
  y: number;
  rotation: number;
}

// 导出改为命名导出
export const TangramGame: React.FC = () => {
  const [pieces, setPieces] = useState<Piece[]>(
    TANGRAM_PIECES.map(p => ({
      ...p,
      x: p.initialX,
      y: p.initialY,
      rotation: 0,
    }))
  );
  
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showTarget, setShowTarget] = useState(false);
  const [moves, setMoves] = useState(0);
  const [snapThreshold] = useState(15); // 吸附阈值
  const svgRef = useRef<SVGSVGElement>(null);

  // 转换多边形点坐标为SVG路径
  const pointsToPath = (points: number[]) => {
    const pairs = [];
    for (let i = 0; i < points.length; i += 2) {
      pairs.push(`${points[i]},${points[i + 1]}`);
    }
    return pairs.join(' ');
  };

  // 处理鼠标按下
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;

    const piece = pieces.find(p => p.id === id);
    if (!piece) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    setDraggingId(id);
    setSelectedId(id);
    setDragOffset({
      x: svgP.x - piece.x,
      y: svgP.y - piece.y,
    });

    // 将选中的块移到最上层
    setPieces(prev => {
      const selected = prev.find(p => p.id === id)!;
      const others = prev.filter(p => p.id !== id);
      return [...others, selected];
    });
  };

  // 将局部坐标转换为世界坐标
  const transformPoints = (points: number[], x: number, y: number, rotation: number): number[] => {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    const transformed: number[] = [];
    for (let i = 0; i < points.length; i += 2) {
      const px = points[i];
      const py = points[i + 1];
      
      // 旋转
      const rotatedX = px * cos - py * sin;
      const rotatedY = px * sin + py * cos;
      
      // 平移
      transformed.push(rotatedX + x);
      transformed.push(rotatedY + y);
    }
    
    return transformed;
  };

  // 将点数组转换为 SAT 多边形
  const pointsToSATPolygon = (points: number[]): SAT.Polygon => {
    const vectors: SAT.Vector[] = [];
    for (let i = 0; i < points.length; i += 2) {
      vectors.push(new SAT.Vector(points[i], points[i + 1]));
    }
    return new SAT.Polygon(new SAT.Vector(0, 0), vectors);
  };

  // 检测两个图形是否碰撞
  const checkCollision = (piece1: Piece, piece2: Piece): boolean => {
    const points1 = transformPoints(piece1.points, piece1.x, piece1.y, piece1.rotation);
    const points2 = transformPoints(piece2.points, piece2.x, piece2.y, piece2.rotation);
    
    const poly1 = pointsToSATPolygon(points1);
    const poly2 = pointsToSATPolygon(points2);
    
    const response = new SAT.Response();
    const collided = SAT.testPolygonPolygon(poly1, poly2, response);
    
    // 修改碰撞逻辑：允许微小的重叠（< 1px），解决紧贴时的碰撞误判，让块可以紧密拼合
    return collided && response.overlap > 1;
  };

  // 计算吸附位置
  const getSnappedPosition = (piece: Piece, x: number, y: number) => {
    const vertices = transformPoints(piece.points, x, y, piece.rotation);
    let bestDx = 0;
    let bestDy = 0;
    let minDistance = snapThreshold;

    // 收集所有吸附点（目标图形顶点 + 其他七巧板顶点）
    const snapPoints: {x: number, y: number}[] = [];
    
    // 1. 目标图形顶点 (如果有)
    if (TARGET_SHAPE) {
      for (let i = 0; i < TARGET_SHAPE.outline.length; i += 2) {
        snapPoints.push({ x: TARGET_SHAPE.outline[i], y: TARGET_SHAPE.outline[i + 1] });
      }
    }

    // 2. 其他七巧板顶点
    pieces.forEach(p => {
      if (p.id === piece.id) return;
      const pts = transformPoints(p.points, p.x, p.y, p.rotation);
      for (let i = 0; i < pts.length; i += 2) {
        snapPoints.push({ x: pts[i], y: pts[i + 1] });
      }
    });

    // 寻找最近的顶点对
    for (let i = 0; i < vertices.length; i += 2) {
      const vx = vertices[i];
      const vy = vertices[i + 1];
      
      for (const sp of snapPoints) {
        const dx = sp.x - vx;
        const dy = sp.y - vy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDistance) {
          minDistance = dist;
          bestDx = dx;
          bestDy = dy;
        }
      }
    }

    return { x: x + bestDx, y: y + bestDy };
  };

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null) return;

    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    let newX = svgP.x - dragOffset.x;
    let newY = svgP.y - dragOffset.y;

    setPieces(prev => {
      const currentPiece = prev.find(p => p.id === draggingId);
      if (!currentPiece) return prev;

      // 1. 计算吸附后的位置
      const snappedPos = getSnappedPosition(currentPiece, newX, newY);
      
      // 2. 创建临时图形用于碰撞检测
      const tempPiece: Piece = {
        ...currentPiece,
        x: snappedPos.x,
        y: snappedPos.y,
      };

      // 3. 检测与其他图形的碰撞（不检测目标图形，允许在目标图形内部）
      let hasCollision = false;
      for (const other of prev) {
        if (other.id === draggingId) continue;
        if (checkCollision(tempPiece, other)) {
          hasCollision = true;
          break;
        }
      }

      // 如果没有碰撞其他图形，则更新位置
      if (!hasCollision) {
        return prev.map(p =>
          p.id === draggingId
            ? { ...p, x: snappedPos.x, y: snappedPos.y }
            : p
        );
      }

      return prev;
    });
  };

  // 处理鼠标释放
  const handleMouseUp = () => {
    if (draggingId !== null) {
      setMoves(prev => prev + 1);
    }
    setDraggingId(null);
  };

  // 旋转选中的块
  const rotatePiece = (degrees: number) => {
    if (selectedId === null) return;

    setPieces(prev =>
      prev.map(p =>
        p.id === selectedId
          ? { ...p, rotation: (p.rotation + degrees) % 360 }
          : p
      )
    );
    setMoves(prev => prev + 1);
  };

  // 重置游戏
  const resetGame = () => {
    setPieces(
      TANGRAM_PIECES.map(p => ({
        ...p,
        x: p.initialX,
        y: p.initialY,
        rotation: 0,
      }))
    );
    setSelectedId(null);
    setDraggingId(null);
    setMoves(0);
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId === null) return;

      switch (e.key) {
        case 'ArrowLeft':
          rotatePiece(-15);
          break;
        case 'ArrowRight':
          rotatePiece(15);
          break;
        case 'r':
        case 'R':
          rotatePiece(45);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 m-0">七巧板拼图</h2>
        <div className="flex gap-5 items-center">
          <span className="text-base font-bold text-gray-600">移动次数: {moves}</span>
          <label className="flex items-center gap-2 cursor-pointer">
            {TARGET_SHAPE && (
              <>
                <input
                  type="checkbox"
                  checked={showTarget}
                  onChange={(e) => setShowTarget(e.target.checked)}
                  className="cursor-pointer"
                />
                显示目标
              </>
            )}
          </label>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button 
          onClick={() => rotatePiece(-45)}
          className="px-5 py-2 text-sm bg-teal-500 text-white border-none rounded cursor-pointer transition-colors hover:bg-sky-600 active:scale-[0.98]"
        >
          ↺ 逆时针
        </button>
        <button 
          onClick={() => rotatePiece(45)}
          className="px-5 py-2 text-sm bg-teal-500 text-white border-none rounded cursor-pointer transition-colors hover:bg-sky-600 active:scale-[0.98]"
        >
          ↻ 顺时针
        </button>
        <button 
          onClick={resetGame}
          className="px-5 py-2 text-sm bg-teal-500 text-white border-none rounded cursor-pointer transition-colors hover:bg-sky-600 active:scale-[0.98]"
        >
          重置
        </button>
      </div>

      <div className="min-h-[30px] px-2 py-2 bg-yellow-50 border-l-4 border-yellow-400 mb-4 rounded">
        {selectedId !== null && (
          <p className="m-0 text-gray-600 text-sm">
            已选中块 #{selectedId}，使用方向键微调旋转，拖动时会自动吸附到顶点
          </p>
        )}
      </div>

      <svg
        ref={svgRef}
        className="w-full flex-1 border-2 border-gray-300 rounded-lg bg-gray-50 block select-none min-h-[500px]"
        viewBox="0 0 800 600"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 目标轮廓 */}
        {showTarget && TARGET_SHAPE && (
          <polygon
            points={pointsToPath(TARGET_SHAPE.outline)}
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.3"
          />
        )}

        {/* 七巧板块 */}
        {pieces.map((piece) => (
          <g
            key={piece.id}
            transform={`translate(${piece.x}, ${piece.y}) rotate(${piece.rotation})`}
            onMouseDown={(e) => handleMouseDown(e, piece.id)}
            className={`transition-[filter] duration-200 cursor-move ${
              selectedId === piece.id ? '[&>polygon]:stroke-red-500 [&>polygon]:stroke-[3] [&>polygon]:drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]' : ''
            } ${
              draggingId === piece.id ? '[&>polygon]:drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]' : ''
            } hover:[&>polygon]:brightness-110`}
          >
            <polygon
              points={pointsToPath(piece.points)}
              fill={piece.color}
              // 去除黑边 stroke="#333" strokeWidth="2"
              opacity={draggingId === piece.id ? 0.7 : 0.9}
            />
            {/* 去除数字标识 */}
          </g>
        ))}
      </svg>

      <div className="mt-5 p-4 bg-gray-100 rounded-lg">
        <h3 className="mt-0 text-gray-800">游戏说明：</h3>
        <ul className="my-3 pl-5">
          <li className="my-1 text-gray-600">拖动七巧板块到目标位置（会自动吸附顶点）</li>
          <li className="my-1 text-gray-600">图形之间会进行碰撞检测，防止重叠</li>
          <li className="my-1 text-gray-600">点击选中后使用左右方向键微调旋转</li>
          <li className="my-1 text-gray-600">使用旋转按钮快速旋转 45°</li>
          <li className="my-1 text-gray-600">尝试用所有7块拼出目标图形</li>
        </ul>
      </div>
    </div>
  );
};
