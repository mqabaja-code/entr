import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  RefreshCw,
  Calculator,
  Wallet
} from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  debit: number | null; // المدين (داخل +)
  credit: number | null; // الدائن (خارج -)
  balance: number; // الرصيد
}

const INITIAL_DATA: Transaction[] = [
  { id: 1, date: '23/1', description: 'الرصيد الافتتاحي', debit: null, credit: null, balance: 3500 },
  { id: 2, date: '23/1', description: 'استلام قرض نقدي', debit: 20500, credit: null, balance: 24000 },
  { id: 3, date: '24/1', description: 'دفعة نقدية للسيد رامي (أرض)', debit: null, credit: 8000, balance: 16000 },
  { id: 4, date: '24/1', description: 'شراء أجهزة', debit: null, credit: 2875, balance: 13125 },
  { id: 5, date: '24/1', description: 'شراء خردوات ومثبتات', debit: null, credit: 895, balance: 12230 },
];

const InteractiveLedger: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [newEntry, setNewEntry] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'debit' // 'debit' or 'credit'
  });

  const handleAdd = () => {
    if (!newEntry.description || !newEntry.amount) return;

    const amountVal = parseFloat(newEntry.amount);
    const lastBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
    
    let newBalance = lastBalance;
    let debitVal: number | null = null;
    let creditVal: number | null = null;

    if (newEntry.type === 'debit') {
      debitVal = amountVal;
      newBalance += amountVal;
    } else {
      creditVal = amountVal;
      newBalance -= amountVal;
    }

    const newItem: Transaction = {
      id: Date.now(),
      date: newEntry.date || new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric'}),
      description: newEntry.description,
      debit: debitVal,
      credit: creditVal,
      balance: newBalance
    };

    setTransactions([...transactions, newItem]);
    setNewEntry({ date: '', description: '', amount: '', type: 'debit' });
  };

  const resetLedger = () => {
    setTransactions(INITIAL_DATA);
  };

  const currentBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  return (
    <div className="space-y-10">
      
      {/* 1. Educational Section (Explanation) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowDownLeft size={100} className="text-emerald-600" />
          </div>
          <div className="p-3 bg-white rounded-full shadow-sm mb-4 z-10">
            <ArrowDownLeft size={32} className="text-emerald-600" />
          </div>
          <h4 className="text-xl font-black text-emerald-800 mb-2 z-10">الجانب المدين (Debit)</h4>
          <p className="text-emerald-700 font-bold text-lg mb-2 z-10">نقد داخل (+)</p>
          <div className="flex gap-2 mt-2 z-10">
            {['بيع بضاعة', 'قبض إيراد', 'استلام قرض'].map((item, i) => (
              <span key={i} className="text-xs bg-white/60 px-2 py-1 rounded text-emerald-900 border border-emerald-200">{item}</span>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 p-4 opacity-10">
            <ArrowUpRight size={100} className="text-red-600" />
          </div>
          <div className="p-3 bg-white rounded-full shadow-sm mb-4 z-10">
            <ArrowUpRight size={32} className="text-red-600" />
          </div>
          <h4 className="text-xl font-black text-red-800 mb-2 z-10">الجانب الدائن (Credit)</h4>
          <p className="text-red-700 font-bold text-lg mb-2 z-10">نقد خارج (-)</p>
          <div className="flex gap-2 mt-2 z-10">
            {['شراء أصول', 'دفع رواتب', 'صرف مصاريف'].map((item, i) => (
              <span key={i} className="text-xs bg-white/60 px-2 py-1 rounded text-red-900 border border-red-200">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. The Interactive Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-400" />
            <div>
              <h3 className="font-bold text-lg">دفتر الأستاذ التفاعلي</h3>
              <p className="text-xs text-slate-400">سجل حركاتك المالية وراقب الرصيد الجاري</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 flex flex-col items-end">
            <span className="text-xs text-indigo-300">الرصيد الحالي</span>
            <span className="font-mono font-bold text-xl">{currentBalance.toLocaleString()}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold w-1/3">العملية المالية</th>
                <th className="p-4 font-bold text-emerald-600 bg-emerald-50/50 border-r border-slate-200 text-center">
                  (المدين) <br/> نقد داخل (+)
                </th>
                <th className="p-4 font-bold text-red-600 bg-red-50/50 border-r border-slate-200 text-center">
                  (الدائن) <br/> نقد خارج (-)
                </th>
                <th className="p-4 font-bold bg-indigo-50/50 border-r border-slate-200 text-center">
                  الرصيد الجاري
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((t, idx) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{t.date}</td>
                  <td className="p-4 font-bold text-slate-700">{t.description}</td>
                  <td className="p-4 text-center border-r border-slate-100 text-emerald-600 font-bold bg-emerald-50/10">
                    {t.debit ? t.debit.toLocaleString() : '-'}
                  </td>
                  <td className="p-4 text-center border-r border-slate-100 text-red-500 font-bold bg-red-50/10">
                    {t.credit ? t.credit.toLocaleString() : '-'}
                  </td>
                  <td className="p-4 text-center border-r border-slate-100 font-black font-mono text-indigo-700 bg-indigo-50/10">
                    {t.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            
            {/* Input Row */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td className="p-2">
                  <input 
                    type="text" 
                    placeholder="التاريخ"
                    className="w-full p-2 rounded-lg border border-slate-300 text-center text-xs"
                    value={newEntry.date}
                    onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    placeholder="وصف العملية (مثال: بيع بضائع)"
                    className="w-full p-2 rounded-lg border border-slate-300 text-right text-xs"
                    value={newEntry.description}
                    onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                  />
                </td>
                <td colSpan={2} className="p-2">
                  <div className="flex gap-2">
                    <select 
                      className={`p-2 rounded-lg border border-slate-300 text-xs font-bold ${newEntry.type === 'debit' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}
                      value={newEntry.type}
                      onChange={e => setNewEntry({...newEntry, type: e.target.value})}
                    >
                      <option value="debit">مدين (+)</option>
                      <option value="credit">دائن (-)</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder="المبلغ"
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-center text-xs font-bold"
                      value={newEntry.amount}
                      onChange={e => setNewEntry({...newEntry, amount: e.target.value})}
                    />
                  </div>
                </td>
                <td className="p-2 text-center">
                  <button 
                    onClick={handleAdd}
                    className="w-full bg-slate-800 text-white p-2 rounded-lg shadow-md hover:bg-slate-900 transition-colors flex items-center justify-center gap-1 text-xs font-bold"
                  >
                    <Plus size={14} /> إضافة
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calculator size={14} />
            <span>يتم حساب الرصيد تراكمياً بشكل تلقائي</span>
          </div>
          <button 
            onClick={resetLedger}
            className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
          >
            <RefreshCw size={14} /> إعادة تعيين الدفتر
          </button>
        </div>
      </div>

      {/* Visual Guide */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-white/10 rounded-full">
          <Wallet size={32} className="text-yellow-400" />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">قاعدة ذهبية في دفتر الأستاذ</h4>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            الرصيد الجديد = الرصيد السابق + المبالغ الداخلة (المدين) - المبالغ الخارجة (الدائن).
            <br/>
            إذا كان الرصيد يتناقص باستمرار دون إيرادات جديدة، فأنت في خطر نفاد السيولة!
          </p>
        </div>
      </div>

    </div>
  );
};

export default InteractiveLedger;