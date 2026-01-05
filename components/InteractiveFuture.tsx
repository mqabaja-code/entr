import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, LogOut, Shield, Telescope, Plus, Trash2, Info, Target, Users, DollarSign, MapPin, Layers } from 'lucide-react';

interface Risk {
  id: number;
  name: string;
  prob: number; // 1-5
  impact: number; // 1-5
}

const InteractiveFuture: React.FC = () => {
  // Vision Goals State
  const [visionGoals, setVisionGoals] = useState({
    branches: '',
    financial: '',
    marketShare: '',
    products: '',
    employees: ''
  });

  // Risk Matrix Logic
  const [risks, setRisks] = useState<Risk[]>([
    { id: 1, name: 'المنافسة الشرسة في السوق', prob: 4, impact: 4 },
    { id: 2, name: 'تدهور الوضع المالي ونقص السيولة', prob: 3, impact: 5 },
    { id: 3, name: 'مشاكل في الإنتاج أو الموردين', prob: 2, impact: 4 },
    { id: 4, name: 'انخفاض الطلب على الخدمات', prob: 2, impact: 5 },
    { id: 5, name: 'التسرب الوظيفي (ترك الموظفين للعمل)', prob: 3, impact: 3 },
  ]);

  const [newRisk, setNewRisk] = useState({ name: '', prob: 3, impact: 3 });

  const addRisk = () => {
    if (!newRisk.name.trim()) return;
    setRisks([...risks, { id: Date.now(), ...newRisk }]);
    setNewRisk({ name: '', prob: 3, impact: 3 });
  };

  const removeRisk = (id: number) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  // Helper to get color class based on score
  const getRiskColorClass = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score >= 15) return 'bg-red-500'; // High Risk
    if (score >= 8) return 'bg-yellow-400'; // Medium Risk
    return 'bg-emerald-400'; // Low Risk
  };

  const getRiskLabel = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score >= 15) return 'مرتفع';
    if (score >= 8) return 'متوسط';
    return 'منخفض';
  };

  return (
    <div className="space-y-12">
      
      {/* Vision Section - Detailed Dimensions */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white p-8 relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
           <div className="relative z-10">
             <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
               <Telescope className="text-violet-300" />
               توضيح الرؤية المستقبلية والأهداف (5-10 سنوات)
             </h3>
             <p className="text-indigo-200 text-lg">
               القدرة على تخيل شكل مشروعك وعملك خلال 5 أو 10 سنوات. قم بتحديد أهدافك في الجوانب الخمسة الرئيسية:
             </p>
           </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { id: 'branches', label: 'عدد الفروع والمواقع', icon: MapPin, placeholder: 'كم فرعاً ستملك وأين؟' },
             { id: 'financial', label: 'الوضع المالي (الإيرادات/الأرباح)', icon: DollarSign, placeholder: 'ما هو حجم الإيرادات المتوقع؟' },
             { id: 'marketShare', label: 'حصتك في السوق', icon: Target, placeholder: 'كم نسبة سيطرتك على السوق؟' },
             { id: 'products', label: 'المنتجات والخدمات الجديدة', icon: Layers, placeholder: 'ماذا ستضيف من منتجات؟' },
             { id: 'employees', label: 'عدد الموظفين', icon: Users, placeholder: 'كم سيبلغ حجم فريقك؟' },
           ].map((field) => (
             <div key={field.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 focus-within:ring-2 ring-indigo-500/20 transition-all">
               <label className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                 <field.icon size={18} className="text-indigo-600" />
                 {field.label}
               </label>
               <input 
                 className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 transition-colors"
                 placeholder={field.placeholder}
                 value={visionGoals[field.id as keyof typeof visionGoals]}
                 onChange={e => setVisionGoals({...visionGoals, [field.id]: e.target.value})}
               />
             </div>
           ))}
           
           {/* Summary Card */}
           <div className="bg-indigo-600 p-6 rounded-xl text-white flex flex-col justify-center items-center text-center">
             <TrendingUp size={32} className="mb-2 text-indigo-300" />
             <h4 className="font-bold mb-1">النمو المستهدف</h4>
             <p className="text-xs text-indigo-200 opacity-80">رؤية واضحة = مستقبل مشرق</p>
           </div>
        </div>
      </div>

      {/* Risk Analysis Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Shield size={24}/></div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">توقع المخاطر المستقبلية (Risk Matrix)</h3>
              <p className="text-sm text-slate-500">القدرة على تخيل المخاطر المستقبلية وكيفية مواجهتها</p>
            </div>
         </div>
         
         <div className="grid lg:grid-cols-2 gap-8 items-start relative z-10">
            
            {/* Input & List Section */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                <h4 className="font-bold text-slate-700 mb-4 text-sm flex items-center gap-2">
                  <Plus size={16} /> إضافة خطر جديد
                </h4>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="وصف الخطر (مثال: دخول منافس قوي)"
                        className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                        value={newRisk.name}
                        onChange={e => setNewRisk({...newRisk, name: e.target.value})}
                    />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 mb-2">الاحتمالية (1-5)</label>
                            <input 
                                type="range" min="1" max="5" 
                                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                value={newRisk.prob}
                                onChange={e => setNewRisk({...newRisk, prob: Number(e.target.value)})}
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                                <span>نادر</span>
                                <span>مؤكد</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 mb-2">الأثر (1-5)</label>
                            <input 
                                type="range" min="1" max="5" 
                                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                value={newRisk.impact}
                                onChange={e => setNewRisk({...newRisk, impact: Number(e.target.value)})}
                            />
                             <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                                <span>بسيط</span>
                                <span>كارثي</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={addRisk}
                        className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                        إضافة للقائمة
                    </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {risks.map((risk) => (
                  <div key={risk.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                        <div className="font-bold text-slate-700 text-sm mb-1">{risk.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                            <span className="bg-slate-100 px-2 py-0.5 rounded">P: {risk.prob}</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded">I: {risk.impact}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold text-white shadow-sm ${getRiskColorClass(risk.prob, risk.impact)}`}>
                            {getRiskLabel(risk.prob, risk.impact)}
                        </span>
                        <button 
                            onClick={() => removeRisk(risk.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* The Matrix Visualization */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg">
               <div className="text-center mb-4 text-slate-800 font-bold">خريطة المخاطر الحرارية</div>
               <div className="relative aspect-square w-full max-w-md mx-auto">
                   <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400 tracking-widest uppercase">
                       الاحتمالية
                   </div>
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 tracking-widest uppercase">
                       الأثر (Impact)
                   </div>

                   <div className="grid grid-cols-5 grid-rows-5 gap-1.5 h-full w-full bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                     {Array.from({ length: 5 }).map((_, rowIdx) => {
                       const prob = 5 - rowIdx; 
                       return Array.from({ length: 5 }).map((_, colIdx) => {
                         const impact = colIdx + 1; 
                         const colorClass = getRiskColorClass(prob, impact);
                         const cellRisks = risks.filter(r => r.prob === prob && r.impact === impact);
                         const hasRisks = cellRisks.length > 0;
                         
                         return (
                           <div 
                             key={`${prob}-${impact}`} 
                             className={`
                               rounded-lg relative group transition-all duration-300 flex items-center justify-center border
                               ${colorClass} ${hasRisks ? 'bg-opacity-90 scale-105 shadow-md border-white/50 z-10' : 'bg-opacity-10 border-transparent'}
                             `}
                             title={cellRisks.map(r => r.name).join('\n')}
                           >
                             {hasRisks && (
                                 <span className="font-bold text-white text-lg drop-shadow-md">
                                     {cellRisks.length}
                                 </span>
                             )}
                           </div>
                         );
                       });
                     })}
                   </div>
               </div>
            </div>
         </div>
      </div>

      {/* Exit Strategies */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><LogOut size={24}/></div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">استراتيجيات الخروج (Exit Strategy)</h3>
              <p className="text-sm text-slate-500">سيناريوهات المستقبل: ماذا لو حدث خلاف؟ أو أردت بيع الشركة؟</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {[
             { title: 'الاستحواذ (Acquisition)', desc: 'شركة أخرى تشتري شركتك.' },
             { title: 'الاندماج (Merger)', desc: 'الانضمام إلى شركة موجودة لتكوين كيان أكبر.' },
             { title: 'الامتياز (Franchise)', desc: 'بيع حقوق التراخيص للآخرين (مثل المطاعم).' },
             { title: 'التسليم (Succession)', desc: 'منح الشركة للأبناء أو الجيل الثاني.' },
             { title: 'الإغلاق (Liquidation)', desc: 'إنهاء لكافة العمليات وشعور بالخسارة.' },
             { title: 'الطرح العام (IPO)', desc: 'بيع الأسهم للجمهور في البورصة.' }
           ].map((item, idx) => (
             <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:w-4 transition-all"></div>
                 <h4 className="font-bold text-indigo-900">{item.title}</h4>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed pr-4">{item.desc}</p>
             </div>
           ))}
         </div>
      </div>

    </div>
  );
};

export default InteractiveFuture;