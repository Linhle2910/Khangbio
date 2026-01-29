
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizModule from './components/QuizModule';
import ChatTutor from './components/ChatTutor';
import CurriculumView from './components/CurriculumView';
import TopicHub from './components/TopicHub';
import BankView from './components/BankView';
import { View, CurriculumTopic } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('khangbio_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === 'Khang280612') {
      setIsAuthenticated(true);
      localStorage.setItem('khangbio_auth', 'true');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleSelectTopic = (topic: CurriculumTopic) => {
    setSelectedTopic(topic);
  };

  const handleBackToCurriculum = () => {
    setSelectedTopic(null);
  };

  const renderContent = () => {
    if (selectedTopic && currentView === View.CURRICULUM) {
      return <TopicHub topic={selectedTopic} onBack={handleBackToCurriculum} />;
    }

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.CURRICULUM:
        return <CurriculumView onSelectTopic={handleSelectTopic} />;
      case View.EXAM_PRACTICE:
        return <QuizModule />;
      case View.BANK:
        return <BankView />;
      case View.CHAT:
        return <ChatTutor />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] text-[30rem] text-emerald-500/5 select-none pointer-events-none rotate-12">🧬</div>
        
        <div className={`w-full max-w-sm bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10 transition-all ${error ? 'animate-shake border-2 border-red-500' : 'border border-slate-100'}`}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-xl shadow-emerald-200">🧬</div>
            <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">KhangBio</h1>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Hệ thống bồi dưỡng HSG Chuyên Sinh</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật mã truy cập</label>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-black tracking-[0.4em] transition-all text-center text-lg"
                autoFocus
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all"
            >
              MỞ KHÓA HỆ THỐNG
            </button>
          </form>

          {error && (
            <p className="text-center text-red-500 font-black text-[9px] mt-4 uppercase tracking-widest animate-fadeIn">Sai mật mã rồi Khang ơi!</p>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest italic">Design for Nguyên Khang • 2025</p>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
          @supports (-webkit-touch-callout: none) {
            .min-h-screen { min-height: -webkit-fill-available; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Layout 
      currentView={currentView} 
      setView={(view) => {
        setCurrentView(view);
        setSelectedTopic(null);
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
