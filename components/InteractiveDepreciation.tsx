import React, { useState } from 'react';
import { Calculator, Search, Sparkles, Trash2, Plus, Info, RefreshCw, Loader2, TrendingDown } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface AssetRow {
  id: number;
  name: string;
  price: number;
  rate: number; // Percentage
}

interface AiResult {
  assetName: string;
  estimatedLife: string;
  suggestedRate: string;
  reasoning: string;
}

const INITIAL_ROWS: AssetRow[] = [
  { id: 1, name: 'المركبة', price: 27500, rate: 10 },
  { id: 2, name: 'معدات وتجهيزات المستودع', price: 12500, rate: 20 },
  { id: 3, name: 'السكاكين', price: 9000, rate: 20 },
  { id: 4, name: 'أوعية الطبخ', price: 15000, rate: 20 },
  { id: 5, name: 'الأثاث', price: 11500, rate: 20 },
];

const InteractiveDepreciation: React.FC = () => {
  // Table State
  const [rows, setRows] = useState<AssetRow[]>(INITIAL_ROWS);
  
  // AI Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  // --- Table Logic ---
  const updateRow = (id: number, field: keyof AssetRow, value: string | number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), name: 'أصل جديد', price: 0, rate: 10 }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const resetTable = () => {
    setRows(INITIAL_ROWS);
  };

  // Calculations
  const calculateRow = (row: AssetRow) => {
    const annualDep = row.price * (row.rate / 100);
    const netValue = row.price - annualDep;
    return { annualDep, netValue };
  };

  const totals = rows.reduce((acc, row) => {
    const { annualDep, netValue } = calculateRow(row);
    return {
      price: acc.price + row.price,
      annualDep: acc.annualDep + annualDep,
      netValue: acc.netValue + netValue
    };
  }, { price: 0, annualDep: 0, netValue: 0 });

  // --- AI Logic ---
  const searchDepreciationInfo = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setAiResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as an accounting expert. Provide the estimated useful life and standard annual depreciation rate (straight-line method) for the following asset: "${searchTerm}".
        Provide the answer in Arabic.
        
        Output JSON format:
        {
          "assetName": "The asset name in Arabic",
          "estimatedLife": "Range in years (e.g. 5-7 سنوات)",
          "suggestedRate": "Percentage number only (e.g. 20)",
          "reasoning": "Brief explanation why"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              assetName: { type: Type.STRING },
              estimatedLife: { type: Type.STRING },
              suggestedRate: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        setAiResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. Definitions Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <TrendingDown className="text-white" />
            مفهوم الإهلاك (Depreciation)
          </h3>
          <p className="text-orange-100 mt-2">
            هو النقص التدريجي في قيمة الأصل الثابت نتيجة الاستخدام، التقادم، أو مضي المدة.
            <br />
            (توزيع تكلفة الأصل على فترات العمر الإنتاجي).
          </p>
        </div>
        
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 mb-2">1. تكلفة الأصل الثابت</h4>
            <p className="text-sm text-slate-600">سعر الشراء + كافة المصاريف حتى يصبح جاهزاً للاستخدام (نقل، تركيب، جمارك).</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h4 className="font-bold text-red-800 mb-2">2. العمر الإنتاجي</h4>
            <p className="text-sm text-slate-600">المدة الزمنية المقدرة لاستفادة المشروع من الأصل (بالسنوات أو ساعات العمل).</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h4 className="font-bold text-purple-800 mb-2">3. قيمة الخردة</h4>
            <p className="text-sm text-slate-600">القيمة البيعية المتوقعة للأصل في نهاية عمره الإنتاجي (بعد أن يصبح غير صالح للعمل).</p>
          </div>
        </div>
      </div>

      {/* 2. AI Estimator Tool */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-xs">
              <Sparkles size={16} />
              مساعد الذكاء الاصطناعي
            </div>
            <h3 className="text-2xl font-bold">لا تعرف نسبة الإهلاك المناسبة؟</h3>
            <p className="text-slate-300 text-sm">
              أدخل اسم أي أداة أو جهاز (مثال: "ماكينة قهوة"، "شاحنة تبريد") وسيقوم النظام بتقدير العمر الافتراضي ونسبة الإهلاك السنوية لك.
            </p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDepreciationInfo()}
                placeholder="اكتب اسم الأصل هنا..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button 
                onClick={searchDepreciationInfo}
                disabled={isSearching || !searchTerm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                بحث
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {aiResult && (
            <div className="flex-1 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in">
              <h4 className="text-xl font-bold mb-4 flex justify-between items-center">
                {aiResult.assetName}
                <span className="text-xs bg-indigo-500 px-2 py-1 rounded text-white font-normal">تقديري</span>
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-slate-300 text-sm">العمر الإنتاجي:</span>
                  <span className="font-bold text-emerald-400">{aiResult.estimatedLife}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-slate-300 text-sm">نسبة الإهلاك السنوية:</span>
                  <span className="font-bold text-yellow-400 text-xl">{aiResult.suggestedRate}%</span>
                </div>
                <div className="bg-black/20 p-3 rounded-lg text-xs text-slate-300 leading-relaxed">
                  {aiResult.reasoning}
                </div>
                <button 
                  onClick={() => {
                    const rate = parseFloat(aiResult.suggestedRate) || 10;
                    setRows([...rows, { id: Date.now(), name: aiResult.assetName, price: 0, rate: rate }]);
                  }}
                  className="w-full bg-white text-slate-900 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> إضافة للجدول
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Interactive Calculation Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">جدول احتساب قسط الإهلاك (القسط الثابت)</h3>
              <p className="text-xs text-slate-500">
                القسط السنوي = قيمة الشراء × نسبة الإهلاك
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addRow} className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors">
              <Plus size={16} /> إضافة عنصر
            </button>
            <button onClick={resetTable} className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg font-bold text-sm transition-colors">
              <RefreshCw size={16} /> إعادة تعيين
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-orange-200 text-orange-900 text-sm">
                <th className="p-4 w-1/3 text-right">عناصر الموجودات</th>
                <th className="p-4 border-l border-orange-300">قيمة الشراء</th>
                <th className="p-4 border-l border-orange-300 w-32">نسبة الإهلاك</th>
                <th className="p-4 border-l border-orange-300">قيمة الإهلاك السنوي</th>
                <th className="p-4 border-l border-orange-300">صافي القيمة (نهاية السنة)</th>
                <th className="p-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {rows.map((row) => {
                const { annualDep, netValue } = calculateRow(row);
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 text-right">
                      <input 
                        type="text" 
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                        className="w-full bg-transparent outline-none focus:border-b-2 focus:border-indigo-500 placeholder:text-slate-300"
                        placeholder="اسم الأصل..."
                      />
                    </td>
                    <td className="p-3 border-l border-slate-100">
                      <input 
                        type="number" 
                        value={row.price || ''}
                        onChange={(e) => updateRow(row.id, 'price', Number(e.target.value))}
                        className="w-24 text-center bg-slate-50 border border-slate-200 rounded p-1 focus:ring-2 focus:ring-orange-200 outline-none"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3 border-l border-slate-100">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-orange-600 font-bold">%</span>
                        <input 
                          type="number" 
                          value={row.rate || ''}
                          onChange={(e) => updateRow(row.id, 'rate', Number(e.target.value))}
                          className="w-16 text-center font-bold text-orange-600 bg-transparent border-b border-slate-200 focus:border-orange-500 outline-none"
                        />
                      </div>
                    </td>
                    <td className="p-3 border-l border-slate-100 font-bold text-red-600 bg-red-50/10">
                      {Math.round(annualDep).toLocaleString()}
                    </td>
                    <td className="p-3 border-l border-slate-100 font-bold text-slate-800">
                      {Math.round(netValue).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => removeRow(row.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-orange-100 text-orange-900 font-bold border-t-2 border-orange-300">
              <tr>
                <td className="p-4 text-right">المجموع الكلي</td>
                <td className="p-4 border-l border-orange-200 text-lg">{totals.price.toLocaleString()}</td>
                <td className="p-4 border-l border-orange-200 text-slate-400">---</td>
                <td className="p-4 border-l border-orange-200 text-red-700 text-lg">{Math.round(totals.annualDep).toLocaleString()}</td>
                <td className="p-4 border-l border-orange-200 text-emerald-800 text-lg">{Math.round(totals.netValue).toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};

export default InteractiveDepreciation;