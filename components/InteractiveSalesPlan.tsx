import React, { useState } from 'react';
import { Calculator, RefreshCw, ArrowRightCircle, Percent, Eraser } from 'lucide-react';

const MONTHS = Array.from({ length: 9 }, (_, i) => i + 1);

interface MonthData {
  cashSales: number;
  costOfSales: number;
  generalExpenses: number;
  loanInterest: number;
  preOperatingCosts: number;
  depreciation: number;
}

const INITIAL_ROW: MonthData = {
  cashSales: 0,
  costOfSales: 0,
  generalExpenses: 0,
  loanInterest: 0,
  preOperatingCosts: 0,
  depreciation: 0,
};

const InteractiveSalesPlan: React.FC = () => {
  // Initialize with independent objects for each month
  const [data, setData] = useState<MonthData[]>(Array.from({ length: 9 }, () => ({ ...INITIAL_ROW })));
  const [taxRate, setTaxRate] = useState(20);

  const updateCell = (monthIndex: number, field: keyof MonthData, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newData = [...data];
    newData[monthIndex] = { ...newData[monthIndex], [field]: numValue };
    setData(newData);
  };

  const fillRow = (field: keyof MonthData) => {
    const val = data[0][field];
    const newData = data.map(m => ({ ...m, [field]: val }));
    setData(newData);
  };

  const resetAll = () => {
    setData(Array.from({ length: 9 }, () => ({ ...INITIAL_ROW })));
  };

  const calculateMonth = (monthIndex: number) => {
    const m = data[monthIndex];
    
    // 1. Gross Profit
    const grossProfit = m.cashSales - m.costOfSales;

    // 2. Total Expenses
    const totalCosts = m.generalExpenses + m.loanInterest + m.preOperatingCosts + m.depreciation;

    // 3. Net Profit
    const netProfit = grossProfit - totalCosts;

    // 4. Taxes (Only if profit is positive)
    const taxes = netProfit > 0 ? netProfit * (taxRate / 100) : 0;

    // 5. Net Profit After Tax
    const netProfitAfterTax = netProfit - taxes;

    return {
      grossProfit,
      totalCosts,
      netProfit,
      taxes,
      netProfitAfterTax
    };
  };

  const renderInputRow = (label: string, field: keyof MonthData, bgColor: string = 'bg-white') => (
    <tr className={`${bgColor} hover:bg-slate-50 transition-colors group`}>
      <td className="p-3 text-right font-bold sticky right-0 bg-white border-l border-slate-200 z-10 flex items-center justify-between gap-2 group-hover:bg-slate-50 transition-colors min-h-[50px]">
        <span>{label}</span>
        <button 
          onClick={() => fillRow(field)}
          title="تعميم قيمة الشهر 1 على باقي الأشهر"
          className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
        >
          <ArrowRightCircle size={16} />
        </button>
      </td>
      {data.map((row, i) => (
        <td key={i} className="p-1 border-l border-slate-100">
          <input 
            type="number" 
            value={row[field] === 0 ? '' : row[field]}
            onChange={(e) => updateCell(i, field, e.target.value)}
            placeholder="0"
            className="w-full h-full p-2 text-center bg-transparent outline-none focus:bg-indigo-50 focus:ring-1 focus:ring-indigo-200 rounded transition-all font-medium text-slate-700 placeholder:text-slate-300"
          />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">جدول المبيعات والأرباح التفاعلي</h3>
            <p className="text-xs text-slate-500">أدخل البيانات مباشرة في الجدول أدناه</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-sm font-bold text-slate-600">نسبة الضرائب:</span>
            <div className="relative">
              <input 
                type="number" 
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-16 p-1 text-center font-bold text-indigo-600 bg-white border border-slate-300 rounded focus:border-indigo-500 outline-none"
              />
              <Percent size={12} className="absolute top-1/2 left-1 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button 
            onClick={resetAll}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold"
          >
            <Eraser size={16} /> تصفير الجدول
          </button>
        </div>
      </div>

      {/* The Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              {/* Header Row */}
              <tr className="bg-orange-200 text-orange-900 border-b-2 border-orange-300">
                <th className="p-4 w-60 text-right font-black border-l border-orange-300 sticky right-0 bg-orange-200 z-10">الفئة</th>
                {MONTHS.map(m => (
                  <th key={m} className="p-4 font-bold border-l border-orange-300 min-w-[80px]">شهر {m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700">
              
              {/* Inputs */}
              {renderInputRow('المبيعات النقدية', 'cashSales')}
              {renderInputRow('ناقص تكلفة المبيعات', 'costOfSales')}

              {/* Calculated: Gross Profit */}
              <tr className="bg-sky-100 text-sky-900 font-bold border-y border-sky-200">
                <td className="p-3 text-right font-black sticky right-0 bg-sky-100 border-l border-sky-300 z-10">الربح الإجمالي</td>
                {data.map((_, i) => (
                  <td key={i} className="p-3 border-l border-sky-200 font-mono">
                    {calculateMonth(i).grossProfit.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* More Inputs */}
              {renderInputRow('مجموع المصروفات العامة', 'generalExpenses')}
              {renderInputRow('فوائد القروض', 'loanInterest')}
              {renderInputRow('التكاليف السابقة للتشغيل', 'preOperatingCosts')}
              {renderInputRow('تكاليف الاستهلاك', 'depreciation')}

              {/* Calculated: Total Costs */}
              <tr className="bg-white font-bold text-red-600 border-y border-slate-200">
                <td className="p-3 text-right font-black sticky right-0 bg-white border-l border-slate-200 z-10">مجموع التكاليف</td>
                {data.map((_, i) => (
                  <td key={i} className="p-3 border-l border-slate-100 font-mono">
                    {calculateMonth(i).totalCosts.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Calculated: Net Profit */}
              <tr className="bg-sky-100 text-sky-900 font-bold border-y border-sky-200">
                <td className="p-3 text-right font-black sticky right-0 bg-sky-100 border-l border-sky-300 z-10">الربح الصافي</td>
                {data.map((_, i) => (
                  <td key={i} className="p-3 border-l border-sky-200 font-mono">
                    {calculateMonth(i).netProfit.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Calculated: Tax */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold sticky right-0 bg-white border-l border-slate-200 z-10">
                  الضرائب المقررة ({taxRate}%)
                </td>
                {data.map((_, i) => (
                  <td key={i} className="p-3 border-l border-slate-100 font-mono text-slate-500">
                    {Math.round(calculateMonth(i).taxes).toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Calculated: Net Profit After Tax */}
              <tr className="bg-orange-100 text-orange-900 font-black border-t-2 border-orange-300 text-base">
                <td className="p-4 text-right sticky right-0 bg-orange-100 border-l border-orange-300 z-10">الربح الصافي بعد الضرائب</td>
                {data.map((_, i) => (
                  <td key={i} className="p-4 border-l border-orange-200 font-mono text-emerald-700">
                    {Math.round(calculateMonth(i).netProfitAfterTax).toLocaleString()}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 px-2">
        <span>* يمكنك استخدام زر السهم (→) بجانب اسم الفئة لنسخ قيمة الشهر الأول لجميع الأشهر.</span>
        <span>* العملة الافتراضية: العملة المحلية</span>
      </div>

    </div>
  );
};

export default InteractiveSalesPlan;