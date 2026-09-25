import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CellCanvas3D } from './components/CellExplorer/CellCanvas3D';
import { OrganelleDetails } from './components/CellExplorer/OrganelleDetails';
import { ExplorerControls } from './components/CellExplorer/ExplorerControls';
import { QuizView } from './components/Quiz/QuizView';
import { CellDivisionSim } from './components/Simulation/CellDivisionSim';
import { ActivitiesView } from './components/Activities/ActivitiesView';
import { AITutorModal } from './components/AITutor/AITutorModal';
import { ProgressModal } from './components/Progress/ProgressModal';
import { DemoTourGuide, DEMO_STEPS } from './components/GuidedDemo/DemoTourGuide';
import { ORGANELLES } from './data/organelles';
import { Organelle, LearnerProgress, LearningTopicId } from './types';
import { getLearnerProgress, recordOrganelleExplored, addLearningTime } from './services/storageService';
import { checkBackendStatus } from './services/geminiService';
import { Sparkles, Dna, Bot, Compass, Heart } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'explorer' | 'quiz' | 'simulation' | 'activities'>('landing');
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle>(ORGANELLES[1]); // Default to Mitochondria
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);
  const [currentTopic, setCurrentTopic] = useState<LearningTopicId>('Cell Organelles');
  const [progress, setProgress] = useState<LearnerProgress>(getLearnerProgress());

  // AI Tutor Modal state
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorContextOrganelle, setTutorContextOrganelle] = useState<string | undefined>(undefined);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);

  // Progress Modal state
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Guided Demo Tour state
  const [isDemoTourActive, setIsDemoTourActive] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);

  // Backend status
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  useEffect(() => {
    checkBackendStatus().then((res) => {
      setHasGeminiKey(res.hasGeminiKey);
    });
  }, []);

  // Track study time every 60 seconds of active usage
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = addLearningTime(1);
      setProgress(updated);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Whenever an organelle is selected, mark it in explored progress
  const handleSelectOrganelle = (org: Organelle) => {
    setSelectedOrganelle(org);
    const updated = recordOrganelleExplored(org.id);
    setProgress(updated);
  };

  const handleAskTutorAboutOrganelle = (organelleName: string, prompt?: string) => {
    setTutorContextOrganelle(organelleName);
    setTutorInitialPrompt(prompt);
    setIsTutorOpen(true);
  };

  const handleExploreNextOrganelle = () => {
    const currentIndex = ORGANELLES.findIndex((o) => o.id === selectedOrganelle.id);
    const nextOrg = ORGANELLES[(currentIndex + 1) % ORGANELLES.length];
    handleSelectOrganelle(nextOrg);
  };

  // Guided Tour handlers
  const handleStartDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoStepIndex(0);
    applyDemoStep(0);
  };

  const applyDemoStep = (stepIdx: number) => {
    const step = DEMO_STEPS[stepIdx];
    setCurrentView(step.view);
    if (step.focusOrganelle) {
      const org = ORGANELLES.find((o) => o.id === step.focusOrganelle);
      if (org) {
        setSelectedOrganelle(org);
      }
    }
  };

  const handleNextDemoStep = () => {
    if (demoStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = demoStepIndex + 1;
      setDemoStepIndex(nextIdx);
      applyDemoStep(nextIdx);
    } else {
      setIsDemoTourActive(false);
    }
  };

  const handlePrevDemoStep = () => {
    if (demoStepIndex > 0) {
      const prevIdx = demoStepIndex - 1;
      setDemoStepIndex(prevIdx);
      applyDemoStep(prevIdx);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenTutor={() => {
          setTutorContextOrganelle(selectedOrganelle.name);
          setTutorInitialPrompt(undefined);
          setIsTutorOpen(true);
        }}
        onOpenProgress={() => setIsProgressOpen(true)}
        onStartDemoTour={handleStartDemoTour}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'landing' && (
          <LandingPage
            onStartLearning={() => setCurrentView('dashboard')}
            onStartDemoTour={handleStartDemoTour}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            progress={progress}
            onNavigate={setCurrentView}
            onSelectTopic={(t) => setCurrentTopic(t)}
          />
        )}

        {currentView === 'explorer' && (
          <div className="space-y-6">
            {/* Organelle Selector Pills */}
            <ExplorerControls
              selectedOrganelle={selectedOrganelle}
              onSelectOrganelle={handleSelectOrganelle}
              exploredOrganelles={progress.exploredOrganelles}
            />

            {/* 3D Cell Canvas and Organelle Inspector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 h-[500px] lg:h-[640px]">
                <CellCanvas3D
                  selectedOrganelle={selectedOrganelle}
                  onSelectOrganelle={handleSelectOrganelle}
                  cutawayMode={cutawayMode}
                  onToggleCutaway={() => setCutawayMode(!cutawayMode)}
                />
              </div>

              <div className="lg:col-span-5 h-[500px] lg:h-[640px]">
                <OrganelleDetails
                  organelle={selectedOrganelle}
                  onAskTutorAboutOrganelle={handleAskTutorAboutOrganelle}
                  onExploreNext={handleExploreNextOrganelle}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'quiz' && (
          <QuizView
            initialTopic={currentTopic}
            onNavigateTopic={(top) => {
              setCurrentTopic(top as LearningTopicId);
              setCurrentView('explorer');
            }}
          />
        )}

        {currentView === 'simulation' && (
          <CellDivisionSim />
        )}

        {currentView === 'activities' && (
          <ActivitiesView />
        )}
      </main>

      {/* Floating AI Tutor Quick Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => {
            setTutorContextOrganelle(selectedOrganelle?.name);
            setTutorInitialPrompt(undefined);
            setIsTutorOpen(true);
          }}
          className="p-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-2xl border border-slate-700 flex items-center gap-2.5 transition-all hover:scale-105 group"
          title="Open BioSphere AI Biology Tutor"
        >
          <Bot className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline pr-1">Ask AI Tutor</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* AI Tutor Modal */}
      <AITutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        contextTopic={currentTopic}
        currentOrganelle={tutorContextOrganelle}
        initialPrompt={tutorInitialPrompt}
      />

      {/* Learner Progress Modal */}
      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        progress={progress}
        onReset={(newP) => setProgress(newP)}
      />

      {/* Guided Demo Tour Guide */}
      {isDemoTourActive && (
        <DemoTourGuide
          currentStepIndex={demoStepIndex}
          onNextStep={handleNextDemoStep}
          onPrevStep={handlePrevDemoStep}
          onCloseTour={() => setIsDemoTourActive(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              B
            </span>
            <span className="font-extrabold text-slate-800">BioSphere AI</span>
            <span>— Interactive 3D Human Cell Explorer</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium text-[11px]">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Powered by Gemini AI (gemini-3.8-flash)
            </span>
            <span className="text-slate-400">•</span>
            <span>Contest 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
