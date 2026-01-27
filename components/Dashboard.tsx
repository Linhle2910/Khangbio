
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
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Chào Nguyên Khang!</h2>
          <p className="text-emerald-50 text-lg opacity-90 max-w-lg">Cùng tiếp tục hành trình chinh phục kỳ thi vào lớp 10 Chuyên Sinh nào. Mục tiêu hôm nay: Hệ thần kinh & Giác quan.</p>
          <div className="mt-8 flex gap-4">
            <button className="bg-white text-emerald-700 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-colors">Học bài mới</button>
            <button className="bg-emerald-700/30 backdrop-blur-md text-white border border-emerald-400/30 px-6 py-2 rounded-xl font-bold hover:bg-emerald-700/50 transition-colors">Xem lại đề thi</button>
          </div>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] text-[180px] opacity-10 rotate-12 pointer-events-none">🧬</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl">📈</div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Điểm TB</p>
            <p className="text-2xl font-black text-slate-800">8.6</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl">✅</div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Bài đã học</p>
            <p className="text-2xl font-black text-slate-800">24/45</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-2xl">🔥</div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Streak</p>
            <p className="text-2xl font-black text-slate-800">12 ngày</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black mb-8 flex items-center gap-2 text-slate-800">
            <span>📊</span> Năng lực theo nhóm kiến thức
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} width={100} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-slate-800">
            <span>⏰</span> Nhắc nhở
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-xl">
              <p className="text-xs font-black text-orange-700 uppercase">Ưu tiên cao</p>
              <p className="text-sm font-bold text-slate-800 mt-1">Ôn tập Di truyền học Mendel</p>
              <p className="text-[10px] text-slate-500">Cần làm thêm 2 đề tự luận</p>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-xl">
              <p className="text-xs font-black text-blue-700 uppercase">Mục tiêu tuần</p>
              <p className="text-sm font-bold text-slate-800 mt-1">Hoàn thành Hệ Nội Tiết</p>
              <p className="text-[10px] text-slate-500">Chưa bắt đầu bài giảng chi tiết</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
