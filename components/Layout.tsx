
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
    { id: View.BANK, label: 'Tài liệu', icon: '🏛️' },
    { id: View.CHAT, label: 'Gia sư AI', icon: '🤖' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overscroll-behavior-none">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[320px] flex-col bg-white border-r border-slate-100 sticky top-0 h-screen z-50 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]">
        <div className="p-12">
          <div className="flex items-center gap-4 mb-16 group cursor-pointer">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-emerald-200 group-hover:rotate-12 transition-transform">🧬</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900">KhangBio</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Hệ thống HSG Chuyên</p>
            </div>
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-300 group ${
                  currentView === item.id
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 translate-x-2'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={`text-2xl transition-transform group-hover:scale-110 ${currentView === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10 border-t border-slate-50">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Tiến độ tuần này</p>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner mb-3">
              <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">65% Mục tiêu hoàn thành</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative w-full flex flex-col h-full touch-pan-y overscroll-contain">
        {/* Header Bar */}
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center w-full min-h-[64px] md:min-h-[88px] shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-200">🧬</div>
            <h1 className="text-xl font-black tracking-tighter">KhangBio</h1>
          </div>
          
          <h2 className="hidden md:block text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {navItems.find(i => i.id === currentView)?.label}
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">NK. Khang</p>
              <p className="text-[8px] text-emerald-600 font-black px-2 py-0.5 bg-emerald-50 rounded-lg uppercase tracking-widest border border-emerald-100">Lớp 9 Chuyên</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-center font-black text-xs transition-transform active:scale-90 cursor-pointer border-2 border-white ring-1 ring-slate-100">NK</div>
          </div>
        </header>

        {/* View Content Wrapper */}
        <div className="flex-1 p-4 md:p-12 pb-[120px] md:pb-12 w-full">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="fixed bottom-6 left-6 right-6 bg-slate-900/95 border border-white/10 flex justify-around p-3 md:hidden z-[110] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-xl rounded-[2.5rem] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[64px] transition-all active:scale-90 ${
              currentView === item.id ? 'text-white bg-white/10 font-black scale-110' : 'text-slate-500 font-medium'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-[8px] uppercase tracking-widest font-black">{item.label}</span>
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
