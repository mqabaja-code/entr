import React, { useState } from 'react';
import { MapPin, Truck, Settings, ShieldCheck, Monitor, Calculator, CalendarClock, GripHorizontal } from 'lucide-react';

interface LocationCriteria {
  id: number;
  name: string;
  weight: number; // Importance 1-5
  scoreA: number; // Score for Location A
  scoreB: number; // Score for Location B
}

interface Task {
  id: number;
  name: string;
  startMonth: number; // 1-12
  duration: number; // in months
}

const InteractiveOperations: React.FC = () => {
  // Location Matrix State
  const [criteria, setCriteria] = useState<LocationCriteria[]>([
    { id: 1, name: 'القرب من السوق المستهدف', weight: 5, scoreA: 0, scoreB: 0 },
    { id: 2, name: 'توفر الطرق ووسائل المواصلات', weight: 4, scoreA: 0, scoreB: 0 },
    { id: 3, name: 'القرب من مناطق تجمع العمالة', weight: 3, scoreA: 0, scoreB: 0 },
    { id: 4, name: 'توفر الخدمات (كهرباء، ماء، انترنت)', weight: 5, scoreA: 0, scoreB: 0 },
    { id: 5, name: 'تكاليف الإيجار', weight: 4, scoreA: 0, scoreB: 0 },
  ]);

  // Gantt Chart State
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: '1 - التراخيص الحكومية', startMonth: 1, duration: 2 },
    { id: 2, name: '2 - ترتيبات تمويل المشروع', startMonth: 2, duration: 2 },
    { id: 3, name: '3 - تعيين إدارة المشروع', startMonth: 3, duration: 1 },
    { id: 4, name: '4 - عقود استيراد الماكينات', startMonth: 3, duration: 1 },
    { id: 5, name: '5 - المباني والإنشاءات', startMonth: 4, duration: 3 },
    { id: 6, name: '6 - استيراد الماكينات والمعدات', startMonth: 5, duration: 2 },
    { id: 7, name: '7 - توفير المواد الخام', startMonth: 7, duration: 1 },
    { id: 8, name: '8 - توفير السيارات والمواصلات', startMonth: 7, duration: 1 },
    { id: 9, name: '9 - توظيف العمالة', startMonth: 7, duration: 1 },
    { id: 10, name: '10 - تركيب الآلات والمعدات', startMonth: 8, duration: 1 },
    { id: 11, name: '11 - التشغيل التجريبي', startMonth: 9, duration: 1 },
  ]);

  const updateScore = (id: number, field: 'scoreA' | 'scoreB', value: number) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateTask = (id: number, field: 'startMonth' | 'duration', value: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const totalA = criteria.reduce((sum, c) => sum + (c.scoreA * c.weight), 0);
  const totalB = criteria.reduce((sum, c) => sum + (c.scoreB * c.weight), 0);

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  return (
    <div className="space-y-10">
      
      {/* Implementation Plan (Gantt Chart) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
               <CalendarClock size={24}/>
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-900">جدولة تنفيذ المشروع (Gantt Chart)</h3>
               <p className="text-sm text-slate-500">تحديد إطار زمني لتنفيذ كامل خطوات بناء المشروع</p>
             </div>
           </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Months */}
            <div className="grid grid-cols-12 gap-1 mb-4 border-b-2 border-slate-200 pb-2">
              <div className="col-span-4 font-bold text-slate-700 pr-4">النشاط / Activity</div>
              {months.slice(0, 10).map((m, i) => ( // Showing first 10 months to fit slide style or keep 12
                 <div key={i} className="col-span-1 text-center text-xs font-bold text-slate-500 border-r border-slate-100 last:border-0 transform -rotate-0 md:rotate-0">
                   {m} <br/><span className="text-[10px] opacity-60">({i+1})</span>
                 </div>
              ))}
            </div>

            {/* Task Rows */}
            <div className="space-y-2">
              {tasks.map((task) => {
                 // Calculate grid positioning
                 // We have 12 cols total. First 4 are for name. Remaining 8 are for time? 
                 // Let's use flex or specific grid.
                 // Better: Use a 14 column grid (4 for name, 10 for months as per slide)
                 return (
                   <div key={task.id} className="grid grid-cols-12 gap-1 items-center hover:bg-slate-50 p-1 rounded-lg transition-colors">
                     {/* Task Name */}
                     <div className="col-span-4 text-xs font-bold text-slate-700 pr-2 truncate" title={task.name}>
                       {task.name}
                     </div>
                     
                     {/* Timeline Bars */}
                     {Array.from({ length: 8 }).map((_, i) => { // Using 8 columns for months 1-8 approximately to match space
                        const monthIndex = i + 1;
                        const isActive = monthIndex >= task.startMonth && monthIndex < (task.startMonth + task.duration);
                        
                        return (
                          <div key={i} className="col-span-1 h-8 flex items-center justify-center border-r border-slate-100 relative">
                             {isActive && (
                               <div className="w-full h-4 bg-yellow-400 border border-slate-400 shadow-sm rounded-sm"></div>
                             )}
                          </div>
                        );
                     })}
                   </div>
                 );
              })}
            </div>

            {/* Interactive Editors */}
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
               <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2"><Settings size={16}/> تعديل الجدول الزمني</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                 {tasks.map(task => (
                   <div key={task.id} className="flex items-center gap-2 text-xs bg-white p-2 rounded border border-slate-200">
                      <span className="w-6 font-bold">{task.id}</span>
                      <span className="flex-1 truncate">{task.name}</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                        <span>بدء:</span>
                        <input 
                          type="number" min="1" max="12" 
                          value={task.startMonth}
                          onChange={(e) => updateTask(task.id, 'startMonth', Number(e.target.value))}
                          className="w-8 text-center bg-white border border-slate-300 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                        <span>مدة:</span>
                        <input 
                          type="number" min="1" max="12" 
                          value={task.duration}
                          onChange={(e) => updateTask(task.id, 'duration', Number(e.target.value))}
                          className="w-8 text-center bg-white border border-slate-300 rounded"
                        />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Matrix Tool */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><MapPin size={24}/></div>
          <h3 className="text-xl font-bold text-slate-800">مصفوفة اختيار موقع المشروع</h3>
        </div>
        
        <p className="text-slate-500 mb-6 text-sm">
          أداة لمساعدتك في المفاضلة بين موقعين محتملين بناءً على المعايير المذكورة في الدرس. قم بتقييم كل موقع من 1 إلى 5.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="p-4 rounded-r-xl">المعيار</th>
                <th className="p-4 text-center">الأهمية (الوزن)</th>
                <th className="p-4 text-center bg-blue-50/50">الموقع (أ)</th>
                <th className="p-4 text-center rounded-l-xl bg-emerald-50/50">الموقع (ب)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-medium text-slate-800">{c.name}</td>
                  <td className="p-4 text-center text-slate-500">{c.weight}</td>
                  <td className="p-4 text-center bg-blue-50/10">
                    <input 
                      type="number" min="0" max="5"
                      className="w-16 p-2 text-center border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={c.scoreA}
                      onChange={(e) => updateScore(c.id, 'scoreA', Number(e.target.value))}
                    />
                  </td>
                  <td className="p-4 text-center bg-emerald-50/10">
                    <input 
                      type="number" min="0" max="5"
                      className="w-16 p-2 text-center border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={c.scoreB}
                      onChange={(e) => updateScore(c.id, 'scoreB', Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-lg">
                <td className="p-4">النتيجة النهائية (الوزن × التقييم)</td>
                <td className="p-4"></td>
                <td className={`p-4 text-center ${totalA > totalB ? 'text-blue-600 bg-blue-50 rounded-lg' : 'text-slate-400'}`}>
                  {totalA}
                  {totalA > totalB && <span className="block text-xs mt-1">الموقع الأفضل</span>}
                </td>
                <td className={`p-4 text-center ${totalB > totalA ? 'text-emerald-600 bg-emerald-50 rounded-lg' : 'text-slate-400'}`}>
                  {totalB}
                  {totalB > totalA && <span className="block text-xs mt-1">الموقع الأفضل</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Truck size={20}/></div>
              <h4 className="font-bold text-lg">سلسلة التوريد (Supply Chain)</h4>
           </div>
           <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex gap-2"><span className="text-orange-500">•</span> من هم الموردون الرئيسيون للمواد الخام؟</li>
             <li className="flex gap-2"><span className="text-orange-500">•</span> هل لديك موردين بدلاء في حال الطوارئ؟</li>
             <li className="flex gap-2"><span className="text-orange-500">•</span> كيف ستتم عملية تخزين المواد؟</li>
           </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Monitor size={20}/></div>
              <h4 className="font-bold text-lg">الخطة التقنية (Technology)</h4>
           </div>
           <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex gap-2"><span className="text-purple-500">•</span> ما هي البرامج والأجهزة التي يحتاجها فريقك؟</li>
             <li className="flex gap-2"><span className="text-purple-500">•</span> هل تحتاج موقع إلكتروني أو تطبيق؟</li>
             <li className="flex gap-2"><span className="text-purple-500">•</span> كيف ستحمي بيانات العملاء؟</li>
           </ul>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><ShieldCheck size={20}/></div>
              <h4 className="font-bold text-lg">الجودة والإنتاج</h4>
           </div>
           <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex gap-2"><span className="text-emerald-500">•</span> تحديد الطاقة الإنتاجية اليومية.</li>
             <li className="flex gap-2"><span className="text-emerald-500">•</span> وضع معايير صارمة لفحص المنتج قبل بيعه.</li>
             <li className="flex gap-2"><span className="text-emerald-500">•</span> خطة صيانة دورية للمعدات.</li>
           </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><Calculator size={20}/></div>
              <h4 className="font-bold text-lg">التحكم المالي</h4>
           </div>
           <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex gap-2"><span className="text-rose-500">•</span> نظام إصدار الفواتير (إلكتروني/يدوي).</li>
             <li className="flex gap-2"><span className="text-rose-500">•</span> سياسات التعامل مع النقد (Cash Handling).</li>
             <li className="flex gap-2"><span className="text-rose-500">•</span> إجراءات التدقيق لمنع الغش والاحتيال.</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default InteractiveOperations;