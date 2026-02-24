
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Di truyền', score: 85, color: '#10b981' },
  { name: 'Tế bào', score: 72, color: '#3b82f6' },
  { name: 'Sinh lý người', score: 90, color: '#f59e0b' },
  { name: 'Sinh thái', score: 65, color: '#ef4444' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-500 p-10 md:p-14 rounded-[3rem] text-white shadow-2xl shadow-emerald-200/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">Chào Nguyên Khang!</h2>
          <p className="text-emerald-50 text-lg md:text-xl opacity-90 max-w-xl leading-relaxed font-medium">Cùng tiếp tục hành trình chinh phục kỳ thi vào lớp 10 Chuyên Sinh nào. Mục tiêu hôm nay: <span className="underline underline-offset-8 decoration-emerald-300/50">Hệ thần kinh & Giác quan</span>.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95 shadow-lg shadow-emerald-900/10">Học bài mới</button>
            <button className="bg-emerald-700/30 backdrop-blur-md text-white border border-emerald-400/30 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700/50 transition-all active:scale-95">Xem lại đề thi</button>
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] text-[180px] opacity-10 rotate-12 pointer-events-none select-none">🧬</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-slate-100 flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📈</div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Điểm TB</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">8.6</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-slate-100 flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">✅</div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Bài đã học</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">24/45</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-slate-100 flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🔥</div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Streak</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">12 ngày</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] card-shadow border border-slate-100">
          <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-slate-900 uppercase tracking-tight">
            <span className="text-2xl">📊</span> Năng lực theo nhóm kiến thức
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b', textAnchor: 'end' }} width={110} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                />
                <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] card-shadow border border-slate-100">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-900 uppercase tracking-tight">
            <span className="text-2xl">⏰</span> Nhắc nhở
          </h3>
          <div className="space-y-6">
            <div className="p-6 bg-orange-50 border-l-4 border-orange-500 rounded-2xl hover:bg-orange-100/50 transition-colors">
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-2">Ưu tiên cao</p>
              <p className="text-base font-black text-slate-900 leading-tight">Ôn tập Di truyền học Mendel</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Cần làm thêm 2 đề tự luận</p>
            </div>
            <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-2xl hover:bg-blue-100/50 transition-colors">
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">Mục tiêu tuần</p>
              <p className="text-base font-black text-slate-900 leading-tight">Hoàn thành Hệ Nội Tiết</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Chưa bắt đầu bài giảng chi tiết</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
