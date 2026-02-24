
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
    <div className="space-y-20 animate-fadeIn max-w-7xl mx-auto px-4 md:px-0 pb-40">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-10 md:p-16 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-3">Lộ trình học tập chuyên sâu</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.3em]">Cá nhân hóa cho ôn thi vào lớp 10 chuyên Sinh</p>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 shrink-0 relative z-10">
           <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
           <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Dữ liệu thời gian thực</span>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mt-40 opacity-20"></div>
      </div>

      {/* Grade 8 Section */}
      {grade8.length > 0 && (
        <section>
          <div className="flex items-center gap-6 mb-12 pl-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 font-black text-3xl">8</div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sinh học lớp 8</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Giải phẫu & Sinh lý học người</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {grade8.map((topic, idx) => (
              <div 
                key={topic.id} 
                onClick={() => onSelectTopic(topic)} 
                className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-blue-500 cursor-pointer transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-3 group flex flex-col justify-between h-full relative overflow-hidden card-shadow"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-7xl group-hover:opacity-10 transition-opacity">
                  {getTopicIcon(topic.title)}
                </div>
                <div>
                  <div className="text-5xl mb-8 p-5 bg-blue-50 w-fit rounded-3xl group-hover:rotate-12 transition-transform shadow-inner ring-8 ring-blue-50/50">
                    {getTopicIcon(topic.title)}
                  </div>
                  <h3 className="font-black text-slate-900 text-xl mb-3 leading-tight uppercase group-hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: formatScientificText(topic.title) }} />
                  <div className="flex items-center gap-2 mb-8">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Bài học số {idx + 1}</p>
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-widest">BẮT ĐẦU</span>
                  <span className="text-blue-600 font-black text-sm opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">Khám phá →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grade 9 Section */}
      {grade9.length > 0 && (
        <section>
          <div className="flex items-center gap-6 mb-12 pl-6 pt-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 font-black text-3xl">9</div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sinh học lớp 9</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Di truyền & Biến dị</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {grade9.map((topic, idx) => (
              <div 
                key={topic.id} 
                onClick={() => onSelectTopic(topic)} 
                className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-3 group flex flex-col justify-between h-full relative overflow-hidden card-shadow"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-7xl group-hover:opacity-10 transition-opacity">🧬</div>
                <div>
                  <div className="text-5xl mb-8 p-5 bg-emerald-50 w-fit rounded-3xl group-hover:rotate-12 transition-transform shadow-inner ring-8 ring-emerald-50/50">
                    {getTopicIcon(topic.title)}
                  </div>
                  <h3 className="font-black text-slate-900 text-xl mb-3 leading-tight uppercase group-hover:text-emerald-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: formatScientificText(topic.title) }} />
                  <div className="flex items-center gap-2 mb-8">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Bài học số {idx + 1}</p>
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl uppercase tracking-widest">BẮT ĐẦU</span>
                  <span className="text-emerald-600 font-black text-sm opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">Khám phá →</span>
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
