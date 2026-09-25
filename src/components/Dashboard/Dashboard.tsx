import React from 'react';
import { LearnerProgress, LearningTopicId } from '../../types';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Dna, 
  Play, 
  BrainCircuit, 
  Target,
  BookOpen,
  Compass,
  Award
} from 'lucide-react';

interface DashboardProps {
  progress: LearnerProgress;
  onNavigate: (view: 'landing' | 'dashboard' | 'explorer' | 'quiz' | 'simulation' | 'activities') => void;
  onSelectTopic: (topic: LearningTopicId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onNavigate,
  onSelectTopic,
}) => {
  const topics: {
    id: LearningTopicId;
    title: string;
    description: string;
    icon: string;
    subtopics: string[];
    actionView: 'explorer' | 'simulation';
  }[] = [
    {
      id: 'Cell Structure',
      title: 'A. Cell Structure & Boundaries',
      description: 'Phospholipid bilayer fluid mosaic, cholesterol fluidity buffers, cytoplasm colloidal matrix, and cytoskeletal filaments.',
      icon: '🛡️',
      subtopics: ['Plasma Membrane', 'Cytoplasm & Cytosol', 'Cytoskeleton Tracks'],
      actionView: 'explorer'
    },
    {
      id: 'Cell Organelles',
      title: 'B. Cell Organelles & Nanomachines',
      description: 'The nucleus, ATP mitochondria, Rough & Smooth ER, Golgi apparatus cisternae, lysosomes, and translating ribosomes.',
      icon: '⚡',
      subtopics: ['Mitochondria & ATP', 'Nucleus & DNA', 'Golgi & ER Highways'],
      actionView: 'explorer'
    },
    {
      id: 'Cell Division',
      title: 'C. Cell Division & Mitosis',
      description: 'Six dynamic phases: Interphase, Prophase, Metaphase, Anaphase, Telophase, and Cytokinesis contractile ring pinching.',
      icon: '🧬',
      subtopics: ['Mitotic Spindle', 'Chromatid Separation', 'Cytokinesis Ring'],
      actionView: 'simulation'
    }
  ];

  // Overall progress percentage
  const totalTopics = 3;
  const completedTopicsCount = progress.completedTopics.length;
  const overallPercentage = Math.round(
    (completedTopicsCount / totalTopics) * 50 +
    Math.min(progress.exploredOrganelles.length / 8, 1) * 30 +
    Math.min(progress.quizzesTaken / 2, 1) * 20
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Top Welcome & Continue Learning Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-900/60 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Curriculum Tracker • Grade 9–12 Biology
              </span>
              <span className="text-xs text-slate-300">
                🔥 {progress.streakDays}-Day Learning Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome back to BioSphere AI!
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Continue your journey into eukaryotic cellular mechanics. 
              Explore interactive 3D organelles, test your recall with AI quizzes, and inspect mitosis in real time.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('explorer')}
                className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4" />
                <span>Continue Learning in 3D</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('quiz')}
                className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 flex items-center gap-2 transition-all"
              >
                <BrainCircuit className="w-4 h-4 text-cyan-300" />
                <span>Take AI Quiz</span>
              </button>
            </div>
          </div>

          {/* Overall Progress Circular / Dial Stat */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center justify-center shrink-0 min-w-[200px] text-center space-y-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* SVG Circular Progress */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/15 fill-transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * overallPercentage) / 100}
                  strokeLinecap="round"
                  className="text-cyan-400 fill-transparent transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{overallPercentage}%</span>
                <span className="text-[10px] uppercase font-bold text-cyan-300">Progress</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              {completedTopicsCount} of {totalTopics} Topics Completed
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Topics Done</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {completedTopicsCount} <span className="text-sm font-semibold text-slate-400">/ 3</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${(completedTopicsCount / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Organelles</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {progress.exploredOrganelles.length} <span className="text-sm font-semibold text-slate-400">/ 8</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Explored in 3D
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Accuracy</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {progress.bestQuizScore}%
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Avg: {progress.averageQuizScore}% • {progress.quizzesTaken} Quizzes
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Study Time</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {progress.totalMinutesLearned} <span className="text-sm font-semibold text-slate-400">mins</span>
          </div>
          <div className="text-xs text-purple-600 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {progress.streakDays}-day streak active
          </div>
        </div>
      </div>

      {/* Recommended Next Section (AI Powered) */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border border-blue-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Recommended Next Step</span>
          </div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            Dive into Mitochondria & ATP Synthesis in 3D
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students who review mitochondria before the Cell Division module show 40% higher quiz retention. 
            Inspect its internal cristae folds and listen to the AI analogy.
          </p>
        </div>

        <button
          onClick={() => {
            onSelectTopic('Cell Organelles');
            onNavigate('explorer');
          }}
          className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
        >
          <span>Launch Recommended 3D Unit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Major Learning Topics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Curriculum Learning Units
            </h2>
            <p className="text-xs text-slate-500">
              Select any core biology unit to explore in interactive 3D, simulate, or take an AI assessment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map((t) => {
            const isCompleted = progress.completedTopics.includes(t.id);

            return (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{t.icon}</span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {t.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Concepts:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.subtopics.map((st, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onSelectTopic(t.id);
                      onNavigate(t.actionView);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>{t.actionView === 'simulation' ? 'Launch Simulation' : 'Enter 3D Explorer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
