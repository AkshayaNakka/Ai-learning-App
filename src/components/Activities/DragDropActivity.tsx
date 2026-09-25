import React, { useState } from 'react';
import { recordActivityCompleted } from '../../services/storageService';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight,
  Target
} from 'lucide-react';

interface DropSlot {
  id: string;
  name: string;
  expectedOrganelle: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
}

const SLOTS: DropSlot[] = [
  {
    id: 'slot-center',
    name: 'Central Control Vault',
    expectedOrganelle: 'nucleus',
    x: 48,
    y: 48,
    description: 'The dense central sphere housing genomic DNA'
  },
  {
    id: 'slot-mito',
    name: 'Metabolic Power Zone',
    expectedOrganelle: 'mitochondria',
    x: 22,
    y: 28,
    description: 'Oval folded powerhouse generating cellular ATP'
  },
  {
    id: 'slot-er',
    name: 'Perinuclear Highway',
    expectedOrganelle: 'endoplasmic_reticulum',
    x: 68,
    y: 42,
    description: 'Curved folding sheets hugging the nuclear envelope'
  },
  {
    id: 'slot-golgi',
    name: 'Shipping Cisternae',
    expectedOrganelle: 'golgi_apparatus',
    x: 28,
    y: 72,
    description: 'Stacked curved green discs sorting and dispatching cargo'
  },
  {
    id: 'slot-lyso',
    name: 'Hydrolytic Disposal',
    expectedOrganelle: 'lysosomes',
    x: 75,
    y: 75,
    description: 'Acidic enzymatic vesicles recycling cellular waste'
  },
  {
    id: 'slot-ribo',
    name: 'Protein Translation Site',
    expectedOrganelle: 'ribosomes',
    x: 65,
    y: 22,
    description: 'Tiny catalytic complexes decoding mRNA messages'
  }
];

const ORGANELLE_ITEMS = [
  { id: 'nucleus', name: 'Nucleus', color: '#8b5cf6', icon: '🟣' },
  { id: 'mitochondria', name: 'Mitochondria', color: '#f97316', icon: '🟠' },
  { id: 'endoplasmic_reticulum', name: 'Endoplasmic Reticulum', color: '#06b6d4', icon: '🔵' },
  { id: 'golgi_apparatus', name: 'Golgi Apparatus', color: '#10b981', icon: '🟢' },
  { id: 'lysosomes', name: 'Lysosomes', color: '#eab308', icon: '🟡' },
  { id: 'ribosomes', name: 'Ribosomes', color: '#ec4899', icon: '🔴' },
];

export const DragDropActivity: React.FC = () => {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ slotId: string; isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOrganelle = (id: string) => {
    setSelectedOrganelle(id);
    setFeedback(null);
  };

  const handleSlotClick = (slot: DropSlot) => {
    if (!selectedOrganelle) {
      setFeedback({
        slotId: slot.id,
        isCorrect: false,
        text: 'Select an organelle from the inventory below first, then click a target zone!'
      });
      return;
    }

    const isCorrect = selectedOrganelle === slot.expectedOrganelle;
    const orgData = ORGANELLE_ITEMS.find((o) => o.id === selectedOrganelle);

    if (isCorrect) {
      const nextPlaced = { ...placed, [slot.id]: selectedOrganelle };
      setPlaced(nextPlaced);
      setSelectedOrganelle(null);
      setFeedback({
        slotId: slot.id,
        isCorrect: true,
        text: `Correct! ${orgData?.name} successfully placed in ${slot.name}. ${slot.description}.`
      });

      if (Object.keys(nextPlaced).length === SLOTS.length) {
        setIsCompleted(true);
        recordActivityCompleted();
      }
    } else {
      setFeedback({
        slotId: slot.id,
        isCorrect: false,
        text: `Incorrect placement! ${orgData?.name} does not belong in the ${slot.name}. Hint: ${slot.description}.`
      });
    }
  };

  const handleReset = () => {
    setPlaced({});
    setSelectedOrganelle(null);
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Cellular Placement Challenge</span>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
              {Object.keys(placed).length}/{SLOTS.length} Placed
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click an organelle below, then click its corresponding anatomical location inside the cell!
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Interactive Cell Target Diagram */}
      <div className="relative w-full h-[380px] sm:h-[420px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl p-4 flex items-center justify-center">
        {/* Decorative cell membrane boundary */}
        <div className="absolute inset-8 rounded-full border-4 border-dashed border-sky-500/30 pointer-events-none animate-pulse-subtle" />
        <div className="absolute inset-12 rounded-full bg-sky-500/5 pointer-events-none backdrop-blur-xs" />

        {/* Central Nucleus outline silhouette */}
        <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-purple-500/40 bg-purple-950/30 pointer-events-none" />

        {/* Target Slots */}
        {SLOTS.map((slot) => {
          const currentPlacedId = placed[slot.id];
          const placedOrg = ORGANELLE_ITEMS.find((o) => o.id === currentPlacedId);
          const isSlotSelected = feedback?.slotId === slot.id;

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              disabled={!!placedOrg}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl border transition-all z-10 flex flex-col items-center justify-center gap-1 shadow-lg ${
                placedOrg
                  ? 'bg-slate-900/95 border-emerald-500/80 text-white shadow-emerald-500/20'
                  : selectedOrganelle
                  ? 'bg-slate-900/80 border-sky-400 text-sky-200 hover:scale-105 animate-pulse cursor-pointer'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {placedOrg ? (
                <>
                  <span className="text-xl">{placedOrg.icon}</span>
                  <span className="text-[11px] font-bold text-white whitespace-nowrap">
                    {placedOrg.name}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 text-sky-400/80" />
                  <span className="text-[10px] font-semibold whitespace-nowrap max-w-[100px] truncate text-center">
                    {slot.name}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback Box */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 animate-in fade-in ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          {feedback.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold block text-sm mb-0.5">
              {feedback.isCorrect ? 'Accurate Identification!' : 'Try Again!'}
            </span>
            <p>{feedback.text}</p>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-extrabold text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              All Organelles Anatomically Situated!
            </h4>
            <p className="text-xs text-emerald-100">
              You've demonstrated a complete mental map of the eukaryotic cell architecture.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white text-emerald-900 rounded-xl font-bold text-xs hover:bg-emerald-50 shadow-md"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Organelle Inventory Selection Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Inventory: Click an organelle to place
        </span>
        <div className="flex flex-wrap gap-2.5">
          {ORGANELLE_ITEMS.map((org) => {
            const isAlreadyPlaced = Object.values(placed).includes(org.id);
            const isSelected = selectedOrganelle === org.id;

            return (
              <button
                key={org.id}
                onClick={() => handleSelectOrganelle(org.id)}
                disabled={isAlreadyPlaced}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  isAlreadyPlaced
                    ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{org.icon}</span>
                <span>{org.name}</span>
                {isAlreadyPlaced && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
