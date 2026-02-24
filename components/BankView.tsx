
import React, { useState, useMemo, useEffect } from 'react';
import { BIOLOGY_TOPICS } from '../constants';
import { BankItem } from '../types';
import { summarizeBankItem, fetchBankFromSheet } from '../services/geminiService';

const BankView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LECTURE' | 'EXAM' | 'QA'>('LECTURE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<number | ''>('');
  
  // App states
  const [isLoading, setIsLoading] = useState(true);
  const [localBankData, setLocalBankData] = useState<BankItem[]>([]);

  // Viewing states
  const [viewingQA, setViewingQA] = useState<BankItem | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let finalUrl = url.trim();
    if (finalUrl.includes('drive.google.com')) {
      if (finalUrl.includes('/view')) finalUrl = finalUrl.replace('/view', '/preview');
      else if (finalUrl.includes('/edit')) finalUrl = finalUrl.replace('/edit', '/preview');
      else if (finalUrl.includes('id=')) {
        const idMatch = finalUrl.match(/[-\w]{25,}/);
        if (idMatch) finalUrl = `https://drive.google.com/file/d/${idMatch[0]}/preview`;
      }
    }
    return finalUrl;
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [uploadMode, setUploadMode] = useState<'FILE' | 'DRIVE'>('DRIVE');
  const [tempContent, setTempContent] = useState(''); // Text for AI analysis
  const [newItem, setNewItem] = useState<Partial<BankItem>>({
    type: 'LECTURE',
    grade: 9,
    source: 'Tài liệu cá nhân',
    fileType: 'DRIVE',
    title: '',
    description: ''
  });
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const sheetData = await fetchBankFromSheet();
        const customItems = JSON.parse(localStorage.getItem('khangbio_custom_bank_items') || '[]');
        
        const combined = [...customItems, ...sheetData];
        const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        setLocalBankData(unique);
      } catch (error) {
        console.error("Lỗi tải dữ liệu tài liệu:", error);
        const customItems = JSON.parse(localStorage.getItem('khangbio_custom_bank_items') || '[]');
        setLocalBankData(customItems);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const performDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (window.confirm("Khang có chắc chắn muốn xóa tài liệu này không?")) {
      const updatedData = localBankData.filter(item => item.id !== id);
      setLocalBankData(updatedData);
      
      const customItems = JSON.parse(localStorage.getItem('khangbio_custom_bank_items') || '[]');
      const updatedCustom = customItems.filter((item: BankItem) => item.id !== id);
      localStorage.setItem('khangbio_custom_bank_items', JSON.stringify(updatedCustom));
    }
  };

  const handleAutoSummarize = async () => {
    if (!tempContent.trim()) {
      alert("Vui lòng nhập một ít nội dung tài liệu để AI có thể phân tích.");
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const summary = await summarizeBankItem(tempContent, newItem.type || 'LECTURE');
      setNewItem(prev => ({
        ...prev,
        title: summary.title,
        description: summary.description
      }));
    } catch (error) {
      alert("Lỗi khi tóm tắt bằng AI. Vui lòng thử lại.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.topicId) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Chủ đề tài liệu.");
      return;
    }

    const itemToAdd: BankItem = {
      id: `manual-${Date.now()}`,
      title: newItem.title,
      description: newItem.description || '',
      type: newItem.type as 'LECTURE' | 'EXAM' | 'QA',
      topicId: newItem.topicId,
      grade: newItem.grade as 8 | 9,
      source: newItem.source || 'Tài liệu cá nhân',
      dateAdded: new Date().toISOString().split('T')[0],
      url: uploadMode === 'DRIVE' ? newItem.url : '#',
      fileType: uploadMode
    };

    const customItems = JSON.parse(localStorage.getItem('khangbio_custom_bank_items') || '[]');
    const updatedCustom = [itemToAdd, ...customItems];
    localStorage.setItem('khangbio_custom_bank_items', JSON.stringify(updatedCustom));
    
    setLocalBankData(prev => [itemToAdd, ...prev]);
    setShowUploadModal(false);
    setNewItem({ type: 'LECTURE', grade: 9, source: 'Tài liệu cá nhân', fileType: 'DRIVE', title: '', description: '' });
    setTempContent('');
  };

  const handleViewItem = (item: BankItem) => {
    setViewingQA(item);
  };

  const filteredData = useMemo(() => {
    return localBankData.filter(item => {
      if (item.type !== activeTab) return false;
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchYear = !selectedYear || item.dateAdded.startsWith(selectedYear);
      const matchTopic = !selectedTopicId || item.topicId.toLowerCase().includes(selectedTopicId.toLowerCase());
      const matchGrade = !selectedGrade || item.grade === selectedGrade;
      return matchSearch && matchYear && matchTopic && matchGrade;
    });
  }, [localBankData, activeTab, searchTerm, selectedYear, selectedTopicId, selectedGrade]);

  const availableTopicsFromData = useMemo(() => {
    const topics = localBankData.map(item => item.topicId).filter(t => t && t.trim() !== '');
    return Array.from(new Set(topics)).sort();
  }, [localBankData]);

  const availableYears = useMemo(() => {
    const years = localBankData.map(item => item.dateAdded.split('-')[0]);
    return Array.from(new Set(years)).sort((a: string, b: string) => b.localeCompare(a));
  }, [localBankData]);

  return (
    <div className="w-full space-y-4 md:space-y-6 animate-fadeIn pb-24 overflow-x-hidden">
      {isLoading && localBankData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang tải danh sách tài liệu...</p>
        </div>
      ) : (
        <>
          {/* Tabs & Toolbar Bar - Sticky under Header (56px) */}
      <div className="flex flex-col gap-3 mx-1 md:mx-0 sticky top-[56px] md:top-[72px] z-[90] pt-1 pb-2 bg-slate-50/95 backdrop-blur-md">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {['LECTURE', 'EXAM', 'QA'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[100px] py-2.5 rounded-lg font-black text-[9px] md:text-xs transition-all whitespace-nowrap active:scale-95 ${
                activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab === 'LECTURE' ? 'TÀI LIỆU HỌC' : tab === 'EXAM' ? 'ĐỀ THI' : 'HỎI ĐÁP'}
            </button>
          ))}
        </div>
        
        <div className="flex items-stretch gap-2">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-lg">➕</span> THÊM TÀI LIỆU MỚI
          </button>
        </div>
      </div>

      {/* Simplified Filters for Mobile - Single column or tight grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 mx-1 md:mx-0">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm tên tài liệu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs focus:border-emerald-500 shadow-inner"
          />
          <span className="absolute right-4 top-3.5 opacity-30 text-xs">🔍</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select 
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 text-xs appearance-none focus:border-emerald-500 shadow-sm"
          >
            <option value="">Tất cả chủ đề</option>
            {availableTopicsFromData.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="flex-1 px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 text-xs appearance-none focus:border-emerald-500 shadow-sm">
              <option value="">Năm</option>
              {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : '')} className="flex-1 px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 text-xs appearance-none focus:border-emerald-500 shadow-sm">
              <option value="">Khối</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display - Adaptive for mobile screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mx-1 md:mx-0">
        {filteredData.length > 0 ? filteredData.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl md:rounded-[2.5rem] border border-slate-200 hover:border-emerald-500 shadow-sm relative flex flex-col justify-between transition-all active:scale-[0.98]">
            <div onClick={() => handleViewItem(item)} className="cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <span className={`w-fit px-2 py-0.5 rounded-[4px] text-[6px] md:text-[7px] font-black uppercase tracking-widest shadow-sm ${
                    item.type === 'QA' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.category || (item.type === 'QA' ? '💬 Hỏi đáp' : '📁 TÀI LIỆU')}
                  </span>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.dateAdded}</p>
                </div>
                <span className="text-[9px] font-black text-slate-300">#{item.id.split('-')[1]}</span>
              </div>
              
              <h4 className="text-lg md:text-2xl font-black text-slate-900 mb-3 leading-tight tracking-tight break-words group-hover:text-emerald-600 transition-colors">
                {item.title}
              </h4>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider line-clamp-1">
                  Chủ đề: {item.topicId || "Chung"}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Khối lớp {item.grade}</span>
                <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">{item.source}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={(e) => performDelete(e, item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                <button onClick={() => handleViewItem(item)} className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-600 font-black text-[8px] md:text-[9px] rounded-lg uppercase tracking-widest transition-all">XEM CHI TIẾT →</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Không tìm thấy tài liệu nào phù hợp</p>
          </div>
        )}
      </div>
      
        </>
      )}
      
      {/* View Modal - Responsive Fullscreen for Mobile */}
      {viewingQA && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-white animate-slideUp">
          <div className={`p-4 md:p-8 text-white flex justify-between items-center shrink-0 shadow-xl ${viewingQA.type === 'QA' ? 'bg-amber-600' : 'bg-emerald-600'}`}>
            <div className="pr-4">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">{viewingQA.type === 'QA' ? 'Hỏi đáp AI' : 'Chi tiết tài liệu'}</p>
              <h3 className="text-lg md:text-2xl font-black leading-tight line-clamp-2 break-words">{viewingQA.title}</h3>
            </div>
            <button onClick={() => setViewingQA(null)} className="w-10 h-10 flex items-center justify-center bg-black/10 rounded-full font-bold active:scale-90 transition-all">✕</button>
          </div>
          <div className="p-6 md:p-12 overflow-y-auto flex-1 bg-slate-50/50 no-scrollbar">
            {viewingQA.url && viewingQA.url !== '#' && viewingQA.url.includes('drive.google.com') ? (
              <div className="w-full h-[500px] md:h-[700px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                <iframe 
                  src={getEmbedUrl(viewingQA.url) || ''} 
                  className="w-full h-full border-none"
                  title="Document Preview"
                />
              </div>
            ) : (
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm text-slate-700 font-medium text-sm md:text-lg leading-relaxed whitespace-pre-wrap break-words mb-8">
                {viewingQA.description}
              </div>
            )}
            
            {viewingQA.url && viewingQA.url !== '#' && (
              <div className="mt-4">
                <button onClick={() => window.open(viewingQA.url, '_blank')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">MỞ TÀI LIỆU TRONG CỬA SỔ MỚI ↗</button>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button onClick={() => setViewingQA(null)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:bg-slate-200 transition-all">ĐÓNG XEM TRƯỚC</button>
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

export default BankView;
