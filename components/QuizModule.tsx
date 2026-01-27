
// Fix: Added explicit type assertions to Object.values results for essayAnswers to resolve trim() type errors.
import React, { useState, useEffect, useRef } from 'react';
import { generateQuiz, generateEssayExam, gradeEssayExam, gradeHomework } from '../services/geminiService';
import { QuizQuestion, EssayExam, EssayGradingResult, HomeworkGradingResult } from '../types';
import { QUESTION_POOL } from '../constants';

const QuizModule: React.FC = () => {
  const [mode, setMode] = useState<'QUIZ' | 'ESSAY' | 'HOMEWORK' | null>(null);
  
  // Quiz (MCQ) states
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({}); // Track selected answers for all quiz questions

  // Essay states
  const [essayExam, setEssayExam] = useState<EssayExam | null>(null);
  const [currentEssayIdx, setCurrentEssayIdx] = useState(0);
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [gradingResult, setGradingResult] = useState<EssayGradingResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [gradingStep, setGradingStep] = useState(0);

  // Homework Evaluation states
  const [homeworkQuestion, setHomeworkQuestion] = useState('');
  const [homeworkAnswer, setHomeworkAnswer] = useState('');
  const [homeworkImage, setHomeworkImage] = useState<string | null>(null);
  const [homeworkResult, setHomeworkResult] = useState<HomeworkGradingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save logic for Essay
  useEffect(() => {
    if (mode === 'ESSAY' && essayExam && Object.keys(essayAnswers).length > 0) {
      localStorage.setItem(`essay_progress_${essayExam.id}`, JSON.stringify(essayAnswers));
    }
  }, [essayAnswers, mode, essayExam]);

  // Immersive Grading Steps
  useEffect(() => {
    if (isGrading) {
      const interval = setInterval(() => {
        setGradingStep(s => (s + 1) % 4);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGrading]);

  const startQuiz = (count: number = 30) => {
    const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
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
    const answeredCount = (Object.values(essayAnswers) as string[]).filter(v => v.trim().length > 0).length;
    if (answeredCount < essayExam.questions.length) {
      if (!window.confirm(`Khang mới làm ${answeredCount}/${essayExam.questions.length} câu. Vẫn muốn nộp bài chứ?`)) {
        return;
      }
    }
    setIsGrading(true);
    try {
      const result = await gradeEssayExam(essayExam, essayAnswers);
      setGradingResult(result);
      localStorage.removeItem(`essay_progress_${essayExam.id}`);
    } catch (e) {
      alert("Lỗi khi chấm điểm bài làm. Nguyên Khang thử lại nhé!");
    } finally {
      setIsGrading(false);
    }
  };

  const submitHomeworkForGrading = async () => {
    if (!homeworkQuestion.trim() && !homeworkAnswer.trim() && !homeworkImage) {
      alert("Nguyên Khang hãy nhập đề bài và bài làm để thầy chấm nhé!");
      return;
    }
    setIsGrading(true);
    try {
      const result = await gradeHomework(homeworkQuestion, homeworkAnswer, homeworkImage || undefined);
      setHomeworkResult(result);
    } catch (e) {
      alert("Lỗi khi chấm bài tập. Nguyên Khang thử lại nhé!");
    } finally {
      setIsGrading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomeworkImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswers[currentQIdx] !== undefined) return;
    const updatedAnswers = { ...quizAnswers, [currentQIdx]: idx };
    setQuizAnswers(updatedAnswers);
    setSelectedAns(idx);
    
    // Calculate final score when finished
    if (Object.keys(updatedAnswers).length === questions.length) {
      let finalScore = 0;
      questions.forEach((q, i) => {
        if (updatedAnswers[i] === q.correctAnswer) finalScore++;
      });
      setQuizScore(finalScore);
    }
  };

  const gradingMessages = [
    "Giám khảo AI đang phân tích logic bài làm của Khang...",
    "Kiểm tra tính chính xác của thuật ngữ chuyên môn...",
    "Đối chiếu với đáp án chuẩn của kỳ thi chuyên lớp 10...",
    "Đang tổng hợp điểm số và nhận xét chi tiết..."
  ];

  // Helper Component: Stepper
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
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100 scale-110' 
              : isAnswered(i)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
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
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Kỳ thi vào 10 chuyên</span>
            </div>
            <h2 className="text-4xl font-black mb-4">Phòng luyện thi Chuyên</h2>
            <p className="text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed font-medium">
              Hệ thống mô phỏng đề thi chính thức hoặc gửi bài tập cá nhân để AI chấm điểm chuyên sâu.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => startQuiz(30)}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-8 rounded-[2rem] text-left hover:bg-white/20 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                <h3 className="text-xl font-black mb-2">Trắc nghiệm</h3>
                <p className="text-xs text-slate-400">30 câu đa tầng kiến thức.</p>
              </button>
              <button 
                onClick={startEssayExam}
                className="bg-emerald-600 text-white p-8 rounded-[2rem] text-left hover:scale-[1.02] transition-all shadow-xl shadow-emerald-950/40 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
                <h3 className="text-xl font-black mb-2">Đề thi tự luận</h3>
                <p className="text-emerald-50/70 text-xs">AI soạn đề theo chuẩn chuyên.</p>
              </button>
              <button 
                onClick={startHomeworkMode}
                className="bg-blue-600 text-white p-8 rounded-[2rem] text-left hover:scale-[1.02] transition-all shadow-xl shadow-blue-950/40 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
                <h3 className="text-xl font-black mb-2">Chấm bài tập</h3>
                <p className="text-blue-50/70 text-xs">Gửi đề & bài làm cá nhân cho AI.</p>
              </button>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-[15rem] opacity-5 rotate-12 pointer-events-none">📜</div>
        </div>
      </div>
    );
  }

  // QUIZ VIEW (MCQ)
  if (mode === 'QUIZ') {
    if (quizFinished) {
      return (
        <div className="max-w-3xl mx-auto py-20 text-center space-y-8 animate-fadeIn">
          <div className="text-8xl">🎉</div>
          <h2 className="text-4xl font-black">Kết quả: {quizScore}/{questions.length}</h2>
          <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm text-left">
             <p className="text-slate-600 font-bold leading-relaxed italic">
               {(quizScore / questions.length) >= 0.8 ? "Nguyên Khang nắm kiến thức nền cực kỳ chắc chắn! Hãy tiếp tục duy trì phong độ này." : "Cần xem lại một số nội dung ở mục Học tập nhé Khang. Sai sót là bước đệm của thành công!"}
             </p>
          </div>
          <button onClick={() => setMode(null)} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">QUAY LẠI CHỌN ĐỀ</button>
        </div>
      );
    }

    const currentQ = questions[currentQIdx];
    const answeredInThisQ = quizAnswers[currentQIdx] !== undefined;

    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-800">Luyện tập trắc nghiệm</h2>
          <button onClick={handleExit} className="text-xs font-black text-red-500 uppercase px-4 py-2 hover:bg-red-50 rounded-xl transition-all">Thoát</button>
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

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 min-h-[500px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black mb-10 leading-relaxed text-slate-800">{currentQ?.question}</h3>
            <div className="space-y-4">
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    !answeredInThisQ ? 'border-slate-100 hover:border-emerald-200 hover:bg-emerald-50' :
                    i === currentQ.correctAnswer ? 'border-emerald-500 bg-emerald-50' : 
                    quizAnswers[currentQIdx] === i ? 'border-red-500 bg-red-50' : 'opacity-40 border-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                    !answeredInThisQ ? 'bg-slate-100 text-slate-400' :
                    i === currentQ.correctAnswer ? 'bg-emerald-500 text-white' :
                    quizAnswers[currentQIdx] === i ? 'bg-red-500 text-white' : 'bg-slate-100'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-bold text-lg text-slate-700">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {answeredInThisQ && (
            <div className="mt-10 p-8 bg-slate-900 rounded-[2.5rem] text-white animate-slideUp border-l-8 border-emerald-500">
              <p className="text-emerald-400 font-black text-xs mb-2 uppercase tracking-widest">Phân tích học thuật</p>
              <p className="italic text-slate-300 mb-8 font-medium leading-relaxed">"{currentQ.explanation}"</p>
              <button 
                onClick={() => {
                  if (currentQIdx + 1 < questions.length) {
                    setCurrentQIdx(currentQIdx + 1);
                    setSelectedAns(quizAnswers[currentQIdx + 1] !== undefined ? quizAnswers[currentQIdx + 1] : null);
                  } else setQuizFinished(true);
                }}
                className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-lg shadow-xl shadow-emerald-950/20 hover:bg-emerald-700 transition-all"
              >
                {currentQIdx + 1 === questions.length ? 'XEM TỔNG KẾT' : 'CÂU TIẾP THEO'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ESSAY VIEW (Results and Exam implementation)
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

    if (gradingResult) {
      return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-32">
          {/* Main Results Board */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>
            
            <div className="relative z-10 text-center mb-16">
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Học viện Sinh học KhangBio</p>
              <h2 className="text-4xl font-black text-slate-900 mb-8 italic">BẢNG ĐIỂM NĂNG LỰC CHUYÊN SÂU</h2>
              
              <div className="inline-flex items-center justify-center bg-white p-2 rounded-[3rem] shadow-xl border border-slate-100">
                <div className="px-12 py-8 bg-emerald-600 rounded-[2.5rem] text-white flex flex-col items-center">
                  <span className="text-7xl font-black leading-none">{gradingResult.totalScore.toFixed(1)}</span>
                  <span className="text-xs font-black uppercase tracking-widest mt-2 opacity-80">Điểm tổng kết</span>
                </div>
                <div className="px-10 py-6 text-left max-w-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xếp loại năng lực</p>
                  <p className="text-xl font-black text-slate-800">
                    {gradingResult.totalScore >= 9 ? 'Xuất sắc' : 
                     gradingResult.totalScore >= 8 ? 'Giỏi' : 
                     gradingResult.totalScore >= 6.5 ? 'Khá' : 'Cần cố gắng'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white mb-12 border-l-[12px] border-emerald-500 shadow-lg">
              <h4 className="text-emerald-400 font-black text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                <span>📋</span> Nhận xét tổng quát
              </h4>
              <p className="text-lg font-medium leading-relaxed italic opacity-95">"{gradingResult.overallReview}"</p>
            </div>

            <div className="space-y-12">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 ml-4">
                <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                PHÂN TÍCH TỪNG CÂU HỎI
              </h3>
              
              {gradingResult.feedback.map((f, i) => {
                const originalQuestion = essayExam?.questions.find(q => q.id === f.questionId);
                const originalAnswer = essayAnswers[f.questionId];
                
                return (
                  <div key={i} className="group">
                    <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all">
                      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                             {i+1}
                           </div>
                           <div>
                             <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Câu hỏi {i+1}</h4>
                             <p className="text-lg font-black text-slate-800 tracking-tight">{originalQuestion?.point} điểm</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Điểm AI chấm</span>
                          <span className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-2xl border border-emerald-100">{f.score.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-8">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bài làm của Khang</p>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-black text-slate-800 mb-3">"{originalQuestion?.text}"</p>
                              <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed italic">{originalAnswer || "(Bỏ trống)"}</p>
                            </div>
                          </div>
                          <div className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3">Góp ý từ Giám khảo</p>
                            <p className="text-slate-800 font-bold text-sm leading-relaxed">{f.comment}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Đáp án gợi ý chuẩn Chuyên</p>
                          <div className="p-8 bg-slate-900 rounded-[2rem] text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium h-full border-t-8 border-emerald-500 shadow-inner">
                            {f.suggestedAnswer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setMode(null)}
              className="mt-20 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest"
            >
              HOÀN THÀNH ÔN LUYỆN
            </button>
          </div>
        </div>
      );
    }

    const currentQ = essayExam?.questions[currentEssayIdx];

    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-fadeIn pb-32">
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-8 py-4 rounded-full border border-slate-200 shadow-sm sticky top-4 z-50">
          <button onClick={handleExit} className="text-slate-400 font-bold hover:text-red-500 flex items-center gap-2 transition-colors">
            <span className="text-lg">←</span> Thoát phòng thi
          </button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Thời gian: {essayExam?.duration} PHÚT</span>
            </div>
            <div className="text-xs font-black text-emerald-600 uppercase tracking-widest">ĐANG LÀM BÀI</div>
          </div>
        </div>

        {essayExam && (
          <QuestionStepper 
            count={essayExam.questions.length} 
            currentIndex={currentEssayIdx} 
            setCurrentIndex={setCurrentEssayIdx}
            isAnswered={(idx) => (essayAnswers[essayExam.questions[idx].id]?.trim().length || 0) > 0}
          />
        )}

        <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl border-t-[24px] border-emerald-600 relative overflow-hidden min-h-[700px] flex flex-col">
          <div className="text-center mb-12 space-y-4 relative z-10">
            <h1 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Luyện đề thi thử Chuyên Sinh</h1>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{essayExam?.title}</h2>
            <div className="w-16 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="flex-1 relative z-10 space-y-8">
            {currentQ && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xl border border-emerald-100 shadow-sm">
                    {currentEssayIdx + 1}
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Câu {currentEssayIdx + 1} ({currentQ.point} điểm):</h4>
                </div>
                <div className="text-xl text-slate-800 font-bold leading-relaxed whitespace-pre-wrap pl-8 border-l-6 border-emerald-100 py-2 mb-8">
                  {currentQ.text}
                </div>
                <textarea 
                  value={essayAnswers[currentQ.id] || ''}
                  onChange={(e) => setEssayAnswers(prev => ({...prev, [currentQ.id]: e.target.value}))}
                  placeholder="Nhập lời giải chi tiết tại đây..."
                  className="w-full h-80 p-10 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-lg resize-none shadow-inner leading-relaxed"
                />
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between items-center relative z-10">
            <button
              onClick={() => setCurrentEssayIdx(Math.max(0, currentEssayIdx - 1))}
              disabled={currentEssayIdx === 0}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase disabled:opacity-30 hover:bg-slate-200 transition-all"
            >
              Câu trước
            </button>

            {currentEssayIdx < (essayExam?.questions.length || 0) - 1 ? (
              <button
                onClick={() => setCurrentEssayIdx(currentEssayIdx + 1)}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
              >
                Câu tiếp theo
              </button>
            ) : (
              <div className="text-center">
                {isGrading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-emerald-700 animate-pulse uppercase text-[10px] tracking-widest">{gradingMessages[gradingStep]}</p>
                  </div>
                ) : (
                  <button 
                    onClick={submitEssay}
                    className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-black shadow-2xl transition-all uppercase tracking-widest"
                  >
                    Nộp bài và chấm điểm
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // HOMEWORK MODE
  if (mode === 'HOMEWORK') {
    if (homeworkResult) {
      return (
        <div className="max-w-4xl mx-auto py-10 animate-fadeIn">
          <button onClick={() => setHomeworkResult(null)} className="mb-4 font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-2">← Quay lại</button>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200">
             <div className="text-center mb-10">
               <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full border-4 border-emerald-500 mb-4">
                 <span className="text-4xl font-black text-emerald-600">{homeworkResult.score}</span>
               </div>
               <h3 className="text-2xl font-black text-slate-800 italic">"{homeworkResult.score >= 8 ? 'Xuất sắc' : 'Khá tốt'}"</h3>
             </div>
             <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Nhận xét chi tiết</h4>
                  <p className="text-slate-800 font-bold leading-relaxed">{homeworkResult.detailedFeedback}</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                  <h4 className="text-emerald-400 font-black text-xs uppercase mb-2 tracking-widest">Đáp án mẫu chuẩn chuyên</h4>
                  <p className="text-slate-300 font-medium whitespace-pre-wrap italic">{homeworkResult.suggestedModelAnswer}</p>
                </div>
             </div>
             <button onClick={() => setMode(null)} className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-lg">HOÀN THÀNH</button>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-8 animate-fadeIn">
        <button onClick={() => setMode(null)} className="font-bold text-slate-500 hover:text-red-500 transition-colors">← Thoát</button>
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">1. Đề bài</label>
            <textarea value={homeworkQuestion} onChange={(e) => setHomeworkQuestion(e.target.value)} placeholder="Nhập đề bài..." className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:border-emerald-500 transition-all outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">2. Bài làm của Khang</label>
            <textarea value={homeworkAnswer} onChange={(e) => setHomeworkAnswer(e.target.value)} placeholder="Nhập lời giải..." className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:border-emerald-500 transition-all outline-none" />
          </div>
          <button onClick={submitHomeworkForGrading} disabled={isGrading} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
            {isGrading ? 'ĐANG CHẤM ĐIỂM...' : 'GỬI BÀI VÀ CHẤM ĐIỂM'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizModule;
