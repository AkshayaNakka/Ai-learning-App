import React, { useState, useEffect } from 'react';
import { Organelle, ExplanationLevel, AIExplanation } from '../../types';
import { fetchAIExplanation } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Flame,
  ArrowRight
} from 'lucide-react';

interface OrganelleDetailsProps {
  organelle: Organelle;
  onAskTutorAboutOrganelle: (organelleName: string, prompt?: string) => void;
  onExploreNext?: () => void;
}

export const OrganelleDetails: React.FC<OrganelleDetailsProps> = ({
  organelle,
  onAskTutorAboutOrganelle,
  onExploreNext
}) => {
  const [level, setLevel] = useState<ExplanationLevel>('Intermediate');
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'overview' | 'molecules'>('ai');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Subscribe to speechService updates
  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      speechService.stop();
      unsubscribe();
    };
  }, [organelle.id]);

  // Fetch AI explanation on organelle or level change
  useEffect(() => {
    let isCancelled = false;
    async function loadExplanation() {
      setLoading(true);
      try {
        const data = await fetchAIExplanation(organelle.id, organelle.name, level);
        if (!isCancelled) {
          setExplanation(data);
        }
      } catch (err) {
        console.error('Failed to load AI explanation:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    loadExplanation();
    return () => {
      isCancelled = true;
    };
  }, [organelle.id, level]);

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      speechService.stop();
    } else if (explanation) {
      const speechText = `${organelle.name}. ${explanation.whatIsIt} Function: ${explanation.whatDoesItDo} Analogy: ${explanation.analogy} Memory trick: ${explanation.memoryTrick}`;
      speechService.speak(speechText);
    }
  };

  const handleQuickQuestion = (type: 'simple' | 'analogy' | 'exam') => {
    if (type === 'simple') {
      onAskTutorAboutOrganelle(organelle.name, `Explain ${organelle.name} simply for a 6th grader with fun analogies.`);
    } else if (type === 'analogy') {
      onAskTutorAboutOrganelle(organelle.name, `Give me a creative real-world analogy explaining how ${organelle.name} interacts with other cell organelles.`);
    } else {
      onAskTutorAboutOrganelle(organelle.name, `What are the most common exam questions and trick points tested on ${organelle.name}?`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header with Organelle color badge */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm"
                style={{ backgroundColor: organelle.color }}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {organelle.category} Organelle
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                {organelle.diameter}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {organelle.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{organelle.tagline}</p>
          </div>

          {/* Voice text-to-speech button */}
          <button
            onClick={handleVoiceToggle}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600'
            }`}
            title={isSpeaking ? 'Stop narration' : 'Listen to AI explanation (Voice Learning)'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-xs font-semibold">Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold hidden sm:inline">Listen</span>
              </>
            )}
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 mt-4 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Explanation
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Anatomy & Functions
          </button>
          <button
            onClick={() => setActiveTab('molecules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'molecules'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Biochemistry
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4">
        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Level Selector & Model Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {(['Beginner', 'Intermediate', 'Advanced'] as ExplanationLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      level === lvl
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Powered by Gemini AI</span>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
                <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
                <p className="text-xs font-medium">Synthesizing {level}-level biological insights...</p>
              </div>
            ) : explanation ? (
              <div className="space-y-3.5">
                {/* 1. What is it */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    What is it?
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {explanation.whatIsIt}
                  </p>
                </div>

                {/* 2. What does it do */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    What does it do?
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {explanation.whatDoesItDo}
                  </p>
                </div>

                {/* 3. Why is it important */}
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    Why is it important?
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {explanation.whyIsItImportant}
                  </p>
                </div>

                {/* 4. Real-life Analogy */}
                <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-3.5">
                  <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                    Real-Life Analogy
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed italic">
                    "{explanation.analogy}"
                  </p>
                </div>

                {/* 5. Memory Trick */}
                <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3.5">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Quick Memory Trick
                  </h4>
                  <p className="text-sm text-emerald-900 font-semibold leading-relaxed">
                    {explanation.memoryTrick}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Quick AI Prompts & Question Options */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick AI Exploration
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickQuestion('simple')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 text-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  Simple Words
                </button>
                <button
                  onClick={() => handleQuickQuestion('analogy')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 text-center"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  Give Analogy
                </button>
                <button
                  onClick={() => handleQuickQuestion('exam')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 text-center"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Exam Tips
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Physiological Function
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {organelle.primaryFunction}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Intracellular Location
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {organelle.location}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                Did You Know? (Cell Biology Fact)
              </h4>
              <p className="text-sm text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                {organelle.funFact}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'molecules' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Biomolecules & Enzymes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {organelle.keyMolecules.map((mol, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-slate-800">{mol}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 mt-4">
              <h5 className="text-xs font-bold text-indigo-900 mb-1">Cellular Communication</h5>
              <p className="text-xs text-indigo-700 leading-relaxed">
                This organelle continuously synchronizes with other structures via vesicular trafficking, 
                calcium signaling cascades, and metabolic feedback loops to sustain cellular homeostasis.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Ask AI button */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <button
          onClick={() => onAskTutorAboutOrganelle(organelle.name)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Ask AI Tutor About {organelle.name}</span>
        </button>

        {onExploreNext && (
          <button
            onClick={onExploreNext}
            className="p-2.5 rounded-xl bg-white text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 shadow-sm transition-colors"
            title="Inspect next organelle"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
