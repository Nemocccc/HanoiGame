export const NotificationsPage = () => (
  <div className="bg-white rounded-lg p-8 shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">📢 消息通知</h2>
    <ul className="space-y-0">
      {['本周六下午2点举行新生赛', '算法训练营报名截止通知', '关于暑期集训的安排'].map((item, i) => (
        <li key={i} className="py-4 border-b border-gray-100 last:border-0 flex items-center">
          <span className="text-gray-500 mr-3 text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">[公告]</span>
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
