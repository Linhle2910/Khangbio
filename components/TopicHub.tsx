
import React, { useState, useEffect, useRef } from 'react';
import { BiologyTopic, BankItem } from '../types';
import { BANK_DATA, BIOLOGY_TOPICS } from '../constants';
import { 
  generateIllustration, 
  generateLectureOutline, 
  generateSectionContent,
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

  // Checklist State
  const [checklist, setChecklist] = useState<string[]>([]);

  // Summary state
  const [topicSummary, setTopicSummary] = useState<{ text: string; image?: string; isGenerating: boolean }>({
    text: '', isGenerating: false
  });

  // QA State
  const [savedQA, setSavedQA] = useState<BankItem[]>([]);
  const [viewingQA, setViewingQA] = useState<BankItem | null>(null);

  useEffect(() => {
    const savedOutline = localStorage.getItem(`outline_${topic.id}`);
    const savedSummary = localStorage.getItem(`summary_${topic.id}`);
    const savedChecklist = localStorage.getItem(`checklist_${topic.id}`);
    const savedFinalized = localStorage.getItem(`finalized_${topic.id}`);
    
    if (savedOutline) setLectureOutline(JSON.parse(savedOutline));
    if (savedSummary) setTopicSummary(JSON.parse(savedSummary));
    
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

  const persistLecture = (outline: LectureSection[], finalized: boolean) => {
    setLectureOutline(outline);
    setIsOutlineFinalized(finalized);
    localStorage.setItem(`outline_${topic.id}`, JSON.stringify(outline));
    localStorage.setItem(`finalized_${topic.id}`, JSON.stringify(finalized));
  };

  const handleCreateOutlineWithAI = async () => {
    if (isLocked) {
      setShowUnlockModal(true);
      return;
    }
    setIsSaving(true);
    try {
      const titles = await generateLectureOutline(topic.title, topic.grade);
      const newOutline = titles.map((t: string) => ({
        title: t, content: '', isGenerating: false, isGeneratingImage: false, isSuggestingImage: false
      }));
      persistLecture(newOutline, false);
    } catch (e) {
      alert("Lỗi khi tạo dàn ý bằng AI. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSectionContent = async (idx: number) => {
    if (isLocked || !isOutlineFinalized) return;
    const newOutline = [...lectureOutline];
    newOutline[idx].isGenerating = true;
    setLectureOutline([...newOutline]);

    try {
      const content = await generateSectionContent(topic.title, newOutline[idx].title);
      newOutline[idx].content = content;
      newOutline[idx].isGenerating = false;
      
      newOutline[idx].isSuggestingImage = true;
      setLectureOutline([...newOutline]);
      await new Promise(r => setTimeout(r, 800));
      
      newOutline[idx].isGeneratingImage = true;
      newOutline[idx].isSuggestingImage = false;
      setLectureOutline([...newOutline]);

      const imageUrl = await generateIllustration(`Professional scientific diagram for: ${newOutline[idx].title}, chủ đề ${topic.title}.`);
      if (imageUrl) newOutline[idx].image = imageUrl;
    } catch (e) {
      alert("Lỗi khi soạn nội dung. Khang hãy thử lại nhé!");
    } finally {
      newOutline[idx].isGenerating = false;
      newOutline[idx].isGeneratingImage = false;
      newOutline[idx].isSuggestingImage = false;
      persistLecture([...newOutline], true);
    }
  };

  const handleUpdateChecklist = (idx: number, val: string) => {
    if (isLocked) return;
    const newList = [...checklist];
    newList[idx] = val;
    persistChecklist(newList);
  };

  const handleAddChecklist = () => {
    if (isLocked) return;
    persistChecklist([...checklist, "Nhập kiến thức trọng tâm mới..."]);
  };

  const handleDeleteChecklist = (idx: number) => {
    if (isLocked) return;
    if (window.confirm("Xóa mục này?")) {
      persistChecklist(checklist.filter((_, i) => i !== idx));
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
    if (isLocked) setShowUnlockModal(true);
    else setIsLocked(true);
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
      const summaryImage = await generateIllustration(`Biological hierarchy of ${topic.title} for high achieving students.`);
      const newState = { text: summaryText, image: summaryImage || undefined, isGenerating: false };
      setTopicSummary(newState);
      localStorage.setItem(`summary_${topic.id}`, JSON.stringify(newState));
    } catch (e) {
      alert("Lỗi khi hệ thống hóa kiến thức.");
      setTopicSummary(prev => ({ ...prev, isGenerating: false }));
    }
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
                <span className="text-emerald-500 font-black text-[8px] uppercase animate-pulse">● Đang xử lý...</span>
              )}
            </div>
            <h1 className="text-xl md:text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{topic.title}</h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-none">{topic.description}</p>
          </div>
          <div className="flex items-center justify-between md:justify-start gap-2 bg-slate-50 p-2 md:p-4 rounded-xl border border-slate-100">
            <div className="text-left md:text-center px-1 md:px-4 md:border-r md:border-slate-200">
              <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Biên tập</p>
              <p className={`text-[10px] md:text-sm font-black ${isLocked ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isLocked ? '🔒 KHÓA' : '🔓 MỞ'}
              </p>
            </div>
            <button 
              onClick={handleToggleLock}
              className={`px-3 md:px-5 py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase shadow-sm transition-all active:scale-95 ${
                isLocked ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {isLocked ? 'Mở khóa' : 'Lưu lại'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-12 border border-slate-200 shadow-sm min-h-[400px] mx-1 md:mx-0">
        {activeTab === 'CHECKLIST' && (
          <div className="space-y-4 md:space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Kiến thức trọng tâm</h3>
              {!isLocked && (
                <div className="flex gap-2">
                  <button onClick={handleAddChecklist} className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow-md active:scale-95 transition-all">➕ Thêm</button>
                  <button onClick={handleResetChecklist} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg font-black text-[9px] uppercase active:scale-95 transition-all">🔄 Reset</button>
                </div>
              )}
            </div>
            <div className="space-y-2 md:space-y-4">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">{i + 1}</div>
                  {isLocked ? (
                    <span className="text-slate-700 font-bold flex-1 text-sm md:text-base leading-relaxed break-words py-1.5">{item}</span>
                  ) : (
                    <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                      <textarea 
                        value={item} 
                        onChange={(e) => handleUpdateChecklist(i, e.target.value)} 
                        rows={1}
                        className="flex-1 bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 text-sm md:text-base outline-none focus:border-emerald-500 shadow-inner resize-none" 
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
                      <button onClick={() => handleDeleteChecklist(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'LECTURE' && (
          <div className="space-y-6 animate-fadeIn">
            {lectureOutline.length === 0 ? (
              /* Step 1: Initial Empty State */
              <div className="text-center py-20 px-4 space-y-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="text-5xl">📖</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Xây dựng bài giảng chuyên sâu</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">Tạo dàn ý kiến thức làm nền tảng cho bài giảng bồi dưỡng HSG.</p>
                </div>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button onClick={handleCreateOutlineWithAI} className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">🚀 Tạo dàn ý bằng AI</button>
                  <button onClick={() => persistLecture([{title: 'Khái quát chung', content: '', isGenerating: false}], false)} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-all">➕ Tự lập dàn ý</button>
                </div>
              </div>
            ) : !isOutlineFinalized ? (
              /* Step 2: Edit Outline Mode */
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cấu trúc bài giảng</h3>
                   <div className="flex gap-2">
                     <button onClick={() => persistLecture([...lectureOutline, {title: 'Mục mới', content: '', isGenerating: false}], false)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all">➕ Thêm mục</button>
                     <button onClick={() => persistLecture([], false)} className="px-3 py-2 bg-red-50 text-red-500 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all">🗑️ Làm lại</button>
                   </div>
                </div>
                <div className="space-y-3">
                  {lectureOutline.map((sec, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <span className="w-8 h-8 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0">{idx + 1}</span>
                      <input 
                        value={sec.title} 
                        onChange={(e) => {
                          const newList = [...lectureOutline];
                          newList[idx].title = e.target.value;
                          setLectureOutline(newList);
                        }} 
                        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                        placeholder="Tiêu đề mục..."
                      />
                      <button onClick={() => setLectureOutline(lectureOutline.filter((_, i) => i !== idx))} className="p-2 text-slate-300 hover:text-red-500">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => persistLecture(lectureOutline, true)} className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase shadow-xl active:scale-95 transition-all">XÁC NHẬN DÀN Ý & BẮT ĐẦU SOẠN BÀI</button>
              </div>
            ) : (
              /* Step 3: Write Detailed Content Mode */
              <div className="space-y-12">
                <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-700 uppercase">Dàn ý đã chốt. Khang hãy dùng AI để soạn chi tiết nhé!</p>
                  <button onClick={() => setIsOutlineFinalized(false)} className="text-[9px] font-black text-emerald-600 underline uppercase">Sửa dàn ý</button>
                </div>
                {lectureOutline.map((section, idx) => (
                  <div key={idx} className="space-y-6 border-b border-slate-50 pb-12 last:border-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-base shadow-md shrink-0">{idx+1}</span>
                        <h4 className="font-black text-slate-800 text-lg md:text-2xl break-words tracking-tight">{section.title}</h4>
                      </div>
                      {!isLocked && (
                        <div className="flex gap-2">
                          <button onClick={() => handleGenerateSectionContent(idx)} disabled={section.isGenerating} className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-black text-[9px] uppercase active:scale-95 transition-all">
                            {section.isGenerating ? '⏳ Đang soạn...' : '✨ AI viết bài'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                       <div className="relative">
                         {section.isGeneratingImage ? (
                            <div className="aspect-video bg-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center animate-pulse border border-slate-200">
                               <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                               <span className="text-[10px] font-black text-emerald-600 uppercase">AI đang vẽ sơ đồ minh họa...</span>
                            </div>
                         ) : section.image ? (
                            <img src={section.image} className="w-full rounded-[1.5rem] shadow-xl border border-slate-100 object-cover" alt={section.title} />
                         ) : null}
                       </div>
                    </div>
                  </div>
                ))}
                {!isLocked && (
                  <button onClick={() => persistLecture([], false)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 transition-all">Làm lại bài giảng từ đầu</button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'SUMMARY' && (
          <div className="space-y-8 animate-fadeIn text-center flex flex-col items-center py-10">
            <h3 className="text-lg md:text-3xl font-black text-slate-800 tracking-tight">Hệ thống hóa kiến thức</h3>
            {!topicSummary.text ? (
              <div className="max-w-sm w-full space-y-6">
                <div className="text-6xl">📝</div>
                <button 
                  onClick={handleGenerateFullSummary} 
                  disabled={topicSummary.isGenerating || isLocked} 
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase shadow-xl tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                >
                  {topicSummary.isGenerating ? '⌛ Đang tổng hợp...' : '🚀 Bắt đầu tổng hợp AI'}
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-[1100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className={`bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl transition-all ${pinError ? 'animate-shake' : ''}`}>
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">🔐</div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Xác thực mã PIN</h3>
                <p className="text-slate-400 text-[9px] font-bold uppercase mt-2 tracking-widest">Mã PIN mặc định: 280612</p>
             </div>
             <input type="password" value={unlockPin} onChange={(e) => setUnlockPin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} placeholder="••••••" autoFocus className="w-full py-5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-4xl font-black tracking-[0.5em] outline-none focus:border-emerald-500 mb-8 shadow-inner" />
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => { setShowUnlockModal(false); setUnlockPin(''); }} className="py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase active:scale-95">Hủy</button>
               <button onClick={handleUnlock} className="py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">Xác nhận</button>
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
