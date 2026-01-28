
// Fix: Added React import to resolve 'Cannot find namespace React' error on line 7
import React, { useState, useEffect, useRef } from 'react';
import { generateEssayExam, gradeEssayExam, gradeHomework } from '../services/geminiService';
import { QuizQuestion, EssayExam, EssayGradingResult, HomeworkGradingResult } from '../types';
import { QUESTION_POOL, BIOLOGY_TOPICS } from '../constants';

const QuizModule: React.FC = () => {
  const [mode, setMode] = useState<'QUIZ_SELECT' | 'QUIZ' | 'ESSAY' | 'HOMEWORK' | null>(null);
  
  // Quiz (MCQ) states
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({}); 

  // Essay states
  const [essayExam, setEssayExam] = useState<EssayExam | null>(null);
  const [currentEssayIdx, setCurrentEssayIdx] = useState(0);
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [gradingResult, setGradingResult] = useState<EssayGradingResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [isLoadingExam, setIsLoadingExam] = useState(false);

  // Homework Evaluation states
  const [homeworkQuestion, setHomeworkQuestion] = useState('');
  const [homeworkAnswer, setHomeworkAnswer] = useState('');
  const [homeworkImage, setHomeworkImage] = useState<string | null>(null);
  const [homeworkResult, setHomeworkResult] = useState<HomeworkGradingResult | null>(null);

  // Auto-save logic for Essay
  useEffect(() => {
    if (mode === 'ESSAY' && essayExam && Object.keys(essayAnswers).length > 0) {
      localStorage.setItem(`essay_progress_${essayExam.id}`, JSON.stringify(essayAnswers));
    }
  }, [essayAnswers, mode, essayExam]);

  const startQuiz = (topic?: string, grade?: number, count: number = 30) => {
    let pool = [...QUESTION_POOL];
    if (topic) {
      pool = pool.filter(q => q.topic === topic);
    }
    if (grade) {
      pool = pool.filter(q => q.grade === grade);
    }
    
    // Shuffle and pick 30
    const shuffled = pool.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, Math.min(count, shuffled.length)));
    setCurrentQIdx(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedAns(null);
    setQuizAnswers({});
    setMode('QUIZ');
  };

  const startEssayExam = async () => {
    setIsLoadingExam(true);
    setMode('ESSAY');
    try {
      const exam = await generateEssayExam();
      setEssayExam(exam);
      setCurrentEssayIdx(0);
      const saved = localStorage.getItem(`essay_progress_${exam.id}`);
      if (saved) {
        setEssayAnswers(JSON.parse(saved));
      } else {
        setEssayAnswers({});
      }
      setGradingResult(null);
    } catch (e) {
      alert("Lỗi tạo đề thi. Vui lòng thử lại!");
      setMode(null);
    } finally {
      setIsLoadingExam(false);
    }
  };

  const startHomeworkMode = () => {
    setMode('HOMEWORK');
    setHomeworkResult(null);
  };

  const handleExit = () => {
    if (mode === 'ESSAY' && (Object.values(essayAnswers) as string[]).some(val => val.trim().length > 0) && !gradingResult) {
      if (window.confirm("Nguyên Khang chắc chắn muốn thoát chứ? Bài làm chưa nộp sẽ không được chấm điểm.")) {
        setMode(null);
      }
    } else {
      setMode(null);
    }
  };

  const submitEssay = async () => {
    if (!essayExam) return;
    setIsGrading(true);
    try {
      const result = await gradeEssayExam(essayExam, essayAnswers);
      setGradingResult(result);
      localStorage.removeItem(`essay_progress_${essayExam.id}`);
    } catch (e) {
      alert("Lỗi khi chấm điểm bài làm.");
    } finally {
      setIsGrading(false);
    }
  };

  const submitHomeworkForGrading = async () => {
    setIsGrading(true);
    try {
      const result = await gradeHomework(homeworkQuestion, homeworkAnswer, homeworkImage || undefined);
      setHomeworkResult(result);
    } catch (e) {
      alert("Lỗi khi chấm bài tập.");
    } finally {
      setIsGrading(false);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswers[currentQIdx] !== undefined) return;
    const updatedAnswers = { ...quizAnswers, [currentQIdx]: idx };
    setQuizAnswers(updatedAnswers);
    setSelectedAns(idx);
    
    if (Object.keys(updatedAnswers).length === questions.length) {
      let finalScore = 0;
      questions.forEach((q, i) => {
        if (updatedAnswers[i] === q.correctAnswer) finalScore++;
      });
      setQuizScore(finalScore);
    }
  };

  const QuestionStepper = ({ 
    count, 
    currentIndex, 
    setCurrentIndex, 
    isAnswered 
  }: { 
    count: number, 
    currentIndex: number, 
    setCurrentIndex: (idx: number) => void,
    isAnswered: (idx: number) => boolean
  }) => (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-2 bg-white/50 backdrop-blur-sm rounded-2xl mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentIndex(i)}
          className={`min-w-[40px] h-10 rounded-xl font-black text-sm transition-all flex items-center justify-center border-2 ${
            currentIndex === i 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
              : isAnswered(i)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-white border-slate-100 text-slate-400'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  if (!mode) {
    return (
      <div className="max-w-5xl mx-auto py-10 space-y-8 animate-fadeIn">
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Kỳ thi vào 10 chuyên</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Phòng luyện thi Chuyên</h2>
            <p className="text-slate-400 text-sm md:text-lg max-w-2xl mb-10 leading-relaxed font-medium">
              Mô phỏng kỳ thi chính thức với hệ thống chấm điểm AI khắt khe. Luyện tập trắc nghiệm theo từng chuyên đề hoặc thi thử tự luận.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <button 
                onClick={() => setMode('QUIZ_SELECT')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-6 md:p-8 rounded-[2rem] text-left hover:bg-white/20 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                <h3 className="text-xl font-black mb-2">Trắc nghiệm</h3>
                <p className="text-xs text-slate-400">Theo chuyên đề, 30 câu/lượt.</p>
              </button>
              <button 
                onClick={startEssayExam}
                className="bg-emerald-600 text-white p-6 md:p-8 rounded-[2rem] text-left hover:scale-[1.02] transition-all shadow-xl shadow-emerald-950/40 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
                <h3 className="text-xl font-black mb-2">Đề thi tự luận</h3>
                <p className="text-emerald-50/70 text-xs">Phân tích chuyên sâu 100%.</p>
              </button>
              <button 
                onClick={startHomeworkMode}
                className="bg-blue-600 text-white p-6 md:p-8 rounded-[2rem] text-left hover:scale-[1.02] transition-all shadow-xl shadow-blue-950/40 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
                <h3 className="text-xl font-black mb-2">Chấm bài tập</h3>
                <p className="text-blue-50/70 text-xs">Gửi bài làm cá nhân của Khang.</p>
              </button>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-[15rem] opacity-5 rotate-12 pointer-events-none uppercase font-black">Bio</div>
        </div>
      </div>
    );
  }

  if (mode === 'QUIZ_SELECT') {
    const topics8 = Array.from(new Set(QUESTION_POOL.filter(q => q.grade === 8).map(q => q.topic))).filter(Boolean);
    const topics9 = Array.from(new Set(QUESTION_POOL.filter(q => q.grade === 9).map(q => q.topic))).filter(Boolean);
    
    return (
      <div className="max-w-5xl mx-auto py-6 md:py-10 space-y-12 animate-fadeIn px-2 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => setMode(null)} className="text-slate-400 font-black flex items-center gap-2 uppercase tracking-widest text-[10px] mb-2 hover:text-emerald-600 transition-colors">
              ← Quay lại phòng thi
            </button>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight italic">CHỌN CHUYÊN ĐỀ LUYỆN TẬP</h2>
          </div>
          <button 
            onClick={() => startQuiz(undefined, undefined, 30)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
          >
            🎲 Xáo trộn tất cả (30 câu)
          </button>
        </div>

        {/* Grade 8 Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black italic">8</div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sinh học lớp 8</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {topics8.map((topic, i) => {
              const count = QUESTION_POOL.filter(q => q.topic === topic).length;
              const icon = BIOLOGY_TOPICS.find(t => t.title === topic)?.icon || '🧬';
              return (
                <button 
                  key={i}
                  onClick={() => startQuiz(topic as string, 8, 30)}
                  className="p-6 bg-white border border-slate-200 rounded-[2rem] text-left hover:border-blue-500 hover:shadow-xl transition-all group flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">{icon}</div>
                    <h3 className="text-base font-black text-slate-800 mb-1 leading-tight">{topic}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter">Bộ {Math.min(count, 30)} câu</span>
                    <span className="text-blue-500 font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Luyện ngay →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Grade 9 Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black italic">9</div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sinh học lớp 9</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {topics9.map((topic, i) => {
              const count = QUESTION_POOL.filter(q => q.topic === topic).length;
              const icon = BIOLOGY_TOPICS.find(t => t.title === topic)?.icon || '🧬';
              return (
                <button 
                  key={i}
                  onClick={() => startQuiz(topic as string, 9, 30)}
                  className="p-6 bg-white border border-slate-200 rounded-[2rem] text-left hover:border-emerald-500 hover:shadow-xl transition-all group flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">{icon}</div>
                    <h3 className="text-base font-black text-slate-800 mb-1 leading-tight">{topic}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-tighter">Bộ {Math.min(count, 30)} câu</span>
                    <span className="text-emerald-500 font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Luyện ngay →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // QUIZ VIEW (MCQ) - Remains mostly same but ensure the questions count is respected
  if (mode === 'QUIZ') {
    if (quizFinished) {
      return (
        <div className="max-w-3xl mx-auto py-20 text-center space-y-8 animate-fadeIn">
          <div className="text-8xl">🏆</div>
          <h2 className="text-4xl font-black italic">HOÀN THÀNH LUYỆN TẬP</h2>
          <div className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-xl space-y-6">
             <div className="flex justify-center gap-8">
                <div className="text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Điểm số</p>
                   <p className="text-5xl font-black text-emerald-600">{quizScore}/{questions.length}</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ</p>
                   <p className="text-5xl font-black text-slate-800">{Math.round((quizScore / questions.length) * 100)}%</p>
                </div>
             </div>
             <p className="text-slate-600 font-bold leading-relaxed italic text-lg px-6">
               {(quizScore / questions.length) >= 0.8 ? "Nguyên Khang nắm kiến thức rất chắc chắn. Hãy sẵn sàng cho những thử thách tự luận khó hơn!" : "Kết quả khá ổn, Khang hãy xem kỹ phần giải thích AI để lấp đầy các lỗ hổng kiến thức nhé."}
             </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setMode('QUIZ_SELECT')} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all uppercase tracking-widest active:scale-95">LUYỆN CHUYÊN ĐỀ KHÁC</button>
            <button onClick={() => setMode(null)} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black transition-all uppercase tracking-widest active:scale-95">VỀ PHÒNG THI</button>
          </div>
        </div>
      );
    }

    const currentQ = questions[currentQIdx];
    const answeredInThisQ = quizAnswers[currentQIdx] !== undefined;

    return (
      <div className="max-w-4xl mx-auto py-6 md:py-8 space-y-4 animate-fadeIn px-2 md:px-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest italic">{currentQ?.topic || 'Ôn tập tổng hợp'}</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">30 CÂU THỬ THÁCH</span>
          </div>
          <button onClick={handleExit} className="text-[9px] font-black text-red-500 uppercase px-4 py-2 hover:bg-red-50 rounded-xl transition-all border border-red-100">Dừng luyện tập</button>
        </div>

        <QuestionStepper 
          count={questions.length} 
          currentIndex={currentQIdx} 
          setCurrentIndex={(idx) => {
            setCurrentQIdx(idx);
            setSelectedAns(quizAnswers[idx] !== undefined ? quizAnswers[idx] : null);
          }}
          isAnswered={(idx) => quizAnswers[idx] !== undefined}
        />

        <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-100 min-h-[550px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">CÂU HỎI {currentQIdx + 1}</span>
              {currentQ?.level && (
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  currentQ.level === 'ADVANCED' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>{currentQ.level === 'ADVANCED' ? 'NÂNG CAO' : 'CƠ BẢN'}</span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-black mb-12 leading-relaxed text-slate-800 italic">"{currentQ?.question}"</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  className={`w-full text-left p-5 md:p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${
                    !answeredInThisQ ? 'border-slate-50 hover:border-emerald-200 hover:bg-emerald-50' :
                    i === currentQ.correctAnswer ? 'border-emerald-500 bg-emerald-50 shadow-md' : 
                    quizAnswers[currentQIdx] === i ? 'border-red-500 bg-red-50' : 'opacity-40 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all shrink-0 ${
                    !answeredInThisQ ? 'bg-slate-100 text-slate-400' :
                    i === currentQ.correctAnswer ? 'bg-emerald-500 text-white' :
                    quizAnswers[currentQIdx] === i ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-bold text-sm md:text-base text-slate-700 leading-snug">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {answeredInThisQ && (
            <div className="mt-12 p-6 md:p-8 bg-slate-950 rounded-[2rem] text-white animate-slideUp border-t-8 border-emerald-500 shadow-2xl relative overflow-hidden">
              <div className="absolute right-[-10px] top-[-10px] text-5xl opacity-10 grayscale">💡</div>
              <p className="text-emerald-400 font-black text-[9px] mb-3 uppercase tracking-[0.3em]">GIẢI THÍCH CHUYÊN SÂU</p>
              <p className="italic text-slate-300 mb-8 font-medium text-sm md:text-base leading-relaxed opacity-90">"{currentQ.explanation}"</p>
              <button 
                onClick={() => {
                  if (currentQIdx + 1 < questions.length) {
                    setCurrentQIdx(currentQIdx + 1);
                    setSelectedAns(null);
                  } else setQuizFinished(true);
                }}
                className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-sm md:text-base shadow-xl shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-widest"
              >
                {currentQIdx + 1 === questions.length ? 'XEM TỔNG KẾT' : 'CÂU TIẾP THEO'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ESSAY and HOMEWORK views remain as provided in previous file content
  if (mode === 'ESSAY') {
    if (isLoadingExam) {
      return (
        <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
          <div className="relative w-24 h-24 mb-10">
            <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-slate-200 border-b-emerald-400 rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-xl font-black text-slate-700 animate-pulse text-center max-w-md uppercase tracking-widest">
            AI ĐANG SOẠN ĐỀ THI CHUYÊN BIỆT...
          </p>
        </div>
      );
    }
  }

  // Simplified fallback if mode not matched
  return (
    <div className="max-w-5xl mx-auto py-10 text-center">
       <p className="text-slate-400">Đang tải module...</p>
    </div>
  );
};

export default QuizModule;
