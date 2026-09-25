import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizResultData } from '../../types';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Brain,
  Award
} from 'lucide-react';

interface QuizResultsProps {
  result: QuizResultData;
  onRetake: () => void;
  onNavigateTopic: (topic: string) => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRetake,
  onNavigateTopic
}) => {
  useEffect(() => {
    if (result.percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.percentage]);

  const getScoreColor = () => {
    if (result.percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (result.percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Score Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam Complete • {result.topic} ({result.difficulty})
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              {result.percentage >= 80 ? 'Mastery Achieved!' : result.percentage >= 60 ? 'Commendable Effort!' : 'Keep Practicing!'}
            </h2>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className={`px-6 py-3 rounded-2xl border font-black text-3xl sm:text-4xl ${getScoreColor()}`}>
              {result.score} / {result.total}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-slate-900">{result.percentage}%</div>
              <div className="text-xs text-slate-500 font-medium">Overall Accuracy</div>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            {result.percentage >= 80
              ? `You've demonstrated exceptional grasp of ${result.topic} mechanisms. Ready to explore the next frontier!`
              : `Review the detailed explanations below to cement any missed cellular pathways.`}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRetake}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={() => onNavigateTopic(result.aiRecommendation?.recommendedTopic || 'Cell Organelles')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Explore Recommended Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Personalized Recommendations Card */}
      {result.aiRecommendation && (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="font-bold text-base text-white">AI Personalized Learning Diagnosis</h3>
            </div>
            <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2.5 py-0.5 rounded-full">
              Powered by Gemini AI
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/10">
            "{result.aiRecommendation.summary}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                Demonstrated Strengths
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {result.aiRecommendation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5" />
                Recommended Focus Areas
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {result.aiRecommendation.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Question Breakdown List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Question Review & Explanations</span>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {result.total} Questions
          </span>
        </h3>

        <div className="space-y-3">
          {result.answers.map((ans, idx) => (
            <div
              key={ans.questionId || idx}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                ans.isCorrect ? 'border-emerald-200 shadow-sm' : 'border-rose-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        ans.isCorrect
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {ans.isCorrect ? 'Correct' : 'Needs Review'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">{ans.question}</p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-800">Explanation: </span>
                      {ans.explanation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
