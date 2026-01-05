import React, { useState } from 'react';
import { 
  Building2, Hammer, Activity, Lock, TrendingUp, 
  Target, Layers, HelpCircle, CheckCircle2, XCircle,
  Banknote, PackageOpen
} from 'lucide-react';

interface CostType {
  id: number;
  title: string;
  concept: string;
  examples: string[];
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const COST_TYPES: CostType[] = [
  {
    id: 1,
    title: 'التكاليف الرأسمالية',
    concept: 'تسمى التكاليف التأسيسية، وهي الأموال التي تنفق لمرة واحدة في بداية المشروع للحصول على الأصول وعناصر الإنتاج الأساسية.',
    examples: ['البناء والإنشاءات', 'المعدات والآلات', 'شراء الأرض'],
    icon: Building2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 2,
    title: 'التكاليف التشغيلية',
    concept: 'تسمى تكلفة رأس المال العامل، وهي المصاريف الدورية اللازمة لتسيير أعمال المشروع يوماً بيوم.',
    examples: ['جميع التكاليف الثابتة', 'جميع التكاليف المتغيرة', 'رواتب التشغيل ومصاريف الصيانة'],
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    title: 'التكاليف الثابتة',
    concept: 'وهي تلك التكلفة التي لا تتأثر بحجم الإنتاج (زيادة أو نقصان).',
    examples: ['الإيجار', 'الرواتب الإدارية', 'التراخيص الحكومية', 'التأمين'],
    icon: Lock,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50'
  },
  {
    id: 4,
    title: 'التكاليف المتغيرة',
    concept: 'وهي تلك التكلفة التي تتأثر بحجم الإنتاج (زيادة أو نقصان).',
    examples: ['المواد الخام', 'الوقود', 'الكهرباء (للتصنيع)', 'مواد التغليف'],
    icon: TrendingUp,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    id: 5,
    title: 'التكاليف المباشرة',
    concept: 'وهي تلك التكلفة التي تظهر في شكل وصور المنتج النهائي.',
    examples: ['تكلفة صناعة المنتج مباشرة', 'خشب لصناعة الأثاث', 'قماش لصناعة الملابس'],
    icon: Target,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 6,
    title: 'التكاليف غير المباشرة',
    concept: 'وهي تلك التكلفة التي لا تظهر في شكل وصور المنتج النهائي.',
    examples: ['التكلفة المضافة على المنتج', 'زيوت التشحيم للآلات', 'إضاءة المصنع', 'رواتب المشرفين'],
    icon: Layers,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

// Quiz Data
const QUIZ_QUESTIONS = [
  { q: 'دفع فاتورة إيجار المحل الشهري', type: 'fixed', options: ['تكلفة ثابتة', 'تكلفة متغيرة'], correct: 'تكلفة ثابتة' },
  { q: 'شراء الدقيق لمخبز', type: 'variable', options: ['تكلفة ثابتة', 'تكلفة متغيرة'], correct: 'تكلفة متغيرة' },
  { q: 'شراء فرن كبير عند تأسيس المخبز', type: 'capital', options: ['تكلفة رأسمالية', 'تكلفة تشغيلية'], correct: 'تكلفة رأسمالية' },
  { q: 'فاتورة بنزين لسيارة التوصيل (حسب الطلبات)', type: 'variable', options: ['تكلفة ثابتة', 'تكلفة متغيرة'], correct: 'تكلفة متغيرة' },
];

const InteractiveCostTypes: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizAnswer = (answer: string) => {
    if (answer === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizFeedback('correct');
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
      }, 1000);
    } else {
      setQuizFeedback('wrong');
      setTimeout(() => setQuizFeedback(null), 1000);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Banknote className="text-emerald-600" />
          تصنيف تكاليف المشروع
        </h3>
        <p className="text-slate-500 max-w-2xl mx-auto">
          يعد فهم أنواع التكاليف أمراً حاسماً لإعداد الميزانية وتسعير المنتجات بشكل صحيح. تنقسم التكاليف إلى عدة أنواع رئيسية:
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COST_TYPES.map((cost) => (
          <div 
            key={cost.id}
            className={`
              relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer group
              ${activeCard === cost.id ? 'border-indigo-500 shadow-xl scale-105 z-10' : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg'}
            `}
            onClick={() => setActiveCard(activeCard === cost.id ? null : cost.id)}
          >
            {/* Front Header */}
            <div className={`p-6 flex items-center gap-4 ${cost.bgColor}`}>
              <div className={`p-3 rounded-xl bg-white shadow-sm ${cost.color}`}>
                <cost.icon size={24} />
              </div>
              <h4 className="font-bold text-lg text-slate-800">{cost.title}</h4>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">المفهوم</span>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {cost.concept}
                </p>
              </div>
              
              <div className={`
                transition-all duration-500 overflow-hidden
                ${activeCard === cost.id ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}
              `}>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-indigo-500 uppercase block mb-2">أمثلة</span>
                  <ul className="list-disc list-inside space-y-1">
                    {cost.examples.map((ex, i) => (
                      <li key={i} className="text-indigo-900 text-sm font-medium">{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hint Arrow */}
              {activeCard !== cost.id && (
                <div className="text-center text-slate-300 text-xs mt-2 animate-bounce">
                  اضغط لعرض الأمثلة
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quiz Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-block p-3 bg-white/10 rounded-full mb-6">
            <HelpCircle size={32} className="text-yellow-400" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">اختبر معرفتك بالتكاليف</h3>
          <p className="text-slate-300 mb-8">هل يمكنك التمييز بين أنواع التكاليف المختلفة؟</p>

          {!showQuiz ? (
            <button 
              onClick={() => setShowQuiz(true)}
              className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              ابدأ التحدي
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 animate-fade-in">
              <div className="text-sm text-indigo-200 mb-4 font-bold tracking-widest uppercase">
                سؤال {quizIndex + 1} من {QUIZ_QUESTIONS.length}
              </div>
              
              <h4 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
                "{QUIZ_QUESTIONS[quizIndex].q}"
                <br/>
                <span className="text-base font-normal text-slate-300 mt-2 block">تعتبر من:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt)}
                    className="bg-white text-slate-800 p-4 rounded-xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Feedback Overlay */}
              {quizFeedback && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl z-20 backdrop-blur-sm animate-fade-in">
                  <div className="text-center">
                    {quizFeedback === 'correct' ? (
                      <>
                        <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white">إجابة صحيحة!</h3>
                      </>
                    ) : (
                      <>
                        <XCircle size={64} className="text-red-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white">حاول مرة أخرى</h3>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default InteractiveCostTypes;