import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  Scale, 
  Banknote, 
  ArrowDown, 
  Info,
  PieChart,
  Wallet,
  Landmark,
  Send
} from 'lucide-react';

interface Statement {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  shortDesc: string;
  details: string;
  equation?: string;
}

const STATEMENTS: Statement[] = [
  {
    id: 'income',
    title: 'قائمة الدخل (Income Statement)',
    icon: TrendingUp,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    shortDesc: 'هل ربحنا أم خسرنا؟',
    details: 'تعرض أداء الشركة خلال فترة زمنية محددة. توضح الإيرادات (المبيعات) وتطرح منها جميع المصروفات للوصول إلى صافي الربح أو الخسارة.',
    equation: 'الإيرادات - المصروفات = صافي الربح'
  },
  {
    id: 'cashflow',
    title: 'قائمة التدفقات النقدية (Cash Flow)',
    icon: Banknote,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    shortDesc: 'أين ذهب الكاش؟',
    details: 'تتتبع حركة السيولة النقدية الداخلة والخارجة من الشركة. وهي الأهم لاستمرار المشروع لأن الأرباح في "قائمة الدخل" لا تعني بالضرورة وجود "كاش" في البنك.',
    equation: 'التدفقات التشغيلية + الاستثمارية + التمويلية = صافي النقد'
  },
  {
    id: 'retained',
    title: 'قائمة الأرباح المبقاة (Retained Earnings)',
    icon: PieChart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    shortDesc: 'ماذا فعلنا بالأرباح؟',
    details: 'توضح التغيرات في حقوق الملكية، وتحديداً كم من الأرباح تم توزيعه على الشركاء وكم تم "إبقاؤه" داخل الشركة لإعادة استثماره في التوسع.',
    equation: 'أرباح سابقة + صافي ربح الحالي - التوزيعات = أرباح مبقاة'
  },
  {
    id: 'balance',
    title: 'قائمة المركز المالي (Balance Sheet)',
    icon: Scale,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    shortDesc: 'ما لنا وما علينا (صورة لحظية)',
    details: 'توضح الوضع المالي للشركة في لحظة محددة (تاريخ اليوم). تتضمن الموجودات (الأصول)، والالتزامات (الخصوم)، وحقوق الملاك.',
    equation: 'الأصول = الخصوم + حقوق الملكية'
  }
];

const InteractiveFinancialStatements: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-12 py-8">
      
      {/* The Cloud Header Area */}
      <div className="relative h-48 md:h-64 flex items-center justify-center mb-8">
        
        {/* Animated Cloud SVG Background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl text-slate-100 animate-pulse-slow">
           <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
             <path d="M40,60 Q30,40 60,30 Q80,10 110,30 Q140,20 160,50 Q190,60 170,90 Q150,110 100,100 Q60,110 40,90 Q10,80 40,60 Z" />
           </svg>
        </div>

        {/* Title inside Cloud */}
        <div className="relative z-10 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
            <h3 className="text-3xl md:text-5xl font-black drop-shadow-sm">أنواع القوائم المالية</h3>
          </div>
          <p className="text-slate-500 font-bold mt-2">Financial Statements Types</p>
        </div>

        {/* Paper Airplanes Decor */}
        <div className="absolute top-full left-0 w-full h-12 hidden md:block overflow-visible">
           {/* Dashed Lines Paths (Visual CSS approximation) */}
           <div className="absolute left-[15%] top-[-20px] h-24 w-0.5 border-l-2 border-dashed border-slate-300 transform -rotate-12 origin-top"></div>
           <div className="absolute left-[38%] top-[-20px] h-24 w-0.5 border-l-2 border-dashed border-slate-300 transform -rotate-6 origin-top"></div>
           <div className="absolute left-[62%] top-[-20px] h-24 w-0.5 border-l-2 border-dashed border-slate-300 transform rotate-6 origin-top"></div>
           <div className="absolute left-[85%] top-[-20px] h-24 w-0.5 border-l-2 border-dashed border-slate-300 transform rotate-12 origin-top"></div>
           
           {/* Airplanes */}
           <Send size={24} className="text-slate-400 absolute left-[14%] top-[40px] transform rotate-[160deg]" />
           <Send size={24} className="text-slate-400 absolute left-[37%] top-[50px] transform rotate-[170deg]" />
           <Send size={24} className="text-slate-400 absolute left-[61%] top-[50px] transform rotate-[-170deg]" />
           <Send size={24} className="text-slate-400 absolute left-[84%] top-[40px] transform rotate-[-160deg]" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {STATEMENTS.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            className={`
              relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group
              ${activeId === item.id ? `shadow-xl scale-105 ${item.borderColor} bg-white` : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'}
            `}
          >
            {/* Image/Icon Area */}
            <div className={`
              h-32 rounded-xl mb-4 flex items-center justify-center transition-colors
              ${activeId === item.id ? item.bgColor : 'bg-slate-50 group-hover:bg-slate-100'}
            `}>
               <item.icon 
                 size={48} 
                 className={`transform transition-transform duration-500 ${activeId === item.id ? 'scale-110 rotate-3' : 'group-hover:scale-110'} ${item.color}`} 
               />
            </div>

            <h4 className="font-bold text-slate-800 text-lg mb-2 text-center">{item.title}</h4>
            
            <p className="text-slate-500 text-sm text-center mb-4">
              {item.shortDesc}
            </p>

            {/* Expandable Details */}
            <div className={`overflow-hidden transition-all duration-500 ${activeId === item.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
               <div className={`p-3 rounded-lg text-sm leading-relaxed text-slate-600 bg-slate-50 mb-3`}>
                 {item.details}
               </div>
               {item.equation && (
                 <div className="text-xs font-bold text-center py-2 px-3 bg-slate-900 text-white rounded-lg shadow-md">
                   {item.equation}
                 </div>
               )}
            </div>

            {/* Click Hint */}
            {activeId !== item.id && (
               <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-slate-300 animate-bounce">
                 <ArrowDown size={16} />
               </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Educational Note */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg mt-8 flex items-start gap-4">
        <div className="p-3 bg-white/10 rounded-xl">
           <Landmark size={24} className="text-yellow-400" />
        </div>
        <div>
           <h4 className="font-bold text-lg mb-1">لماذا أربع قوائم؟</h4>
           <p className="text-slate-300 text-sm leading-relaxed">
             كل قائمة تحكي جزءاً مختلفاً من القصة المالية. لا يمكن الاعتماد على قائمة واحدة فقط. 
             مثلاً: قد تكون شركتك رابحة (في قائمة الدخل) لكنها مفلسة (في التدفقات النقدية) لأنك بعت بالآجل ولم تحصل الأموال!
           </p>
        </div>
      </div>

    </div>
  );
};

export default InteractiveFinancialStatements;