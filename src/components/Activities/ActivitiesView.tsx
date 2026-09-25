import React, { useState } from 'react';
import { DragDropActivity } from './DragDropActivity';
import { IdentifyActivity } from './IdentifyActivity';
import { MatchingActivity } from './MatchingActivity';
import { Target, Search, Link2, Sparkles } from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drag_drop' | 'identify' | 'matching'>('drag_drop');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Activities Navigation Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Interactive Lab
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
              3 Hands-on Activities
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Cellular Discovery Activities
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test and cement your cellular understanding with practical spatial, diagnostic, and functional interactions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('drag_drop')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'drag_drop'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Placement</span>
          </button>
          <button
            onClick={() => setActiveTab('identify')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'identify'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Identify</span>
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'matching'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Match Duties</span>
          </button>
        </div>
      </div>

      {/* Activity Component Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        {activeTab === 'drag_drop' && <DragDropActivity />}
        {activeTab === 'identify' && <IdentifyActivity />}
        {activeTab === 'matching' && <MatchingActivity />}
      </div>
    </div>
  );
};
