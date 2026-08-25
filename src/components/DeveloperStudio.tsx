import React, { useState, useEffect } from 'react';
import {
  Code2,
  Terminal,
  Sparkles,
  Settings,
  Download,
  Copy,
  Check,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Radio,
  Eye,
  ShieldCheck,
  FileCode,
  Folder,
  Volume2,
  Mic,
  Activity,
  Zap,
  Users,
} from 'lucide-react';
import { DeviceMode, ModeInfo, SparkApp } from '../types';
import { OS_MODES } from './DeviceScreen';
import { MASTER_ANDROID_CODEBASE, BUNDLED_SPARK_APPS } from '../data/mockHardwareData';
import { exportGeminiBoxZip } from '../utils/projectExporter';
import { SwarmMatrixView } from './SwarmMatrixView';

interface DeveloperStudioProps {
  currentMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  onSimulateVoicePrompt: (prompt: string) => void;
  onSimulateCameraSnap: () => void;
  onRotaryRotate: (delta: 1 | -1) => void;
  isProcessing: boolean;
  activeSparkApp: SparkApp;
  onSelectSparkApp: (app: SparkApp) => void;
  onGenerateCustomApp: (prompt: string) => void;
  persistentMemories: string[];
  onTriggerNightlySummary: () => void;
  onClearMemories: () => void;
  customPersona: string;
  onUpdatePersona: (persona: string) => void;
  apiKeyStatus: boolean;
  onTriggerSwarmAction?: (agentId: number, taskName: string) => void;
  onRunSwarmBoost?: () => void;
}

