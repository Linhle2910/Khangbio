
import React, { useState, useEffect, useMemo } from 'react';
import { fetchQuestionsFromSheet, formatScientificText } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { BIOLOGY_TOPICS } from '../constants';

const QuizModule: React.FC = () => {
  const [step, setStep] = useState<'GRADE' | 'TOPIC' | 'LEVEL' | 'SYNC' | 'QUIZ' | 'RESULT' | 'ERROR'>('GRADE');
  const [selectedGrade, setSelectedGrade] = useState<8 | 9 | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'BASIC' | 'ADVANCED' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const availableTopics = useMemo(() => {
    if (!selectedGrade) return [];
    return BIOLOGY_TOPICS.filter(t => t.grade === selectedGrade);
  }, [selectedGrade]);

  const handleSelectGrade = (grade: 8 | 9) => {
    setSelectedGrade(grade);
    setStep('TOPIC');
  };

  const handleSelectTopic = (topicName: string) => {
    setSelectedTopic(topicName);
    setStep('LEVEL');
  };

  const handleSelectLevel = (level: 'BASIC' | 'ADVANCED') => {
    setSelectedLevel(level);
    performSync(selectedTopic!, selectedGrade!, level);
  };

  const performSync = async (topic: string, grade: number, level: 'BASIC' | 'ADVANCED') => {
    setStep('SYNC');
    setIsSyncing(true);
    setErrorMessage('');
    
    try {
      const allQuestions = await fetchQuestionsFromSheet();
      
      const normalize = (s: string) => s.trim().toLowerCase().normalize("NFC").replace(/\s+/g, ' ');
      
      const targetTopic = normalize(topic);
      const targetLevel = level === 'BASIC' ? 'cơ bản' : 'nâng cao';

      const filtered = allQuestions.filter(q => {
        const qTopic = normalize(q.topic || '');
        const qLevel = normalize(q.level || '');
        const qGrade = q.grade;

        // Lọc theo Chuyên đề, Lớp và Mức độ (Cột D)
        return qTopic === targetTopic && 
               qGrade === grade && 
               (qLevel.includes(targetLevel) || qLevel === (level === 'BASIC' ? 'basic' : 'advanced'));
      });
      
      if (filtered.length === 0) {
        const sheetAnalysis = Array.from(new Set(allQuestions.map(q => `• [${q.topic}] - Lớp ${q.grade} - ${q.level}`)));
        
        setErrorMessage(
          `Không tìm thấy câu hỏi cho "${topic}" - Lớp ${grade} - Mức độ ${level === 'BASIC' ? 'Cơ bản' : 'Nâng cao'}.\n\n` +
          `Dữ liệu hiện có trong Sheet của Khang:\n` +
          (sheetAnalysis.length > 0 ? sheetAnalysis.join('\n') : "Trống") +
          `\n\nKhang hãy kiểm tra lại Cột D (Mức độ) ghi là "Cơ bản" hoặc "Nâng cao" nhé!`
        );
        setStep('ERROR');
        return;
      }

      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 30);
      setQuestions(shuffled);
      setCurrentIdx(0);
      setQuizAnswers({});
      setScore(0);
      setStep('QUIZ');
    } catch (error: any) {
      setErrorMessage(error.message || "Lỗi đồng bộ không xác định.");
      setStep('ERROR');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (quizAnswers[currentIdx] !== undefined) return;
    const correct = optionIdx === questions[currentIdx].correctAnswer;
    if (correct) setScore(s => s + 1);
    setQuizAnswers(prev => ({ ...prev, [currentIdx]: optionIdx }));
  };

  if (step === 'GRADE') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-12 animate-fadeIn">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Luyện trắc nghiệm</h2>
          <p className="text-slate-500 font-medium italic">Hệ thống lọc theo Lớp, Chuyên đề và Mức độ.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => handleSelectGrade(8)} className="group p-12 bg-white border-4 border-slate-100 rounded-[3rem] hover:border-blue-500 hover:shadow-2xl transition-all active:scale-95">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🧬</div>
            <h3 className="text-2xl font-black text-slate-800 uppercase">Sinh học 8</h3>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Hệ cơ quan & Giải phẫu</p>
          </button>
          <button onClick={() => handleSelectGrade(9)} className="group p-12 bg-white border-4 border-slate-100 rounded-[3rem] hover:border-emerald-500 hover:shadow-2xl transition-all active:scale-95">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🌱</div>
            <h3 className="text-2xl font-black text-slate-800 uppercase">Sinh học 9</h3>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Di truyền & Biến dị</p>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'TOPIC') {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-10 animate-fadeIn">
        <button onClick={() => setStep('GRADE')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">← Chọn lại khối lớp</button>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight italic">Chọn chuyên đề</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTopics.map(topic => (
            <button key={topic.id} onClick={() => handleSelectTopic(topic.title)} className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-left hover:border-emerald-500 hover:shadow-xl transition-all group flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="text-4xl mb-4 p-3 bg-slate-50 rounded-2xl w-fit group-hover:rotate-12 transition-transform">{topic.icon}</div>
                <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{topic.title}</h3>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase">Tiếp tục →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'LEVEL') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-12 animate-fadeIn">
        <button onClick={() => setStep('TOPIC')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">← Chọn lại chuyên đề</button>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Chọn mức độ</h2>
          <p className="text-slate-500 font-medium italic">Chuyên đề: {selectedTopic}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => handleSelectLevel('BASIC')} className="group p-10 bg-white border-4 border-slate-100 rounded-[3rem] hover:border-emerald-500 hover:shadow-2xl transition-all active:scale-95">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📗</div>
            <h3 className="text-2xl font-black text-slate-800 uppercase italic">Cơ bản</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Kiến thức nền tảng</p>
          </button>
          <button onClick={() => handleSelectLevel('ADVANCED')} className="group p-10 bg-white border-4 border-slate-100 rounded-[3rem] hover:border-red-500 hover:shadow-2xl transition-all active:scale-95">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔥</div>
            <h3 className="text-2xl font-black text-slate-800 uppercase italic">Nâng cao</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Ôn thi HSG & Chuyên</p>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'SYNC') {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-fadeIn space-y-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-8 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-slate-700 uppercase tracking-[0.2em] animate-pulse">Đang đồng bộ từ Cột D...</p>
          <p className="text-xs text-slate-400 font-bold uppercase italic">Vui lòng đợi giây lát</p>
        </div>
      </div>
    );
  }

  if (step === 'ERROR') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-8 animate-fadeIn">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center text-4xl mx-auto">⚠️</div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-800 uppercase">Lỗi lọc dữ liệu</h2>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-800 text-xs font-medium whitespace-pre-wrap text-left leading-relaxed">
            {errorMessage}
          </div>
        </div>
        <button onClick={() => setStep('LEVEL')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Quay lại</button>
      </div>
    );
  }

  if (step === 'QUIZ') {
    const currentQ = questions[currentIdx];
    const userAns = quizAnswers[currentIdx];
    const isAnswered = userAns !== undefined;

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic">{selectedTopic} - {selectedLevel === 'BASIC' ? 'Cơ bản' : 'Nâng cao'}</span>
            <span className="text-sm font-black text-slate-800 italic">Câu {currentIdx + 1} / {questions.length}</span>
          </div>
          <button onClick={() => { if(window.confirm("Khang muốn thoát?")) setStep('TOPIC'); }} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase transition-colors">Thoát</button>
        </div>

        <div className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 min-h-[600px] flex flex-col justify-between transition-all">
          <div className="space-y-12">
            <h3 className="text-2xl md:text-3xl font-black leading-tight text-slate-800 italic" 
                dangerouslySetInnerHTML={{ __html: formatScientificText(currentQ.question) }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, i) => {
                const isCorrect = i === currentQ.correctAnswer;
                const isSelected = userAns === i;
                let btnClass = "border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-white";
                let iconClass = "bg-slate-200 text-slate-500";
                
                if (isAnswered) {
                  if (isCorrect) {
                    btnClass = "border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-500/10";
                    iconClass = "bg-emerald-500 text-white";
                  } else if (isSelected) {
                    btnClass = "border-red-500 bg-red-50";
                    iconClass = "bg-red-500 text-white";
                  } else {
                    btnClass = "border-transparent bg-slate-50 opacity-40";
                    iconClass = "bg-slate-100 text-slate-300";
                  }
                }

                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={isAnswered} className={`w-full text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all flex items-center gap-5 group ${btnClass}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all shrink-0 text-lg ${iconClass}`}>{String.fromCharCode(65 + i)}</div>
                    <span className="font-bold text-base md:text-lg text-slate-700 leading-snug" dangerouslySetInnerHTML={{ __html: formatScientificText(opt) }} />
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div className="mt-12 p-8 bg-slate-950 rounded-[2.5rem] text-white animate-slideUp border-t-8 border-emerald-500 relative overflow-hidden">
              <p className="text-emerald-400 font-black text-[9px] mb-4 uppercase tracking-[0.4em]">Lời giảng của Thầy:</p>
              <div className="italic text-slate-300 mb-8 font-medium text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: formatScientificText(currentQ.explanation) }} />
              <button onClick={() => { if (currentIdx + 1 < questions.length) setCurrentIdx(currentIdx + 1); else setStep('RESULT'); }} className="w-full py-6 bg-emerald-600 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-widest">
                {currentIdx + 1 === questions.length ? 'XEM KẾT QUẢ' : 'CÂU TIẾP THEO →'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'RESULT') {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-10 animate-fadeIn px-4">
        <div className="text-9xl">🏆</div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-slate-900 italic">KẾT QUẢ CỦA KHANG</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em]">Nỗ lực tuyệt vời!</p>
        </div>
        <div className="p-12 bg-white rounded-[4rem] border-4 border-emerald-500 shadow-2xl space-y-8">
           <div className="flex justify-center gap-12">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số câu đúng</p>
                 <p className="text-8xl font-black text-emerald-600">{score}/{questions.length}</p>
              </div>
           </div>
           <p className="text-slate-600 font-bold leading-relaxed italic text-xl px-10 pt-8 border-t border-slate-100">
             {score / questions.length >= 0.8 ? "Khang học bài rất tốt! Duy trì phong độ này nhé." : "Một kết quả khả quan! Khang hãy dành thời gian ôn lại các câu sai để bứt phá hơn."}
           </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setStep('TOPIC')} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all uppercase tracking-widest">LUYỆN CHỦ ĐỀ KHÁC</button>
          <button onClick={() => setStep('GRADE')} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black transition-all uppercase tracking-widest">CHỌN LẠI KHỐI LỚP</button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizModule;
