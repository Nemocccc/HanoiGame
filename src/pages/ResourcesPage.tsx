export const ResourcesPage = () => (
  <div className="bg-white rounded-lg p-8 shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">📂 文件资源共享</h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="border-b-2 border-gray-100 text-left">
            <th className="p-3 font-semibold text-gray-600">文件名</th>
            <th className="p-3 font-semibold text-gray-600">类型</th>
            <th className="p-3 font-semibold text-gray-600">大小</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'ACM算法模板_v2.pdf', type: 'PDF', size: '2.4MB' },
            { name: '动态规划专题讲解.pptx', type: 'PPT', size: '5.1MB' },
            { name: 'Codeforces训练计划.xlsx', type: 'Excel', size: '12KB' },
          ].map((file, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="p-3 text-gray-800">{file.name}</td>
              <td className="p-3 text-gray-500 text-sm">{file.type}</td>
              <td className="p-3 text-gray-500 text-sm">{file.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
