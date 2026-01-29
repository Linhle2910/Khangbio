
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

      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 20);
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
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fadeIn pb-32 px-1">
      {/* Selection Control Bar - ONE LINE ON DESKTOP */}
      <div className="bg-white p-3 md:p-5 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center gap-3 md:gap-4 sticky top-[56px] md:top-[72px] z-[90] backdrop-blur-xl bg-white/90">
        <div className="flex flex-1 flex-wrap lg:flex-nowrap gap-2 md:gap-3">
          {/* Grade Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[8, 9].map(g => (
              <button 
                key={g} 
                onClick={() => { setSelectedGrade(g as 8 | 9); setSelectedTopic(''); setHasStarted(false); }}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${selectedGrade === g ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Topic Selector */}
          <div className="flex-1 min-w-[180px]">
            <select 
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setHasStarted(false); }}
              className="w-full h-full px-4 py-2 bg-slate-100 border border-transparent rounded-xl text-[10px] font-black uppercase text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>-- CHỌN CHUYÊN ĐỀ --</option>
              {availableTopics.map(t => (
                <option key={t.id} value={t.title}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Level Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['BASIC', 'ADVANCED'].map(l => (
              <button 
                key={l} 
                onClick={() => { setSelectedLevel(l as any); setHasStarted(false); }}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${selectedLevel === l ? (l === 'BASIC' ? 'bg-emerald-600' : 'bg-red-600') + ' text-white shadow-md' : 'text-slate-400'}`}
              >
                {l === 'BASIC' ? 'Cơ bản' : 'Nâng cao'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleStartPractice}
          disabled={isSyncing || !selectedTopic}
          className="lg:w-44 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isSyncing ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : 'BẮT ĐẦU →'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-2">
        {errorMessage && (
          <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 text-center animate-fadeIn">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="text-red-800 font-bold text-sm italic">{errorMessage}</p>
          </div>
        )}

        {isSyncing && (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải bộ câu hỏi...</p>
          </div>
        )}

        {!hasStarted && !isSyncing && !errorMessage && !showResult && (
          <div className="py-24 text-center opacity-20">
            <div className="text-8xl mb-8">🎯</div>
            <h3 className="text-xl font-black text-slate-800 uppercase italic">Sẵn sàng ôn luyện chuyên sâu chưa Khang?</h3>
          </div>
        )}

        {hasStarted && !showResult && (
          <div className="space-y-6 animate-fadeIn">
            {/* Progress */}
            <div className="flex justify-between items-center px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Câu {currentIdx + 1} / {questions.length}</span>
              <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-8 md:p-14 rounded-[3rem] border border-slate-200 shadow-2xl min-h-[450px] flex flex-col justify-between">
              <div className="space-y-10">
                <h3 className="text-xl md:text-3xl font-black text-slate-800 leading-tight italic" 
                    dangerouslySetInnerHTML={{ __html: formatScientificText(currentQ.question) }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((opt, i) => {
                    const isCorrect = i === currentQ.correctAnswer;
                    const isSelected = userAns === i;
                    let style = "border-slate-100 bg-slate-50 text-slate-700";
                    
                    if (isAnswered) {
                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100";
                      else if (isSelected) style = "border-red-500 bg-red-50 text-red-900";
                      else style = "border-transparent bg-slate-50 opacity-40 grayscale";
                    }

                    return (
                      <button 
                        key={i} 
                        onClick={() => handleAnswer(i)} 
                        disabled={isAnswered} 
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group ${style}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0 text-xs ${isAnswered && isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-bold text-sm md:text-base" dangerouslySetInnerHTML={{ __html: formatScientificText(opt) }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {isAnswered && (
                <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white animate-slideUp">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-400 text-xl">💡</span>
                    <p className="text-amber-400 font-black text-[9px] uppercase tracking-widest italic">Phân tích từ hệ thống:</p>
                  </div>
                  <div className="italic text-slate-300 mb-8 font-medium text-sm md:text-base leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: formatScientificText(currentQ.explanation) }} />
                  <button 
                    onClick={() => { if (currentIdx + 1 < questions.length) setCurrentIdx(currentIdx + 1); else setShowResult(true); }} 
                    className="w-full py-4 bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                  >
                    {currentIdx + 1 === questions.length ? 'XEM KẾT QUẢ TỔNG KẾT' : 'TIẾP THEO →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showResult && (
          <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-fadeIn">
            <div className="text-8xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase">Hoàn thành bài luyện!</h2>
            
            <div className="p-12 bg-white rounded-[4rem] border border-slate-200 shadow-2xl">
                <p className="text-7xl font-black text-emerald-600 mb-2">{score}/{questions.length}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Câu trả lời đúng</p>
                <p className="text-slate-600 font-bold italic text-lg leading-relaxed">
                   {score / questions.length >= 0.8 
                    ? "Khang nắm kiến thức rất chắc chắn. Cố gắng phát huy nhé!" 
                    : "Kết quả ổn, Khang hãy xem lại các câu sai để ghi nhớ kỹ hơn nhé."}
                </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => setHasStarted(false)} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">CHỌN CHỦ ĐỀ KHÁC</button>
              <button onClick={handleStartPractice} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">LUYỆN LẠI</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModule;
