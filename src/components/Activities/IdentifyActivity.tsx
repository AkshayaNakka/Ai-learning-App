import React, { useState } from 'react';
import { recordActivityCompleted } from '../../services/storageService';
import { CheckCircle2, XCircle, Sparkles, RotateCcw, ArrowRight, Eye } from 'lucide-react';

interface Flashcard {
  id: string;
  clue: string;
  category: string;
  organelleId: string;
  correctName: string;
  options: string[];
  explanation: string;
  microscopicDetail: string;
}

const CARDS: Flashcard[] = [
  {
    id: 'f1',
    category: 'Bio-Energetics',
    clue: 'I have a double membrane with deeply folded inner cristae, my own circular DNA, and I produce ATP currency.',
    correctName: 'Mitochondria',
    organelleId: 'mitochondria',
    options: ['Lysosome', 'Mitochondria', 'Golgi Apparatus', 'Ribosome'],
    explanation: 'Mitochondria contain an electron transport chain embedded along the inner mitochondrial cristae folds to produce ATP via oxidative phosphorylation.',
    microscopicDetail: 'Double-membrane oval rod ~1-2 µm'
  },
  {
    id: 'f2',
    category: 'Cellular Logistics',
    clue: 'I look like a stack of deflated pita breads or curved cisternae. I add sugar tags to proteins and dispatch them into vesicles.',
    correctName: 'Golgi Apparatus',
    organelleId: 'golgi_apparatus',
    options: ['Nucleus', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Peroxisome'],
    explanation: 'The Golgi apparatus modifies proteins arriving from the Rough ER (glycosylation) and sorts them into targeted transport vesicles via its trans face.',
    microscopicDetail: 'Stacked cisternae with budding peripheral vesicles'
  },
  {
    id: 'f3',
    category: 'Waste Management',
    clue: 'I contain over 50 acidic hydrolases at pH 4.8. If an organelle breaks down or a bacterium invades, I digest and recycle it.',
    correctName: 'Lysosome',
    organelleId: 'lysosomes',
    options: ['Lysosome', 'Ribosome', 'Centrosome', 'Smooth ER'],
    explanation: 'Lysosomes are acidic hydrolytic vesicles that fuse with autophagosomes or endosomes to break down proteins, lipids, and nucleic acids safely.',
    microscopicDetail: 'Dense spherical hydrolytic vesicle'
  },
  {
    id: 'f4',
    category: 'Protein Synthesis',
    clue: 'I am a non-membranous molecular machine made of rRNA and protein subunits. I read mRNA codons and assemble peptide chains.',
    correctName: 'Ribosome',
    organelleId: 'ribosomes',
    options: ['Nucleolus', 'Centriole', 'Ribosome', 'Mitochondria'],
    explanation: 'Ribosomes are ribonucleoprotein nanomachines that catalyze peptidyl transferase activity to build polypeptides from amino acids.',
    microscopicDetail: '80S complex composed of 40S small and 60S large subunits'
  },
  {
    id: 'f5',
    category: 'Perimeter Defense',
    clue: 'I am an amphipathic phospholipid bilayer with cholesterol buffers and transport aquaporins, selectively gating entry and exit.',
    correctName: 'Cell Membrane',
    organelleId: 'cell_membrane',
    options: ['Nuclear Envelope', 'Cell Membrane', 'Cell Wall', 'Tonoplast'],
    explanation: 'The human animal cell membrane is a fluid mosaic phospholipid bilayer controlling cellular homeostasis and signaling without a rigid plant cell wall.',
    microscopicDetail: '7-10 nm lipid bilayer with transmembrane channel proteins'
  }
];

export const IdentifyActivity: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const card = CARDS[index];

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    if (option === card.correctName) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index < CARDS.length - 1) {
      setIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      recordActivityCompleted();
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Organelle Detective: Mystery Clues</span>
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold">
              Card {index + 1} of {CARDS.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Read the cytological clue, examine its microscopic fingerprint, and identify the organelle!
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
          Score: {score} / {CARDS.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Mystery Clue Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Category: {card.category}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] text-slate-300">
                {card.microscopicDetail}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug italic">
              "{card.clue}"
            </p>
          </div>

          {/* 4 Choices */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Which organelle matches this description?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {card.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === card.correctName;
                const answered = selectedOption !== null;

                let styles =
                  'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
                if (answered) {
                  if (isCorrect) {
                    styles = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    styles = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                  } else {
                    styles = 'bg-slate-50 border-slate-100 text-slate-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={answered}
                    className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${styles}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {answered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next */}
          {selectedOption !== null && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  selectedOption === card.correctName
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  {selectedOption === card.correctName ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Brilliant Deduction! That is indeed {card.correctName}.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Incorrect! The correct answer is {card.correctName}.</span>
                    </>
                  )}
                </div>
                <p className="font-medium text-slate-700">{card.explanation}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <span>{index === CARDS.length - 1 ? 'View Final Results' : 'Next Clue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-900">Detective Challenge Completed!</h4>
            <p className="text-sm text-slate-500 mt-1">
              You correctly solved {score} out of {CARDS.length} mystery cytological profiles.
            </p>
          </div>

          <div className="text-4xl font-black text-purple-600">
            {Math.round((score / CARDS.length) * 100)}%
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
