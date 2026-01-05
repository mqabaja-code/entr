import React, { useState } from 'react';
import { 
  Wallet, Building2, Coins, ArrowRight, CheckCircle2, 
  HelpCircle, Box, Truck, Clock, Briefcase, TrendingUp,
  LayoutGrid, ArrowDownUp
} from 'lucide-react';

type Tab = 'assets' | 'liabilities' | 'equity' | 'activity';

interface AccountItem {
  id: string;
  name: string;
  category: 'asset' | 'liability' | 'equity';
  subCategory?: string;
}

const ITEMS_TO_SORT: AccountItem[] = [
  { id: '1', name: 'نقدية في الصندوق', category: 'asset', subCategory: 'متداولة' },
  { id: '2', name: 'قرض بنكي طويل الأجل', category: 'liability', subCategory: 'طويلة الأجل' },
  { id: '3', name: 'سيارات التوصيل', category: 'asset', subCategory: 'ثابتة' },
  { id: '4', name: 'رأس المال', category: 'equity', subCategory: '' },
  { id: '5', name: 'دائنون (موردون)', category: 'liability', subCategory: 'قصيرة الأجل' },
  { id: '6', name: 'مخزون البضاعة', category: 'asset', subCategory: 'متداولة' },
  { id: '7', name: 'أثاث مكتبي', category: 'asset', subCategory: 'ثابتة' },
  { id: '8', name: 'أرباح مبقاة', category: 'equity', subCategory: '' },
];

