
import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor, summarizeBankItem, generateIllustration } from '../services/geminiService';
import { BankItem } from '../types';
import { BIOLOGY_TOPICS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  audio?: string;
  illustration?: string;
  illustrationCaption?: string;
}

const ChatTutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingIllustration, setGeneratingIllustration] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('Ghi chú thảo luận');
  const [showFullImage, setShowFullImage] = useState<string | null>(null);
  
  // Save confirmation modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveData, setSaveData] = useState<{
    title: string;
    topicId: string;
    grade: 8 | 9;
    description: string;
  }>({ title: '', topicId: '', grade: 9, description: '' });

  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const savedChat = localStorage.getItem('khangbio_chat_history');
    const savedTopic = localStorage.getItem('khangbio_current_topic');
    if (savedChat) setMessages(JSON.parse(savedChat));
    else setMessages([{ role: 'model', text: 'Chào Nguyên Khang. Thầy đã sẵn sàng hỗ trợ Khang ôn tập Sinh học chuyên sâu. Khang đang quan tâm đến chủ đề nào?' }]);
    if (savedTopic) setSessionTopic(savedTopic);
  }, []);

  useEffect(() => {
    localStorage.setItem('khangbio_chat_history', JSON.stringify(messages));
    localStorage.setItem('khangbio_current_topic', sessionTopic);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sessionTopic]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => setRecordedAudio(reader.result as string);
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Cần quyền Microphone để tiếp tục.");
    }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    if (window.confirm("Khang có chắc chắn muốn làm mới cuộc hội thoại?")) {
      const initialMsg: Message[] = [{ role: 'model', text: 'Thảo luận mới đã sẵn sàng.' }];
      setMessages(initialMsg);
      setSessionTopic('Ghi chú mới');
    }
  };

  const handlePrepareSave = async () => {
    if (messages.length < 2) return;
    setIsSaving(true);
    try {
      const fullText = messages.map(m => `${m.role === 'user' ? 'Khang' : 'Thầy'}: ${m.text}`).join('\n');
      const summary = await summarizeBankItem(fullText, 'QA');
      
      const matchingTopic = BIOLOGY_TOPICS.find(t => 
        sessionTopic.toLowerCase().includes(t.title.toLowerCase()) ||
        t.title.toLowerCase().includes(sessionTopic.toLowerCase())
      );

      setSaveData({
        title: summary.title || 'Hỏi đáp mới',
        topicId: matchingTopic?.id || '',
        grade: matchingTopic?.grade || 9,
        description: summary.description || ''
      });
      setShowSaveModal(true);
    } catch (error) {
      alert("Lỗi khi tóm tắt nội dung để lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmSaveToBank = () => {
    if (!saveData.topicId) {
      alert("Khang vui lòng chọn Chủ đề để phân loại tài liệu nhé!");
      return;
    }

    const lastIllustration = [...messages].reverse().find(m => m.illustration)?.illustration;

    const newBankItem: BankItem = {
      id: `chat-${Date.now()}`,
      title: saveData.title,
      description: saveData.description + (lastIllustration ? "\n\n(Bao gồm sơ đồ minh họa AI)" : ""),
      type: 'QA',
      topicId: saveData.topicId,
      grade: saveData.grade,
      source: 'Gia sư AI',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const savedItems = JSON.parse(localStorage.getItem('khangbio_custom_bank_items') || '[]');
    localStorage.setItem('khangbio_custom_bank_items', JSON.stringify([newBankItem, ...savedItems]));
    
    setShowSaveModal(false);
    alert(`Đã lưu nội dung Hỏi đáp vào Ngân hàng tài liệu!`);
  };

  const requestDiagram = () => {
    if (loading) return;
    sendMessage("Hãy vẽ sơ đồ minh họa chi tiết cho nội dung này.");
  };

  const sendMessage = async (overrideMessage?: string) => {
    const msgToSend = overrideMessage || input;
    if ((!msgToSend.trim() && !attachedImage && !recordedAudio) || loading) return;
    
    const currentInput = msgToSend;
    const currentImage = attachedImage;
    const currentAudio = recordedAudio;
    
    setInput('');
    setAttachedImage(null);
    setRecordedAudio(null);
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: currentInput || "[Yêu cầu minh họa]", 
      image: currentImage || undefined, 
      audio: currentAudio || undefined 
    }]);
    
    setLoading(true);
    
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await chatWithTutor(history, currentInput, currentImage || undefined, currentAudio || undefined);
      
      let finalResponseText = response.text || '';
      let illustrationUrl = undefined;
      let illustrationCaption = undefined;

      if (response.functionCalls && response.functionCalls.length > 0) {
        const fc = response.functionCalls[0];
        if (fc.name === 'generate_biology_illustration') {
          setGeneratingIllustration(true);
          const args = fc.args as any;
          illustrationCaption = args.caption;
          const img = await generateIllustration(args.prompt);
          if (img) illustrationUrl = img;
          setGeneratingIllustration(false);
        }
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: finalResponseText,
        illustration: illustrationUrl,
        illustrationCaption: illustrationCaption
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lỗi kết nối. Vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
      setGeneratingIllustration(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-160px)] bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative mx-1 md:mx-auto w-full">
      {/* Header gọn hơn trên mobile */}
      <div className="px-3 md:px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px] shrink-0 font-black">AI</div>
          <input 
            value={sessionTopic}
            onChange={(e) => setSessionTopic(e.target.value)}
            className="bg-transparent border-b border-emerald-200 focus:border-emerald-500 outline-none text-xs font-black text-slate-800 px-1 py-0.5 w-full min-w-0 overflow-hidden text-ellipsis"
          />
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={handlePrepareSave} disabled={isSaving || messages.length < 2} className="px-2.5 py-1.5 text-[8px] font-black text-emerald-700 bg-emerald-100 rounded-lg uppercase">LƯU</button>
          <button onClick={clearChat} className="px-2.5 py-1.5 text-[8px] font-black text-slate-400 border border-slate-200 bg-white rounded-lg uppercase">MỚI</button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-slate-50/20 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[92%] md:max-w-[85%] p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm ${
              msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {msg.image && <img src={msg.image} className="rounded-lg mb-2 max-h-60 w-full object-cover" alt="Attached" />}
              <div className="text-xs md:text-base leading-relaxed font-medium whitespace-pre-wrap break-words">{msg.text}</div>
              {msg.illustration && (
                <div className="mt-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <img src={msg.illustration} onClick={() => setShowFullImage(msg.illustration || null)} className="rounded h-auto max-h-48 md:max-h-80 w-full object-contain cursor-zoom-in" alt="AI Diagram" />
                  <div className="p-1.5 bg-white mt-1.5 rounded flex items-center justify-between gap-2">
                    <span className="text-[7px] font-black text-emerald-600 uppercase">Sơ đồ AI</span>
                    <span className="text-[7px] text-slate-400 font-bold italic line-clamp-1">{msg.illustrationCaption}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {(loading || generatingIllustration) && (
          <div className="flex justify-start">
            <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Đang phân tích...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 md:p-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
        <div className="flex flex-wrap gap-2 mb-2">
          <button 
            onClick={requestDiagram} 
            disabled={loading || messages.length < 2} 
            className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[7px] font-black uppercase tracking-widest border border-amber-100"
          >
            🎨 Vẽ sơ đồ
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => imageInputRef.current?.click()} className="w-10 h-10 shrink-0 flex items-center justify-center text-slate-400 border border-slate-100 rounded-xl transition-all">📎</button>
          <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          
          <div className="flex-1 relative flex items-center">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
              placeholder="Hỏi Gia sư..." 
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold pr-8 shadow-inner" 
            />
            <button 
              onClick={isRecording ? stopRecording : startRecording} 
              className={`absolute right-1 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400'}`}
            >
              {isRecording ? '⏹' : '🎤'}
            </button>
          </div>

          <button 
            onClick={() => sendMessage()} 
            disabled={loading || (!input.trim() && !attachedImage && !recordedAudio)} 
            className="w-10 h-10 bg-emerald-600 text-white rounded-xl font-black transition-all shadow-md flex items-center justify-center shrink-0"
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-[1200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 mb-2">Lưu thảo luận</h3>
            <div className="space-y-4">
              <input value={saveData.title} onChange={(e) => setSaveData({...saveData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold" placeholder="Tiêu đề thảo luận" />
              <select value={saveData.topicId} onChange={(e) => setSaveData({...saveData, topicId: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold appearance-none">
                <option value="">-- Chọn chủ đề --</option>
                {BIOLOGY_TOPICS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase">Hủy</button>
                <button onClick={confirmSaveToBank} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg">Lưu lại</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .pb-safe { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChatTutor;
