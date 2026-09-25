import React, { useState } from 'react';
import { LearningTopicId, QuizQuestion, QuizResultData } from '../../types';
import { generateAIQuiz, getPersonalizedRecommendations } from '../../services/geminiService';
import { recordQuizCompleted } from '../../services/storageService';
import { QuizResults } from './QuizResults';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  BrainCircuit, 
  Layers, 
  Target,
  Flame,
  Award
} from 'lucide-react';

interface QuizViewProps {
  initialTopic?: LearningTopicId;
  onNavigateTopic: (topic: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialTopic = 'Cell Organelles',
  onNavigateTopic,
}) => {
  const [topic, setTopic] = useState<LearningTopicId>(initialTopic);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [count, setCount] = useState<number>(5);

  const [quizState, setQuizState] = useState<'setup' | 'in_progress' | 'submitted'>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuestionExplanation, setShowQuestionExplanation] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const data = await generateAIQuiz(topic, difficulty, count);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowQuestionExplanation(false);
      setQuizState('in_progress');
    } catch (err) {
      console.error('Failed to start quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
    setShowQuestionExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowQuestionExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    let score = 0;
    const answersData = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        question: q.question,
        selected,
        correct: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    const wrongAnswers = answersData
      .filter((a) => !a.isCorrect)
      .map((a) => ({
        question: a.question,
        chosenAnswer: a.selected >= 0 ? questions.find((q) => q.id === a.questionId)?.options[a.selected] : 'None',
        correctAnswer: questions.find((q) => q.id === a.questionId)?.options[a.correct],
      }));

    // Fetch AI recommendations from Gemini
    let aiRecommendation: any = undefined;
    try {
      aiRecommendation = await getPersonalizedRecommendations(score, total, topic, wrongAnswers);
    } catch (e) {
      console.error('Recommendations error:', e);
    }

    const finalResult: QuizResultData = {
      topic,
      difficulty,
      score,
      total,
      percentage,
      answers: answersData,
      date: new Date().toISOString(),
      aiRecommendation,
    };

    recordQuizCompleted(finalResult);
    setQuizResult(finalResult);
    setQuizState('submitted');
  };

  if (quizState === 'submitted' && quizResult) {
    return (
      <QuizResults
        result={quizResult}
        onRetake={() => {
          setQuizState('setup');
          setQuizResult(null);
        }}
        onNavigateTopic={onNavigateTopic}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {quizState === 'setup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Interactive Evaluation
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                  Powered by Gemini AI
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                AI Cellular Biology Quiz Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Configure your personalized assessment. Gemini AI constructs curriculum-aligned questions with instant feedback.
              </p>
            </div>
          </div>

          {/* Setup Form */}
          <div className="space-y-5">
            {/* Topic Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Select Learning Topic
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Cell Structure', 'Cell Organelles', 'Cell Division'] as LearningTopicId[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      topic === t
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{t}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {t === 'Cell Structure' && 'Membrane, cytosol, & cytoskeleton'}
                      {t === 'Cell Organelles' && 'Mitochondria, nucleus, ER, Golgi'}
                      {t === 'Cell Division' && 'Mitosis stages & cytokinesis'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Choose Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                      difficulty === d
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`py-2.5 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                      count === num
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Custom Quiz with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Start AI Generated Quiz</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {quizState === 'in_progress' && questions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Header & Progress Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="uppercase tracking-wider">
                {topic} • {difficulty} Level
              </span>
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {questions[currentIndex].question}
            </h3>

            {/* 4 Options */}
            <div className="space-y-2.5">
              {questions[currentIndex].options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isCorrect = optIdx === questions[currentIndex].correctAnswer;
                const answered = selectedAnswers[currentIndex] !== undefined;

                let btnStyles =
                  'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
                if (answered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                  } else if (isSelected) {
                    btnStyles = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                  } else {
                    btnStyles = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={answered}
                    className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {answered && (
                      <div className="shrink-0 ml-2">
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Box */}
            {showQuestionExplanation && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 space-y-1 animate-in fade-in duration-200">
                <span className="font-bold uppercase tracking-wider text-blue-700 block">
                  Scientific Explanation:
                </span>
                <p className="leading-relaxed font-medium">
                  {questions[currentIndex].explanation}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">
              Select an option for immediate feedback
            </span>

            {selectedAnswers[currentIndex] !== undefined && (
              <button
                onClick={handleNextQuestion}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all animate-in fade-in"
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish & See Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
