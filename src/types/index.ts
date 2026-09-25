export type LearningTopicId = 'Cell Structure' | 'Cell Organelles' | 'Cell Division';

export interface Organelle {
  id: string;
  name: string;
  tagline: string;
  category: 'Command' | 'Energy' | 'Synthesis' | 'Transport' | 'Waste' | 'Boundary' | 'Matrix';
  color: string;
  emissiveColor: string;
  size: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  shape: 'sphere' | 'capsule' | 'disks' | 'folded_mesh' | 'ring' | 'dots' | 'vesicles' | 'outer_shell';
  summary: string;
  primaryFunction: string;
  diameter: string;
  location: string;
  funFact: string;
  keyMolecules: string[];
}

export type ExplanationLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AIExplanation {
  organelleName: string;
  level: ExplanationLevel;
  whatIsIt: string;
  whatDoesItDo: string;
  whyIsItImportant: string;
  analogy: string;
  memoryTrick: string;
  simpleSummary: string;
  isFallback: boolean;
  aiModel?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResultData {
  topic: LearningTopicId;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  total: number;
  percentage: number;
  answers: {
    questionId: string;
    question: string;
    selected: number;
    correct: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  date: string;
  aiRecommendation?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    recommendedTopic: string;
  };
}

export interface DivisionStage {
  id: string;
  name: string;
  subTitle: string;
  phase: 'Interphase' | 'Prophase' | 'Metaphase' | 'Anaphase' | 'Telophase' | 'Cytokinesis';
  description: string;
  keyEvents: string[];
  visualHighlights: string;
  aiInsight: string;
  durationMinutes: number;
}

export interface LearnerProgress {
  completedTopics: LearningTopicId[];
  exploredOrganelles: string[];
  quizzesTaken: number;
  bestQuizScore: number;
  averageQuizScore: number;
  activitiesCompleted: number;
  totalMinutesLearned: number;
  streakDays: number;
  lastActiveDate: string;
  quizHistory: QuizResultData[];
  earnedBadges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  isFallback?: boolean;
}
