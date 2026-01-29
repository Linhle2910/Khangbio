
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Tổng quan', icon: '📊' },
    { id: View.CURRICULUM, label: 'Học tập', icon: '📚' },
    { id: View.EXAM_PRACTICE, label: 'Luyện tập', icon: '🎯' },
    { id: View.BANK, label: 'Ngân hàng', icon: '🏛️' },
    { id: View.CHAT, label: 'Gia sư AI', icon: '🤖' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-50 overflow-hidden w-full select-none">
      {/* Sidebar - Hidden on Mobile */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
            <span className="text-3xl">🧬</span> KhangBio
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black italic">Đào Tạo Chuyên Sinh</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Mục tiêu hôm nay</p>
            <p className="text-xs font-medium">Hoàn thành bài tập mục tiêu</p>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[40%]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative w-full flex flex-col h-full">
        {/* Header - Fixed Height 56px on Mobile */}
        <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center w-full min-h-[56px] md:min-h-[72px] shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-2xl">🧬</span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">KhangBio</h2>
          </div>
          <h2 className="hidden md:block text-xl font-bold text-slate-800">
            {navItems.find(i => i.id === currentView)?.label}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end hidden sm:flex">
              <p className="text-xs font-black text-slate-900">NK. Khang</p>
              <p className="text-[8px] text-emerald-600 font-black px-1.5 py-0.5 bg-emerald-50 rounded uppercase tracking-tighter">Lớp 9 Chuyên</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-600 text-white shadow-md flex items-center justify-center font-black text-xs transition-transform active:scale-90 cursor-pointer">NK</div>
          </div>
        </header>

        {/* View Content Wrapper - Padding bottom for fixed mobile nav */}
        <div className="flex-1 p-3 md:p-8 pb-[120px] md:pb-8 w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 flex justify-around p-2 md:hidden z-[110] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] transition-all active:scale-90 ${
              currentView === item.id ? 'text-emerald-600 bg-emerald-50 font-black' : 'text-slate-400 font-medium'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-[8px] uppercase tracking-tighter font-black">{item.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @supports (-webkit-touch-callout: none) {
          .h-screen { height: -webkit-fill-available; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
