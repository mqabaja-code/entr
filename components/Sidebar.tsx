import React from 'react';
import { Section } from '../types';
import { GraduationCap, Rocket } from 'lucide-react';

interface SidebarProps {
  sections: Section[];
  activeTab: string;
  onTabChange: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeTab, onTabChange, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:sticky top-0 right-0 h-screen z-50
          w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out border-l border-slate-800
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-8 flex flex-col items-center justify-center border-b border-slate-800 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20 ring-1 ring-white/10 relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Rocket size={40} className="text-white drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-black text-center leading-tight text-white tracking-tight">ريادة الأعمال <span className="text-orange-500">2</span></h2>
          <p className="text-[10px] text-slate-400 mt-2 text-center font-bold tracking-[0.2em] uppercase">Entrepreneurship</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => {
                  onTabChange(section.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-right transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-900/50 translate-x-[-4px]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}
                `}
              >
                <Icon size={20} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`} />
                <span className="text-sm font-bold relative z-10">{section.title}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-5 border-t border-slate-800 bg-[#020617] text-center">
           <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity">
             <GraduationCap size={14} />
             منصة التعليم الريادي
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;