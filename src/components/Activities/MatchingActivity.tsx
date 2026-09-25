import React, { useState } from 'react';
import { recordActivityCompleted } from '../../services/storageService';
import { CheckCircle2, XCircle, RotateCcw, Sparkles, Link2 } from 'lucide-react';

interface MatchPair {
  organelleId: string;
  name: string;
  functionText: string;
  explanation: string;
}

const PAIRS: MatchPair[] = [
  {
    organelleId: 'nucleus',
    name: 'Nucleus',
    functionText: 'Houses DNA & coordinates gene transcription',
    explanation: 'The nucleus contains chromatin and controls protein synthesis through regulated mRNA transcription.'
  },
  {
    organelleId: 'mitochondria',
    name: 'Mitochondria',
    functionText: 'Produces ATP through cellular respiration',
    explanation: 'Mitochondria utilize oxygen and glucose metabolites to generate cellular chemical energy via ATP synthase.'
  },
  {
    organelleId: 'ribosomes',
    name: 'Ribosomes',
    functionText: 'Translates mRNA transcripts into polypeptide proteins',
    explanation: 'Ribosomes read codon sequences on mRNA and bond amino acids together to form proteins.'
  },
  {
    organelleId: 'golgi_apparatus',
    name: 'Golgi Apparatus',
    functionText: 'Glycosylates, sorts, & packages secretory vesicles',
    explanation: 'The Golgi modifies nascent proteins and attaches molecular zip codes for delivery inside or outside the cell.'
  },
  {
    organelleId: 'lysosomes',
    name: 'Lysosomes',
    functionText: 'Enzymatically digests cellular waste & pathogens',
    explanation: 'Lysosomes maintain acid hydrolases to break down worn-out organelle debris and engulfed foreign microbes.'
  }
];

export const MatchingActivity: React.FC = () => {
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffled right column indices for fun challenge
  const [shuffledFunctions] = useState(() => {
    return [...PAIRS].sort(() => 0.5 - Math.random());
  });

  const handleSelectOrganelle = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedOrganelle(id);
    setFeedback(null);

    if (selectedFunction) {
      checkMatch(id, selectedFunction);
    }
  };

  const handleSelectFunction = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedFunction(id);
    setFeedback(null);

    if (selectedOrganelle) {
      checkMatch(selectedOrganelle, id);
    }
  };

  const checkMatch = (orgId: string, funcId: string) => {
    const isMatch = orgId === funcId;
    const pair = PAIRS.find((p) => p.organelleId === orgId);

    if (isMatch && pair) {
      const nextMatched = [...matchedPairs, orgId];
      setMatchedPairs(nextMatched);
      setSelectedOrganelle(null);
      setSelectedFunction(null);
      setFeedback({
        isCorrect: true,
        text: `Exact Match! ${pair.name} → ${pair.functionText}. ${pair.explanation}`
      });

      if (nextMatched.length === PAIRS.length) {
        setIsCompleted(true);
        recordActivityCompleted();
      }
    } else {
      setSelectedOrganelle(null);
      setSelectedFunction(null);
      setFeedback({
        isCorrect: false,
        text: 'Not a biological match! Review the organelle function carefully and try again.'
      });
    }
  };

  const handleReset = () => {
    setSelectedOrganelle(null);
    setSelectedFunction(null);
    setMatchedPairs([]);
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Match Organelle to Physiological Duty</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              {matchedPairs.length}/{PAIRS.length} Matched
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click an organelle on the left, then click its corresponding biological function on the right!
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

      {/* Two Matching Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Organelles */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Organelle Name
          </span>
          <div className="space-y-2">
            {PAIRS.map((pair) => {
              const isMatched = matchedPairs.includes(pair.organelleId);
              const isSelected = selectedOrganelle === pair.organelleId;

              return (
                <button
                  key={pair.organelleId}
                  onClick={() => handleSelectOrganelle(pair.organelleId)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-bold transition-all flex items-center justify-between shadow-xs ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 opacity-80'
                      : isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>{pair.name}</span>
                  </div>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Functions */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Primary Cellular Duty
          </span>
          <div className="space-y-2">
            {shuffledFunctions.map((pair) => {
              const isMatched = matchedPairs.includes(pair.organelleId);
              const isSelected = selectedFunction === pair.organelleId;

              return (
                <button
                  key={pair.organelleId}
                  onClick={() => handleSelectFunction(pair.organelleId)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm leading-relaxed transition-all flex items-center justify-between shadow-xs ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold opacity-80'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{pair.functionText}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
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
              {feedback.isCorrect ? 'Biological Link Verified!' : 'Mismatch Detected!'}
            </span>
            <p>{feedback.text}</p>
          </div>
        </div>
      )}

      {/* Finished State */}
      {isCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-black text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              All Cellular Functions Synchronized!
            </h4>
            <p className="text-xs text-emerald-100">
              Outstanding! You matched all 5 cellular organelles with their exact biochemical roles.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-white text-emerald-900 rounded-xl font-bold text-xs hover:bg-emerald-50 shadow-md transition-all"
          >
            Restart Matching
          </button>
        </div>
      )}
    </div>
  );
};