const InteractiveAccountTypes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('assets');
  const [draggedItem, setDraggedItem] = useState<AccountItem | null>(null);
  const [sortedItems, setSortedItems] = useState<Record<string, AccountItem[]>>({
    asset: [],
    liability: [],
    equity: []
  });
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const handleDrop = (targetCategory: 'asset' | 'liability' | 'equity') => {
    if (!draggedItem) return;

    if (draggedItem.category === targetCategory) {
      setSortedItems(prev => ({
        ...prev,
        [targetCategory]: [...prev[targetCategory], draggedItem]
      }));
      setFeedback({ msg: 'إجابة صحيحة! أحسنت', type: 'success' });
    } else {
      setFeedback({ msg: 'خطأ! حاول مرة أخرى في خانة مختلفة', type: 'error' });
    }
    setDraggedItem(null);
    setTimeout(() => setFeedback(null), 1500);
  };

  const remainingItems = ITEMS_TO_SORT.filter(item => 
    !Object.values(sortedItems).flat().find((i: any) => i.id === item.id)
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
      
      {/* Navigation */}
      <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
        {[
          { id: 'assets', label: 'الأصول (Assets)', icon: Wallet, color: 'text-emerald-600' },
          { id: 'liabilities', label: 'الخصوم (Liabilities)', icon: Building2, color: 'text-red-600' },
          { id: 'equity', label: 'حقوق الملكية (Equity)', icon: Coins, color: 'text-blue-600' },
          { id: 'activity', label: 'نشاط تفاعلي', icon: LayoutGrid, color: 'text-indigo-600' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`
              flex-1 min-w-[140px] py-4 px-4 flex flex-col md:flex-row items-center justify-center gap-2 font-bold text-sm md:text-base transition-all border-b-2
              ${activeTab === tab.id 
                ? `bg-white border-indigo-500 ${tab.color}` 
                : 'border-transparent text-slate-500 hover:bg-slate-100'}
            `}
          >
            <tab.icon size={20} className={activeTab === tab.id ? tab.color : 'text-slate-400'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex-1 bg-slate-50/30">
        
        {/* 1. ASSETS TAB */}
        {activeTab === 'assets' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <Wallet /> ما هي الأصول؟
              </h3>
              <p className="text-emerald-700/80 leading-relaxed">
                هي جميع الموارد الاقتصادية التي <span className="font-bold">تمتلكها</span> الشركة وتتوقع الاستفادة منها مستقبلاً. باختصار: "ما لنا".
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Assets */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ArrowDownUp size={20}/></div>
                  <h4 className="text-lg font-bold text-slate-800">الأصول المتداولة (Current)</h4>
                </div>
                <p className="text-sm text-slate-500 mb-4 min-h-[40px]">
                  أصول يمكن تحويلها لنقدية خلال سنة واحدة أو أقل.
                </p>
                <ul className="space-y-3">
                  {[
                    { name: 'النقدية بالصندوق/البنك', icon: Coins },
                    { name: 'المخزون (Inventory)', icon: Box },
                    { name: 'المدينون (العملاء)', icon: Briefcase },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <item.icon size={16} className="text-blue-500" />
                      <span className="text-slate-700 font-medium text-sm">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fixed Assets */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Building2 size={20}/></div>
                  <h4 className="text-lg font-bold text-slate-800">الأصول الثابتة (Fixed)</h4>
                </div>
                <p className="text-sm text-slate-500 mb-4 min-h-[40px]">
                  أصول تشترى بغرض الاستخدام طويل الأمد وليس للبيع.
                </p>
                <ul className="space-y-3">
                  {[
                    { name: 'المباني والأراضي', icon: Building2 },
                    { name: 'الآلات والمعدات', icon: Truck },
                    { name: 'أجهزة الكمبيوتر والبرامج', icon: Briefcase },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <item.icon size={16} className="text-indigo-500" />
                      <span className="text-slate-700 font-medium text-sm">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. LIABILITIES TAB */}
        {activeTab === 'liabilities' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center gap-2">
                <Building2 /> ما هي الخصوم (الالتزامات)؟
              </h3>
              <p className="text-red-700/80 leading-relaxed">
                هي الديون والتعهدات المالية التي <span className="font-bold">يجب على الشركة دفعها</span> للغير. باختصار: "ما علينا".
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Short Term */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-red-400"></div>
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-red-500" /> قصيرة الأجل (Short-term)
                </h4>
                <p className="text-sm text-slate-500 mb-4">ديون تستحق السداد خلال سنة مالية واحدة.</p>
                <div className="flex flex-wrap gap-2">
                  {['الموردون (الدائنون)', 'قروض قصيرة', 'رواتب مستحقة', 'ضرائب مستحقة'].map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{t}</span>
                  ))}
                </div>
              </div>

              {/* Long Term */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Truck size={18} className="text-red-700" /> طويلة الأجل (Long-term)
                </h4>
                <p className="text-sm text-slate-500 mb-4">ديون تمتد فترة سدادها لأكثر من سنة.</p>
                <div className="flex flex-wrap gap-2">
                  {['قروض بنكية طويلة', 'سندات', 'رهن عقاري'].map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm border border-red-200">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. EQUITY TAB */}
        {activeTab === 'equity' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Coins /> حقوق الملكية (Owner's Equity)
              </h3>
              <p className="text-blue-700/80 leading-relaxed">
                هي ما يتبقى للمالكين بعد سداد كافة الديون. وهي تمثل استثمار المالك في الشركة.
                <br/>
                <span className="font-mono text-sm bg-white/50 px-2 py-1 rounded mt-2 inline-block dir-ltr">
                  Equity = Assets - Liabilities
                </span>
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h4 className="text-center font-bold text-slate-800 mb-8">مكونات حقوق الملكية</h4>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                
                <div className="flex-1 text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <div className="text-2xl font-black text-blue-600 mb-1">+</div>
                  <div className="font-bold text-slate-700">رأس المال</div>
                  <div className="text-xs text-slate-500 mt-1">المال الذي بدأ به المشروع</div>
                </div>

                <ArrowRight className="text-slate-300 hidden md:block" />

                <div className="flex-1 text-center p-4 bg-emerald-50 rounded-xl border-2 border-emerald-100">
                  <div className="text-2xl font-black text-emerald-600 mb-1">+</div>
                  <div className="font-bold text-slate-700">الأرباح المبقاة</div>
                  <div className="text-xs text-slate-500 mt-1">أرباح أعيد استثمارها</div>
                </div>

                <ArrowRight className="text-slate-300 hidden md:block" />

                <div className="flex-1 text-center p-4 bg-red-50 rounded-xl border-2 border-red-100">
                  <div className="text-2xl font-black text-red-600 mb-1">-</div>
                  <div className="font-bold text-slate-700">المسحوبات</div>
                  <div className="text-xs text-slate-500 mt-1">ما سحبه المالك لنفسه</div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 4. ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="animate-fade-in h-full flex flex-col">
            <div className="text-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg">اختبر معلوماتك: صنف الحسابات</h3>
              <p className="text-slate-500 text-sm">اضغط على العنصر ثم اختر الصندوق المناسب</p>
            </div>

            {feedback && (
              <div className={`text-center mb-4 p-2 rounded-lg font-bold text-sm ${feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} animate-bounce`}>
                {feedback.msg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Drop Zones */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleDrop('asset')}
                  className="h-32 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors flex flex-col items-center justify-center gap-2 group"
                >
                  <Wallet className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-emerald-700">أصول (Assets)</span>
                </button>
                <div className="space-y-2">
                  {sortedItems.asset.map(item => (
                    <div key={item.id} className="bg-emerald-500 text-white p-2 rounded-lg text-sm text-center shadow-sm animate-slide-up">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleDrop('liability')}
                  className="h-32 rounded-2xl border-2 border-dashed border-red-300 bg-red-50 hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 group"
                >
                  <Building2 className="text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-red-700">خصوم (Liabilities)</span>
                </button>
                <div className="space-y-2">
                  {sortedItems.liability.map(item => (
                    <div key={item.id} className="bg-red-500 text-white p-2 rounded-lg text-sm text-center shadow-sm animate-slide-up">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleDrop('equity')}
                  className="h-32 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 group"
                >
                  <Coins className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-blue-700">حقوق ملكية (Equity)</span>
                </button>
                <div className="space-y-2">
                  {sortedItems.equity.map(item => (
                    <div key={item.id} className="bg-blue-500 text-white p-2 rounded-lg text-sm text-center shadow-sm animate-slide-up">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Source Items */}
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-400 mb-3 uppercase">العناصر المتاحة</div>
              <div className="flex flex-wrap gap-3">
                {remainingItems.length > 0 ? remainingItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setDraggedItem(item)}
                    className={`px-4 py-2 rounded-xl shadow-sm text-sm font-bold transition-all transform hover:scale-105
                      ${draggedItem?.id === item.id 
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' 
                        : 'bg-white text-slate-700 hover:bg-white border border-slate-200'}
                    `}
                  >
                    {item.name}
                  </button>
                )) : (
                  <div className="w-full text-center py-4 text-emerald-600 font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 /> تم تصنيف جميع العناصر بنجاح!
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default InteractiveAccountTypes;