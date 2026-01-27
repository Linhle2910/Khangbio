
import React, { useState, useEffect } from 'react';
import { GRADE_8_TOPICS, GRADE_9_TOPICS } from '../constants';
import { BiologyTopic, BankItem } from '../types';

interface CurriculumViewProps {
  onSelectTopic: (topic: BiologyTopic) => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ onSelectTopic }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdate = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    setUpdatingId(topicId);
    setTimeout(() => {
      setUpdatingId(null);
      alert('Đã cập nhật dữ liệu mới nhất cho chủ đề này!');
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-7xl mx-auto px-4 md:px-0 pb-20">
      {/* Grade 8 Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <span className="text-xl font-black">8</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sinh học lớp 8</h2>
            <p className="text-slate-400 text-sm font-medium">Trọng tâm: Giải phẫu và Sinh lý người</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GRADE_8_TOPICS.map(topic => (
            <div 
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-500 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group relative"
            >
              <button 
                onClick={(e) => handleUpdate(e, topic.id)}
                className={`absolute top-6 right-6 p-2 rounded-xl border border-slate-100 hover:bg-blue-50 transition-all ${updatingId === topic.id ? 'animate-spin' : ''}`}
                title="Cập nhật"
              >
                {updatingId === topic.id ? '⏳' : '🔄'}
              </button>
              <div className="text-4xl mb-4 p-3 bg-blue-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">{topic.icon}</div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{topic.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{topic.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">HỆ CƠ QUAN</span>
                <span className="text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Học ngay →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grade 9 Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <span className="text-xl font-black">9</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sinh học lớp 9</h2>
            <p className="text-slate-400 text-sm font-medium">Trọng tâm: Di truyền và Sinh thái</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GRADE_9_TOPICS.map(topic => (
            <div 
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group relative"
            >
              <button 
                onClick={(e) => handleUpdate(e, topic.id)}
                className={`absolute top-6 right-6 p-2 rounded-xl border border-slate-100 hover:bg-emerald-50 transition-all ${updatingId === topic.id ? 'animate-spin' : ''}`}
                title="Cập nhật"
              >
                {updatingId === topic.id ? '⏳' : '🔄'}
              </button>
              <div className="text-4xl mb-4 p-3 bg-emerald-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">{topic.icon}</div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{topic.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{topic.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">CHUYÊN ĐỀ CHÍNH</span>
                <span className="text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Học ngay →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CurriculumView;
