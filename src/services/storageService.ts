import { LearnerProgress, LearningTopicId, QuizResultData } from '../types';

const STORAGE_KEY = 'biosphere_learner_progress_v1';

const INITIAL_PROGRESS: LearnerProgress = {
  completedTopics: ['Cell Structure'],
  exploredOrganelles: ['nucleus', 'mitochondria'],
  quizzesTaken: 2,
  bestQuizScore: 80,
  averageQuizScore: 75,
  activitiesCompleted: 3,
  totalMinutesLearned: 38,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  quizHistory: [
    {
      topic: 'Cell Organelles',
      difficulty: 'Medium',
      score: 4,
      total: 5,
      percentage: 80,
      answers: [],
      date: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  earnedBadges: [
    {
      id: 'first_step',
      title: 'Cellular Novice',
      description: 'Embarked on the 3D cell exploration journey',
      icon: '🌱',
      unlockedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'powerhouse',
      title: 'ATP Master',
      description: 'Investigated the inner workings of mitochondria',
      icon: '⚡',
      unlockedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

export function getLearnerProgress(): LearnerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLearnerProgress(INITIAL_PROGRESS);
      return INITIAL_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Failed to read learner progress from storage:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveLearnerProgress(progress: LearnerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save learner progress to storage:', e);
  }
}

export function recordOrganelleExplored(organelleId: string): LearnerProgress {
  const progress = getLearnerProgress();
  if (!progress.exploredOrganelles.includes(organelleId)) {
    progress.exploredOrganelles.push(organelleId);

    // Unlock badge if all 8 key organelles explored
    if (progress.exploredOrganelles.length >= 8 && !progress.earnedBadges.some(b => b.id === 'master_cytologist')) {
      progress.earnedBadges.push({
        id: 'master_cytologist',
        title: 'Master Cytologist',
        description: 'Explored all 8 primary organelles in 3D',
        icon: '🔬',
        unlockedAt: new Date().toISOString()
      });
    }

    saveLearnerProgress(progress);
  }
  return progress;
}

export function recordTopicCompleted(topic: LearningTopicId): LearnerProgress {
  const progress = getLearnerProgress();
  if (!progress.completedTopics.includes(topic)) {
    progress.completedTopics.push(topic);
    saveLearnerProgress(progress);
  }
  return progress;
}

export function recordActivityCompleted(): LearnerProgress {
  const progress = getLearnerProgress();
  progress.activitiesCompleted = (progress.activitiesCompleted || 0) + 1;
  saveLearnerProgress(progress);
  return progress;
}

export function recordQuizCompleted(result: QuizResultData): LearnerProgress {
  const progress = getLearnerProgress();
  progress.quizzesTaken += 1;
  progress.quizHistory.unshift(result);
  
  if (result.percentage > progress.bestQuizScore) {
    progress.bestQuizScore = result.percentage;
  }

  const allScores = progress.quizHistory.map(q => q.percentage);
  progress.averageQuizScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  // If score >= 80%, auto-mark topic as completed if not already
  if (result.percentage >= 80 && !progress.completedTopics.includes(result.topic)) {
    progress.completedTopics.push(result.topic);
  }

  // Quiz champ badge
  if (result.percentage === 100 && !progress.earnedBadges.some(b => b.id === 'perfect_score')) {
    progress.earnedBadges.push({
      id: 'perfect_score',
      title: 'Centum Biologist',
      description: 'Scored 100% on a Gemini AI cellular biology exam',
      icon: '🏆',
      unlockedAt: new Date().toISOString()
    });
  }

  saveLearnerProgress(progress);
  return progress;
}

export function addLearningTime(minutes: number): LearnerProgress {
  const progress = getLearnerProgress();
  progress.totalMinutesLearned = (progress.totalMinutesLearned || 0) + minutes;
  saveLearnerProgress(progress);
  return progress;
}

export function resetProgress(): LearnerProgress {
  const clean: LearnerProgress = {
    ...INITIAL_PROGRESS,
    completedTopics: [],
    exploredOrganelles: [],
    quizzesTaken: 0,
    bestQuizScore: 0,
    averageQuizScore: 0,
    activitiesCompleted: 0,
    totalMinutesLearned: 0,
    streakDays: 1,
    quizHistory: [],
    earnedBadges: []
  };
  saveLearnerProgress(clean);
  return clean;
}
