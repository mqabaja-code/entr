import React, { useState } from 'react';
import { ShieldAlert, Lightbulb, TrendingUp, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface SWOTData {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

interface AnalysisResult {
  score: number;
  strategicAdvice: string;
  actionPoints: string[];
}

const InteractiveSWOT: React.FC = () => {
  const [data, setData] = useState<SWOTData>({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze this SWOT analysis for a startup:
        ${JSON.stringify(data)}
        
        Provide:
        1. A viability score (0-100).
        2. Strategic advice on how to use Strengths to capture Opportunities (SO Strategy) and minimize Threats.
        3. 3 concrete action points.
        Output JSON: { score: number, strategicAdvice: string, actionPoints: string[] } (in Arabic).
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
                strategicAdvice: { type: Type.STRING },
                actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
             }
          }
        }
      });
      
      if(response.text) setResult(JSON.parse(response.text));
    } catch (e) {
      console.error(e);
      alert("حدث خطأ في التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderSection = (title: string, field: keyof SWOTData, color: string, icon: React.ReactNode) => (
    <div className={`p-4 rounded-xl border-2 ${color} bg-white h-full flex flex-col`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-bold text-lg">{title}</h4>
      </div>
      <textarea
        className="w-full flex-1 p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:ring-2 ring-indigo-500/20 resize-none min-h-[120px]"
        placeholder={`اكتب ${title} هنا...`}
        value={data[field]}
        onChange={e => setData(prev => ({ ...prev, [field]: e.target.value }))}
      />
    </div>
  );

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">تحليل SWOT التفاعلي</h3>
        <p className="text-slate-500">حلل نقاط القوة والضعف والفرص والتهديدات لمشروعك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderSection('نقاط القوة (Strengths)', 'strengths', 'border-emerald-100', <ShieldAlert className="text-emerald-500" />)}
        {renderSection('نقاط الضعف (Weaknesses)', 'weaknesses', 'border-red-100', <AlertTriangle className="text-red-500" />)}
        {renderSection('الفرص (Opportunities)', 'opportunities', 'border-blue-100', <Lightbulb className="text-blue-500" />)}
        {renderSection('التهديدات (Threats)', 'threats', 'border-orange-100', <TrendingUp className="text-orange-500" />)}
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={analyze}
          disabled={isAnalyzing}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
          فحص الخطة الاستراتيجية
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h4 className="font-bold text-lg text-indigo-900">نتائج التحليل</h4>
            <div className={`text-2xl font-black ${result.score > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{result.score}/100</div>
          </div>
          <div className="space-y-4">
            <div>
              <h5 className="font-bold text-slate-700 mb-2">النصيحة الاستراتيجية:</h5>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">{result.strategicAdvice}</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-700 mb-2">خطوات العمل المقترحة:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {result.actionPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveSWOT;