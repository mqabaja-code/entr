import React, { useState } from 'react';
import { Calculator, HelpCircle, RefreshCw } from 'lucide-react';

const InteractiveIncomeStatement: React.FC = () => {
  // Initial values set to zero for direct entry
  const [values, setValues] = useState({
    cashSales: 0,
    creditSales: 0,
    beginningInventory: 0,
    purchases: 0,
    endingInventory: 0,
    salaries: 0,
    electricity: 0,
    ads: 0,
    otherExpenses: 0,
    depreciation: 0,
    taxRate: 0
  });

  const handleChange = (field: keyof typeof values, val: string) => {
    setValues({ ...values, [field]: parseFloat(val) || 0 });
  };

  // Calculations
  const totalSales = values.cashSales + values.creditSales;
  const goodsAvailable = values.beginningInventory + values.purchases;
  const cogs = goodsAvailable - values.endingInventory; // Cost of Goods Sold
  const grossProfit = totalSales - cogs;
  
  const totalGeneralExpenses = values.salaries + values.electricity + values.ads + values.otherExpenses;
  const netProfit = grossProfit - totalGeneralExpenses - values.depreciation;
  
  const taxAmount = netProfit > 0 ? netProfit * (values.taxRate / 100) : 0;
  const netProfitAfterTax = netProfit - taxAmount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">قائمة الدخل (Income Statement)</h3>
            <p className="text-sm text-slate-500">حاسبة تفاعلية لتحديد صافي الربح والخسارة</p>
          </div>
        </div>
        <button 
          onClick={() => setValues({
            cashSales: 0, creditSales: 0, beginningInventory: 0, purchases: 0, endingInventory: 0,
            salaries: 0, electricity: 0, ads: 0, otherExpenses: 0, depreciation: 0, taxRate: 0
          })}
          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-bold"
        >
          <RefreshCw size={16} /> تصفير البيانات
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Formulas & Explanations */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-sm text-emerald-800 font-medium leading-relaxed">
            <strong>الإيرادات:</strong> هي المبيعات النقدية + المبيعات الآجلة.
          </div>
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-2">
            <strong className="text-amber-900 block mb-1">معادلة كلفة السلع المباعة:</strong>
            <div className="text-xs text-amber-800 space-y-1 font-mono">
              <div className="flex justify-between"><span>+ قيمة المخزون أول المدة</span></div>
              <div className="flex justify-between"><span>+ قيمة المشتريات خلال المدة</span></div>
              <div className="flex justify-between border-t border-amber-200 pt-1"><span>- قيمة المخزون آخر المدة</span></div>
              <div className="font-bold pt-1">= كلفة السلعة المباعة</div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 font-medium">
            <strong>إجمالي الربح:</strong> المبيعات - كلفة السلع المباعة.
          </div>

          <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-sm text-slate-700 font-medium">
            <strong>صافي الربح:</strong> إجمالي الربح - (المصروفات العامة + الاستهلاك).
          </div>
        </div>

        {/* Right Side: The Statement Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-4 w-32 text-center">الفرعي</th>
                  <th className="p-4 w-32 text-center border-r border-slate-200">الكلي</th>
                  <th className="p-4 border-r border-slate-200">البيان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium">
                
                {/* Sales Section */}
                <tr className="bg-slate-50/50"><td colSpan={3} className="p-2 px-4 font-bold text-indigo-900">المبيعات</td></tr>
                <tr>
                  <td className="p-2 text-center">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.cashSales || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('cashSales', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">البيع نقداً</td>
                </tr>
                <tr>
                  <td className="p-2 text-center border-b border-slate-400">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.creditSales || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('creditSales', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">البيع بالآجل</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-100 border-b border-slate-300">
                    {totalSales.toLocaleString()}
                  </td>
                  <td className="p-2 px-4 font-bold border-r border-slate-100">مجموع المبيعات</td>
                </tr>

                {/* COGS Section */}
                <tr className="bg-slate-50/50"><td colSpan={3} className="p-2 px-4 font-bold text-indigo-900">كلفة السلع المُباعة</td></tr>
                <tr>
                  <td className="p-2 text-center">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.beginningInventory || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('beginningInventory', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">المخزون أول المدة</td>
                </tr>
                <tr>
                  <td className="p-2 text-center border-b border-slate-400">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.purchases || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('purchases', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">+ المشتريات</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="p-2 text-center font-bold text-slate-600 border-r border-slate-100">
                    {goodsAvailable.toLocaleString()}
                  </td>
                  <td className="p-2 px-4 border-r border-slate-100 text-xs text-slate-500">كلفة البضائع المعروضة للبيع</td>
                </tr>
                <tr>
                  <td className="p-2 text-center border-b border-slate-400">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.endingInventory || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('endingInventory', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">- المخزون آخر المدة</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="p-2 text-center font-bold text-red-600 border-r border-slate-100 border-b border-slate-300">
                    {cogs.toLocaleString()}
                  </td>
                  <td className="p-2 px-4 font-bold border-r border-slate-100 text-red-600">كلفة السلع المُباعة</td>
                </tr>

                {/* Gross Profit */}
                <tr className="bg-indigo-50/30">
                  <td className="p-3 text-center text-lg font-black text-indigo-700 border-b-2 border-indigo-200">
                    {grossProfit.toLocaleString()}
                  </td>
                  <td className="border-r border-indigo-100"></td>
                  <td className="p-3 px-4 font-black text-indigo-800 border-r border-indigo-100">إجمالي الربح</td>
                </tr>

                {/* Expenses Section */}
                <tr className="bg-slate-50/50"><td colSpan={3} className="p-2 px-4 font-bold text-indigo-900">المصروفات العامة</td></tr>
                <tr>
                  <td className="p-2 text-center">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.salaries || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('salaries', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">الرواتب / الأجور</td>
                </tr>
                <tr>
                  <td className="p-2 text-center">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.electricity || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('electricity', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">الكهرباء</td>
                </tr>
                <tr>
                  <td className="p-2 text-center">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.ads || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('ads', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">الإعلانات</td>
                </tr>
                <tr>
                  <td className="p-2 text-center border-b border-slate-400">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 focus:bg-white transition-all" 
                      value={values.otherExpenses || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('otherExpenses', e.target.value)} 
                    />
                  </td>
                  <td className="border-r border-slate-100"></td>
                  <td className="p-2 px-4 border-r border-slate-100">النفقات الأخرى</td>
                </tr>
                
                <tr>
                  <td></td>
                  <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-100 border-b border-slate-300">
                    {totalGeneralExpenses.toLocaleString()}
                  </td>
                  <td className="p-2 px-4 font-bold border-r border-slate-100">مجموع المصروفات العامة</td>
                </tr>

                {/* Depreciation */}
                <tr>
                  <td></td>
                  <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-100 border-b-2 border-slate-400">
                    <input 
                      type="number" 
                      className="w-24 p-1 bg-transparent border-none text-center outline-none font-bold placeholder-slate-300" 
                      value={values.depreciation || ''} 
                      placeholder="0"
                      onChange={(e) => handleChange('depreciation', e.target.value)} 
                    />
                  </td>
                  <td className="p-2 px-4 font-bold border-r border-slate-100">تكاليف الاستهلاك</td>
                </tr>

                {/* Net Profit */}
                <tr className="bg-sky-50">
                  <td></td>
                  <td className="p-3 text-center font-black text-sky-700 border-r border-sky-100 text-lg">
                    {netProfit.toLocaleString()}
                  </td>
                  <td className="p-3 px-4 font-black border-r border-sky-100 text-sky-800">صافي الربح</td>
                </tr>

                {/* Tax */}
                <tr>
                  <td></td>
                  <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-100 border-b border-slate-300">
                    {Math.round(taxAmount).toLocaleString()}
                  </td>
                  <td className="p-2 px-4 font-bold border-r border-slate-100 flex items-center justify-between">
                    الضرائب المقدرة 
                    <div className="flex items-center gap-1 bg-slate-100 px-2 rounded">
                      <input 
                        type="number" 
                        value={values.taxRate || ''} 
                        onChange={(e) => handleChange('taxRate', e.target.value)}
                        className="w-8 bg-transparent text-center outline-none text-xs"
                        placeholder="0"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </td>
                </tr>

                {/* Final Profit */}
                <tr className="bg-orange-100">
                  <td></td>
                  <td className="p-4 text-center font-black text-xl text-emerald-700 border-r border-orange-200">
                    {Math.round(netProfitAfterTax).toLocaleString()}
                  </td>
                  <td className="p-4 px-4 font-black border-r border-orange-200 text-orange-900">صافي الربح بعد الضريبة</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveIncomeStatement;