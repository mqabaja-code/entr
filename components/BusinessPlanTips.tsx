import React from 'react';
import { 
  Brain, Lightbulb, PenTool, CheckCircle2, XCircle, 
  FileCheck, Sparkles, BarChart3, Scissors, SpellCheck, 
  Printer, Feather
} from 'lucide-react';

const BusinessPlanTips: React.FC = () => {
  return (
    <div className="w-full space-y-12 py-8">
      
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <h3 className="text-3xl font-black text-slate-800 mb-4 relative z-10">فن كتابة خطة العمل</h3>
        <p className="text-slate-500 text-lg relative z-10">
          خطة العمل ليست مجرد وثيقة، بل هي واجهتك أمام المستثمر. إليك القواعد الذهبية لصياغتها باحترافية.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Right Column: Language (The Bulb) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2.5rem] transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>
          <div className="relative bg-white border border-amber-100 p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/5 hover:shadow-amber-500/10 transition-all duration-500">
            
            {/* Header Icon */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce-slow">
                <Lightbulb className="text-white w-12 h-12" strokeWidth={2.5} />
              </div>
            </div>

            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <span className="text-amber-500">أولاً:</span> لغة خطة العمل الجيدة
              </h4>
              <p className="text-sm text-slate-400 font-medium mt-1">كيف تكتب لتقنع؟</p>
            </div>

            <ul className="space-y-4">
              {[
                { text: 'أن لا تكون مطولة (خير الكلام ما قل ودل)', icon: Scissors, color: 'text-amber-600' },
                { text: 'تفادي الروابط اللغوية المعقدة (مثل: وبناءً على ذلك...)', icon: XCircle, color: 'text-red-500' },
                { text: 'استخدام جمل قصيرة وتقريرية مفيدة', icon: CheckCircle2, color: 'text-emerald-500' },
                { text: 'محددة العبارات وسليمة الصياغة لغوياً', icon: PenTool, color: 'text-blue-500' },
                { text: 'شيقة، مفيدة، واقعية، ومهنية', icon: Sparkles, color: 'text-purple-500' },
                { text: 'تثير إعجاب المستثمر بالمحتوى لا بالبلاغة', icon: Feather, color: 'text-slate-600' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50/50 transition-colors group/item">
                  <div className={`p-2 rounded-lg bg-slate-50 group-hover/item:bg-white shadow-sm transition-colors ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm md:text-base">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Interactive Example */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
              <div className="font-bold text-slate-400 text-xs uppercase mb-2">مثال عملي</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 opacity-70">
                  <span className="block text-red-600 font-bold text-xs mb-1">❌ صياغة ضعيفة</span>
                  "ولهذا السبب، ونظراً لما سبق، فإننا نأمل أن نحقق النجاح..."
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="block text-emerald-600 font-bold text-xs mb-1">✅ صياغة قوية</span>
                  "تشير التوقعات لتحقيق نمو بنسبة 20% خلال العام الأول."
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Left Column: Characteristics (The Brain/Muscle) */}
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2.5rem] transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500"></div>
           <div className="relative bg-white border border-emerald-100 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-500">
            
            {/* Header Icon */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse-slow">
                <Brain className="text-white w-12 h-12" strokeWidth={2.5} />
              </div>
            </div>

            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <span className="text-emerald-500">ثانياً:</span> صفات خطة العمل الجيدة
              </h4>
              <p className="text-sm text-slate-400 font-medium mt-1">الشكل والمضمون</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {[
                 { title: 'بسيطة وقصيرة', desc: 'لا تعقد الأمور، البساطة هي قمة التطور.', icon: Scissors },
                 { title: 'مدعمة بالبيانات', desc: 'استخدم الجداول، الرسوم البيانية، والأرقام.', icon: BarChart3 },
                 { title: 'سهلة الفهم', desc: 'أي شخص يقرأها يجب أن يفهم الفكرة فوراً.', icon: Lightbulb },
                 { title: 'خالية من الأخطاء', desc: 'المراجعة اللغوية ضرورية لتعكس الاحترافية.', icon: SpellCheck },
                 { title: 'مطبوعة ومجلدة', desc: 'المظهر الخارجي يعكس اهتمامك بالتفاصيل.', icon: Printer },
                 { title: 'شيقة ومفيدة', desc: 'اجعل القارئ يستمتع باكتشاف فرصتك.', icon: FileCheck },
               ].map((card, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all group/card">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/card:bg-emerald-600 group-hover/card:text-white transition-colors">
                     <card.icon size={18} />
                   </div>
                   <div>
                     <h5 className="font-bold text-slate-800 text-sm">{card.title}</h5>
                     <p className="text-xs text-slate-500">{card.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
            
            {/* Visual Decor */}
            <div className="mt-6 flex justify-center gap-2 opacity-20">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-2 h-2 rounded-full bg-emerald-500"></div>
               ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessPlanTips;