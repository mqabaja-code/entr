import React, { useState } from 'react';
import { 
  Target, Megaphone, DollarSign, Users, Sparkles, Download, 
  Save, Wand2, Check, Loader2, Bot, X, Globe, BarChart3, 
  ShoppingBag, Tag
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
    id: 'target_audience',
    title: '1. الجمهور المستهدف (STP)',
    icon: Users,
    placeholder: 'من هو عميلك المثالي؟ (العمر، الجنس، الاهتمامات، السلوك، الموقع الجغرافي)...',
    tips: ['حدد شخصية المشتري (Buyer Persona)', 'كيف ستقسم السوق؟ (Segmentation)', 'ما هي الفئة المستهدفة بالتحديد؟']
  },
  {
    id: 'usp',
    title: '2. عرض القيمة الفريد (USP)',
    icon: Sparkles,
    placeholder: 'لماذا يشتري العميل منك وليس من المنافس؟ ما الذي يجعلك مختلفاً؟...',
    tips: ['ركز على الفائدة الفريدة', 'كن واضحاً ومختصراً', 'حل مشكلة محددة للعميل']
  },
  {
    id: 'product_strategy',
    title: '3. استراتيجية المنتج',
    icon: ShoppingBag,
    placeholder: 'وصف المنتج/الخدمة، المزايا التنافسية، التغليف، وتجربة المستخدم...',
    tips: ['كيف يلبي المنتج حاجة السوق؟', 'هل هناك خدمات ما بعد البيع؟', 'ما هي خطة تطوير المنتج؟']
  },
  {
    id: 'pricing_strategy',
    title: '4. استراتيجية التسعير',
    icon: Tag,
    placeholder: 'نموذج التسعير (اشتراك، مرة واحدة)، السعر المقترح، ومقارنته بالسوق...',
    tips: ['هل ستستخدم التسعير القائم على التكلفة أم القيمة؟', 'هل هناك خصومات أو عروض؟', 'هامش الربح المتوقع']
  },
  {
    id: 'distribution',
    title: '5. التوزيع والمكان (Place)',
    icon: Globe,
    placeholder: 'كيف سيصل المنتج للعميل؟ (متجر إلكتروني، محل تجزئة، تطبيق، توصيل)...',
    tips: ['سهولة الوصول للمنتج', 'تغطية المناطق الجغرافية', 'شركاء التوزيع واللوجستيات']
  },
  {
    id: 'promotion',
    title: '6. الترويج والإعلان',
    icon: Megaphone,
    placeholder: 'القنوات الإعلانية (فيسبوك، جوجل، مؤثرين)، ونوع المحتوى التسويقي...',
    tips: ['حدد القنوات التي يتواجد فيها عميلك', 'الميزانية الإعلانية لكل قناة', 'الرسالة التسويقية الرئيسية']
  },
  {
    id: 'budget',
    title: '7. الميزانية التسويقية',
    icon: DollarSign,
    placeholder: 'تقدير تكاليف التسويق للفترة القادمة وتوزيعها على القنوات...',
    tips: ['تكلفة الاستحواذ على العميل (CAC)', 'العائد المتوقع على الاستثمار (ROI)', 'ميزانية الطوارئ']
  },
  {
    id: 'kpis',
    title: '8. مؤشرات الأداء (KPIs)',
    icon: BarChart3,
    placeholder: 'كيف ستقيس النجاح؟ (عدد المبيعات، الزيارات، نسبة التحويل)...',
    tips: ['حدد أرقاماً واقعية وقابلة للقياس', 'معدل الاحتفاظ بالعملاء', 'صافي نقاط الترويج (NPS)']
  }
];

const InteractiveMarketingPlan: React.FC = () => {
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
        You are an expert Chief Marketing Officer (CMO). Create a comprehensive Marketing Plan in Arabic based on the following project details:
        
        Project Name: ${ideaInput.name}
        Description: ${ideaInput.description}

        Generate detailed strategic content for EACH of the following marketing sections.
        
        Required Keys in JSON:
        - target_audience (Define demographics, psychographics, and persona)
        - usp (Clear Unique Selling Proposition)
        - product_strategy (Features benefits map)
        - pricing_strategy (Pricing model and justification)
        - distribution (Channels and logistics)
        - promotion (Campaign ideas and channels)
        - budget (Estimated allocation)
        - kpis (Key Performance Indicators)

        Ensure the output is a valid JSON object where each key contains the Arabic text.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              target_audience: { type: Type.STRING },
              usp: { type: Type.STRING },
              product_strategy: { type: Type.STRING },
              pricing_strategy: { type: Type.STRING },
              distribution: { type: Type.STRING },
              promotion: { type: Type.STRING },
              budget: { type: Type.STRING },
              kpis: { type: Type.STRING },
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
      alert('حدث خطأ أثناء توليد الخطة التسويقية.');
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
        You are a marketing expert. The user is writing the "${activeSection.title}" section of their marketing plan in Arabic.
        
        Current Draft:
        "${currentText}"

        Please provide:
        1. A refined, professional marketing copy of this text.
        2. Brief advice on how to make it more persuasive or data-driven.
        
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
      const newSuggestions = { ...aiSuggestions };
      delete newSuggestions[activeSectionId];
      setAiSuggestions(newSuggestions);
    }
  };

  const exportToWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Marketing Plan</title><style>body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; } h1 { color: #db2777; border-bottom: 2px solid #ddd; padding-bottom: 10px; } h2 { color: #831843; } p { line-height: 1.6; margin-bottom: 15px; }</style></head><body>`;
    
    let body = `<h1>الخطة التسويقية الاستراتيجية</h1><p>تم الإنشاء بواسطة منصة ريادة الأعمال 2</p><hr/>`;
    
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
    fileDownload.download = 'marketing_plan.doc';
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
                <Sparkles className="text-pink-600" />
                توليد خطة تسويقية بالذكاء الاصطناعي
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم المشروع</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-pink-500"
                  placeholder="مثال: تطبيق توصيل صحي"
                  value={ideaInput.name}
                  onChange={e => setIdeaInput({...ideaInput, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">وصف المنتج/الخدمة</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-pink-500 min-h-[120px]"
                  placeholder="اشرح ما تقدمه ولمن.. كلما كنت دقيقاً كانت الخطة التسويقية أنجح."
                  value={ideaInput.description}
                  onChange={e => setIdeaInput({...ideaInput, description: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={generateFullPlan}
                disabled={isGeneratingFull || !ideaInput.description}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingFull ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {isGeneratingFull ? 'جاري رسم الاستراتيجية...' : 'توليد الخطة التسويقية'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-50 border-l border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 space-y-3 bg-pink-50/50">
           <button 
             onClick={() => setShowGenerateModal(true)}
             className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-500/20 transition-all text-sm"
           >
             <Bot size={18} />
             توليد خطة تسويق AI
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
                    ? 'bg-pink-600 text-white shadow-md' 
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
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-lg text-sm"
          >
            <Download size={18} />
            تصدير ملف Word
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
               <span className="text-pink-600">
                 {React.createElement(activeSection.icon, { size: 28 })}
               </span>
               {activeSection.title}
             </h2>
             <div className="flex flex-wrap gap-2">
               {activeSection.tips.map((tip, idx) => (
                 <span key={idx} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-md border border-pink-100">
                   💡 {tip}
                 </span>
               ))}
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4 relative">
          <textarea
            className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-base leading-relaxed focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none"
            placeholder={activeSection.placeholder}
            value={planContent[activeSectionId] || ''}
            onChange={(e) => handleContentChange(e.target.value)}
          />

          {aiSuggestions[activeSectionId] && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-4 animate-slide-up relative">
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
              <h4 className="text-pink-900 font-bold mb-2 flex items-center gap-2">
                <Sparkles size={16} />
                تحسينات التسويق الذكية
              </h4>
              <p className="text-sm text-slate-600 mb-3 pl-4 border-r-2 border-pink-200">
                {aiSuggestions[activeSectionId].advice}
              </p>
              <div className="bg-white p-3 rounded-lg border border-pink-100 text-sm text-slate-700 mb-3 max-h-40 overflow-y-auto">
                {aiSuggestions[activeSectionId].refined}
              </div>
              <button 
                onClick={acceptRefinement}
                className="text-xs bg-pink-600 text-white px-3 py-1.5 rounded-lg hover:bg-pink-700 flex items-center gap-1"
              >
                <Check size={12} />
                استخدام النص المقترح
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="text-xs text-slate-400 font-medium">
             {planContent[activeSectionId]?.length || 0} حرف
          </div>
          <button
            onClick={generateImprovement}
            disabled={isImproving || !planContent[activeSectionId] || planContent[activeSectionId].length < 10}
            className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-pink-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImproving ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
            تحسين الصياغة التسويقية
          </button>
        </div>
      </div>

    </div>
  );
};

export default InteractiveMarketingPlan;