export const DeveloperStudio: React.FC<DeveloperStudioProps> = ({
  currentMode,
  onModeChange,
  onSimulateVoicePrompt,
  onSimulateCameraSnap,
  onRotaryRotate,
  isProcessing,
  activeSparkApp,
  onSelectSparkApp,
  onGenerateCustomApp,
  persistentMemories,
  onTriggerNightlySummary,
  onClearMemories,
  customPersona,
  onUpdatePersona,
  apiKeyStatus,
  onTriggerSwarmAction,
  onRunSwarmBoost,
}) => {
  const [activeTab, setActiveTab] = useState<
    'swarm_matrix' | 'controls' | 'codebase' | 'spark_studio' | 'adb_telemetry' | 'settings'
  >('swarm_matrix');
  const [selectedFileKey, setSelectedFileKey] = useState<string>('MainActivity.kt');
  const [copiedFile, setCopiedFile] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [studioAppPrompt, setStudioAppPrompt] = useState('');
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Simulated live ADB logcat stream
  const [adbLogs, setAdbLogs] = useState<string[]>([
    '[INIT] BxBoot: MediaTek MT6765 Helio P35 boot sequence verified.',
    '[SYSFS] step_motor_ms35774: initialized at angle 0 deg.',
    '[AUDIO] AudioHardwareConfig: AEC + NoiseSuppressor bound to VOICE_RECOGNITION.',
    '[KIOSK] MainActivity: startLockTask() engaged. System bars stripped.',
    '[LIVE] BxLiveStream: 16kHz PCM audio buffer ready for PTT trigger.',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        `[THERMAL] /sys/class/thermal/thermal_zone0/temp: ${(40.8 + Math.random() * 1.8).toFixed(1)}°C (schedutil ok)`,
        `[ROTARY] KeyCode intercepted: DPAD_UP/DOWN state idle`,
        `[AUDIO] AudioTrack write queue: 0 underflows, 24kHz stream healthy`,
        `[POWER] 1,000 mAh battery cell: 3.84V, draw: 185 mA`,
      ];
      setAdbLogs((prev) => [...prev.slice(-30), msgs[Math.floor(Math.random() * msgs.length)]]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    const file = MASTER_ANDROID_CODEBASE[selectedFileKey];
    if (file) {
      navigator.clipboard.writeText(file.content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      await exportGeminiBoxZip();
    } finally {
      setIsExportingZip(false);
    }
  };

  const quickPrompts = [
    { label: 'Pomodoro Timer', prompt: 'Create a circular Pomodoro focus timer with rotary wheel dial' },
    { label: 'Tip Splitter', prompt: 'Build a tip splitter calculator with rotary percentage dial' },
    { label: 'Pitch Pipe', prompt: 'Build a musical pitch pipe tone generator with frequency dial' },
    { label: 'Habit Tracker', prompt: 'Build a daily habit ticker widget with rotary streak counter' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl min-h-[560px]">
      {/* Studio Header & Tab Navigation */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950 border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FA4616] animate-pulse" />
          <span className="font-mono font-bold text-sm text-stone-100">
            PROJECT BX • STUDIO WORKBENCH
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
            v3.2 Release
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1">
          <button
            id="tab_30_agents_swarm"
            onClick={() => setActiveTab('swarm_matrix')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'swarm_matrix'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-md'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>30 Agents Swarm</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'controls'
                ? 'bg-[#FA4616] text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Hardware Actions
          </button>
          <button
            onClick={() => setActiveTab('codebase')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'codebase'
                ? 'bg-[#FA4616] text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Android Source
          </button>
          <button
            onClick={() => setActiveTab('spark_studio')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'spark_studio'
                ? 'bg-[#FA4616] text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Spark Micro-Apps
          </button>
          <button
            onClick={() => setActiveTab('adb_telemetry')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'adb_telemetry'
                ? 'bg-[#FA4616] text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            ADB Telemetry
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#FA4616] text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Persona & Memory
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-stone-900 text-stone-200 text-sm">
        {/* ================= TAB 0: 30 AGENTS PARALLEL SWARM MATRIX ================= */}
        {activeTab === 'swarm_matrix' && (
          <SwarmMatrixView
            onTriggerAgentAction={(agentId, taskName) => {
              if (onTriggerSwarmAction) {
                onTriggerSwarmAction(agentId, taskName);
              }
            }}
            onRunGlobalSwarmBoost={() => {
              if (onRunSwarmBoost) {
                onRunSwarmBoost();
              }
            }}
          />
        )}

        {/* ================= TAB 1: HARDWARE CONTROLS & QUICK ACTIONS ================= */}
        {activeTab === 'controls' && (
          <div className="space-y-4 max-w-3xl">
            <div>
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                Live Hardware Interactivity Hub
              </h3>
              <p className="text-xs text-stone-400">
                Directly trigger inputs, voice questions, rotary gestures, and camera snapshots to test the simulated Rabbit R1.
              </p>
            </div>

            {/* Mode Quick Switcher */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs font-mono text-stone-400 uppercase">
                Active Operating Mode (Rotary Wheel Selector)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {OS_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      currentMode === mode.id
                        ? 'border-white bg-stone-800 text-white font-bold shadow-md'
                        : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-200'
                    }`}
                    style={{
                      borderColor: currentMode === mode.id ? mode.accentColor : undefined,
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: mode.accentColor }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mode.accentColor }} />
                      {mode.shortName}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 truncate">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Voice & PTT Input Form */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs font-mono text-stone-400 uppercase">
                Simulate Voice Query to Gemini Box
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (promptInput.trim()) {
                    onSimulateVoicePrompt(promptInput.trim());
                    setPromptInput('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. 'What is the speed of light in vacuum?', 'Play 90s Rock radio', or 'Create a timer'"
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#FA4616]"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-[#FA4616] hover:bg-[#ff5722] disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isProcessing ? 'Processing...' : 'Send Voice'}
                </button>
              </form>

              {/* Quick sample queries */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'What time is it in Tokyo right now?',
                  'Start 90s Rock radio station',
                  'Translate: Where can I buy train tickets to Shibuya?',
                  'Summarize my meeting notes on project architecture',
                  'Explain how a 555 timer works in astable mode',
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => onSimulateVoicePrompt(sample)}
                    className="px-2 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-400 hover:text-stone-200 transition-all"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Rotary & Camera Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <div className="text-xs font-mono text-stone-400 uppercase">
                  Rotary Encoder Simulation
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRotaryRotate(-1)}
                    className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 rounded-lg font-mono text-xs text-stone-200 border border-stone-700 transition-all flex items-center justify-center gap-1"
                  >
                    <span>▲ Scroll Up</span>
                    <span className="text-stone-500">(Up Arrow)</span>
                  </button>
                  <button
                    onClick={() => onRotaryRotate(1)}
                    className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 rounded-lg font-mono text-xs text-stone-200 border border-stone-700 transition-all flex items-center justify-center gap-1"
                  >
                    <span>▼ Scroll Down</span>
                    <span className="text-stone-500">(Down Arrow)</span>
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">
                  Operates the 6-mode carousel, micro-app dials, camera angle micro-steps, and volume.
                </p>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <div className="text-xs font-mono text-stone-400 uppercase">
                  Camera Stepper & Vision Snap
                </div>
                <button
                  onClick={onSimulateCameraSnap}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold rounded-lg font-mono text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Trigger Rabbit Eye Snapshot (Double-click PTT)
                </button>
                <p className="text-[10px] text-stone-500">
                  Switches motor to 180° outward and dispatches visual frame to Gemini for analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MASTER CODEBASE EXPLORER ================= */}
        {activeTab === 'codebase' && (
          <div className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div>
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  Rabbit R1 Gemini Box Master Android Codebase
                </h3>
                <p className="text-xs text-stone-400">
                  Complete production-grade Kotlin, Sysfs drivers, and 1-click ADB flashing manifests.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-all border border-stone-700"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedFile ? 'Copied' : 'Copy File'}
                </button>
                <button
                  onClick={handleDownloadZip}
                  disabled={isExportingZip}
                  className="px-3 py-1.5 rounded-lg bg-[#FA4616] hover:bg-[#ff5722] disabled:opacity-50 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isExportingZip ? 'Packaging...' : 'Download Complete ZIP'}
                </button>
              </div>
            </div>

            {/* Split Explorer: File List on Left, Code Viewer on Right */}
            <div className="flex-1 flex gap-3 min-h-[400px]">
              {/* File List */}
              <div className="w-56 bg-stone-950 rounded-xl border border-stone-800 p-2 space-y-1 overflow-y-auto shrink-0">
                <div className="text-[10px] font-mono text-stone-500 uppercase px-2 py-1 flex items-center gap-1">
                  <Folder className="w-3 h-3 text-stone-400" /> Source Tree
                </div>
                {Object.keys(MASTER_ANDROID_CODEBASE).map((fileKey) => (
                  <button
                    key={fileKey}
                    onClick={() => setSelectedFileKey(fileKey)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate transition-all ${
                      selectedFileKey === fileKey
                        ? 'bg-[#FA4616]/20 text-[#FA4616] font-bold border border-[#FA4616]/50'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    {fileKey}
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="flex-1 bg-stone-950 rounded-xl border border-stone-800 p-3 overflow-auto font-mono text-xs text-stone-300 leading-relaxed shadow-inner">
                <div className="text-[10px] text-stone-500 mb-2 border-b border-stone-800 pb-1">
                  {MASTER_ANDROID_CODEBASE[selectedFileKey]?.filename}
                </div>
                <pre className="whitespace-pre">
                  {MASTER_ANDROID_CODEBASE[selectedFileKey]?.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SPARK MICRO-APP STUDIO ================= */}
        {activeTab === 'spark_studio' && (
          <div className="space-y-4 max-w-4xl">
            <div>
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Spark On-Device Micro-App Generator & Runner
              </h3>
              <p className="text-xs text-stone-400">
                Design, test, and mount standalone HTML5/JS widgets optimized for the Rabbit R1's 2.88" display and rotary dial.
              </p>
            </div>

            {/* Pre-installed Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BUNDLED_SPARK_APPS.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectSparkApp(app)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeSparkApp.id === app.id
                      ? 'border-emerald-400 bg-emerald-950/20 text-white shadow-lg'
                      : 'border-stone-800 bg-stone-950 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="font-bold text-xs text-emerald-400 mb-1 flex items-center justify-between">
                    <span>{app.name}</span>
                    <span className="text-[9px] px-1 bg-stone-800 text-stone-400 rounded">
                      {app.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">{app.description}</p>
                </div>
              ))}
            </div>

            {/* Custom AI App Generation Form */}
            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                Generate Any New Micro-App with Gemini Spark
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (studioAppPrompt.trim()) {
                    onGenerateCustomApp(studioAppPrompt.trim());
                    setStudioAppPrompt('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={studioAppPrompt}
                  onChange={(e) => setStudioAppPrompt(e.target.value)}
                  placeholder="Describe your micro-app (e.g. 'Tip calculator with rotary tip dial', 'Metronome', 'Coin flipper')..."
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isProcessing ? 'Generating...' : 'Build App'}
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onGenerateCustomApp(item.prompt)}
                    className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-400 hover:text-stone-200 transition-all"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ADB TELEMETRY & HARDWARE GAUGES ================= */}
        {activeTab === 'adb_telemetry' && (
          <div className="space-y-4 max-w-4xl">
            <div>
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Live ADB Serial Monitor & MT6765 SoC Telemetry
              </h3>
              <p className="text-xs text-stone-400">
                Low-level diagnostics monitoring CPU thermals, memory pressure, DSP audio filters, and kernel sysfs nodes.
              </p>
            </div>

            {/* Hardware Gauge Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                <div className="text-[10px] font-mono text-stone-400 uppercase mb-1 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" /> CPU Core Temp
                </div>
                <div className="text-xl font-bold text-cyan-400 font-mono">41.4°C</div>
                <div className="text-[10px] text-stone-500 mt-1">Governor: schedutil</div>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                <div className="text-[10px] font-mono text-stone-400 uppercase mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" /> System RAM
                </div>
                <div className="text-xl font-bold text-emerald-400 font-mono">920 MB</div>
                <div className="text-[10px] text-stone-500 mt-1">3.08 GB Free of 4.0 GB</div>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                <div className="text-[10px] font-mono text-stone-400 uppercase mb-1 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-purple-400" /> Hardware AEC
                </div>
                <div className="text-xl font-bold text-purple-400 font-mono">ACTIVE</div>
                <div className="text-[10px] text-stone-500 mt-1">Acoustic Echo Isolation</div>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                <div className="text-[10px] font-mono text-stone-400 uppercase mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Kiosk Lock
                </div>
                <div className="text-xl font-bold text-amber-400 font-mono">PINNED</div>
                <div className="text-[10px] text-stone-500 mt-1">Bypass: Up 3x, Down 3x</div>
              </div>
            </div>

            {/* Simulated Live Logcat Console */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-2 text-[10px] text-stone-500">
                <span>ADB LOGCAT STREAM (SERIAL /dev/ttyMT0)</span>
                <span className="text-emerald-400">● STREAMING</span>
              </div>
              <div className="h-44 overflow-y-auto space-y-1 text-stone-300 pr-1 select-text">
                {adbLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    <span className="text-stone-600 mr-2">{new Date().toLocaleTimeString()}</span>
                    <span
                      className={
                        log.includes('[INIT]')
                          ? 'text-cyan-400'
                          : log.includes('[SYSFS]')
                          ? 'text-amber-400'
                          : log.includes('[AUDIO]')
                          ? 'text-purple-400'
                          : log.includes('[THERMAL]')
                          ? 'text-emerald-400'
                          : 'text-stone-300'
                      }
                    >
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PERSONA & MEMORY SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-4 max-w-3xl">
            <div>
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2 mb-1">
                <Settings className="w-4 h-4 text-purple-400" />
                Custom Persona & Persistent Memory Bank
              </h3>
              <p className="text-xs text-stone-400">
                Configure your Gemini Box personality and inspect durable facts synthesized by the nightly background worker.
              </p>
            </div>

            {/* Persona Customizer */}
            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs font-mono text-purple-400 font-bold uppercase">
                Active System Instruction / Personality
              </div>
              <textarea
                value={customPersona}
                onChange={(e) => onUpdatePersona(e.target.value)}
                rows={3}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                placeholder="Set custom tone, e.g., 'Ultra-concise, technical, no conversational fluff. Direct answers only.'"
              />

              {/* Persona Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: 'Concise & Technical', val: 'Be ultra-concise, technical, and direct. Skip introductory greetings and polite filler.' },
                  { label: 'Casual Companion', val: 'Be friendly, conversational, and energetic. Speak like a close tech-savvy friend.' },
                  { label: 'Jarvis Assistant', val: 'Act as a refined, high-intelligence personal operating system assistant named Jarvis.' },
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdatePersona(preset.val)}
                    className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-400 hover:text-purple-300 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Persistent Memories Bank */}
            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-bold uppercase">
                <span>Durable Long-Term Memories ({persistentMemories.length})</span>
                <div className="flex gap-2">
                  <button
                    onClick={onTriggerNightlySummary}
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-mono font-bold"
                  >
                    Run Nightly Distillation
                  </button>
                  <button
                    onClick={onClearMemories}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[10px] font-mono"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {persistentMemories.length === 0 ? (
                  <p className="text-xs text-stone-500 py-2">
                    No memories saved yet. Talk with Gemini Box and nightly distillation will record key takeaways.
                  </p>
                ) : (
                  persistentMemories.map((mem, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-stone-900 border border-purple-500/20 text-xs text-stone-300 flex items-start gap-2"
                    >
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{mem}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
