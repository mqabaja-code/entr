import React, { useState, useRef } from 'react';
import { 
  ClipboardCheck, Play, Loader2, CheckCircle2, XCircle, 
  RotateCcw, Download, ChevronLeft, Timer,
  Calculator, HelpCircle, FileText, AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'tf' | 'math';
  options: string[];
  correctAnswer: string;
}

interface ExamState {
  score: number;
  answeredCount: number;
  isFinished: boolean;
}

const InteractiveExam: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'active' | 'finished'>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // State for immediate feedback logic
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  
  // Store all user answers for final export
  const [allAnswers, setAllAnswers] = useState<Record<number, string>>({});

  const generateExam = async () => {
    setStatus('generating');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Create a comprehensive practice exam for an "Entrepreneurship 2" course.
        Generate exactly 30 questions in Arabic.
        
        The questions MUST cover these specific topics:
        1. Business Model Canvas (BMC) components.
        2. SWOT & PESTLE Analysis.
        3. Marketing Plan (STP, 7Ps, Pricing strategies).
        4. Operational Plan & Legal Forms of companies (Sole, LLC, etc.).
        5. Financial Plan (Important: Include Math problems for Break-even point, Depreciation, Net Profit, Equity = Assets - Liabilities).
        
        Requirements:
        - 10 Multiple Choice Questions (mcq).
        - 10 True/False Questions (tf).
        - 10 Math/Accounting Problems (math).
        - For 'math', put the scenario in the 'text' and the numerical answers in 'options'.
        - Ensure options array always contains the correct answer.
        - STRICTLY return a JSON array.
        
        Output JSON Schema:
        Array of objects: {
          id: number,
          text: string,
          type: 'mcq' | 'tf' | 'math',
          options: string[],
          correctAnswer: string
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['mcq', 'tf', 'math'] },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING }
              }
            }
          }
        }
      });

      if (response.text) {
        const generatedQuestions = JSON.parse(response.text);
        setQuestions(generatedQuestions);
        setStatus('active');
        setCurrentQIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setAllAnswers({});
      }
    } catch (error) {
      console.error("Exam Generation Error:", error);
      alert("حدث خطأ أثناء توليد الامتحان. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.");
      setStatus('idle');
    }
  };

  const handleOptionClick = (option: string) => {
    if (isAnswerChecked) return; // Prevent changing answer after selection

    setSelectedOption(option);
    setIsAnswerChecked(true);
    
    // Save answer
    setAllAnswers(prev => ({...prev, [questions[currentQIndex].id]: option}));

    // Update score immediately
    if (option === questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setStatus('finished');
    }
  };

  const resetExam = () => {
    setStatus('idle');
    setQuestions([]);
    setCurrentQIndex(0);
    setScore(0);
    setAllAnswers({});
  };

  const exportToWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Exam Export</title><style>body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; } .question { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; } .correct { color: green; font-weight: bold; } .wrong { color: red; text-decoration: line-through; } h1, h2, h3 { color: #000; }</style></head><body>`;
    
    let body = `<h1>امتحان ريادة الأعمال 2 - تجريبي</h1>
                <p>النتيجة النهائية: ${score} من ${questions.length}</p>
                <hr/>`;
    
    questions.forEach((q, idx) => {
      const userAnswer = allAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      
      body += `<div class='question'>
        <h3>س${idx + 1}: ${q.text}</h3>
        <ul>
          ${q.options.map(opt => {
            let style = 'color: #000;';
            let suffix = '';
            
            if (opt === q.correctAnswer) {
              style = 'color: green; font-weight: bold;';
              suffix = ' (الإجابة الصحيحة)';
            } else if (opt === userAnswer && !isCorrect) {
              style = 'color: red; text-decoration: line-through;';
              suffix = ' (إجابتك)';
            } else if (opt === userAnswer && isCorrect) {
              suffix = ' (إجابتك)';
            }
            
            return `<li style='${style}'>${opt}${suffix}</li>`;
          }).join('')}
        </ul>
      </div>`;
    });

    const footer = "</body></html>";
    const sourceHTML = header + body + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'entrepreneurship_exam_result.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  // --- RENDER STATES ---

  if (status === 'idle') {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
           <ClipboardCheck size={64} className="text-indigo-600" />
        </div>
        <h2 className="text-3xl font-black text-black mb-4">الامتحان التجريبي الشامل</h2>
        <p className="text-slate-600 text-lg max-w-xl leading-relaxed mb-8">
          اختبر معلوماتك في مساق ريادة الأعمال 2. سيقوم النظام بتوليد <span className="font-bold text-indigo-700">30 سؤالاً</span> جديداً (صح/خطأ، متعدد، ومسائل حسابية) تغطي كافة مواضيع المساق مع تصحيح فوري.
        </p>
        <button 
          onClick={generateExam}
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
        >
          <Play size={24} fill="currentColor" />
          ابدأ الامتحان (30 سؤال)
        </button>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 size={64} className="text-indigo-600 animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-black mb-2">جاري إعداد ورقة الامتحان...</h3>
        <p className="text-slate-600">يقوم الذكاء الاصطناعي بصياغة 30 سؤالاً متنوعاً من محتوى المساق.</p>
      </div>
    );
  }

  if (status === 'active') {
    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex) / questions.length) * 100;

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-white/10 rounded-lg">
               <Timer className="text-yellow-400" />
             </div>
             <div>
               <h3 className="font-bold text-lg">الامتحان التجريبي</h3>
               <div className="text-slate-400 text-xs font-mono">السؤال {currentQIndex + 1} من {questions.length}</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-sm text-slate-300">النتيجة الحالية:</div>
             <div className="bg-white/20 px-4 py-2 rounded-full font-mono font-bold text-lg text-emerald-400">
                {score}
             </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100">
           <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
           
           <div className="mb-8">
             <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-4 border
               ${currentQ.type === 'math' ? 'bg-purple-50 text-purple-700 border-purple-200' : currentQ.type === 'tf' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}
             `}>
               {currentQ.type === 'math' && <Calculator size={14} />}
               {currentQ.type === 'tf' && <HelpCircle size={14} />}
               {currentQ.type === 'mcq' && <FileText size={14} />}
               {currentQ.type === 'math' ? 'مسألة حسابية' : currentQ.type === 'tf' ? 'صح أم خطأ' : 'اختيار من متعدد'}
             </span>
             
             {/* Question Text - BLACK COLOR */}
             <h2 className="text-2xl md:text-3xl font-black text-black leading-snug">
               {currentQ.text}
             </h2>
           </div>

           <div className="space-y-4 max-w-3xl">
             {currentQ.options.map((opt, idx) => {
               // Logic for button styling based on state
               let buttonClass = "border-slate-200 bg-white text-black hover:bg-slate-50"; // Default
               let icon = null;

               if (isAnswerChecked) {
                 if (opt === currentQ.correctAnswer) {
                   // Correct Answer (always show green)
                   buttonClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                   icon = <CheckCircle2 className="text-emerald-600" size={24} />;
                 } else if (opt === selectedOption) {
                   // User selected wrong answer
                   buttonClass = "border-red-500 bg-red-50 text-red-900";
                   icon = <XCircle className="text-red-600" size={24} />;
                 } else {
                   // Other wrong options
                   buttonClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
                 }
               }

               return (
                 <button
                   key={idx}
                   onClick={() => handleOptionClick(opt)}
                   disabled={isAnswerChecked}
                   className={`w-full p-5 rounded-2xl text-right text-lg border-2 transition-all flex items-center justify-between group ${buttonClass} ${!isAnswerChecked ? 'hover:border-indigo-300' : ''}`}
                 >
                   <span className={isAnswerChecked && opt !== currentQ.correctAnswer && opt !== selectedOption ? "" : "text-black"}>
                     {opt}
                   </span>
                   {icon}
                 </button>
               );
             })}
           </div>

           {/* Feedback Message */}
           {isAnswerChecked && (
             <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${selectedOption === currentQ.correctAnswer ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {selectedOption === currentQ.correctAnswer ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
                <span className="font-bold text-lg">
                  {selectedOption === currentQ.correctAnswer ? 'إجابة صحيحة! أحسنت.' : 'إجابة خاطئة، الإجابة الصحيحة موضحة باللون الأخضر.'}
                </span>
             </div>
           )}
        </div>

        {/* Footer Navigation - Only shows when answered */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end items-center h-24">
           {isAnswerChecked && (
             <button 
               onClick={nextQuestion}
               className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all animate-slide-up"
             >
               {currentQIndex < questions.length - 1 ? 'السؤال التالي' : 'إنهاء وعرض النتيجة'} 
               <ChevronLeft size={20} />
             </button>
           )}
        </div>
      </div>
    );
  }

  // FINISHED STATE
  if (status === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Score Header */}
        <div className={`p-12 text-center text-white ${passed ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-red-600 to-orange-700'}`}>
           <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-lg">
             {passed ? <CheckCircle2 size={56} /> : <XCircle size={56} />}
           </div>
           <h2 className="text-5xl font-black mb-3">{score} <span className="text-2xl opacity-80 font-medium">/ {questions.length}</span></h2>
           <p className="text-2xl font-bold opacity-90">{passed ? 'ممتاز! لقد اجتزت الامتحان بنجاح' : 'حاول مرة أخرى لتحسين مستواك'}</p>
        </div>

        {/* Action Bar */}
        <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 justify-center">
           <button onClick={exportToWord} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
             <Download size={20} /> تصدير الإجابات (Word)
           </button>
           <button onClick={resetExam} className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-900 transition-colors shadow-md hover:shadow-lg">
             <RotateCcw size={20} /> امتحان جديد (30 سؤال)
           </button>
        </div>

        {/* Review List */}
        <div className="flex-1 p-8 bg-white overflow-y-auto max-h-[600px]">
           <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
             <FileText className="text-slate-500" /> مراجعة شاملة للإجابات
           </h3>
           
           <div className="space-y-6">
             {questions.map((q, idx) => {
               const userAnswer = allAnswers[q.id];
               const isCorrect = userAnswer === q.correctAnswer;
               
               return (
                 <div key={q.id} className={`bg-slate-50 p-6 rounded-2xl border-l-4 shadow-sm ${isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                   <div className="flex items-start justify-between mb-4">
                     <h4 className="font-bold text-black text-lg flex-1 leading-relaxed">
                       <span className="text-slate-500 ml-2 text-sm font-mono">#{idx + 1}</span> {q.text}
                     </h4>
                     <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                       {isCorrect ? 'صحيح' : 'خطأ'}
                     </span>
                   </div>

                   <div className="space-y-2">
                     {q.options.map((opt, i) => (
                       <div key={i} className={`
                         p-3 rounded-lg text-base font-bold flex items-center justify-between
                         ${opt === q.correctAnswer ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 
                           (opt === userAnswer && !isCorrect) ? 'bg-red-100 text-red-900 border border-red-200 decoration-slice line-through decoration-red-500' : 'bg-white text-slate-400'}
                       `}>
                         <span>{opt}</span>
                         {opt === q.correctAnswer && <CheckCircle2 size={18} className="text-emerald-600" />}
                       </div>
                     ))}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InteractiveExam;