import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import { COURSE_SECTIONS } from './constants';
import { Menu, GraduationCap, Rocket, Lightbulb, TrendingUp, Target, Users, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(COURSE_SECTIONS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSection = COURSE_SECTIONS.find(s => s.id === activeTabId) || COURSE_SECTIONS[0];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-['Cairo']" dir="rtl">
      {/* Sidebar */}
      <Sidebar 
        sections={COURSE_SECTIONS} 
        activeTab={activeTabId} 
        onTabChange={setActiveTabId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 flex flex-col">
        
        {/* Mobile Header Toggle */}
        <div className="md:hidden bg-[#0f172a] text-white p-4 flex items-center justify-between shadow-lg z-20 sticky top-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
              <Rocket size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">ريادة الأعمال 2</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto scroll-smooth">
          
          {/* HERO SECTION / LANDING PAGE HEADER */}
          <div className="bg-[#0f172a] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden mb-10 shadow-2xl shadow-slate-900/20 border border-slate-800 group">
            
            {/* Background Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -mr-40 -mt-40 mix-blend-screen"></div>
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-screen"></div>
            </div>

            <div className="relative z-10">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-orange-400 uppercase tracking-widest">
                       <GraduationCap size={16} />
                       مساق ريادة الأعمال
                     </div>
                     <h1 className="text-3xl md:text-5xl font-black leading-tight">
                       رحلتك من الفكرة إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">المشروع الناجح</span>
                     </h1>
                     <p className="text-slate-400 text-lg leading-relaxed">
                       استكشف أدوات التخطيط، ونماذج العمل، واستراتيجيات التسويق التي يحتاجها كل رائد أعمال لبناء شركة ناشئة قوية ومستدامة.
                     </p>
                  </div>
                  <div className="hidden md:block relative">
                     <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 to-blue-500/30 blur-2xl rounded-full"></div>
                     <Rocket size={140} className="relative z-10 text-white drop-shadow-2xl transform -rotate-12" />
                  </div>
               </div>
            </div>
          </div>

          <ContentDisplay section={activeSection} />

          <div className="mt-12 text-center text-slate-400 text-sm">
            &copy; 2024 منصة ريادة الأعمال. جميع الحقوق محفوظة.
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;