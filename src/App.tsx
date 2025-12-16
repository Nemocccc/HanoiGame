import { useState } from 'react';
import './App.css';
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
      <header className="flex items-center justify-between px-8 h-16 bg-white shadow-sm sticky top-0 z-50">
        <div className="text-xl font-semibold text-blue-600">ACM Association</div>
        <nav className="flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 text-sm rounded transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto my-8 px-4">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
