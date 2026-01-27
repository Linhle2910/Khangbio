
import React from 'react';
import { STUDY_PLAN_DATA } from '../constants';

const StudyPlan: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-800">Lộ Trình Ôn Thi Chuyên Sinh</h2>
        <p className="text-slate-500 mt-2">13 tuần bứt phá kiến thức lớp 8 & 9</p>
      </div>

      <div className="relative border-l-4 border-emerald-100 ml-4 md:ml-8 space-y-12">
        {STUDY_PLAN_DATA.map((plan, idx) => (
          <div key={plan.week} className="relative pl-10">
            {/* Timeline Dot */}
            <div className="absolute -left-[26px] top-0 w-12 h-12 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-emerald-600 shadow-sm z-10">
              {plan.week}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  Tuần {plan.week}: {plan.title}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full text-slate-500">
                  {plan.week <= 6 ? 'Trọng tâm Lớp 8' : plan.week <= 12 ? 'Trọng tâm Lớp 9' : 'Giai đoạn nước rút'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chủ đề chính</h4>
                  <ul className="space-y-2">
                    {plan.topics.map((t, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dạng bài tập</h4>
                  <ul className="space-y-2">
                    {plan.exercises.map((e, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✎</span> {e}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tài liệu gợi ý</h4>
                  <p className="text-sm text-slate-700 font-medium italic">
                    {plan.reference}
                  </p>
                  <button className="mt-4 w-full bg-white border border-slate-200 text-slate-600 text-xs py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all font-bold">
                    TẢI TÀI LIỆU
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlan;
