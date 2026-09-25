import React from 'react';
import { Organelle } from '../../types';
import { ORGANELLES } from '../../data/organelles';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ExplorerControlsProps {
  selectedOrganelle: Organelle | null;
  onSelectOrganelle: (organelle: Organelle) => void;
  exploredOrganelles: string[];
}

export const ExplorerControls: React.FC<ExplorerControlsProps> = ({
  selectedOrganelle,
  onSelectOrganelle,
  exploredOrganelles,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Select Organelle to Inspect ({exploredOrganelles.length}/{ORGANELLES.length} Explored)
        </span>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Click pills below or click directly in the 3D cell
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
        {ORGANELLES.map((org) => {
          const isSelected = selectedOrganelle?.id === org.id;
          const isExplored = exploredOrganelles.includes(org.id);

          return (
            <button
              key={org.id}
              onClick={() => onSelectOrganelle(org)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/50"
                style={{ backgroundColor: org.color }}
              />
              <span>{org.name}</span>
              {isExplored && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-blue-200' : 'text-emerald-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
