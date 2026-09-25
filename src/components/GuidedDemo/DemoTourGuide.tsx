import React from 'react';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Zap, 
  BrainCircuit, 
  Layers 
} from 'lucide-react';

export interface DemoStep {
  step: number;
  view: 'landing' | 'dashboard' | 'explorer' | 'activities' | 'quiz' | 'simulation';
  title: string;
  instructions: string;
  focusOrganelle?: string;
  badge: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    view: 'landing',
    title: '1. Landing Page Overview',
    instructions: 'Welcome screen introduces BioSphere AI, the 3D cell visualization core, and subject alignment (Biology).',
    badge: 'Overview'
  },
  {
    step: 2,
    view: 'dashboard',
    title: '2. Student Dashboard & 3 Learning Units',
    instructions: 'Demonstrates overall learning progress, topics completed, study streak, and the 3 core biology curriculum cards.',
    badge: 'Progress'
  },
  {
    step: 3,
    view: 'explorer',
    title: '3. Interactive 3D Human Cell Explorer',
    instructions: 'Students rotate the cell in 3D, toggle cutaways, zoom in/out, and click organelles in 3D or the top pills.',
    focusOrganelle: 'nucleus',
    badge: '3D Three.js'
  },
  {
    step: 4,
    view: 'explorer',
    title: '4. Click Mitochondria & AI Explanation',
    instructions: 'Selected Mitochondria shows what it is, its function, real-life analogy, memory trick, and Voice Learning narration.',
    focusOrganelle: 'mitochondria',
    badge: 'Gemini AI Explanations'
  },
  {
    step: 5,
    view: 'activities',
    title: '5. Hands-on Interactive Activities',
    instructions: 'Experience cellular drag-and-drop placement, mystery organelle identification, and function matching with immediate feedback.',
    badge: 'Practical Lab'
  },
  {
    step: 6,
    view: 'quiz',
    title: '6. AI-Generated Biology Quiz',
    instructions: 'Gemini generates curriculum-aligned multiple-choice questions with instant rationale and scoring.',
    badge: 'Gemini AI Assessment'
  },
  {
    step: 7,
    view: 'simulation',
    title: '7. Cell Division (Mitosis) Simulation',
    instructions: 'Interactive 2.5D animation showing Interphase, Prophase, Metaphase, Anaphase, Telophase, and Cytokinesis with voice insights.',
    badge: 'Simulation'
  },
  {
    step: 8,
    view: 'dashboard',
    title: '8. Progress Dashboard & AI Recommendations',
    instructions: 'Learner progress is persistently stored in localStorage. Gemini provides personalized study suggestions based on results.',
    badge: 'Adaptive Learning'
  }
];

interface DemoTourGuideProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCloseTour: () => void;
}

export const DemoTourGuide: React.FC<DemoTourGuideProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onCloseTour,
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex];

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-blue-500/50 backdrop-blur-md space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
              2-Minute Contest Demonstration Flow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {currentStep.step} / {DEMO_STEPS.length}
            </span>
            <button
              onClick={onCloseTour}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and details */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              {currentStep.title}
            </h4>
            <span className="text-[10px] bg-blue-500/20 text-cyan-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-medium">
              {currentStep.badge}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.instructions}
          </p>
        </div>

        {/* Controls */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all"
          >
            <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish Demo' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
