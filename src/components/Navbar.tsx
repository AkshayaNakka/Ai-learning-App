import React, { useState } from 'react';
import { 
  Compass, 
  Dna, 
  Layers, 
  Sparkles, 
  Trophy, 
  Bot, 
  Menu, 
  X, 
  Play, 
  BrainCircuit,
  Target
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'explorer' | 'quiz' | 'simulation' | 'activities';
  onNavigate: (view: 'landing' | 'dashboard' | 'explorer' | 'quiz' | 'simulation' | 'activities') => void;
  onOpenTutor: () => void;
  onOpenProgress: () => void;
  onStartDemoTour: () => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenTutor,
  onOpenProgress,
  onStartDemoTour,
  hasGeminiKey,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: {
    id: 'landing' | 'dashboard' | 'explorer' | 'simulation' | 'activities' | 'quiz';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'explorer', label: '3D Cell Explorer', icon: <Compass className="w-4 h-4" /> },
    { id: 'simulation', label: 'Division Sim', icon: <Dna className="w-4 h-4" /> },
    { id: 'activities', label: 'Lab Activities', icon: <Target className="w-4 h-4" /> },
    { id: 'quiz', label: 'AI Quiz', icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Dna className="w-5 h-5 text-cyan-200 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-lg">
                  BioSphere<span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                  Biology 3D
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium hidden sm:block">
                Interactive Human Cell Explorer
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* 2-Min Demo Button */}
          <button
            onClick={onStartDemoTour}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-xs transition-colors"
            title="Start structured 2-minute demonstration flow"
          >
            <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            <span>2-Min Demo</span>
          </button>

          {/* AI Tutor Button */}
          <button
            onClick={onOpenTutor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all hover:scale-105"
            title="Ask AI Biology Tutor"
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">AI Tutor</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Progress Modal Opener */}
          <button
            onClick={onOpenProgress}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="View Progress & Milestones"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 bg-white border-t border-slate-100 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Dna className="w-4 h-4" />
            <span>Home / Landing Page</span>
          </button>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentView === link.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onStartDemoTour();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-indigo-600 py-1.5 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-600" />
              <span>Launch 2-Min Demo Flow</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
