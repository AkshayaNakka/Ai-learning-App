import React from 'react';
import { LearnerProgress } from '../../types';
import { resetProgress } from '../../services/storageService';
import { 
  X, 
  Trophy, 
  Clock, 
  Flame, 
  CheckCircle2, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Target,
  Sparkles
} from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: LearnerProgress;
  onReset: (newProgress: LearnerProgress) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your learning progress? This will clear saved scores and completed modules.')) {
      const fresh = resetProgress();
      onReset(fresh);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Learning Progress & Milestones</h3>
              <p className="text-xs text-slate-500">Persistent storage synchronized with browser cache</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Topics</span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {progress.completedTopics.length} / 3
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Organelles</span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {progress.exploredOrganelles.length} / 8
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Best Quiz</span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {progress.bestQuizScore}%
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Study Time</span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {progress.totalMinutesLearned}m
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Achievements & Certificates ({progress.earnedBadges.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progress.earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-3"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs text-amber-950">{badge.title}</h5>
                    <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Scores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-blue-500" />
              Recent Quiz History ({progress.quizHistory.length})
            </h4>

            {progress.quizHistory.length > 0 ? (
              <div className="space-y-2">
                {progress.quizHistory.slice(0, 4).map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{q.topic}</div>
                      <div className="text-slate-500 text-[11px]">
                        Difficulty: {q.difficulty} • {new Date(q.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-blue-600">{q.percentage}%</span>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {q.score} / {q.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No quizzes completed yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleResetProgress}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
