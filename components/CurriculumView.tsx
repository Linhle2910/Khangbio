
import React, { useState, useEffect } from 'react';
import { CurriculumTopic } from '../types';
import { fetchCurriculumFromSheet, formatScientificText } from '../services/geminiService';

interface CurriculumViewProps {
  onSelectTopic: (topic: CurriculumTopic) => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ onSelectTopic }) => {
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurriculum = async () => {
      setIsLoading(true);
      try {
        const freshTopics = await fetchCurriculumFromSheet();
        if (freshTopics && freshTopics.length > 0) {
          setTopics(freshTopics);
          localStorage.setItem('khangbio_curriculum_cache', JSON.stringify(freshTopics));
        } else {
          const saved = localStorage.getItem('khangbio_curriculum_cache');
          if (saved) setTopics(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Lỗi tải lộ trình:", error);
        const saved = localStorage.getItem('khangbio_curriculum_cache');
        if (saved) setTopics(JSON.parse(saved));
      } finally {
        setIsLoading(false);
      }
    };

    loadCurriculum();
  }, []);

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

  if (isLoading && topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-8 animate-fadeIn">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🧬</div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-black text-slate-700 uppercase tracking-[0.3em]">Đang đồng bộ lộ trình học</p>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest animate-pulse">Hệ thống đang tải dữ liệu từ Excel của Khang...</p>
        </div>
      </div>
    );
  }

  const grade8 = topics.filter(t => t.grade === 8);
  const grade9 = topics.filter(t => t.grade === 9);

  return (
    <div className="space-y-16 animate-fadeIn max-w-7xl mx-auto px-2 md:px-0 pb-32">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Lộ trình học tập chuyên sâu</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] italic">Cá nhân hóa cho ôn thi vào lớp 10 chuyên Sinh</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 shrink-0 relative z-10">
           <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Dữ liệu thời gian thực</span>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-20"></div>
      </div>

      {/* Grade 8 Section */}
      {grade8.length > 0 && (
        <section>
          <div className="flex items-center gap-5 mb-10 pl-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-100 font-black text-2xl italic">8</div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Sinh học lớp 8</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Giải phẫu & Sinh lý học người</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {grade8.map((topic, idx) => (
              <div 
                key={topic.id} 
                onClick={() => onSelectTopic(topic)} 
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-500 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 group flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-6xl group-hover:opacity-10 transition-opacity">
                  {getTopicIcon(topic.title)}
                </div>
                <div>
                  <div className="text-4xl mb-6 p-4 bg-blue-50 w-fit rounded-[1.5rem] group-hover:rotate-12 transition-transform shadow-inner ring-4 ring-blue-50/50">
                    {getTopicIcon(topic.title)}
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mb-2 leading-snug uppercase italic group-hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: formatScientificText(topic.title) }} />
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Bài học số {idx + 1}</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">BẮT ĐẦU</span>
                  <span className="text-blue-600 font-black text-xs opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">Khám phá →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grade 9 Section */}
      {grade9.length > 0 && (
        <section>
          <div className="flex items-center gap-5 mb-10 pl-4 pt-8">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-emerald-100 font-black text-2xl italic">9</div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Sinh học lớp 9</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Di truyền & Biến dị</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {grade9.map((topic, idx) => (
              <div 
                key={topic.id} 
                onClick={() => onSelectTopic(topic)} 
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 group flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-6xl group-hover:opacity-10 transition-opacity">🧬</div>
                <div>
                  <div className="text-4xl mb-6 p-4 bg-emerald-50 w-fit rounded-[1.5rem] group-hover:rotate-12 transition-transform shadow-inner ring-4 ring-emerald-50/50">
                    {getTopicIcon(topic.title)}
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mb-2 leading-snug uppercase italic group-hover:text-emerald-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: formatScientificText(topic.title) }} />
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Bài học số {idx + 1}</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">BẮT ĐẦU</span>
                  <span className="text-emerald-600 font-black text-xs opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">Khám phá →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CurriculumView;
