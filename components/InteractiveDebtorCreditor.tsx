import React, { useState } from 'react';
import { 
  ArrowRightLeft, UserMinus, UserPlus, Wallet, 
  TrendingUp, TrendingDown, Building, Coins, 
  HelpCircle, Check, X
} from 'lucide-react';

interface Term {
  id: number;
  name: string;
  type: 'debit' | 'credit'; // debit = مدين, credit = دائن
  hint: string;
}

const TERMS: Term[] = [
  { id: 1, name: 'الصندوق / النقدية (Assets)', type: 'debit', hint: 'أصل تملكه الشركة (أخذ قيمة)' },
  { id: 2, name: 'رأس المال (Capital)', type: 'credit', hint: 'التزام الشركة تجاه المالك (أعطى قيمة)' },
  { id: 3, name: 'القروض البنكية', type: 'credit', hint: 'أموال أخذتها من البنك وعليك إعادتها' },
  { id: 4, name: 'السيارات والمعدات', type: 'debit', hint: 'ممتلكات (أصول ثابتة)' },
  { id: 5, name: 'الموردون (Suppliers)', type: 'credit', hint: 'أشخاص أعطوك بضاعة ولم تدفع لهم بعد' },
  { id: 6, name: 'العملاء (Receivables)', type: 'debit', hint: 'أشخاص أخذوا منك بضاعة ولم يدفعوا بعد' },
  { id: 7, name: 'المصروفات (Expenses)', type: 'debit', hint: 'أموال خرجت مقابل خدمة (مثل الإيجار)' },
  { id: 8, name: 'الإيرادات / المبيعات', type: 'credit', hint: 'مصدر دخل الشركة (زيادة في الملكية)' },
];

