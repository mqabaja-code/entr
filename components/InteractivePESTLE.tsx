import React, { useState } from 'react';
import { Globe, DollarSign, Users, Cpu, Scale, Leaf, Loader2, Search } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const FACTORS = [
  { id: 'political', title: 'سياسي (Political)', icon: Globe, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'economic', title: 'اقتصادي (Economic)', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'social', title: 'اجتماعي (Social)', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'technological', title: 'تكنولوجي (Technological)', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'legal', title: 'قانوني (Legal)', icon: Scale, color: 'text-slate-500', bg: 'bg-slate-50' },
  { id: 'environmental', title: 'بيئي (Environmental)', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
];

const InteractivePESTLE: React.FC = () => {
  const [data, setData] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ summary: string, keyRisks: string[] } | null>(null);

  const analyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze this PESTLE analysis for a business context:
        ${JSON.stringify(data)}
        
        Provide:
        1. A summary of the external environment favorability.
        2. Identify the top 3 biggest external risks mentioned.
        Output JSON: { summary: string, keyRisks: string[] } (in Arabic).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.OBJECT,
             properties: {
                summary: { type: Type.STRING },
                keyRisks: { type: Type.ARRAY, items: { type: Type.STRING } }
             }
          }
        }
      });
      
      if(response.text) setResult(JSON.parse(response.text));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 bg-slate-900 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">تحليل البيئة الخارجية (PESTLE)</h3>
        <p className="text-slate-400">ادرس العوامل الخارجية التي قد تؤثر على نجاح مشروعك</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FACTORS.map((f) => (
          <div key={f.id} className="flex flex-col gap-2">
            <div className={`flex items-center gap-2 font-bold ${f.color}`}>
              <div className={`p-2 rounded-lg ${f.bg}`}><f.icon size={18} /></div>
              {f.title}
            </div>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none h-24"
              placeholder="اكتب العوامل هنا..."
              value={data[f.id] || ''}
              onChange={(e) => setData({ ...data, [f.id]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
        <button
          onClick={analyze}
          disabled={isAnalyzing}
          className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70 mb-6"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />}
          تحليل السياق الخارجي
        </button>

        {result && (
          <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-slide-up">
            <h4 className="font-bold text-lg mb-3">ملخص البيئة الخارجية</h4>
            <p className="text-slate-600 mb-4 leading-relaxed">{result.summary}</p>
            <h4 className="font-bold text-red-600 text-sm mb-2">المخاطر الرئيسية المحتملة:</h4>
            <ul className="space-y-2">
              {result.keyRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-red-50 p-2 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractivePESTLE;