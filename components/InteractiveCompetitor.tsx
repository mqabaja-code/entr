import React, { useState } from 'react';
import { Swords, Trophy, Target, Loader2, ArrowRightLeft } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface CompetitorData {
  name: string;
  price: string;
  quality: string;
  location: string;
  marketing: string;
  strengths: string;
  weaknesses: string;
}

const InteractiveCompetitor: React.FC = () => {
  const [myProject, setMyProject] = useState<CompetitorData>({ 
    name: 'مشروعي', price: '', quality: '', location: '', marketing: '', strengths: '', weaknesses: '' 
  });
  const [competitor1, setCompetitor1] = useState<CompetitorData>({ 
    name: 'المنافس الأول', price: '', quality: '', location: '', marketing: '', strengths: '', weaknesses: '' 
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ advantage: string, positioning: string } | null>(null);

  const updateData = (setter: React.Dispatch<React.SetStateAction<CompetitorData>>, field: keyof CompetitorData, value: string) => {
    setter(prev => ({ ...prev, [field]: value }));
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Compare my project vs a competitor based on this data:
        My Project: ${JSON.stringify(myProject)}
        Competitor: ${JSON.stringify(competitor1)}
        
        Identify:
        1. My Competitive Advantage (Why customers will choose me).
        2. Market Positioning advice.
        Output JSON: { advantage: string, positioning: string } (in Arabic).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.OBJECT,
             properties: {
                advantage: { type: Type.STRING },
                positioning: { type: Type.STRING }
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

  const renderColumn = (title: string, data: CompetitorData, setter: React.Dispatch<React.SetStateAction<CompetitorData>>, isPrimary = false) => (
    <div className={`flex-1 min-w-[300px] p-6 rounded-2xl ${isPrimary ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white border border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-6">
        {isPrimary ? <Target className="text-indigo-600" /> : <Swords className="text-slate-400" />}
        <input 
          value={data.name} 
          onChange={e => updateData(setter, 'name', e.target.value)}
          className={`font-bold text-xl bg-transparent border-b border-dashed ${isPrimary ? 'border-indigo-300 text-indigo-900' : 'border-slate-300 text-slate-700'} w-full focus:outline-none`}
        />
      </div>
      
      <div className="space-y-4">
        {['price', 'quality', 'location', 'marketing'].map(field => (
          <div key={field}>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
              {field === 'price' ? 'السعر' : field === 'quality' ? 'الجودة' : field === 'location' ? 'الموقع/التوزيع' : 'التسويق'}
            </label>
            <input
              value={data[field as keyof CompetitorData]}
              onChange={e => updateData(setter, field as keyof CompetitorData, e.target.value)}
              className="w-full p-2 rounded bg-white/50 border border-slate-200 text-sm"
              placeholder="..."
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-bold text-emerald-600 uppercase block mb-1">نقاط القوة</label>
          <textarea
            value={data.strengths}
            onChange={e => updateData(setter, 'strengths', e.target.value)}
            className="w-full p-2 rounded bg-emerald-50/50 border border-emerald-100 text-sm h-16 resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-red-600 uppercase block mb-1">نقاط الضعف</label>
          <textarea
            value={data.weaknesses}
            onChange={e => updateData(setter, 'weaknesses', e.target.value)}
            className="w-full p-2 rounded bg-red-50/50 border border-red-100 text-sm h-16 resize-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-6">
        {renderColumn("مشروعي", myProject, setMyProject, true)}
        {renderColumn("المنافس", competitor1, setCompetitor1)}
      </div>

      <div className="flex justify-center">
        <button
          onClick={analyze}
          disabled={isAnalyzing}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-indigo-200 hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <ArrowRightLeft />}
          مقارنة وتحديد الميزة التنافسية
        </button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-yellow-400" size={28} />
              <h3 className="text-2xl font-bold">نتيجة التحليل التنافسي</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-indigo-200 mb-2">ميزتك التنافسية (Competitive Advantage)</h4>
                <p className="leading-relaxed">{result.advantage}</p>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold text-indigo-200 mb-2">نصيحة التموضع (Positioning)</h4>
                <p className="leading-relaxed">{result.positioning}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCompetitor;