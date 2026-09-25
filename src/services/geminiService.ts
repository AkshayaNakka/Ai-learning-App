import { AIExplanation, ExplanationLevel, LearningTopicId, QuizQuestion } from '../types';

export interface BackendStatus {
  status: string;
  hasGeminiKey: boolean;
  model: string;
}

export async function checkBackendStatus(): Promise<BackendStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (err) {
    return { status: 'error', hasGeminiKey: false, model: 'gemini-3.8-flash' };
  }
}

export async function fetchAIExplanation(
  organelleId: string,
  organelleName: string,
  level: ExplanationLevel = 'Intermediate'
): Promise<AIExplanation> {
  try {
    const response = await fetch('/api/gemini/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organelleId, organelleName, level })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch AI explanation, falling back to local dataset:', error);
    return {
      organelleName,
      level,
      whatIsIt: `${organelleName} is an essential eukaryotic organelle critical for maintaining homeostatic life processes.`,
      whatDoesItDo: `It coordinates with other cellular structures to execute specialized biochemical duties and metabolic pathways.`,
      whyIsItImportant: `Without ${organelleName}, cellular energy, structural integrity, or genetic expression would rapidly degrade.`,
      analogy: `Like a dedicated department in a municipal ecosystem working 24/7 to sustain the metropolis.`,
      memoryTrick: `Remember ${organelleName} by linking its unique 3D shape to its cellular function!`,
      simpleSummary: `A vital cellular component keeping the human cell alive and efficient.`,
      isFallback: true,
      aiModel: 'Local Biological Knowledge Base'
    };
  }
}

export async function askAITutor(
  question: string,
  contextTopic: string = 'Cell Organelles',
  currentOrganelle?: string,
  chatHistory?: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<{ answer: string; suggestedQuestions: string[]; isFallback: boolean; aiModel?: string }> {
  try {
    const response = await fetch('/api/gemini/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        contextTopic,
        currentOrganelle,
        chatHistory: (chatHistory || []).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.text
        }))
      })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('AI Tutor call error:', error);
    return {
      answer: `In cellular biology, ${question} highlights an important principle of compartmentalization. Every organelle operates inside a specific biochemical environment to prevent unintended reactions.`,
      suggestedQuestions: [
        "Explain this in simpler words",
        "Give me a real-world analogy",
        "What should I remember for an exam?"
      ],
      isFallback: true,
      aiModel: 'BioSphere Knowledge Base'
    };
  }
}

export async function generateAIQuiz(
  topic: LearningTopicId = 'Cell Organelles',
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  count: number = 5
): Promise<{ questions: QuizQuestion[]; isFallback: boolean; aiModel?: string }> {
  try {
    const response = await fetch('/api/gemini/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, count })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
}

export async function getPersonalizedRecommendations(
  score: number,
  total: number,
  topic: LearningTopicId,
  wrongAnswers: any[]
): Promise<{
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  recommendedTopic: string;
  isFallback: boolean;
  aiModel?: string;
}> {
  try {
    const response = await fetch('/api/gemini/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total, topic, wrongAnswers })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    const percentage = Math.round((score / (total || 1)) * 100);
    return {
      summary: `You scored ${percentage}% in ${topic}. Reviewing organelle structures will help solidify your understanding.`,
      strengths: ['Great curiosity and engagement with cell biology concepts'],
      weaknesses: ['Specific biochemical roles and membrane mechanisms'],
      recommendations: [
        'Explore the 3D cell model and click each organelle for a deep dive.',
        'Use the Drag and Drop activity to reinforce spatial positioning.',
        'Retake the quiz to measure your improvement.'
      ],
      recommendedTopic: topic,
      isFallback: true,
      aiModel: 'Local Pedagogical Engine'
    };
  }
}
