import React, { useState, useEffect, useRef } from 'react';
import { DIVISION_STAGES } from '../../data/divisionStages';
import { speechService } from '../../services/speechService';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Info,
  Maximize2
} from 'lucide-react';

export const CellDivisionSim: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(3500); // ms per stage
  const [isSpeaking, setIsSpeaking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stage = DIVISION_STAGES[currentStageIndex];

  // Subscribe to speechService
  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
      speechService.stop();
    };
  }, [currentStageIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % DIVISION_STAGES.length);
    }, speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // Voice narration toggle
  const handleToggleVoice = () => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      const text = `${stage.name}. ${stage.description} Key event: ${stage.keyEvents[0]} AI insight: ${stage.aiInsight}`;
      speechService.speak(text);
    }
  };

  // Canvas visual rendering of each division phase
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w / 2);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.save();

      const phase = stage.phase;

      if (phase === 'Interphase') {
        // Single spherical cell
        ctx.beginPath();
        ctx.ellipse(cx, cy, 140, 140, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.fill();

        // Intact nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 65, 0, Math.PI * 2);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.fill();

        // Diffuse chromatin loops inside nucleus
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          const angle = (i / 6) * Math.PI * 2 + Math.sin(t + i) * 0.1;
          const r1 = 20 + (i % 3) * 12;
          ctx.arc(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1, 14, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Nucleolus
        ctx.beginPath();
        ctx.arc(cx - 15, cy - 15, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#6b21a8';
        ctx.fill();

        // Two adjacent centrosomes
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx + 80, cy - 60, 6, 0, Math.PI * 2);
        ctx.arc(cx + 95, cy - 50, 6, 0, Math.PI * 2);
        ctx.fill();

      } else if (phase === 'Prophase') {
        // Single spherical cell
        ctx.beginPath();
        ctx.ellipse(cx, cy, 145, 140, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.fill();

        // Fragmenting nuclear envelope (dashed)
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(cx, cy, 65, 0, Math.PI * 2);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        // 4 condensed X-shaped chromosomes
        const chromoPositions = [
          { x: cx - 25, y: cy - 20, rot: 0.3 },
          { x: cx + 25, y: cy - 15, rot: -0.4 },
          { x: cx - 20, y: cy + 25, rot: 0.8 },
          { x: cx + 20, y: cy + 20, rot: -0.6 },
        ];

        chromoPositions.forEach((pos) => {
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(pos.rot + Math.sin(t) * 0.05);

          // Draw X chromosome
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-12, -18);
          ctx.lineTo(12, 18);
          ctx.moveTo(12, -18);
          ctx.lineTo(-12, 18);
          ctx.stroke();

          // Centromere dot
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // Centrosomes migrating to opposite poles
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx - 105, cy, 7, 0, Math.PI * 2);
        ctx.arc(cx + 105, cy, 7, 0, Math.PI * 2);
        ctx.fill();

        // Early spindle asters
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 1.5;
        for (let a = 0; a < 6; a++) {
          const ang = (a / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx - 105, cy);
          ctx.lineTo(cx - 105 + Math.cos(ang) * 25, cy + Math.sin(ang) * 25);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + 105, cy);
          ctx.lineTo(cx + 105 + Math.cos(ang) * 25, cy + Math.sin(ang) * 25);
          ctx.stroke();
        }

      } else if (phase === 'Metaphase') {
        // Oval cell
        ctx.beginPath();
        ctx.ellipse(cx, cy, 155, 135, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.fill();

        // Centrosomes at exact left and right poles
        const poleL = { x: cx - 135, y: cy };
        const poleR = { x: cx + 135, y: cy };

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(poleL.x, poleL.y, 8, 0, Math.PI * 2);
        ctx.arc(poleR.x, poleR.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Spindle fibers converging to metaphase plate
        const plateY = [cy - 60, cy - 20, cy + 20, cy + 60];

        plateY.forEach((py) => {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(poleL.x, poleL.y);
          ctx.lineTo(cx, py);
          ctx.lineTo(poleR.x, poleR.y);
          ctx.stroke();

          // Chromosome lined up vertically along equator
          ctx.save();
          ctx.translate(cx, py);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-10, -10);
          ctx.lineTo(10, 10);
          ctx.moveTo(10, -10);
          ctx.lineTo(-10, 10);
          ctx.stroke();

          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Metaphase plate dotted dashed guide
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 100);
        ctx.lineTo(cx, cy + 100);
        ctx.stroke();
        ctx.restore();

      } else if (phase === 'Anaphase') {
        // Elongated cell shape
        ctx.beginPath();
        ctx.ellipse(cx, cy, 180, 120, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.fill();

        const poleL = { x: cx - 160, y: cy };
        const poleR = { x: cx + 160, y: cy };

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(poleL.x, poleL.y, 8, 0, Math.PI * 2);
        ctx.arc(poleR.x, poleR.y, 8, 0, Math.PI * 2);
        ctx.fill();

        const sepY = [cy - 45, cy - 15, cy + 15, cy + 45];
        const travel = 65;

        sepY.forEach((py) => {
          // Left V-chromatid pulled toward left pole
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(poleL.x, poleL.y);
          ctx.lineTo(cx - travel, py);
          ctx.stroke();

          ctx.save();
          ctx.translate(cx - travel, py);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(12, -10);
          ctx.lineTo(0, 0);
          ctx.lineTo(12, 10);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Right V-chromatid pulled toward right pole
          ctx.beginPath();
          ctx.moveTo(poleR.x, poleR.y);
          ctx.lineTo(cx + travel, py);
          ctx.stroke();

          ctx.save();
          ctx.translate(cx + travel, py);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-12, -10);
          ctx.lineTo(0, 0);
          ctx.lineTo(-12, 10);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

      } else if (phase === 'Telophase') {
        // Hourglass shape (pinching cleavage furrow)
        ctx.beginPath();
        ctx.moveTo(cx - 170, cy - 100);
        ctx.bezierCurveTo(cx - 50, cy - 100, cx - 20, cy - 40, cx, cy - 25);
        ctx.bezierCurveTo(cx + 20, cy - 40, cx + 50, cy - 100, cx + 170, cy - 100);
        ctx.bezierCurveTo(cx + 210, cy, cx + 210, cy, cx + 170, cy + 100);
        ctx.bezierCurveTo(cx + 50, cy + 100, cx + 20, cy + 40, cx, cy + 25);
        ctx.bezierCurveTo(cx - 20, cy + 40, cx - 50, cy + 100, cx - 170, cy + 100);
        ctx.bezierCurveTo(cx - 210, cy, cx - 210, cy, cx - 170, cy - 100);
        ctx.closePath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.fill();

        // Two reforming round purple nuclear envelopes
        [-95, 95].forEach((offset) => {
          ctx.beginPath();
          ctx.arc(cx + offset, cy, 48, 0, Math.PI * 2);
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
          ctx.fill();

          // Decondensing chromatin threads inside
          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx + offset - 8, cy - 8, 12, 0, Math.PI * 1.5);
          ctx.arc(cx + offset + 8, cy + 8, 10, 0, Math.PI * 1.5);
          ctx.stroke();

          // Centrosome outside
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cx + offset * 1.45, cy, 6, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (phase === 'Cytokinesis') {
        // Two distinct separating daughter cells
        const r = 85;
        const offset = 105;

        // Left Daughter Cell
        ctx.beginPath();
        ctx.arc(cx - offset, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.fill();

        // Left Nucleus
        ctx.beginPath();
        ctx.arc(cx - offset, cy, 42, 0, Math.PI * 2);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.fill();

        // Left nucleolus
        ctx.beginPath();
        ctx.arc(cx - offset - 8, cy - 8, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#6b21a8';
        ctx.fill();

        // Right Daughter Cell
        ctx.beginPath();
        ctx.arc(cx + offset, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.fill();

        // Right Nucleus
        ctx.beginPath();
        ctx.arc(cx + offset, cy, 42, 0, Math.PI * 2);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.fill();

        // Right nucleolus
        ctx.beginPath();
        ctx.arc(cx + offset - 8, cy - 8, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#6b21a8';
        ctx.fill();

        // Severed midbody glow
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [stage.phase]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Simulation Screen Card */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Header Overlay */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 text-cyan-300 font-black text-sm flex items-center justify-center">
              {currentStageIndex + 1}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-extrabold text-base sm:text-lg tracking-tight">
                  {stage.name}
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-cyan-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
                  Step {currentStageIndex + 1} of 6
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{stage.subTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSpeaking
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isSpeaking ? 'Stop voice' : 'Listen to AI narration'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic 2.5D Animated Canvas */}
        <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Bottom Stage Scrubber bar inside visualizer */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-500/30"
                title={isPlaying ? 'Pause simulation' : 'Play automated simulation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => setCurrentStageIndex((prev) => (prev - 1 + DIVISION_STAGES.length) % DIVISION_STAGES.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Previous stage"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentStageIndex((prev) => (prev + 1) % DIVISION_STAGES.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Next stage"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Speed toggle */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="hidden sm:inline">Speed:</span>
              <button
                onClick={() => setSpeed(speed === 3500 ? 2000 : 3500)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 font-semibold"
              >
                {speed === 3500 ? '1x' : '2x'}
              </button>
            </div>
          </div>
        </div>

        {/* Phase Pills Navigation */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {DIVISION_STAGES.map((s, idx) => {
            const isActive = currentStageIndex === idx;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStageIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {idx + 1}. {s.phase}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanatory Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Description */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Cellular Mechanism & Events
            </h4>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Typical duration: ~{stage.durationMinutes} min
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {stage.description}
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Key Biological Benchmarks
            </span>
            <ul className="space-y-1.5">
              {stage.keyEvents.map((evt, eIdx) => (
                <li key={eIdx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{evt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                AI Biological Analogy
              </h5>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic bg-white/5 p-3.5 rounded-2xl border border-white/10">
              "{stage.aiInsight}"
            </p>
          </div>

          <div className="pt-2 border-t border-white/10">
            <span className="text-[11px] text-cyan-300 font-semibold block mb-1">
              Visual Focus:
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              {stage.visualHighlights}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
