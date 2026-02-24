
import React, { useState, useEffect } from 'react';
import { CurriculumTopic } from '../types';
import { formatScientificText, fetchCurriculumFromSheet } from '../services/geminiService';

interface TopicHubProps {
  topic: CurriculumTopic;
  onBack: () => void;
}

const TopicHub: React.FC<TopicHubProps> = ({ topic, onBack }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [localTopic, setLocalTopic] = useState<CurriculumTopic>(topic);

  // Chuẩn hóa link để hiển thị nội dung trình chiếu (Presentation Mode)
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let finalUrl = url.trim();

    // Xử lý Google Slides chuyên dụng cho "Trình chiếu"
    if (finalUrl.includes('docs.google.com/presentation')) {
      const idMatch = finalUrl.match(/\/d\/([-\w]{25,})/);
      if (idMatch) {
        return `https://docs.google.com/presentation/d/${idMatch[1]}/embed?start=false&loop=false&delayms=3000`;
      }
    }

    // Xử lý Google Drive Files khác (PDF, Docs...)
    if (finalUrl.includes('drive.google.com')) {
      if (finalUrl.includes('/view')) finalUrl = finalUrl.replace('/view', '/preview');
      else if (finalUrl.includes('/edit')) finalUrl = finalUrl.replace('/edit', '/preview');
      else if (finalUrl.includes('id=')) {
        const idMatch = finalUrl.match(/[-\w]{25,}/);
        if (idMatch) finalUrl = `https://drive.google.com/file/d/${idMatch[0]}/preview`;
      }
      
      if (!finalUrl.includes('/preview') && !finalUrl.includes('usp=sharing')) {
        if (finalUrl.endsWith('/')) finalUrl += 'preview';
        else if (!finalUrl.includes('?')) finalUrl += '/preview';
      }
    }
    return finalUrl;
  };

  const handleManualRefresh = async () => {
    setIsSyncing(true);
    try {
      const allTopics = await fetchCurriculumFromSheet();
      const fresh = allTopics.find(t => t.title.trim().toLowerCase() === localTopic.title.trim().toLowerCase());
      if (fresh) {
        setLocalTopic(fresh);
        const saved = JSON.parse(localStorage.getItem('khangbio_curriculum_cache') || '[]');
        const updated = saved.map((t: CurriculumTopic) => t.title === fresh.title ? fresh : t);
        localStorage.setItem('khangbio_curriculum_cache', JSON.stringify(updated));
      }
    } catch (error) {
      alert("Lỗi đồng bộ dữ liệu. Khang kiểm tra internet nhé!");
    } finally {
      setIsSyncing(false);
    }
  };

  const embedLink = getEmbedUrl(localTopic.detailLink);

  const getTopicIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('xương') || lowerTitle.includes('vận động')) return '🦴';
    if (lowerTitle.includes('tuần hoàn') || lowerTitle.includes('máu') || lowerTitle.includes('tim')) return '🫀';
    if (lowerTitle.includes('tiêu hóa') || lowerTitle.includes('ăn')) return '🍕';
    if (lowerTitle.includes('hô hấp') || lowerTitle.includes('phổi')) return '🫁';
    if (lowerTitle.includes('bài tiết') || lowerTitle.includes('thận')) return '💧';
    if (lowerTitle.includes('thần kinh') || lowerTitle.includes('não')) return '🧠';
    if (lowerTitle.includes('nội tiết') || lowerTitle.includes('hormone')) return '🧪';
    if (lowerTitle.includes('sinh sản') || lowerTitle.includes('trứng')) return '👶';
    if (lowerTitle.includes('năng lượng') || lowerTitle.includes('trao đổi chất')) return '⚡';
    if (lowerTitle.includes('giác quan') || lowerTitle.includes('mắt') || lowerTitle.includes('tai')) return '👁️';
    if (lowerTitle.includes('sinh thái') || lowerTitle.includes('môi trường')) return '🌍';
    if (lowerTitle.includes('di truyền') || lowerTitle.includes('mendel') || lowerTitle.includes('gen')) return '🧬';
    return '📖';
  };

  return (
    <div className="w-full space-y-8 md:space-y-10 animate-fadeIn pb-32 max-w-7xl mx-auto px-4 md:px-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <button onClick={onBack} className="group flex items-center gap-3 text-slate-400 hover:text-emerald-600 font-black transition-all py-2 text-[11px] uppercase tracking-[0.2em]">
          <span className="group-hover:-translate-x-2 transition-transform text-lg">←</span> Quay lại lộ trình
        </button>
        <div className="flex items-center gap-6 w-full md:w-auto">
           <h1 className="hidden lg:block text-2xl font-black text-slate-900 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: formatScientificText(localTopic.title) }} />
           <button 
            onClick={handleManualRefresh}
            disabled={isSyncing}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 text-[11px] font-black rounded-2xl uppercase tracking-[0.15em] shadow-sm hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSyncing ? '⌛' : '🔄'} {isSyncing ? 'Đang đồng bộ...' : 'Cập nhật bài học'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
        {/* Left Column: Nội dung chính (Cột D) */}
        <div className="lg:col-span-3 h-fit sticky top-10">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">📋</div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Nội dung chính</h4>
            </div>
            
            <div className="space-y-6 flex-1">
              {localTopic.mainContent && localTopic.mainContent.trim() !== '' ? (
                localTopic.mainContent.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0 group-hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10">
                      {i + 1}
                    </div>
                    <p className="pt-0.5 text-sm font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors"
                       dangerouslySetInnerHTML={{ __html: formatScientificText(line) }} />
                  </div>
                ))
              ) : (
                <div className="text-center py-16 opacity-30 flex flex-col items-center">
                  <span className="text-5xl mb-6">✍️</span>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">Đang cập nhật...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Bài giảng chi tiết (Cột F) - CHIẾU NỘI DUNG FILE */}
        <div className="lg:col-span-9">
          <div className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] border-[6px] border-slate-800 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[550px] md:h-[850px] relative ring-1 ring-slate-700">
            {/* Minimal Header for Presentation mode */}
            <div className="p-4 md:p-6 bg-slate-900 flex justify-between items-center shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-4 ml-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="ml-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Biên soạn bởi KhangBio</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => embedLink && window.open(embedLink, '_blank')}
                  className="px-6 py-3 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  Xem rộng hơn ↗
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black relative">
              {embedLink ? (
                <iframe 
                  src={embedLink} 
                  className="w-full h-full border-none bg-black" 
                  allow="autoplay; fullscreen"
                  title="Lecture Content"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center text-slate-600">
                  <div className="w-24 h-24 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 animate-pulse">📁</div>
                  <h5 className="text-2xl font-black uppercase tracking-tighter text-slate-400">Vui lòng đợi Khang nhé...</h5>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] mt-4 text-slate-500">
                    Nội dung trình chiếu đang được tải lên
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer decoration */}
            <div className="p-4 bg-slate-900 flex justify-center border-t border-slate-800">
               <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">KHANGBIO - CHUYÊN SINH 10 - TRÌNH CHIẾU BÀI GIẢNG</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <button className="py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 active:scale-[0.98] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group">
              🎯 BẮT ĐẦU LUYỆN TẬP <span className="group-hover:translate-x-2 transition-transform text-lg">→</span>
            </button>
            <button className="py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/20 active:scale-[0.98] hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 group">
              🤖 HỎI ĐÁP VỚI GIA SƯ <span className="group-hover:scale-125 transition-transform text-lg">✨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicHub;
