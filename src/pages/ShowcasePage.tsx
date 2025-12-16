export const ShowcasePage = () => (
  <div className="bg-white rounded-lg p-8 shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">✨ 风采展示</h2>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-100 rounded-lg h-40 flex items-center justify-center text-gray-400 hover:shadow-md transition-shadow cursor-pointer">
          活动照片 {i}
        </div>
      ))}
    </div>
  </div>
);
