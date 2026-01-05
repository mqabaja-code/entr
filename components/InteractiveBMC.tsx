import React, { useState } from 'react';
import { 
  Users, Gift, Truck, HeartHandshake, Settings, Package, 
  Handshake, Calculator, Banknote, Loader2, CheckCircle2, 
  AlertTriangle, Lightbulb 
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// Standard BMC Layout mapping for the grid
// We use a CSS grid approach to mimic the canvas layout
// Top section has 5 columns: Partners, Activities/Resources, Value, Relationships/Channels, Segments

interface BMCData {
  customerSegments: string;
  valuePropositions: string;
  channels: string;
  customerRelationships: string;
  revenueStreams: string;
  keyResources: string;
  keyActivities: string;
  keyPartners: string;
  costStructure: string;
}

interface AnalysisResult {
  successScore: number;
  positives: string[];
  developmentTips: string[];
  overallFeedback: string;
}

const InteractiveBMC: React.FC = () => {
  const [data, setData] = useState<BMCData>({
    customerSegments: '',
    valuePropositions: '',
    channels: '',
    customerRelationships: '',
    revenueStreams: '',
    keyResources: '',
    keyActivities: '',
    keyPartners: '',
    costStructure: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof BMCData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeBMC = async () => {
    // Basic validation
    const emptyFields = Object.values(data).filter((v) => (v as string).trim() === '').length;
    if (emptyFields > 4) {
      setError("يرجى تعبئة 5 خانات على الأقل للحصول على تحليل دقيق.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are an expert business consultant and entrepreneurship professor. 
        Analyze the following Business Model Canvas (BMC) data provided in Arabic.
        
        BMC Data:
        ${JSON.stringify(data)}

        Please evaluate the coherence, viability, and potential success of this business model.
        Return the response in JSON format with the following schema:
        - successScore: number (0-100) representing the potential viability.
        - positives: array of strings (List 3 strong points).
        - developmentTips: array of strings (List 3 actionable tips to improve the model).
        - overallFeedback: string (A brief summary paragraph in Arabic).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              successScore: { type: Type.NUMBER },
              positives: { type: Type.ARRAY, items: { type: Type.STRING } },
              developmentTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              overallFeedback: { type: Type.STRING }
            },
            required: ["successScore", "positives", "developmentTips", "overallFeedback"]
          }
        }
      });

      if (response.text) {
        const jsonResult = JSON.parse(response.text) as AnalysisResult;
        setResult(jsonResult);
      } else {
        throw new Error("لم يتم استلام رد من النظام الذكي");
      }

    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء التحليل. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderBlock = (
    title: string, 
    number: number, 
    icon: React.ReactNode, 
    field: keyof BMCData, 
    className: string,
    placeholder: string
  ) => (
    <div className={`flex flex-col border border-slate-200 bg-white p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
             {number}
           </div>
           <h4 className="font-bold text-slate-800 text-sm md:text-base">{title}</h4>
        </div>
        <div className="text-emerald-500">
          {icon}
        </div>
      </div>
      <textarea
        className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none min-h-[100px]"
        placeholder={placeholder}
        value={data[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">نموذج العمل التجاري التفاعلي</h3>
        <p className="text-slate-500">قم بتعبئة الخانات أدناه ثم اضغط على زر التحليل للحصول على تقييم فوري لمشروعك</p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 auto-rows-min">
        
        {/* Row 1 Top Section (Partners, Activities, Value, Relationships, Segments) */}
        
        {/* Col 1: Key Partners (Tall) */}
        <div className="md:row-span-2">
           {renderBlock('الشركاء الرئيسيين', 7, <Handshake size={20} />, 'keyPartners', 'h-full', 'من هم الموردون والشركاء الاستراتيجيين؟')}
        </div>

        {/* Col 2: Activities & Resources */}
        <div className="flex flex-col gap-4 md:row-span-2">
          <div className="flex-1">
             {renderBlock('الأنشطة الرئيسية', 5, <Settings size={20} />, 'keyActivities', 'h-full', 'ما هي العمليات الأساسية لنجاح العمل؟')}
          </div>
          <div className="flex-1">
             {renderBlock('الموارد الرئيسية', 6, <Package size={20} />, 'keyResources', 'h-full', 'ما هي الأصول (مادية، بشرية، مالية) المطلوبة؟')}
          </div>
        </div>

        {/* Col 3: Value Proposition (Tall) */}
        <div className="md:row-span-2">
           {renderBlock('عرض القيمة', 2, <Gift size={20} />, 'valuePropositions', 'h-full bg-emerald-50/50 border-emerald-100', 'ما هي القيمة الفريدة التي تقدمها للعميل؟ ماذا تحل؟')}
        </div>

        {/* Col 4: Relationships & Channels */}
        <div className="flex flex-col gap-4 md:row-span-2">
          <div className="flex-1">
             {renderBlock('علاقات العملاء', 3, <HeartHandshake size={20} />, 'customerRelationships', 'h-full', 'كيف تتفاعل وتحافظ على عملائك؟')}
          </div>
          <div className="flex-1">
             {renderBlock('القنوات', 4, <Truck size={20} />, 'channels', 'h-full', 'كيف تصل منتجاتك للعميل؟ (توصيل، متجر، تطبيق..)')}
          </div>
        </div>

        {/* Col 5: Customer Segments (Tall) */}
        <div className="md:row-span-2">
           {renderBlock('شرائح العملاء', 1, <Users size={20} />, 'customerSegments', 'h-full', 'من هم عملاؤك المستهدفون؟')}
        </div>

        {/* Row 2 Bottom Section (Cost & Revenue) */}
        <div className="md:col-span-2.5 mt-2">
           {renderBlock('هيكل التكلفة', 8, <Calculator size={20} />, 'costStructure', 'h-full', 'ما هي أهم التكاليف في نموذج عملك؟')}
        </div>
        <div className="md:col-span-2.5 mt-2">
           {renderBlock('مصادر الدخل', 9, <Banknote size={20} />, 'revenueStreams', 'h-full', 'من أين وكيف يدفع العملاء؟ (اشتراك، بيع مباشر..)')}
        </div>

      </div>

      {/* Action Area */}
      <div className="flex justify-center mb-10">
        <button
          onClick={analyzeBMC}
          disabled={isAnalyzing}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-600/30 flex items-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" />
              جاري تحليل النموذج...
            </>
          ) : (
            <>
              <CheckCircle2 />
              تحليل وتقييم المشروع
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 flex items-center gap-3">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            {/* Score Card */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 min-w-[200px]">
              <div className="relative mb-4">
                 <svg className="w-32 h-32 transform -rotate-90">
                   <circle cx="64" cy="64" r="60" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                   <circle 
                     cx="64" cy="64" r="60" 
                     stroke={result.successScore > 70 ? "#10b981" : result.successScore > 40 ? "#f59e0b" : "#ef4444"} 
                     strokeWidth="8" 
                     fill="transparent" 
                     strokeDasharray={377}
                     strokeDashoffset={377 - (377 * result.successScore) / 100}
                     className="transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                   <span className="text-3xl font-black">{result.successScore}%</span>
                   <span className="text-xs font-medium text-slate-400">احتمالية النجاح</span>
                 </div>
              </div>
              <div className="text-center font-bold text-slate-700">تقييم الجدوى</div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              
              <div>
                <h4 className="font-bold text-lg mb-2 text-slate-900 flex items-center gap-2">
                  <Lightbulb className="text-yellow-500" size={20} />
                  نظرة عامة
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl text-sm">
                  {result.overallFeedback}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <h4 className="font-bold text-emerald-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                     <CheckCircle2 size={16} />
                     نقاط القوة
                   </h4>
                   <ul className="space-y-2">
                     {result.positives.map((item, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>

                <div>
                   <h4 className="font-bold text-indigo-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                     <AlertTriangle size={16} />
                     نصائح للتطوير
                   </h4>
                   <ul className="space-y-2">
                     {result.developmentTips.map((item, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                         <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveBMC;