import { useState, useEffect, useCallback } from 'react';

export const ShowcasePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    // 使用 Vite 的 glob 导入功能动态加载 assets 目录下所有图片
    // eager: true 表示直接加载模块，而不是懒加载函数
    const modules = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', { eager: true });
    // 获取图片路径 (default export)
    const images = Object.values(modules).map((mod: any) => mod.default);
    setImageList(images);
  }, []);

  const nextImage = useCallback(() => {
    if (imageList.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const prevImage = useCallback(() => {
    if (imageList.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + imageList.length) % imageList.length);
  }, [imageList.length]);

  // 键盘支持：左右方向键切换
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  if (imageList.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-md min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">暂无图片展示</p>
          <p className="text-sm">请在 src/assets 文件夹中添加图片文件 (.png, .jpg, .jpeg, .svg)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">✨ 风采展示</h2>
      
      <div className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden group flex items-center justify-center select-none">
        {/* 图片显示区域 */}
        <img 
          src={imageList[currentIndex]} 
          alt={`Showcase ${currentIndex + 1}`} 
          className="max-w-full max-h-full object-contain transition-opacity duration-300"
        />

        {/* 左切换按钮 */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
          title="上一张 (←)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* 右切换按钮 */}
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
          title="下一张 (→)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* 底部指示器 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 flex-wrap justify-center px-4">
          {imageList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer shadow-sm ${
                idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        
        {/* 计数器 */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm font-mono">
          {currentIndex + 1} / {imageList.length}
        </div>
      </div>
    </div>
  );
};
