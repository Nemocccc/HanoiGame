import { useState } from 'react';
import './App.css';
import swjtuLogo from './assets/swjtu130.svg';
import { GamesPage } from './pages/GamesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { ResourcesPage } from './pages/ResourcesPage';

function App() {
  const [activeTab, setActiveTab] = useState('games');

  const renderContent = () => {
    switch (activeTab) {
      case 'games': return <GamesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'showcase': return <ShowcasePage />;
      case 'resources': return <ResourcesPage />;
      default: return <GamesPage />;
    }
  };

  const navItems = [
    { id: 'games', label: '小游戏' },
    { id: 'notifications', label: '消息通知' },
    { id: 'showcase', label: '风采展示' },
    { id: 'resources', label: '资源共享' },
  ];

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-gray-50">
      {/* 移动端适配：高度自动，垂直排列，增加内边距控制 */}
      <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 h-auto md:h-16 bg-white shadow-sm sticky top-0 z-50 py-2 md:py-0 gap-2 md:gap-0">
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          <span className="text-xl font-semibold text-blue-600">ACM</span>
          <span className="text-gray-300 text-xl font-light">|</span>
          <img src={swjtuLogo} alt="SWJTU 130" className="h-10 w-auto bg-[#8b0700] p-1 rounded object-contain" />
        </div>
        
        {/* 移动端适配：宽度100%，允许横向滚动，隐藏滚动条 */}
        <nav className="flex gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar justify-start md:justify-end">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 md:px-4 py-2 text-sm rounded transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === item.id 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://130.swjtu.edu.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 md:px-4 py-2 text-sm rounded transition-all duration-200 cursor-pointer text-gray-600 hover:bg-gray-100 flex items-center whitespace-nowrap shrink-0"
          >
            交大130
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </nav>
      </header>
      <main className="w-full mx-auto my-2 md:my-4 px-2 md:px-4">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
