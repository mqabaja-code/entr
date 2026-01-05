import React, { useState } from 'react';
import { 
  Eye, Target, Heart, Sparkles, Loader2, Bot, 
  Globe, Lightbulb, CheckCircle2, Quote, ArrowRight,
  Zap, Flag
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// Tabs for the interactive component
type Tab = 'learn' | 'generate' | 'analyze';

interface IdentityData {
  projectName: string;
  field: string;
  vision: string;
  mission: string;
  values: string;
}

interface AnalysisResult {
  score: number;
  feedback: string;
  refinedVision: string;
  refinedMission: string;
}

const GLOBAL_EXAMPLES = [
  {
    name: "Google (جوجل)",
    logo: "G",
    color: "bg-blue-600",
    mission: "تنظيم معلومات العالم وجعلها مفيدة وفي متناول الجميع.",
    vision: "توفير الوصول إلى المعلومات بنقرة واحدة للعالم أجمع.",
    values: ["التركيز على المستخدم", "الديمقراطية في الويب", "يمكنك أن تكون جاداً بدون بدلة رسمية"]
  },
  {
    name: "Tesla (تسلا)",
    logo: "T",
    color: "bg-red-600",
    mission: "تسريع انتقال العالم إلى الطاقة المستدامة.",
    vision: "أن نكون أكبر شركة سيارات في القرن الحادي والعشرين من خلال قيادة التحول للمركبات الكهربائية.",
    values: ["القيام بالأفضل", "تحمل المخاطر", "الاحترام", "التعلم المستمر"]
  },
  {
    name: "IKEA (ايكيا)",
    logo: "I",
    color: "bg-yellow-500",
    mission: "تقديم مجموعة واسعة من منتجات الأثاث المنزلي المصممة جيداً والعملية بأسعار منخفضة جداً.",
    vision: "خلق حياة يومية أفضل لكثير من الناس.",
    values: ["التواضع", "قوة الإرادة", "البساطة", "التجديد المستمر"]
  },
  {
    name: "Almarai (المراعي)",
    logo: "M",
    color: "bg-blue-500",
    mission: "توفير منتجات غذائية ذات جودة عالية وقيمة غذائية لرفع مستوى معيشة المستهلكين.",
    vision: "أن نكون الخيار المفضل للمستهلك في المنتجات الغذائية والمشروبات.",
    values: ["الجودة", "الابتكار", "النزاهة", "العمل بروح الفريق"]
  }
];

const InteractiveMissionVision: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [data, setData] = useState<IdentityData>({
    projectName: '', field: '', vision: '', mission: '', values: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // AI Function: Generate Drafts
  const generateDrafts = async () => {
    if (!data.projectName || !data.field) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a branding expert. Create Vision, Mission, and Values (in Arabic) for a project with:
        Name: ${data.projectName}
        Field/Description: ${data.field}
        
        Rules:
        - Vision: Ambitious, future-oriented.
        - Mission: Action-oriented, present tense, clear.
        - Values: 4-5 core principles.
        
        Output JSON: { vision: string, mission: string, values: string }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vision: { type: Type.STRING },
              mission: { type: Type.STRING },
              values: { type: Type.STRING }
            }
          }
        }
      });
      
      if(response.text) {
        const result = JSON.parse(response.text);
        setData(prev => ({ ...prev, ...result }));
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ في التوليد");
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Function: Analyze & Refine
  const analyzeIdentity = async () => {
    if (!data.vision || !data.mission) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Evaluate this corporate identity (in Arabic):
        Vision: ${data.vision}
        Mission: ${data.mission}
        Values: ${data.values}
        
        Criteria:
        - Vision must be inspiring and long-term.
        - Mission must be specific and actionable.
        
        Output JSON: { score: number, feedback: string, refinedVision: string, refinedMission: string }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              refinedVision: { type: Type.STRING },
              refinedMission: { type: Type.STRING }
            }
          }
        }
      });
      
      if(response.text) {
        setAnalysisResult(JSON.parse(response.text));
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ في التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
        {[
          { id: 'learn', label: 'أمثلة ملهمة', icon: Globe },
          { id: 'generate', label: 'مختبر الصياغة', icon: Zap },
          { id: 'analyze', label: 'التقييم والتحليل', icon: Target },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm md:text-base
              ${activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-10 flex-1 bg-slate-50/30">
        
        {/* TAB 1: LEARN (Global Examples) */}
        {activeTab === 'learn' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl font-black text-slate-800 mb-3">عمالقة غيروا العالم برؤيتهم</h3>
              <p className="text-slate-500">لاحظ كيف تكون الرؤية "حلماً" والرسالة "فعلاً" والقيم "سلوكاً".</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GLOBAL_EXAMPLES.map((ex, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full ${ex.color} text-white flex items-center justify-center font-bold text-xl shadow-lg`}>
                      {ex.logo}
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">{ex.name}</h4>
                  </div>
                  
                  <div className="space-y-4 relative">
                    {/* Connecting line decoration */}
                    <div className="absolute top-4 bottom-4 right-3 w-0.5 bg-slate-100"></div>

                    <div className="relative pr-8">
                      <div className="absolute right-0 top-1 w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <Eye size={14} />
                      </div>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">الرؤية (Vision)</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{ex.vision}</p>
                    </div>

                    <div className="relative pr-8">
                       <div className="absolute right-0 top-1 w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <Target size={14} />
                      </div>
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">الرسالة (Mission)</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{ex.mission}</p>
                    </div>

                    <div className="relative pr-8">
                      <div className="absolute right-0 top-1 w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center text-pink-600">
                        <Heart size={14} />
                      </div>
                      <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block mb-1">القيم (Values)</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ex.values.map((v, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{v}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GENERATOR */}
        {activeTab === 'generate' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
               
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-900">
                 <Bot size={24} className="text-indigo-600" />
                 المساعد الذكي لصياغة الهوية
               </h3>

               <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">اسم المشروع</label>
                   <input 
                     value={data.projectName}
                     onChange={e => setData({...data, projectName: e.target.value})}
                     className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                     placeholder="مثال: أكاديمية المستقبل"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">مجال العمل ونبذة</label>
                   <textarea 
                     value={data.field}
                     onChange={e => setData({...data, field: e.target.value})}
                     className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none h-24 resize-none"
                     placeholder="مثال: منصة تعليمية تقدم دورات برمجة للأطفال بأسلوب ممتع..."
                   />
                 </div>
               </div>

               <button
                 onClick={generateDrafts}
                 disabled={isGenerating || !data.projectName}
                 className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-70"
               >
                 {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                 توليد المسودة الأولية
               </button>
             </div>

             {/* Results Display */}
             {(data.vision || data.mission) && (
               <div className="grid gap-6 animate-slide-up">
                 <div className="bg-white p-6 rounded-2xl border-r-4 border-indigo-500 shadow-sm">
                   <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Eye size={18}/> الرؤية المقترحة</h4>
                   <textarea 
                     value={data.vision} 
                     onChange={(e) => setData({...data, vision: e.target.value})}
                     className="w-full bg-indigo-50/30 p-3 rounded-lg text-slate-700 border-none outline-none"
                   />
                 </div>
                 <div className="bg-white p-6 rounded-2xl border-r-4 border-emerald-500 shadow-sm">
                   <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><Target size={18}/> الرسالة المقترحة</h4>
                   <textarea 
                     value={data.mission} 
                     onChange={(e) => setData({...data, mission: e.target.value})}
                     className="w-full bg-emerald-50/30 p-3 rounded-lg text-slate-700 border-none outline-none"
                   />
                 </div>
                 <div className="bg-white p-6 rounded-2xl border-r-4 border-pink-500 shadow-sm">
                   <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2"><Heart size={18}/> القيم المقترحة</h4>
                   <textarea 
                     value={data.values} 
                     onChange={(e) => setData({...data, values: e.target.value})}
                     className="w-full bg-pink-50/30 p-3 rounded-lg text-slate-700 border-none outline-none"
                   />
                 </div>
                 
                 <button 
                    onClick={() => setActiveTab('analyze')}
                    className="mx-auto bg-slate-800 text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-slate-900 transition-colors"
                 >
                   الانتقال للتقييم والتحليل <ArrowRight size={16} />
                 </button>
               </div>
             )}
          </div>
        )}

        {/* TAB 3: ANALYZE */}
        {activeTab === 'analyze' && (
          <div className="animate-fade-in">
             <div className="flex flex-col md:flex-row gap-8">
               
               {/* Inputs */}
               <div className="flex-1 space-y-6">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4">أدخل بياناتك الحالية للتحليل</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-indigo-500 uppercase">الرؤية</span>
                        <textarea 
                          value={data.vision}
                          onChange={e => setData({...data, vision: e.target.value})}
                          placeholder="اكتب رؤيتك هنا..."
                          className="w-full mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-500 uppercase">الرسالة</span>
                        <textarea 
                          value={data.mission}
                          onChange={e => setData({...data, mission: e.target.value})}
                          placeholder="اكتب رسالتك هنا..."
                          className="w-full mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={analyzeIdentity}
                        disabled={isAnalyzing || !data.vision}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                        فحص الجودة
                      </button>
                    </div>
                 </div>
               </div>

               {/* Result */}
               <div className="flex-1">
                 {analysisResult ? (
                   <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 relative overflow-hidden animate-slide-up">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800">نتيجة التحليل</h3>
                        <div className={`text-3xl font-black ${analysisResult.score > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {analysisResult.score}/100
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <h5 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Quote size={16}/> ملاحظات الخبير</h5>
                          <p className="text-slate-600 text-sm leading-relaxed">{analysisResult.feedback}</p>
                        </div>

                        <div>
                          <h5 className="font-bold text-indigo-600 mb-2 text-sm uppercase">تحسين مقترح للرؤية</h5>
                          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-sm font-medium">
                            {analysisResult.refinedVision}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-bold text-emerald-600 mb-2 text-sm uppercase">تحسين مقترح للرسالة</h5>
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 text-sm font-medium">
                            {analysisResult.refinedMission}
                          </div>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                     <Target size={48} className="mb-4 opacity-50" />
                     <p>اضغط على "فحص الجودة" لترى النتائج هنا</p>
                   </div>
                 )}
               </div>

             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InteractiveMissionVision;
