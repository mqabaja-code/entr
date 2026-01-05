import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, ArrowLeft, DollarSign } from 'lucide-react';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

interface MonthData {
  sales: number;
  loans: number;
  otherIn: number;
  directMaterial: number;
  capitalInvest: number;
  labor: number;
  generalExp: number;
  capitalCost: number;
}

const INITIAL_MONTH_DATA: MonthData = {
  sales: 0, loans: 0, otherIn: 0,
  directMaterial: 0, capitalInvest: 0, labor: 0, generalExp: 0, capitalCost: 0
};

const InteractiveCashFlow: React.FC = () => {
  const [startCash, setStartCash] = useState<number>(10000); // Initial cash for Month 1
  const [data, setData] = useState<MonthData[]>(Array(12).fill(INITIAL_MONTH_DATA));

  // Helper to update specific month data
  const updateMonth = (index: number, field: keyof MonthData, value: number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  // Helper to update start cash
  const handleStartCashChange = (val: string) => {
    setStartCash(Number(val) || 0);
  };

  // Calculate row totals for display
  const getTotals = () => {
    let currentCash = startCash;
    const results = data.map((month) => {
      const totalIn = month.sales + month.loans + month.otherIn;
      const totalOut = month.directMaterial + month.capitalInvest + month.labor + month.generalExp + month.capitalCost;
      const surplus = totalIn - totalOut;
      const endCash = currentCash + surplus;
      
      const result = {
        start: currentCash,
        totalIn,
        totalOut,
        surplus,
        end: endCash
      };
      
      // End of this month is start of next
      currentCash = endCash;
      return result;
    });
    return results;
  };

  const totals = getTotals();

  // Reset function
  const resetData = () => {
    setStartCash(10000);
    setData(Array(12).fill(INITIAL_MONTH_DATA));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">قائمة التدفق النقدي (Cash Flow)</h3>
              <p className="text-orange-100 text-sm">تتبع حركة السيولة لـ 12 شهراً القادمة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
            <span className="text-sm font-medium">النقد في بداية الشهر 1:</span>
            <div className="flex items-center gap-1 bg-white text-orange-600 px-3 py-1 rounded-lg font-bold">
              <input 
                type="number" 
                value={startCash} 
                onChange={(e) => handleStartCashChange(e.target.value)}
                className="w-24 bg-transparent outline-none text-center"
              />
              <span className="text-xs">$</span>
            </div>
          </div>
        </div>

        {/* Table Container - Scrollable */}
        <div className="overflow-x-auto relative custom-scrollbar">
          <table className="w-full text-right text-sm border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-4 sticky right-0 bg-slate-100 z-10 w-48 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">البيان / الشهر</th>
                {MONTHS.map(m => (
                  <th key={m} className="p-4 text-center min-w-[100px] border-l border-slate-200">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* SECTION A: Start Cash */}
              <tr className="bg-blue-50/30">
                <td className="p-3 font-bold text-blue-800 sticky right-0 bg-blue-50/90 backdrop-blur-sm z-10 border-l border-blue-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                  أ- النقد في أول الشهر
                </td>
                {totals.map((t, i) => (
                  <td key={i} className="p-3 text-center font-mono text-blue-700 border-l border-slate-100">
                    {t.start.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* INFLOWS */}
              <tr className="bg-emerald-50/10"><td colSpan={13} className="p-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4">التدفقات الداخلة (+)</td></tr>
              {[
                { label: 'من المبيعات', field: 'sales' },
                { label: 'من القروض', field: 'loans' },
                { label: 'من مصادر أخرى', field: 'otherIn' },
              ].map((row, rIdx) => (
                <tr key={row.field} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3 text-slate-600 font-medium sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-slate-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                    {row.label}
                  </td>
                  {data.map((m, i) => (
                    <td key={i} className="p-2 text-center border-l border-slate-100">
                      <input 
                        type="number" 
                        className="w-full text-center bg-transparent outline-none focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-200 rounded p-1 transition-all text-slate-700"
                        placeholder="0"
                        value={m[row.field as keyof MonthData] || ''}
                        onChange={(e) => updateMonth(i, row.field as keyof MonthData, Number(e.target.value))}
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* TOTAL INFLOW */}
              <tr className="bg-emerald-50 font-bold border-t border-emerald-100 border-b border-emerald-100">
                <td className="p-3 text-emerald-800 sticky right-0 bg-emerald-100 z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                  ب- مجموع النقد الداخل
                </td>
                {totals.map((t, i) => (
                  <td key={i} className="p-3 text-center text-emerald-700 font-mono border-l border-emerald-100">
                    {t.totalIn.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* OUTFLOWS */}
              <tr className="bg-red-50/10"><td colSpan={13} className="p-2 text-xs font-bold text-red-600 bg-red-50 px-4">التدفقات الخارجة (-)</td></tr>
              {[
                { label: 'تكاليف المواد المباشرة', field: 'directMaterial' },
                { label: 'استثمارات رأسمالية', field: 'capitalInvest' },
                { label: 'تكاليف العمالة', field: 'labor' },
                { label: 'مصروفات عامة', field: 'generalExp' },
                { label: 'تكاليف رأسمالية (فوائد)', field: 'capitalCost' },
              ].map((row) => (
                <tr key={row.field} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3 text-slate-600 font-medium sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-slate-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                    {row.label}
                  </td>
                  {data.map((m, i) => (
                    <td key={i} className="p-2 text-center border-l border-slate-100">
                      <input 
                        type="number" 
                        className="w-full text-center bg-transparent outline-none focus:bg-red-50 focus:ring-1 focus:ring-red-200 rounded p-1 transition-all text-slate-700"
                        placeholder="0"
                        value={m[row.field as keyof MonthData] || ''}
                        onChange={(e) => updateMonth(i, row.field as keyof MonthData, Number(e.target.value))}
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* TOTAL OUTFLOW */}
              <tr className="bg-red-50 font-bold border-t border-red-100 border-b border-red-100">
                <td className="p-3 text-red-800 sticky right-0 bg-red-100 z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                  ج- مجموع النقد الخارج
                </td>
                {totals.map((t, i) => (
                  <td key={i} className="p-3 text-center text-red-700 font-mono border-l border-red-100">
                    {t.totalOut.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* SURPLUS / DEFICIT */}
              <tr className="bg-slate-50 font-bold border-b border-slate-200">
                <td className="p-3 text-slate-700 sticky right-0 bg-slate-100 z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                  د- الفائض / العجز (ب - ج)
                </td>
                {totals.map((t, i) => (
                  <td key={i} className={`p-3 text-center font-mono border-l border-slate-200 ${t.surplus >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.surplus.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* END CASH */}
              <tr className="bg-indigo-600 text-white font-black text-base border-b-4 border-indigo-800">
                <td className="p-4 sticky right-0 bg-indigo-700 z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.2)]">
                  النقد في نهاية الشهر (أ + د)
                </td>
                {totals.map((t, i) => (
                  <td key={i} className="p-4 text-center font-mono border-l border-indigo-500/30">
                    {t.end.toLocaleString()}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 flex justify-between items-center text-xs text-slate-500 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">ملاحظة</span>
            <span>يتم ترحيل "النقد في نهاية الشهر" تلقائياً ليكون "النقد في بداية الشهر" التالي.</span>
          </div>
          <button 
            onClick={resetData}
            className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-bold"
          >
            <RefreshCw size={14} /> تصفير الجدول
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCashFlow;