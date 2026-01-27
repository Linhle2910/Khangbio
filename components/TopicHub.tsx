
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BiologyTopic, QuizQuestion, BankItem } from '../types';
import { BANK_DATA, BIOLOGY_TOPICS } from '../constants';
import { 
  generateIllustration, 
  generateQuiz, 
  generateLectureOutline, 
  generateSectionContent,
  generateSectionSummary,
  generateTopicSummary
} from '../services/geminiService';

interface TopicHubProps {
  topic: BiologyTopic;
  onBack: () => void;
}

interface LectureSection {
  title: string;
  content: string;
  image?: string;
  isGenerating: boolean;
  isGeneratingImage?: boolean;
  isSuggestingImage?: boolean;
}

const TopicHub: React.FC<TopicHubProps> = ({ topic, onBack }) => {
  const [activeTab, setActiveTab] = useState<'CHECKLIST' | 'LECTURE' | 'RESOURCES' | 'QA' | 'QUIZ' | 'SUMMARY'>('CHECKLIST');
  
  // Security State
  const [isLocked, setIsLocked] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockPin, setUnlockPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Lecture Management States
  const [lectureOutline, setLectureOutline] = useState<LectureSection[]>([]);
  const [isOutlineFinalized, setIsOutlineFinalized] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Checklist State - Dynamic editing
  const [checklist, setChecklist] = useState<string[]>([]);

  // Summary state
  const [topicSummary, setTopicSummary] = useState<{ text: string; image?: string; isGenerating: boolean }>({
    text: '', isGenerating: false
  });

  // Resources State
  const [savedQA, setSavedQA] = useState<BankItem[]>([]);
  const [viewingQA, setViewingQA] = useState<BankItem | null>(null);

  useEffect(() => {
    // Load persisted data
    const savedOutline = localStorage.getItem(`outline_${topic.id}`);
    const savedSummary = localStorage.getItem(`summary_${topic.id}`);
    const savedChecklist = localStorage.getItem(`checklist_${topic.id}`);
    const savedFinalized = localStorage.getItem(`finalized_${topic.id}`);
    
    if (savedOutline) setLectureOutline(JSON.parse(savedOutline));
    if (savedSummary) setTopicSummary(JSON.parse(savedSummary));
    
    // Checklist priority: LocalStorage > Topic Default
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      setChecklist(topic.checklist);
    }
    
    if (savedFinalized) setIsOutlineFinalized(JSON.parse(savedFinalized));

    const customItems = JSON.parse(localStorage.getItem('khangbio_custom_bank_items') || '[]');
    const allResources = [...customItems, ...BANK_DATA];
    setSavedQA(allResources.filter(item => item.topicId === topic.id && item.type === 'QA'));
  }, [topic]);

  const persistChecklist = (newList: string[]) => {
    setChecklist(newList);
    localStorage.setItem(`checklist_${topic.id}`, JSON.stringify(newList));
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleUpdateChecklist = (idx: number, val: string) => {
    if (isLocked) return;
    const newList = [...checklist];
    newList[idx] = val;
    persistChecklist(newList);
  };

  const handleAddChecklist = () => {
    if (isLocked) return;
    const newList = [...checklist, "Nhập kiến thức trọng tâm mới..."];
    persistChecklist(newList);
  };

  const handleDeleteChecklist = (idx: number) => {
    if (isLocked) return;
    if (window.confirm("Xóa mục này?")) {
      const newList = checklist.filter((_, i) => i !== idx);
      persistChecklist(newList);
    }
  };

  const handleResetChecklist = () => {
    if (isLocked) return;
    if (window.confirm("Khôi phục danh sách trọng tâm về mặc định?")) {
      persistChecklist(topic.checklist);
    }
  };

  const handleUnlock = () => {
    if (unlockPin === '280612') {
      setIsLocked(false);
      setShowUnlockModal(false);
      setUnlockPin('');
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1000);
    }
  };

  const handleToggleLock = () => {
    if (isLocked) {
      setShowUnlockModal(true);
    } else {
      setIsLocked(true);
    }
  };

  const handleGenerateFullSummary = async () => {
    if (isLocked) return;
    const fullContent = lectureOutline.filter(s => s.content).map(s => `Phần ${s.title}:\n${s.content}`).join('\n\n');
    if (!fullContent) {
      alert("Hãy soạn ít nhất một mục nội dung bài giảng trước khi hệ thống hóa kiến thức.");
      return;
    }
    setTopicSummary(prev => ({ ...prev, isGenerating: true }));
    try {
      const summaryText = await generateTopicSummary(topic.title, fullContent);
      const summaryImage = await generateIllustration(`Professional biology concept map for ${topic.title}`);
      const newState = { text: summaryText, image: summaryImage || undefined, isGenerating: false };
      setTopicSummary(newState);
      localStorage.setItem(`summary_${topic.id}`, JSON.stringify(newState));
    } catch (e) {
      alert("Lỗi khi hệ thống hóa kiến thức.");
      setTopicSummary(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // Rest of functions like handleGenerateSectionContent...
  const persistLecture = (outline: LectureSection[], finalized: boolean) => {
    setLectureOutline(outline);
    setIsOutlineFinalized(finalized);
    localStorage.setItem(`outline_${topic.id}`, JSON.stringify(outline));
    localStorage.setItem(`finalized_${topic.id}`, JSON.stringify(finalized));
  };

  const finalizeOutline = () => {
    if (lectureOutline.length === 0) {
      alert("Hãy tạo ít nhất một mục cho dàn ý.");
      return;
    }
    persistLecture(lectureOutline, true);
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 animate-fadeIn pb-12 overflow-x-hidden">
      <button onClick={onBack} className="text-slate-500 hover:text-emerald-600 flex items-center gap-2 font-black transition-all py-2 px-1 text-[10px] md:text-sm uppercase tracking-widest">
        ← Quay lại danh mục
      </button>

      {/* Hero Header */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-5 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden mx-1 md:mx-0">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[8px] md:text-[9px] font-black uppercase rounded-full">LỚP {topic.grade}</span>
              <span className="text-emerald-600 font-black text-[8px] md:text-[9px] uppercase tracking-wider">{topic.category}</span>
              {isSaving && (
                <span className="text-emerald-500 font-black text-[8px] uppercase animate-pulse">● Đã lưu thay đổi</span>
              )}
            </div>
            <h1 className="text-xl md:text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{topic.title}</h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-none">{topic.description}</p>
          </div>
          <div className="flex items-center justify-between md:justify-start gap-2 bg-slate-50 p-2 md:p-4 rounded-xl border border-slate-100">
            <div className="text-left md:text-center px-1 md:px-4 md:border-r md:border-slate-200">
              <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Trạng thái biên tập</p>
              <p className={`text-[10px] md:text-sm font-black ${isLocked ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isLocked ? '🔒 ĐANG KHÓA' : '🔓 ĐANG MỞ'}
              </p>
            </div>
            <button 
              onClick={handleToggleLock}
              className={`px-3 md:px-5 py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase shadow-sm transition-all active:scale-95 ${
                isLocked ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {isLocked ? 'Mở khóa sửa' : 'Khóa lưu'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs - Sticky position */}
      <div className="flex bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar shadow-md sticky top-[56px] md:top-[72px] z-[90] mx-1 md:mx-0">
        {[
          { id: 'CHECKLIST', label: 'Trọng tâm', icon: '📌' },
          { id: 'LECTURE', label: 'Bài giảng', icon: '📖' },
          { id: 'QA', label: 'Hỏi đáp', icon: '💬' },
          { id: 'SUMMARY', label: 'Tóm tắt', icon: '📝' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[95px] md:min-w-0 py-2.5 px-2 rounded-lg font-black text-[9px] md:text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="text-sm">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-12 border border-slate-200 shadow-sm min-h-[400px] mx-1 md:mx-0">
        {activeTab === 'CHECKLIST' && (
          <div className="space-y-4 md:space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Kiến thức trọng tâm chuyên sâu</h3>
              {!isLocked && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={handleAddChecklist} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase shadow-md active:scale-95 transition-all">
                    ➕ Thêm mục
                  </button>
                  <button onClick={handleResetChecklist} className="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-500 rounded-xl font-black text-[9px] uppercase active:scale-95 transition-all">
                    🔄 Reset
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-2 md:space-y-4">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 group transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">{i + 1}</div>
                  {isLocked ? (
                    <span className="text-slate-700 font-bold flex-1 text-sm md:text-base leading-relaxed break-words py-1.5">{item}</span>
                  ) : (
                    <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                      <textarea 
                        value={item} 
                        onChange={(e) => handleUpdateChecklist(i, e.target.value)} 
                        rows={1}
                        className="flex-1 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 text-sm md:text-base outline-none focus:border-emerald-500 shadow-inner resize-none overflow-hidden" 
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
                      <button onClick={() => handleDeleteChecklist(i)} className="p-2.5 text-slate-300 hover:text-red-500 flex justify-center items-center transition-colors">
                        <span className="text-xl">🗑️</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {checklist.length === 0 && (
                <div className="py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest italic">
                  Chưa có dữ liệu trọng tâm. Hãy thêm mục mới!
                </div>
              )}
            </div>
          </div>
        )}

        {/* LECTURE Tab (Simplified for this file update) */}
        {activeTab === 'LECTURE' && (
          <div className="space-y-6 animate-fadeIn">
            {!isOutlineFinalized ? (
              <div className="text-center py-20 px-4 space-y-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="text-5xl">📖</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Xây dựng bài giảng chuyên sâu</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">Lập dàn ý các mục kiến thức để AI hỗ trợ soạn nội dung chi tiết cho Khang ôn luyện.</p>
                </div>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button onClick={() => persistLecture([{title: 'Khái quát chung', content: '', isGenerating: false}], false)} className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">🚀 Tạo dàn ý AI</button>
                  <button onClick={() => finalizeOutline()} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-all">➕ Tự soạn bài giảng</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {lectureOutline.map((section, idx) => (
                  <div key={idx} className="space-y-4 border-b border-slate-100 pb-8 last:border-0">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-base shadow-md shrink-0">{idx+1}</span>
                      <h4 className="font-black text-slate-800 text-lg md:text-2xl break-words tracking-tight">{section.title}</h4>
                    </div>
                    <div className={`p-4 md:p-8 rounded-[1.5rem] text-xs md:text-lg leading-relaxed whitespace-pre-wrap break-words ${isLocked ? 'bg-slate-50 font-medium text-slate-700 border border-slate-100' : 'bg-transparent'}`}>
                       {isLocked ? (section.content || "Chưa có nội dung cho đề mục này.") : (
                          <textarea 
                            value={section.content} 
                            onChange={(e) => {
                               const newList = [...lectureOutline];
                               newList[idx].content = e.target.value;
                               persistLecture(newList, true);
                            }} 
                            className="w-full min-h-[300px] p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:border-emerald-500 font-medium text-slate-700 text-sm md:text-base shadow-inner resize-none" 
                            placeholder="Nhập kiến thức chuyên sâu tại đây hoặc dùng AI soạn thảo..." 
                          />
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QA Tab */}
        {activeTab === 'QA' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Thảo luận Gia sư AI</h3>
            {savedQA.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">Chưa có dữ liệu thảo luận nào được lưu</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedQA.map(qa => (
                  <div key={qa.id} onClick={() => setViewingQA(qa)} className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-emerald-500 transition-all cursor-pointer shadow-sm active:scale-95 group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">Gia sư AI</span>
                      <span className="text-[8px] font-bold text-slate-400">{qa.dateAdded}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">{qa.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-1 italic">"{qa.description}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUMMARY Tab */}
        {activeTab === 'SUMMARY' && (
          <div className="space-y-8 animate-fadeIn text-center flex flex-col items-center py-10">
            <h3 className="text-lg md:text-3xl font-black text-slate-800 tracking-tight">Hệ thống hóa toàn chủ đề</h3>
            {!topicSummary.text ? (
              <div className="max-w-sm w-full space-y-6">
                <div className="text-6xl">📝</div>
                <button 
                  onClick={handleGenerateFullSummary} 
                  disabled={topicSummary.isGenerating || isLocked} 
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase shadow-xl tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                >
                  {topicSummary.isGenerating ? '⌛ Đang tổng hợp dữ liệu...' : '🚀 Tổng hợp bản đồ kiến thức AI'}
                </button>
              </div>
            ) : (
              <div className="w-full space-y-8">
                <div className="p-6 md:p-12 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-left text-sm md:text-lg font-medium leading-relaxed whitespace-pre-wrap text-emerald-900 shadow-inner break-words italic">
                  {topicSummary.text}
                </div>
                {topicSummary.image && (
                   <img src={topicSummary.image} className="w-full rounded-[2.5rem] shadow-2xl border-4 border-white" alt="Concept map" />
                )}
                {!isLocked && (
                  <button onClick={handleGenerateFullSummary} className="px-8 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest active:bg-emerald-50 transition-all">Làm mới bản tóm tắt</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Viewing QA Modal - Fullscreen Mobile */}
      {viewingQA && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-white animate-slideUp">
          <div className="p-4 bg-amber-600 text-white flex justify-between items-center shrink-0 shadow-lg">
            <div className="min-w-0 pr-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-80 mb-0.5">Thảo luận Gia sư AI</p>
              <h3 className="text-lg font-black leading-tight line-clamp-1">{viewingQA.title}</h3>
            </div>
            <button onClick={() => setViewingQA(null)} className="w-10 h-10 bg-black/10 rounded-full font-bold flex items-center justify-center active:scale-90 shrink-0">✕</button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 no-scrollbar">
            <div className="text-slate-700 font-medium text-sm md:text-xl leading-relaxed whitespace-pre-wrap italic bg-white p-6 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm break-words">
              {viewingQA.description}
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-100 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0">
            <button onClick={() => setViewingQA(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Đóng cửa sổ</button>
          </div>
        </div>
      )}

      {/* Security PIN Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-[1100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className={`bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl transition-all ${pinError ? 'animate-shake' : ''}`}>
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">🔐</div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Mở khóa biên tập</h3>
                <p className="text-slate-400 text-[9px] font-bold uppercase mt-2 tracking-widest">Xác thực mã PIN của Khang</p>
             </div>
             <input type="password" value={unlockPin} onChange={(e) => setUnlockPin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} placeholder="••••••" autoFocus className="w-full py-5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-4xl font-black tracking-[0.5em] outline-none focus:border-amber-500 mb-8 shadow-inner" />
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => { setShowUnlockModal(false); setUnlockPin(''); }} className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors hover:bg-slate-200 active:scale-95">Hủy bỏ</button>
               <button onClick={handleUnlock} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg tracking-widest transition-all active:scale-95">Xác nhận</button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default TopicHub;
