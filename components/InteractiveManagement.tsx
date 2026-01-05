import React, { useState } from 'react';
import { Users, UserPlus, Briefcase, DollarSign, Network } from 'lucide-react';

interface Role {
  id: number;
  title: string;
  count: number;
  salary: number;
}

const InteractiveManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, title: 'مدير المشروع', count: 1, salary: 5000 },
    { id: 2, title: 'مسوق إلكتروني', count: 1, salary: 3000 },
  ]);

  const addRole = () => {
    setRoles([...roles, { id: Date.now(), title: 'مسمى وظيفي جديد', count: 1, salary: 0 }]);
  };

  const updateRole = (id: number, field: keyof Role, value: string | number) => {
    setRoles(roles.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const totalMonthlySalary = roles.reduce((sum, r) => sum + (r.count * r.salary), 0);

  return (
    <div className="space-y-8">
      {/* Visual Org Chart Representation */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center overflow-hidden relative">
         <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -z-0"></div>
         <div className="relative z-10">
           <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center justify-center gap-2">
             <Network className="text-indigo-600" />
             الهيكل التنظيمي المقترح
           </h3>
           
           <div className="flex flex-col items-center gap-8">
             {/* CEO Level */}
             <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-lg w-48 font-bold relative">
               مدير المشروع (CEO)
               <div className="absolute top-full left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
             </div>
             
             {/* Departments Level */}
             <div className="flex gap-4 md:gap-8 flex-wrap justify-center relative">
                {/* Horizontal Connector */}
                <div className="absolute -top-8 left-10 right-10 h-0.5 bg-slate-300"></div>

                {['إدارة التسويق', 'إدارة العمليات', 'إدارة المالية', 'الموارد البشرية'].map((dept, i) => (
                  <div key={i} className="flex flex-col items-center relative">
                    <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
                    <div className="p-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg shadow-sm w-32 text-sm font-bold">
                      {dept}
                    </div>
                  </div>
                ))}
             </div>
           </div>
           
           <p className="mt-8 text-slate-500 text-sm">
             الهيكل التنظيمي يوضح العلاقة بين الإدارات، ويحدد "من يرفع التقرير لمن". يضمن انسيابية العمل وتوزيع المسؤوليات.
           </p>
         </div>
      </div>

      {/* Staff & Salary Calculator */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Users size={24}/></div>
             <h3 className="text-xl font-bold text-slate-800">تقدير الموارد البشرية والرواتب</h3>
          </div>
          <button onClick={addRole} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 font-bold flex items-center gap-1 transition-colors">
            <UserPlus size={16} /> إضافة وظيفة
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 rounded-r-lg">المسمى الوظيفي</th>
                <th className="p-3">العدد المطلوب</th>
                <th className="p-3">الراتب الشهري (للفرد)</th>
                <th className="p-3 rounded-l-lg">إجمالي التكلفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="p-3">
                    <input 
                      value={role.title} 
                      onChange={e => updateRole(role.id, 'title', e.target.value)}
                      className="w-full bg-transparent border-b border-transparent focus:border-indigo-300 outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" min="1"
                      value={role.count} 
                      onChange={e => updateRole(role.id, 'count', Number(e.target.value))}
                      className="w-16 p-1 border border-slate-200 rounded text-center"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" min="0"
                        value={role.salary} 
                        onChange={e => updateRole(role.id, 'salary', Number(e.target.value))}
                        className="w-24 p-1 border border-slate-200 rounded text-center"
                      />
                      <span className="text-xs text-slate-400">$</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-700">
                    {(role.count * role.salary).toLocaleString()} $
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-emerald-50 text-emerald-900 font-bold">
              <tr>
                <td colSpan={3} className="p-4 text-left">إجمالي الرواتب الشهرية المتوقعة:</td>
                <td className="p-4 text-xl">{totalMonthlySalary.toLocaleString()} $</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800 text-sm">
          <strong>ملاحظة هامة:</strong> لا تنسَ إضافة تكاليف أخرى للموظفين مثل (التأمين الصحي، المواصلات، السكن، وتكاليف التدريب) والتي تشكل عادة 20-30% إضافية فوق الراتب الأساسي.
        </div>
      </div>
    </div>
  );
};

export default InteractiveManagement;