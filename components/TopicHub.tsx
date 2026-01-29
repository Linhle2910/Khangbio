
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
    <div className="w-full space-y-4 md:space-y-6 animate-fadeIn pb-24 max-w-7xl mx-auto px-1 md:px-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black transition-all py-2 text-[10px] uppercase tracking-widest">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại
        </button>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <h1 className="hidden lg:block text-xl font-black text-slate-800 uppercase italic tracking-tight" dangerouslySetInnerHTML={{ __html: formatScientificText(localTopic.title) }} />
           <button 
            onClick={handleManualRefresh}
            disabled={isSyncing}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-800 text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-sm hover:shadow-md active:scale-95 transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSyncing ? '⌛' : '🔄'} {isSyncing ? 'Đang tải...' : 'Cập nhật bài học'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Nội dung chính (Cột D) */}
        <div className="lg:col-span-3 h-fit">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col min-h-[300px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-lg">📋</div>
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Nội dung chính</h4>
            </div>
            
            <div className="space-y-5 flex-1">
              {localTopic.mainContent && localTopic.mainContent.trim() !== '' ? (
                localTopic.mainContent.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[8px] font-black shrink-0 group-hover:bg-emerald-600 transition-all">
                      {i + 1}
                    </div>
                    <p className="pt-0.5 text-xs font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors"
                       dangerouslySetInnerHTML={{ __html: formatScientificText(line) }} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30 flex flex-col items-center">
                  <span className="text-3xl mb-4">✍️</span>
                  <p className="text-[9px] font-black uppercase tracking-widest">Đang cập nhật...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Bài giảng chi tiết (Cột F) - CHIẾU NỘI DUNG FILE */}
        <div className="lg:col-span-9">
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[500px] md:h-[800px] relative ring-1 ring-slate-200">
            {/* Minimal Header for Presentation mode */}
            <div className="p-3 md:p-4 bg-slate-900 flex justify-between items-center shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3 ml-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="ml-2 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Biên soạn bởi KhangBio</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => embedLink && window.open(embedLink, '_blank')}
                  className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
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
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-slate-600">
                  <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center text-3xl mb-6 animate-pulse">📁</div>
                  <h5 className="text-lg font-black uppercase italic tracking-tight">Vui lòng đợi Khang nhé...</h5>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2">
                    Nội dung trình chiếu đang được tải lên
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer decoration */}
            <div className="p-3 bg-slate-900 flex justify-center border-t border-slate-800">
               <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">KHANGBIO - CHUYÊN SINH 10 - TRÌNH CHIẾU BÀI GIẢNG</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group">
              🎯 BẮT ĐẦU LUYỆN TẬP <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group">
              🤖 HỎI ĐÁP VỚI GIA SƯ <span className="group-hover:scale-110 transition-transform">✨</span>
            </button>
          </div>
        </div>
      </div>
      
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default TopicHub;
