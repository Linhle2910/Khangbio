
import React, { useState, useEffect, useMemo } from 'react';
import { fetchQuestionsFromSheet, formatScientificText } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { BIOLOGY_TOPICS } from '../constants';

const QuizModule: React.FC = () => {
  // Selection states
  const [selectedGrade, setSelectedGrade] = useState<8 | 9>(9);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'BASIC' | 'ADVANCED'>('BASIC');
  
  // App states
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Quiz data states
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Auto-fill first topic when grade changes
  const availableTopics = useMemo(() => {
    const filtered = BIOLOGY_TOPICS.filter(t => t.grade === selectedGrade);
    return filtered;
  }, [selectedGrade]);

  useEffect(() => {
    if (availableTopics.length > 0 && !selectedTopic) {
      setSelectedTopic(availableTopics[0].title);
    }
  }, [availableTopics, selectedTopic]);

  const handleStartPractice = async () => {
    if (!selectedTopic) return;
    
    setIsSyncing(true);
    setHasStarted(false);
    setShowResult(false);
    setErrorMessage('');
    setQuizAnswers({});
    setScore(0);
    setCurrentIdx(0);
    
    try {
      const allQuestions = await fetchQuestionsFromSheet();
      
      const normalize = (s: string) => s.trim().toLowerCase().normalize("NFC").replace(/\s+/g, ' ');
      const targetTopic = normalize(selectedTopic);
      const targetLevel = selectedLevel === 'BASIC' ? 'cơ bản' : 'nâng cao';

      const filtered = allQuestions.filter(q => {
        const qTopic = normalize(q.topic || '');
        const qLevel = normalize(q.level || '');
        return qTopic === targetTopic && 
               q.grade === selectedGrade && 
               (qLevel.includes(targetLevel) || qLevel === (selectedLevel === 'BASIC' ? 'basic' : 'advanced'));
      });
      
      if (filtered.length === 0) {
        setErrorMessage(`Khang ơi, bộ câu hỏi "${selectedLevel === 'BASIC' ? 'Cơ bản' : 'Nâng cao'}" cho chủ đề này đang được soạn thảo. Khang thử mức độ khác nhé!`);
        setIsSyncing(false);
        return;
      }

      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 30);
      setQuestions(shuffled);
      setHasStarted(true);
    } catch (error: any) {
      setErrorMessage("Lỗi đồng bộ dữ liệu. Khang kiểm tra lại nhé!");
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

  const currentQ = questions[currentIdx];
  const userAns = quizAnswers[currentIdx];
  const isAnswered = userAns !== undefined;

  return (
    <div className="max-w-6xl mx-auto space-y-10 md:space-y-12 animate-fadeIn pb-40 px-4">
      {/* Selection Control Bar - ONE LINE ON DESKTOP */}
      <div className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 md:gap-6 sticky top-2 md:top-[72px] z-[90] bg-white/95 backdrop-blur-md mb-10 transform-gpu">
        <div className="flex flex-1 flex-wrap lg:flex-nowrap gap-3 md:gap-4">
          {/* Grade Selector */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[8, 9].map(g => (
              <button 
                key={g} 
                onClick={() => { setSelectedGrade(g as 8 | 9); setSelectedTopic(''); setHasStarted(false); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGrade === g ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Topic Selector */}
          <div className="flex-1 min-w-[240px] relative">
            <select 
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setHasStarted(false); }}
              className="w-full h-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>-- CHỌN CHUYÊN ĐỀ --</option>
              {availableTopics.map(t => (
                <option key={t.id} value={t.title}>{t.title}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
          </div>

          {/* Level Selector */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {['BASIC', 'ADVANCED'].map(l => (
              <button 
                key={l} 
                onClick={() => { setSelectedLevel(l as any); setHasStarted(false); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedLevel === l ? (l === 'BASIC' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-red-600 shadow-red-600/20') + ' text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {l === 'BASIC' ? 'Cơ bản' : 'Nâng cao'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleStartPractice}
          disabled={isSyncing || !selectedTopic}
          className="lg:w-52 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 active:scale-[0.98] hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
        >
          {isSyncing ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : 'BẮT ĐẦU ÔN LUYỆN →'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-2">
        {errorMessage && (
          <div className="bg-red-50 p-12 md:p-20 rounded-[3.5rem] border border-red-100 text-center animate-fadeIn shadow-2xl shadow-red-100/50">
            <span className="text-6xl mb-8 block">⚠️</span>
            <p className="text-red-800 font-black text-base leading-relaxed max-w-2xl mx-auto">{errorMessage}</p>
          </div>
        )}

        {isSyncing && (
          <div className="py-40 flex flex-col items-center justify-center space-y-8">
            <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin shadow-inner"></div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Đang đồng bộ bộ câu hỏi chuyên sâu...</p>
          </div>
        )}

        {!hasStarted && !isSyncing && !errorMessage && !showResult && (
          <div className="py-32 text-center opacity-30 flex flex-col items-center">
            <div className="text-6xl mb-10 animate-bounce">🎯</div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Sẵn sàng bứt phá kiến thức chưa Khang?</h3>
            <p className="text-sm text-slate-400 mt-4 font-bold uppercase tracking-[0.2em]">Chọn chuyên đề và mức độ để bắt đầu</p>
          </div>
        )}

        {hasStarted && !showResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Progress */}
            <div className="flex justify-between items-center px-6">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Câu {currentIdx + 1} / {questions.length}</span>
              <div className="w-60 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-10 md:p-20 rounded-[4rem] border border-slate-100 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)] min-h-[550px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-[8rem] font-black select-none pointer-events-none">
                {currentIdx + 1}
              </div>
              
              <div className="space-y-12 relative z-10">
                <div className="flex gap-6 items-start">
                  <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl mt-1.5 shrink-0 tracking-widest shadow-lg shadow-slate-900/20">CÂU {currentIdx + 1}</span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-[1.3] tracking-tight" 
                      dangerouslySetInnerHTML={{ __html: formatScientificText(currentQ.question) }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentQ.options.map((opt, i) => {
                    const isCorrect = i === currentQ.correctAnswer;
                    const isSelected = userAns === i;
                    let style = "border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-200";
                    
                    if (isAnswered) {
                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-500/10 shadow-xl shadow-emerald-500/10";
                      else if (isSelected) style = "border-red-500 bg-red-50 text-red-900 shadow-xl shadow-red-500/10";
                      else style = "border-transparent bg-slate-50 opacity-30 grayscale scale-[0.98]";
                    }

                    return (
                      <button 
                        key={i} 
                        onClick={() => handleAnswer(i)} 
                        disabled={isAnswered} 
                        className={`w-full text-left p-8 rounded-3xl border-2 transition-all flex items-center gap-6 group ${style}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 text-sm transition-all ${isAnswered && isCorrect ? 'bg-emerald-500 text-white scale-110' : 'bg-white border border-slate-200 text-slate-400 group-hover:text-slate-900 group-hover:border-slate-900'}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-bold text-base md:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: formatScientificText(opt) }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {isAnswered && (
                <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-white animate-slideUp shadow-2xl shadow-slate-900/40 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-amber-400 text-2xl animate-pulse">💡</span>
                    <p className="text-amber-400 font-black text-[10px] uppercase tracking-[0.3em]">Phân tích chuyên sâu từ hệ thống:</p>
                  </div>
                  <div className="text-slate-300 mb-10 font-medium text-sm md:text-base leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: formatScientificText(currentQ.explanation) }} />
                  <button 
                    onClick={() => { if (currentIdx + 1 < questions.length) setCurrentIdx(currentIdx + 1); else setShowResult(true); }} 
                    className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20"
                  >
                    {currentIdx + 1 === questions.length ? 'XEM KẾT QUẢ TỔNG KẾT' : 'TIẾP THEO →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showResult && (
          <div className="max-w-3xl mx-auto py-20 text-center space-y-12 animate-fadeIn">
            <div className="text-6xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Hoàn thành bài luyện!</h2>
            
            <div className="p-16 md:p-24 bg-white rounded-[5rem] border border-slate-100 shadow-[0_64px_96px_-16px_rgba(0,0,0,0.1)] card-shadow">
                <p className="text-6xl md:text-7xl font-black text-emerald-600 mb-4 tracking-tighter">{score}/{questions.length}</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Câu trả lời chính xác</p>
                <p className="text-slate-600 font-bold text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                   {score / questions.length >= 0.8 
                    ? "Khang nắm kiến thức rất chắc chắn. Một kết quả tuyệt vời, hãy tiếp tục duy trì phong độ này nhé!" 
                    : "Kết quả khá ổn, Khang hãy dành thời gian xem lại các câu sai để ghi nhớ kiến thức kỹ hơn nhé."}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={() => setHasStarted(false)} className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20">CHỌN CHỦ ĐỀ KHÁC</button>
              <button onClick={handleStartPractice} className="bg-emerald-600 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20">LUYỆN LẠI BỘ NÀY</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModule;
