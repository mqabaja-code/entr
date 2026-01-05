import React, { useState } from 'react';
import { ContentBlock, Section } from '../types';
import { CheckCircle2, ArrowLeft, BookOpen, Layout, Calculator, Info, Target, Sparkles, Video } from 'lucide-react';
import InteractiveBMC from './InteractiveBMC';
import InteractiveSWOT from './InteractiveSWOT';
import InteractivePESTLE from './InteractivePESTLE';
import InteractiveCompetitor from './InteractiveCompetitor';
import InteractiveBusinessPlan from './InteractiveBusinessPlan';
import InteractiveMarketingPlan from './InteractiveMarketingPlan';
import InteractiveMissionVision from './InteractiveMissionVision';
import InteractiveOperations from './InteractiveOperations';
import InteractiveManagement from './InteractiveManagement';
import InteractiveFuture from './InteractiveFuture';
import BusinessPlanTips from './BusinessPlanTips';
import InteractiveFinancialStatements from './InteractiveFinancialStatements';
import InteractiveBreakEven from './InteractiveBreakEven';
import InteractiveDebtorCreditor from './InteractiveDebtorCreditor';
import InteractiveAccountTypes from './InteractiveAccountTypes';
import InteractiveCostTypes from './InteractiveCostTypes';
import InteractiveLedger from './InteractiveLedger';
import InteractiveCashFlow from './InteractiveCashFlow';
import InteractiveSalesPlan from './InteractiveSalesPlan';
import InteractiveIncomeStatement from './InteractiveIncomeStatement';
import InteractiveDepreciation from './InteractiveDepreciation';
import InteractiveExam from './InteractiveExam';

