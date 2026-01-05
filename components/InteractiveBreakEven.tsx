import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle2, DollarSign, RefreshCw, XCircle } from 'lucide-react';

const InteractiveBreakEven: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState<number>(10000);
  const [variableCost, setVariableCost] = useState<number>(15);
  const [price, setPrice] = useState<number>(40);
  const [breakEvenUnits, setBreakEvenUnits] = useState<number>(0);
  const [breakEvenRevenue, setBreakEvenRevenue] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (price <= variableCost) {
      setError('سعر البيع يجب أن يكون أكبر من التكلفة المتغيرة لتحقيق ربح.');
      setBreakEvenUnits(0);
      setBreakEvenRevenue(0);
    } else {
      setError('');
      const units = fixedCosts / (price - variableCost);
      setBreakEvenUnits(Math.ceil(units));
      setBreakEvenRevenue(Math.ceil(units) * price);
    }
  }, [fixedCosts, variableCost, price]);

  return (
    <div className="space-y-10">
      
      {/* 1. Definition & Importance */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
            <TrendingUp className="text-indigo-600" />
            تحليل نقطة التعادل (Break-Even Point)
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            هي النقطة التي تتساوى فيها <span className="font-bold text-indigo-700">إجمالي الإيرادات</span> مع <span className="font-bold text-red-600">إجمالي التكاليف</span>. 
            عند هذه النقطة، لا يحقق المشروع ربحاً ولا خسارة (الربح = صفر).
            أي مبيعات بعد هذه النقطة تعتبر <span className="font-bold text-emerald-600">ربحاً صافياً</span>.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500"/> لماذا هي مهمة؟
              </h4>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>تحديد الحد الأدنى للمبيعات لتجنب الخسارة.</li>
                <li>تساعد في تسعير المنتجات بشكل صحيح.</li>
                <li>تستخدم لتقييم جدوى المشروع قبل البدء.</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500"/> ماذا لو لم نصل لها؟
              </h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                 إذا كانت مبيعاتك أقل من نقطة التعادل، فالمشروع <span className="font-bold text-red-500">يخسر</span> ويستنزف رأس المال. يجب عليك إما زيادة المبيعات، رفع السعر، أو تقليل التكاليف.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Formula */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <h4 className="text-indigo-300 font-bold mb-6 text-sm tracking-widest uppercase">المعادلة الرياضية</h4>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-2xl md:text-3xl font-black font-mono dir-ltr mb-4">
          <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/20">
             نقطة التعادل
             <span className="block text-xs font-sans text-slate-400 mt-1 font-normal">(بالوحدات)</span>
          </div>
          <span className="text-slate-400">=</span>
          <div className="flex flex-col items-center gap-2">
             <div className="px-4 py-2 border-b-2 border-white/30 w-full text-center">التكاليف الثابتة</div>
             <div className="px-4 py-2 text-xl md:text-2xl text-emerald-400 w-full text-center">
               (سعر البيع - التكلفة المتغيرة)
             </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm mt-4">
          *المقام (السعر - التكلفة المتغيرة) يسمى <span className="text-emerald-400 font-bold">هامش المساهمة</span>.
        </p>
      </div>

      {/* 3. Interactive Calculator */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-lg">
         <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
           <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
             <Calculator size={24} />
           </div>
           <div>
             <h3 className="text-xl font-bold text-slate-900">حاسبة نقطة التعادل</h3>
             <p className="text-sm text-slate-500">جرب تغيير الأرقام لترى متى يبدأ مشروعك بالربح</p>
           </div>
         </div>

         <div className="grid lg:grid-cols-2 gap-10">
           {/* Inputs */}
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">التكاليف الثابتة (شهرياً/سنوياً)</label>
               <div className="relative">
                 <input 
                   type="number" 
                   value={fixedCosts}
                   onChange={e => setFixedCosts(Number(e.target.value))}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-700"
                 />
                 <DollarSign size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
               </div>
               <p className="text-xs text-slate-400 mt-1">مثل: الإيجار، الرواتب، التأمين (لا تتغير بتغير الإنتاج).</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">سعر بيع الوحدة</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-700"
                    />
                    <DollarSign size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">التكلفة المتغيرة للوحدة</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={variableCost}
                      onChange={e => setVariableCost(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-700"
                    />
                    <DollarSign size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">مواد خام، تغليف، شحن.</p>
               </div>
             </div>

             {error && (
               <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                 <XCircle size={16} />
                 {error}
               </div>
             )}
           </div>

           {/* Results */}
           <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center border border-slate-200">
              <div className="text-slate-500 font-bold mb-4">أنت بحاجة لبيع:</div>
              
              <div className="relative mb-6 group">
                <div className="text-5xl md:text-6xl font-black text-indigo-600 transition-transform group-hover:scale-110 duration-300">
                  {breakEvenUnits.toLocaleString()}
                </div>
                <div className="text-sm font-bold text-slate-400 text-center uppercase mt-1">وحدة / منتج</div>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="text-slate-500 font-bold mt-2 mb-2">لتحقيق إيرادات تساوي:</div>
              <div className="text-2xl font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                {breakEvenRevenue.toLocaleString()} $
              </div>
              
              <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
                * عند بيع الوحدة رقم <span className="font-bold text-slate-700">{breakEvenUnits + 1}</span>، ستبدأ بتحقيق ربح قدره <span className="font-bold text-emerald-600">{price - variableCost}$</span>.
              </p>
           </div>
         </div>
      </div>

    </div>
  );
};

export default InteractiveBreakEven;