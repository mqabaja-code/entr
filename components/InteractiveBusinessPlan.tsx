import React, { useState } from 'react';
import { 
  FileText, Briefcase, TrendingUp, Settings, Users, 
  DollarSign, ShieldAlert, Sparkles, Download, ChevronRight, 
  Save, Wand2, Check, Copy, Loader2, Bot, X
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface PlanSection {
  id: string;
  title: string;
  icon: React.ElementType;
  placeholder: string;
  tips: string[];
}

const SECTIONS: PlanSection[] = [
  {
    id: 'executive_summary',
    title: '1. الملخص التنفيذي',
    icon: FileText,
    placeholder: 'اكتب ملخصاً جذاباً للمشروع، المشكلة، الحل، والسوق المستهدف...',
    tips: ['يكتب عادة في النهاية', 'يجب أن لا يتجاوز صفحة واحدة', 'ركز على القيمة المقترحة والجدوى']
  },
  {
    id: 'company_desc',
    title: '2. وصف الشركة',
    icon: Briefcase,
    placeholder: 'اسم الشركة، الرؤية، الرسالة، الأهداف، والهيكل القانوني...',
    tips: ['حدد الرؤية (أين تريد الوصول)', 'حدد الرسالة (ماذا تفعل الآن)', 'اذكر الأهداف الذكية (SMART)']
  },
  {
    id: 'products',
    title: '3. المنتجات والخدمات',
    icon: PackageIcon,
    placeholder: 'وصف تفصيلي للمنتج/الخدمة، المزايا، وكيف تحل مشكلة العميل...',
    tips: ['ركز على الفوائد لا المزايا فقط', 'هل هناك حقوق ملكية فكرية؟', 'مراحل التطور الحالية']
  },
  {
    id: 'market',
    title: '4. تحليل السوق',
    icon: TrendingUp,
    placeholder: 'حجم السوق، الجمهور المستهدف، والمنافسين...',
    tips: ['استخدم أرقام وإحصائيات', 'حدد شريحة العملاء بدقة', 'حلل المنافسين المباشرين وغير المباشرين']
  },
  {
    id: 'marketing',
    title: '5. الخطة التسويقية',
    icon: TargetIcon,
    placeholder: 'استراتيجية التسعير، التوزيع، والترويج (كيف ستصل للعملاء؟)...',
    tips: ['اذكر قنوات التسويق (Social Media, SEO, etc.)', 'استراتيجية التسعير المختارة ولماذا']
  },
  {
    id: 'operations',
    title: '6. الخطة التشغيلية',
    icon: Settings,
    placeholder: 'الموقع، المعدات، الموردين، وعملية الإنتاج...',
    tips: ['كيف ستنتج المنتج؟', 'سلسلة التوريد واللوجستيات', 'الموقع الجغرافي وأهميته']
  },
  {
    id: 'team',
    title: '7. الفريق والإدارة',
    icon: Users,
    placeholder: 'المؤسسون، الخبرات الرئيسية، والهيكل التنظيمي...',
    tips: ['لماذا هذا الفريق قادر على النجاح؟', 'توزيع الأدوار والمسؤوليات']
  },
  {
    id: 'financial',
    title: '8. الخطة المالية',
    icon: DollarSign,
    placeholder: 'مصادر التمويل، توقعات الإيرادات، التكاليف، ونقطة التعادل...',
    tips: ['مصادر التمويل (ذاتي، مستثمرين)', 'توقعات المبيعات لـ 3 سنوات', 'صافي الربح المتوقع']
  },
  {
    id: 'risks',
    title: '9. تحليل المخاطر',
    icon: ShieldAlert,
    placeholder: 'المخاطر المحتملة (مالية، سوقية، تشغيلية) وكيفية التعامل معها...',
    tips: ['كن واقعياً في طرح المخاطر', 'ضع خطة طوارئ (Plan B)']
  }
];

// Mock icons needed for the array definition above
function PackageIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/></svg>; }
function TargetIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }


const InteractiveBusinessPlan: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id);
  const [planContent, setPlanContent] = useState<Record<string, string>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, { refined: string, advice: string }>>({});
  const [isImproving, setIsImproving] = useState(false);

  // Full Plan Generation States
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [ideaInput, setIdeaInput] = useState({ name: '', description: '' });

  const activeSection = SECTIONS.find(s => s.id === activeSectionId) || SECTIONS[0];

  const handleContentChange = (val: string) => {
    setPlanContent(prev => ({ ...prev, [activeSectionId]: val }));
  };

  const generateFullPlan = async () => {
    if (!ideaInput.description) return;
    setIsGeneratingFull(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an expert entrepreneurship consultant. Create a comprehensive business plan in Arabic for a startup based on the following details:
        
        Project Name: ${ideaInput.name}
        Description: ${ideaInput.description}

        Generate detailed content for EACH of the following sections. The content must be professional, realistic, and tailored to the project description.
        
        Required Keys in JSON:
        - executive_summary
        - company_desc
        - products
        - market
        - marketing
        - operations
        - team
        - financial
        - risks

        Ensure the output is a valid JSON object where each key contains the Arabic text for that section.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executive_summary: { type: Type.STRING },
              company_desc: { type: Type.STRING },
              products: { type: Type.STRING },
              market: { type: Type.STRING },
              marketing: { type: Type.STRING },
              operations: { type: Type.STRING },
              team: { type: Type.STRING },
              financial: { type: Type.STRING },
              risks: { type: Type.STRING },
            }
          }
        }
      });

      if (response.text) {
        const generatedPlan = JSON.parse(response.text);
        setPlanContent(generatedPlan);
        setShowGenerateModal(false);
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء توليد الخطة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingFull(false);
    }
  };

  const generateImprovement = async () => {
    const currentText = planContent[activeSectionId];
    if (!currentText || currentText.length < 10) return;

    setIsImproving(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an expert business plan consultant. The user is writing the "${activeSection.title}" section of their business plan in Arabic.
        
        Current Draft:
        "${currentText}"

        Please provide:
        1. A refined, professional version of this text (keep the core meaning but improve wording and structure).
        2. Brief actionable advice on what is missing or could be strengthened.
        
        Output JSON: { refined: string, advice: string }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              refined: { type: Type.STRING },
              advice: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        setAiSuggestions(prev => ({ ...prev, [activeSectionId]: result }));
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء الاتصال بالمساعد الذكي');
    } finally {
      setIsImproving(false);
    }
  };

  const acceptRefinement = () => {
    if (aiSuggestions[activeSectionId]) {
      setPlanContent(prev => ({ ...prev, [activeSectionId]: aiSuggestions[activeSectionId].refined }));
      // Clear suggestion after accepting
      const newSuggestions = { ...aiSuggestions };
      delete newSuggestions[activeSectionId];
      setAiSuggestions(newSuggestions);
    }
  };

  const exportToWord = () => {
    // Basic HTML to Word Export
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Business Plan</title><style>body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; } h1 { color: #2e3b55; border-bottom: 2px solid #ddd; padding-bottom: 10px; } p { line-height: 1.6; margin-bottom: 15px; }</style></head><body>`;
    
    let body = `<h1>خطة العمل</h1><p>تم الإنشاء بواسطة منصة ريادة الأعمال 2</p><hr/>`;
    
    SECTIONS.forEach(section => {
      const content = planContent[section.id] || '(لم يتم تعبئة هذا القسم)';
      body += `<h2>${section.title}</h2><p>${content.replace(/\n/g, '<br>')}</p><br/>`;
    });

    const footer = "</body></html>";
    const sourceHTML = header + body + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'business_plan.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px] relative">
      
      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-indigo-600" />
                توليد خطة كاملة بالذكاء الاصطناعي
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم المشروع (اختياري)</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-indigo-500"
                  placeholder="مثال: منصة تعليمية ذكية"
                  value={ideaInput.name}
                  onChange={e => setIdeaInput({...ideaInput, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">وصف فكرة المشروع</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-indigo-500 min-h-[120px]"
                  placeholder="اشرح فكرتك باختصار.. ماذا تبيع؟ لمن؟ وكيف؟ كلما كان الوصف أدق كانت النتيجة أفضل."
                  value={ideaInput.description}
                  onChange={e => setIdeaInput({...ideaInput, description: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={generateFullPlan}
                disabled={isGeneratingFull || !ideaInput.description}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingFull ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {isGeneratingFull ? 'جاري كتابة الخطة...' : 'توليد الخطة الآن'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-50 border-l border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 space-y-3">
           <button 
             onClick={() => setShowGenerateModal(true)}
             className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-sm"
           >
             <Bot size={18} />
             توليد خطة كاملة AI
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SECTIONS.map((section) => {
            const isFilled = (planContent[section.id]?.length || 0) > 0;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors text-sm
                  ${activeSectionId === section.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <div className={`p-1.5 rounded-full ${activeSectionId === section.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                  {isFilled ? <Check size={14} /> : <section.icon size={14} />}
                </div>
                <span className="truncate font-medium">{section.title}</span>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={exportToWord}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 text-sm"
          >
            <Download size={18} />
            تصدير ملف Word
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeSection.title}</h2>
             <div className="flex flex-wrap gap-2">
               {activeSection.tips.map((tip, idx) => (
                 <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                   💡 {tip}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-6 flex flex-col gap-4 relative">
          <textarea
            className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-base leading-relaxed focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
            placeholder={activeSection.placeholder}
            value={planContent[activeSectionId] || ''}
            onChange={(e) => handleContentChange(e.target.value)}
          />

          {/* AI Suggestion Panel */}
          {aiSuggestions[activeSectionId] && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-xl p-4 animate-slide-up relative">
              <button 
                onClick={() => {
                  const newSuggestions = { ...aiSuggestions };
                  delete newSuggestions[activeSectionId];
                  setAiSuggestions(newSuggestions);
                }}
                className="absolute top-2 left-2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
              <h4 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                <Sparkles size={16} />
                اقتراح المساعد الذكي
              </h4>
              <p className="text-sm text-slate-600 mb-3 pl-4 border-r-2 border-indigo-200">
                {aiSuggestions[activeSectionId].advice}
              </p>
              <div className="bg-white p-3 rounded-lg border border-indigo-100 text-sm text-slate-700 mb-3 max-h-40 overflow-y-auto">
                {aiSuggestions[activeSectionId].refined}
              </div>
              <button 
                onClick={acceptRefinement}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1"
              >
                <Check size={12} />
                اعتماد النص المحسن
              </button>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="text-xs text-slate-400 font-medium">
             {planContent[activeSectionId]?.length || 0} حرف
          </div>
          <button
            onClick={generateImprovement}
            disabled={isImproving || !planContent[activeSectionId] || planContent[activeSectionId].length < 10}
            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImproving ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
            تحسين وتدقيق المحتوى
          </button>
        </div>
      </div>

    </div>
  );
};

export default InteractiveBusinessPlan;