const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return (
        <div className={`p-8 rounded-3xl transition-all duration-300 ${block.highlight ? 'bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100' : 'bg-white border border-slate-100'} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-indigo-500/5 mb-8`}>
          {block.title && (
            <div className="flex items-center gap-3 mb-5">
               <div className={`p-2.5 rounded-xl ${block.highlight ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-slate-100 text-slate-600'}`}>
                 {block.highlight ? <Sparkles size={20} /> : <Info size={20} />}
               </div>
               <h3 className={`text-xl font-bold ${block.highlight ? 'text-violet-900' : 'text-slate-800'}`}>{block.title}</h3>
            </div>
          )}
          <p className="text-slate-600 leading-loose text-lg font-medium">{block.content}</p>
        </div>
      );

    case 'list':
      return (
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          {block.title && (
            <div className="flex items-center gap-3 mb-8 relative z-10">
               <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                 <CheckCircle2 size={22} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">{block.title}</h3>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 relative z-10">
            {block.items?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  {idx + 1}
                </div>
                <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'grid':
      return (
        <div className="mb-10">
          {block.title && (
             <div className="flex items-center gap-4 mb-8 pl-4 border-r-4 border-indigo-500">
               <h3 className="text-2xl font-bold text-slate-800">{block.title}</h3>
             </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {block.gridItems?.map((item, idx) => {
              const Icon = item.icon || ArrowLeft;
              return (
                <div key={idx} className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-600/30">
                      <Icon size={26} />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    
    case 'formula':
      return (
        <div className="relative overflow-hidden p-10 rounded-3xl shadow-xl mb-8 text-center group bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"></div>
          
          {/* Background decoration */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {block.title && (
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Calculator className="text-indigo-400" size={20} />
                </div>
                <h3 className="text-indigo-200 font-bold tracking-wider text-sm uppercase">{block.title}</h3>
              </div>
            )}
            <div className="text-3xl md:text-5xl font-black font-mono dir-ltr text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 drop-shadow-sm">
              {block.content}
            </div>
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 mb-8 overflow-hidden">
           {block.title && (
             <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
               <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500 border border-slate-100">
                 <Layout size={20} />
               </div>
               <h3 className="text-lg font-bold text-slate-800">{block.title}</h3>
             </div>
           )}
           <div className="overflow-x-auto">
             <table className="w-full text-right border-collapse">
               <thead>
                 <tr className="bg-slate-50">
                   {block.columns?.map((col, idx) => (
                     <th key={idx} className="px-8 py-5 font-bold text-slate-700 text-sm border-b border-slate-200 first:rounded-tr-none last:rounded-tl-none">{col}</th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {block.rows?.map((row, rIdx) => (
                   <tr key={rIdx} className="hover:bg-indigo-50/30 transition-colors group">
                     {row.map((cell, cIdx) => (
                       <td key={cIdx} className={`px-8 py-5 text-sm ${cIdx === 0 ? 'font-bold text-indigo-900' : 'text-slate-600'}`}>
                         {cell}
                       </td>
                     ))}
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      );

    case 'video':
      // Helper to extract ID to ensure clean embed URL
      const getVideoId = (url: string | undefined) => {
        if (!url) return null;
        // Matches standard youtube, youtu.be, and embed URLs
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      const videoId = getVideoId(block.videoUrl);
      // Construct clean URL with minimal parameters for performance and compatibility
      // playsinline=1 ensures iOS plays video inline rather than fullscreen
      const embedSrc = videoId 
        ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` 
        : block.videoUrl;

      return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
          {block.title && (
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
               <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                 <Video size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">{block.title}</h3>
            </div>
          )}
          {/* Responsive aspect ratio container using padding hack for maximum compatibility */}
          <div className="relative w-full pb-[56.25%] h-0 bg-slate-900">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={embedSrc} 
              title={block.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      );

    case 'interactive-bmc':
      return <div className="mb-12"><InteractiveBMC /></div>;

    case 'interactive-swot':
      return <div className="mb-12"><InteractiveSWOT /></div>;

    case 'interactive-pestle':
      return <div className="mb-12"><InteractivePESTLE /></div>;

    case 'interactive-competitor':
      return <div className="mb-12"><InteractiveCompetitor /></div>;
    
    case 'interactive-business-plan':
      return <div className="mb-12"><InteractiveBusinessPlan /></div>;
    
    case 'interactive-marketing-plan':
      return <div className="mb-12"><InteractiveMarketingPlan /></div>;

    case 'interactive-mission-vision':
      return <div className="mb-12"><InteractiveMissionVision /></div>;

    case 'interactive-operations':
      return <div className="mb-12"><InteractiveOperations /></div>;

    case 'interactive-management':
      return <div className="mb-12"><InteractiveManagement /></div>;

    case 'interactive-future':
      return <div className="mb-12"><InteractiveFuture /></div>;
    
    case 'interactive-financial-statements':
      return <div className="mb-12"><InteractiveFinancialStatements /></div>;

    case 'interactive-break-even':
      return <div className="mb-12"><InteractiveBreakEven /></div>;

    case 'interactive-debtor-creditor':
      return <div className="mb-12"><InteractiveDebtorCreditor /></div>;

    case 'interactive-account-types':
      return <div className="mb-12"><InteractiveAccountTypes /></div>;

    case 'interactive-cost-types':
      return <div className="mb-12"><InteractiveCostTypes /></div>;

    case 'interactive-ledger':
      return <div className="mb-12"><InteractiveLedger /></div>;

    case 'interactive-cash-flow':
      return <div className="mb-12"><InteractiveCashFlow /></div>;

    case 'interactive-sales-plan':
      return <div className="mb-12"><InteractiveSalesPlan /></div>;

    case 'interactive-income-statement':
      return <div className="mb-12"><InteractiveIncomeStatement /></div>;

    case 'interactive-depreciation':
      return <div className="mb-12"><InteractiveDepreciation /></div>;

    case 'business-plan-tips':
      return <div className="mb-12"><BusinessPlanTips /></div>;

    case 'interactive-exam':
      return <div className="mb-12"><InteractiveExam /></div>;

    default:
      return null;
  }
};

interface ContentDisplayProps {
  section: Section;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ section }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Section Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-0"></div>

        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
             <section.icon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{section.title}</h2>
            <p className="text-slate-500 font-medium mt-2">وحدة تعليمية تفاعلية</p>
          </div>
        </div>
      </div>
      
      {/* Content Blocks */}
      <div className="space-y-2">
        {section.blocks.map((block, idx) => (
          <BlockRenderer key={idx} block={block} />
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;