const InteractiveDebtorCreditor: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [classified, setClassified] = useState<{debit: Term[], credit: Term[]}>({ debit: [], credit: [] });

  const handleClassify = (term: Term, target: 'debit' | 'credit') => {
    if (term.type === target) {
      setFeedback('correct');
      setClassified(prev => ({
        ...prev,
        [target]: [...prev[target], term]
      }));
      setTimeout(() => {
        setFeedback(null);
        setSelectedTerm(null);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const remainingTerms = TERMS.filter(t => 
    !classified.debit.find(x => x.id === t.id) && 
    !classified.credit.find(x => x.id === t.id)
  );

  return (
    <div className="space-y-12">
      
      {/* 1. Concept Introduction */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
          <ArrowRightLeft className="text-slate-400" />
          مفهوم الدائن والمدين
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* DEBIT SIDE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-50 rounded-2xl transform rotate-2 transition-transform group-hover:rotate-1"></div>
            <div className="relative bg-white border-2 border-indigo-100 p-6 rounded-2xl text-center hover:border-indigo-300 transition-colors">
              <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <UserPlus size={32} />
              </div>
              <h4 className="text-xl font-black text-indigo-700 mb-2">المدين (Debit)</h4>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">DR - منه</div>
              <p className="text-slate-600 leading-relaxed mb-4">
                هو الطرف الذي <span className="font-bold text-indigo-600">أخذ</span> القيمة أو المنفعة.
                <br/>
                (عليه فلوس أو استلم أصل).
              </p>
              <div className="bg-indigo-50 py-2 px-4 rounded-lg text-xs font-bold text-indigo-800">
                الأخذ = مدين
              </div>
            </div>
          </div>

          {/* CREDIT SIDE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-50 rounded-2xl transform -rotate-2 transition-transform group-hover:-rotate-1"></div>
            <div className="relative bg-white border-2 border-emerald-100 p-6 rounded-2xl text-center hover:border-emerald-300 transition-colors">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <UserMinus size={32} />
              </div>
              <h4 className="text-xl font-black text-emerald-700 mb-2">الدائن (Credit)</h4>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">CR - له</div>
              <p className="text-slate-600 leading-relaxed mb-4">
                هو الطرف الذي <span className="font-bold text-emerald-600">أعطى</span> القيمة أو المنفعة.
                <br/>
                (له فلوس أو قدم خدمة).
              </p>
              <div className="bg-emerald-50 py-2 px-4 rounded-lg text-xs font-bold text-emerald-800">
                العاطي = دائن
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Classification Game */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 text-center mb-8">
          <h3 className="text-white text-xl font-bold mb-2 flex items-center justify-center gap-2">
            <Coins className="text-yellow-400" />
            اختبر فهمك: صنف الحسابات
          </h3>
          <p className="text-slate-400 text-sm">اضغط على المصطلح ثم اختر مكانه الصحيح (مدين أم دائن)</p>
        </div>

        {/* Game Area */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Debit Bucket */}
          <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-4 min-h-[300px] flex flex-col relative">
            <div className="text-indigo-400 font-bold text-center mb-4 pb-2 border-b border-indigo-500/20">
              مدين (Debit)
              <span className="block text-xs text-slate-500 font-normal mt-1">الأصول، المصروفات، المسحوبات</span>
            </div>
            <div className="flex-1 space-y-2">
              {classified.debit.map(t => (
                <div key={t.id} className="bg-indigo-600 text-white p-3 rounded-lg text-sm font-bold shadow-lg animate-fade-in flex items-center justify-between">
                  {t.name}
                  <Check size={16} className="text-indigo-300" />
                </div>
              ))}
              {selectedTerm && (
                <button 
                  onClick={() => handleClassify(selectedTerm, 'debit')}
                  className="w-full h-12 border-2 border-dashed border-indigo-500/50 rounded-lg flex items-center justify-center text-indigo-300 hover:bg-indigo-500/20 transition-colors animate-pulse"
                >
                  ضع هنا
                </button>
              )}
            </div>
          </div>

          {/* Source Terms */}
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            {remainingTerms.length > 0 ? (
              <>
                <div className="text-slate-400 text-xs mb-2">المصطلحات المتبقية: {remainingTerms.length}</div>
                {selectedTerm ? (
                  <div className="w-full">
                    <div className={`
                      w-full bg-white p-4 rounded-xl shadow-2xl text-center transform transition-all duration-300
                      ${feedback === 'correct' ? 'scale-0 opacity-0' : 'scale-100'}
                      ${feedback === 'wrong' ? 'animate-shake bg-red-100' : ''}
                    `}>
                      <div className="font-bold text-slate-800 mb-2">{selectedTerm.name}</div>
                      <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                        <HelpCircle size={12} />
                        {selectedTerm.hint}
                      </div>
                      
                      {feedback === 'wrong' && (
                        <div className="mt-2 text-red-600 text-xs font-bold flex items-center justify-center gap-1">
                          <X size={12} /> خطأ! حاول مرة أخرى
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedTerm(null)}
                      className="mt-4 text-slate-500 text-xs underline hover:text-white"
                    >
                      إلغاء الاختيار
                    </button>
                  </div>
                ) : (
                  <div className="w-full space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {remainingTerms.map(term => (
                      <button
                        key={term.id}
                        onClick={() => setSelectedTerm(term)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-xl text-sm font-medium transition-all text-right border border-slate-700 hover:border-slate-600"
                      >
                        {term.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg animate-bounce">
                  <Check size={40} />
                </div>
                <h4 className="text-white font-bold text-lg">أحسنت!</h4>
                <p className="text-slate-400 text-sm">تم تصنيف جميع الحسابات بنجاح</p>
                <button 
                  onClick={() => setClassified({ debit: [], credit: [] })}
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                >
                  إعادة اللعب
                </button>
              </div>
            )}
          </div>

          {/* Credit Bucket */}
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-4 min-h-[300px] flex flex-col relative">
            <div className="text-emerald-400 font-bold text-center mb-4 pb-2 border-b border-emerald-500/20">
              دائن (Credit)
              <span className="block text-xs text-slate-500 font-normal mt-1">الخصوم، حقوق الملكية، الإيرادات</span>
            </div>
            <div className="flex-1 space-y-2">
              {classified.credit.map(t => (
                <div key={t.id} className="bg-emerald-600 text-white p-3 rounded-lg text-sm font-bold shadow-lg animate-fade-in flex items-center justify-between">
                  {t.name}
                  <Check size={16} className="text-emerald-300" />
                </div>
              ))}
              {selectedTerm && (
                <button 
                  onClick={() => handleClassify(selectedTerm, 'credit')}
                  className="w-full h-12 border-2 border-dashed border-emerald-500/50 rounded-lg flex items-center justify-center text-emerald-300 hover:bg-emerald-500/20 transition-colors animate-pulse"
                >
                  ضع هنا
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Detailed Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
          <Building className="text-slate-600" />
          <h4 className="font-bold text-slate-800">جدول الفروقات والتصنيفات التفصيلية</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-sm">
                <th className="p-4 w-1/3">وجه المقارنة</th>
                <th className="p-4 w-1/3 text-indigo-700 bg-indigo-50">المدين (Debit)</th>
                <th className="p-4 w-1/3 text-emerald-700 bg-emerald-50">الدائن (Credit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="p-4 font-bold text-slate-600">الدور الأساسي</td>
                <td className="p-4 bg-indigo-50/10">الآخذ للقيمة (المستلم)</td>
                <td className="p-4 bg-emerald-50/10">المعطي للقيمة (المقدم)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-600">العلاقة مع الشركة</td>
                <td className="p-4 bg-indigo-50/10">عليه حق للشركة (أصول ومستحقات)</td>
                <td className="p-4 bg-emerald-50/10">له حق على الشركة (التزامات)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-600">طبيعة الحسابات</td>
                <td className="p-4 bg-indigo-50/10">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2"><Wallet size={14}/> الأصول (Assets)</span>
                    <span className="flex items-center gap-2"><TrendingDown size={14}/> المصروفات (Expenses)</span>
                    <span className="flex items-center gap-2"><UserMinus size={14}/> المسحوبات (Drawings)</span>
                  </div>
                </td>
                <td className="p-4 bg-emerald-50/10">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2"><Building size={14}/> الخصوم/الالتزامات (Liabilities)</span>
                    <span className="flex items-center gap-2"><Coins size={14}/> حقوق الملكية (Equity)</span>
                    <span className="flex items-center gap-2"><TrendingUp size={14}/> الإيرادات (Revenue)</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-600">أمثلة عملية</td>
                <td className="p-4 bg-indigo-50/10">
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>العملاء (أخذوا بضاعة)</li>
                    <li>المخزون (أصل موجود)</li>
                    <li>النقدية بالبنك</li>
                  </ul>
                </td>
                <td className="p-4 bg-emerald-50/10">
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>الموردين (أعطوا بضاعة)</li>
                    <li>قرض البنك</li>
                    <li>رأس المال</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default InteractiveDebtorCreditor;