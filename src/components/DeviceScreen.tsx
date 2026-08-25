import React, { useRef, useEffect, useState } from 'react';
import {
  Mic,
  Sparkles,
  Radio,
  Eye,
  Languages,
  FileText,
  Brain,
  Terminal,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  CheckCircle2,
  Globe,
  ExternalLink,
  Code,
} from 'lucide-react';
import { DeviceMode, ModeInfo, ChatMessage, RadioStation, SparkApp, VoiceMemo } from '../types';
import { RADIO_STATIONS } from '../data/radioStations';
import { BUNDLED_SPARK_APPS } from '../data/mockHardwareData';
import { CameraViewfinder } from './CameraViewfinder';

export const OS_MODES: ModeInfo[] = [
  {
    id: 'flash_live',
    name: 'Flash Live Voice',
    shortName: 'Live Voice',
    accentColor: '#00FFFF',
    bgGlow: 'rgba(0, 255, 255, 0.15)',
    iconName: 'Mic',
    description: 'Sub-second bidirectional voice stream with instant barge-in.',
    triggerKey: 'Hold PTT',
  },
  {
    id: 'pro_intern',
    name: 'Pro / Intern Mode',
    shortName: 'Pro Brain',
    accentColor: '#BB86FC',
    bgGlow: 'rgba(187, 134, 252, 0.15)',
    iconName: 'Brain',
    description: 'Deep reasoning with Python code sandbox & Search Grounding.',
    triggerKey: 'Wheel In',
  },
  {
    id: 'vision_scanner',
    name: 'Vision Scanner',
    shortName: 'Rabbit Eye',
    accentColor: '#FFA500',
    bgGlow: 'rgba(255, 165, 0, 0.15)',
    iconName: 'Eye',
    description: '360° Stepper Camera for visual Q&A & sketch-to-app.',
    triggerKey: '2x PTT',
  },
  {
    id: 'spark_apps',
    name: 'Spark Micro-Apps',
    shortName: 'Spark Hub',
    accentColor: '#00E676',
    bgGlow: 'rgba(0, 230, 118, 0.15)',
    iconName: 'Sparkles',
    description: 'Standalone HTML5/JS widgets powered by rotary wheel.',
    triggerKey: 'Wheel+PTT',
  },
  {
    id: 'interpreter',
    name: 'Dual Interpreter',
    shortName: 'Translate',
    accentColor: '#00B0FF',
    bgGlow: 'rgba(0, 176, 255, 0.15)',
    iconName: 'Languages',
    description: 'Real-time bidirectional speech translation & TTS.',
    triggerKey: 'Mode 5',
  },
  {
    id: 'yt_music',
    name: 'YT Music Radio',
    shortName: 'Radio',
    accentColor: '#FF2A54',
    bgGlow: 'rgba(255, 42, 84, 0.15)',
    iconName: 'Radio',
    description: 'Ad-free headless audio streams & genre radio stations.',
    triggerKey: 'Mode 6',
  },
  {
    id: 'voice_memo',
    name: 'Voice Memos',
    shortName: 'Memos',
    accentColor: '#FFD600',
    bgGlow: 'rgba(255, 214, 0, 0.15)',
    iconName: 'FileText',
    description: 'Voice note transcription & action items checklist.',
    triggerKey: 'Mode 7',
  },
  {
    id: 'memory_bank',
    name: 'Memory Bank',
    shortName: 'Memory',
    accentColor: '#9C27B0',
    bgGlow: 'rgba(156, 39, 176, 0.15)',
    iconName: 'Zap',
    description: 'Nightly WorkManager memory synthesis & personas.',
    triggerKey: 'Mode 8',
  },
];

interface DeviceScreenProps {
  currentMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  isPttActive: boolean;
  isAiSpeaking: boolean;
  messages: ChatMessage[];
  cameraAngle: number;
  onCameraAngleChange: (angle: number) => void;
  onCameraCapture: (dataUrl: string, promptText?: string) => void;
  isProcessing: boolean;
  // Music State
  activeStation: RadioStation;
  isPlayingMusic: boolean;
  currentTrackIndex: number;
  musicVolume: number;
  onTogglePlayMusic: () => void;
  onSelectStation: (st: RadioStation) => void;
  onNextTrack: () => void;
  // Spark Apps
  activeSparkApp: SparkApp;
  onSelectSparkApp: (app: SparkApp) => void;
  onGenerateCustomApp: (prompt: string) => void;
  // Voice Memos
  voiceMemos: VoiceMemo[];
  // Memories
  persistentMemories: string[];
  onTriggerNightlySummary: () => void;
  onClearMemories: () => void;
  // Rotary wheel event pass-through
  lastRotaryDelta: { delta: 1 | -1; timestamp: number } | null;
}

export const DeviceScreen: React.FC<DeviceScreenProps> = ({
  currentMode,
  onModeChange,
  isPttActive,
  isAiSpeaking,
  messages,
  cameraAngle,
  onCameraAngleChange,
  onCameraCapture,
  isProcessing,
  activeStation,
  isPlayingMusic,
  currentTrackIndex,
  musicVolume,
  onTogglePlayMusic,
  onSelectStation,
  onNextTrack,
  activeSparkApp,
  onSelectSparkApp,
  onGenerateCustomApp,
  voiceMemos,
  persistentMemories,
  onTriggerNightlySummary,
  onClearMemories,
  lastRotaryDelta,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [customPromptInput, setCustomPromptInput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetLang, setTargetLang] = useState('Spanish');
  const [interpreterInput, setInterpreterInput] = useState('');

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pass rotary delta to iframe if Spark App is active
  useEffect(() => {
    if (currentMode === 'spark_apps' && lastRotaryDelta && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: 'ROTARY_WHEEL', delta: lastRotaryDelta.delta },
          '*'
        );
        const win = iframeRef.current.contentWindow as any;
        if (typeof win.onRotaryWheel === 'function') {
          win.onRotaryWheel(lastRotaryDelta.delta);
        }
      } catch (e) {}
    }
  }, [lastRotaryDelta, currentMode]);

  const currentModeInfo = OS_MODES.find((m) => m.id === currentMode) || OS_MODES[0];
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');

  return (
    <div
      id="rabbit_screen_viewport"
      className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{
        boxShadow: `inset 0 0 24px rgba(0,0,0,0.9)`,
      }}
    >
      {/* 1. TOP SYSTEM STATUS BAR */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-stone-950/90 border-b border-stone-800 text-[11px] font-mono shrink-0 z-20">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-stone-200">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-stone-500">|</span>
          <span className="text-emerald-400 flex items-center gap-0.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            5GHz
          </span>
        </div>

        {/* Active Mode Pill Button */}
        <div
          onClick={() => {
            const nextIdx = (OS_MODES.findIndex((m) => m.id === currentMode) + 1) % OS_MODES.length;
            onModeChange(OS_MODES[nextIdx].id);
          }}
          className="px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-all border shadow-sm"
          style={{
            backgroundColor: `${currentModeInfo.accentColor}18`,
            color: currentModeInfo.accentColor,
            borderColor: `${currentModeInfo.accentColor}40`,
          }}
          title="Click to cycle next operating mode (or rotate rotary wheel)"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentModeInfo.accentColor }} />
          {currentModeInfo.shortName.toUpperCase()}
        </div>

        {/* Battery & SoC Status */}
        <div className="flex items-center gap-1 text-[10px] text-stone-400">
          <span>41°C</span>
          <span className="text-stone-300 font-bold">94%</span>
        </div>
      </div>

      {/* 2. MODE CAROUSEL PIPS (Glowing top dots) */}
      <div className="flex justify-center gap-1.5 py-1 bg-stone-950/40 border-b border-stone-900/50 shrink-0">
        {OS_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`transition-all ${
              currentMode === mode.id
                ? 'w-4 h-1.5 rounded-full'
                : 'w-1.5 h-1.5 rounded-full bg-stone-700 hover:bg-stone-500'
            }`}
            style={{
              backgroundColor: currentMode === mode.id ? mode.accentColor : undefined,
              boxShadow: currentMode === mode.id ? `0 0 6px ${mode.accentColor}` : undefined,
            }}
            title={mode.name}
          />
        ))}
      </div>

      {/* 3. MAIN INTERACTIVE VIEWPORT (Scrollable, high-contrast) */}
      <div className="flex-1 flex flex-col p-3 overflow-y-auto overflow-x-hidden relative">
        {/* ================= MODE 1: FLASH LIVE VOICE ================= */}
        {currentMode === 'flash_live' && (
          <div className="flex-1 flex flex-col items-center justify-between text-center">
            {/* Live Status Orb */}
            <div className="my-auto flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center">
                {/* Pulsing ripples */}
                <div
                  className={`absolute rounded-full transition-all duration-500 ${
                    isPttActive || isAiSpeaking
                      ? 'w-32 h-32 opacity-30 animate-ping'
                      : 'w-24 h-24 opacity-10'
                  }`}
                  style={{ backgroundColor: '#00FFFF' }}
                />
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                    isPttActive
                      ? 'border-emerald-400 bg-emerald-950/50 scale-110'
                      : isAiSpeaking
                      ? 'border-cyan-400 bg-cyan-950/50 scale-105'
                      : 'border-cyan-500/50 bg-stone-900'
                  }`}
                  style={{
                    boxShadow: isPttActive || isAiSpeaking ? `0 0 20px #00FFFF` : 'none',
                  }}
                >
                  <Mic
                    className={`w-9 h-9 ${
                      isPttActive
                        ? 'text-emerald-400 animate-pulse'
                        : isAiSpeaking
                        ? 'text-cyan-300 animate-bounce'
                        : 'text-cyan-400'
                    }`}
                  />
                </div>
              </div>

              {/* Sub-second latency badge & status text */}
              <div className="flex flex-col items-center gap-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>Sub-second Live Stream</span>
                </div>
                <div className="text-sm font-bold text-stone-100">
                  {isPttActive
                    ? 'Listening to your voice...'
                    : isAiSpeaking
                    ? 'Gemini Live Speaking...'
                    : isProcessing
                    ? 'Reasoning on Cloud Edge...'
                    : 'Hold Side PTT to Speak'}
                </div>
              </div>

              {/* Simulated 16-bar neon audio waveform */}
              <div className="flex items-center justify-center gap-1 h-8 mt-1">
                {Array.from({ length: 16 }).map((_, i) => {
                  const barHeight = isPttActive || isAiSpeaking
                    ? Math.max(4, Math.sin((i + Date.now() / 200) * 0.8) * 24 + 10)
                    : 3;
                  return (
                    <div
                      key={i}
                      className="w-1 rounded-full transition-all duration-75"
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor: isPttActive ? '#00E676' : '#00FFFF',
                        boxShadow: `0 0 4px #00FFFF`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Conversation Glance Card */}
            {lastAssistantMsg && (
              <div className="w-full mt-auto bg-stone-900/90 border border-cyan-500/30 rounded-xl p-2.5 text-left text-xs text-stone-200 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1">
                  <span>GEMINI LIVE RESPONSE</span>
                  <span className="text-stone-500">Barge-in Ready</span>
                </div>
                <p className="line-clamp-4 leading-relaxed font-sans">{lastAssistantMsg.text}</p>
              </div>
            )}
          </div>
        )}

        {/* ================= MODE 2: PRO / INTERN MODE ================= */}
        {currentMode === 'pro_intern' && (
          <div className="flex-1 flex flex-col gap-2 text-left text-xs">
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 mb-1">
                <span className="font-bold">GEMINI 2.5 PRO BRAIN</span>
                <span className="bg-purple-900/50 px-1.5 py-0.5 rounded">Python + Search</span>
              </div>
              <p className="text-stone-300 leading-snug">
                Deep multi-step reasoning, mathematical execution sandbox, and live web grounding.
              </p>
            </div>

            {/* Latest Query & Thought Chain */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {messages.length === 0 ? (
                <div className="text-stone-500 text-center py-8 font-mono text-[11px]">
                  Hold PTT to prompt Gemini Pro with code or research queries.
                </div>
              ) : (
                messages.slice(-4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg text-xs ${
                      msg.role === 'user'
                        ? 'bg-stone-800 border border-stone-700 text-stone-200'
                        : 'bg-purple-950/40 border border-purple-500/30 text-purple-100'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-stone-400 mb-0.5 uppercase">
                      {msg.role === 'user' ? 'YOU' : 'GEMINI PRO REASONING'}
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                    {/* Sources Grounding */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-purple-500/20">
                        <div className="text-[9px] font-mono text-purple-300 flex items-center gap-1 mb-1">
                          <Globe className="w-2.5 h-2.5" /> SOURCES
                        </div>
                        {msg.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-[10px] text-cyan-400 truncate hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= MODE 3: VISION SCANNER / RABBIT EYE ================= */}
        {currentMode === 'vision_scanner' && (
          <div className="flex-1 flex flex-col gap-2">
            <CameraViewfinder
              angle={cameraAngle}
              onAngleChange={onCameraAngleChange}
              onCaptureFrame={onCameraCapture}
              isProcessing={isProcessing}
            />

            {/* Analysis Result */}
            {lastAssistantMsg && (
              <div className="bg-stone-900/90 border border-amber-500/30 rounded-xl p-2.5 text-left text-xs text-stone-200">
                <div className="text-[10px] font-mono text-amber-400 mb-1 font-bold">
                  OPTICAL ANALYSIS RESULT
                </div>
                <p className="line-clamp-4 leading-relaxed font-sans">{lastAssistantMsg.text}</p>
              </div>
            )}
          </div>
        )}

        {/* ================= MODE 4: SPARK MICRO-APPS HUB & RUNNER ================= */}
        {currentMode === 'spark_apps' && (
          <div className="flex-1 flex flex-col gap-1.5 h-full">
            {/* App Header & Switcher */}
            <div className="flex items-center justify-between bg-stone-950 p-1.5 rounded-lg border border-stone-800">
              <span className="font-bold text-xs text-emerald-400 font-mono truncate">
                ⚡ {activeSparkApp.name}
              </span>
              <div className="flex items-center gap-1">
                {BUNDLED_SPARK_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onSelectSparkApp(app)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
                      activeSparkApp.id === app.id
                        ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {app.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sandboxed Micro-App Viewport */}
            <div className="flex-1 rounded-xl overflow-hidden border border-emerald-500/30 bg-black relative shadow-inner">
              <iframe
                ref={iframeRef}
                title={activeSparkApp.name}
                srcDoc={activeSparkApp.html}
                sandbox="allow-scripts allow-same-origin allow-modals"
                className="w-full h-full border-none"
              />
            </div>

            {/* Prompt Custom Micro-App Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customPromptInput.trim()) {
                  onGenerateCustomApp(customPromptInput.trim());
                  setCustomPromptInput('');
                }
              }}
              className="flex gap-1 shrink-0"
            >
              <input
                type="text"
                value={customPromptInput}
                onChange={(e) => setCustomPromptInput(e.target.value)}
                placeholder="Ask Gemini to build any micro-app..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 font-sans"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded text-xs"
              >
                Build
              </button>
            </form>
          </div>
        )}

        {/* ================= MODE 5: LIVE DUAL INTERPRETER ================= */}
        {currentMode === 'interpreter' && (
          <div className="flex-1 flex flex-col gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 mb-1">
                <span>BIDIRECTIONAL INTERPRETER</span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-stone-900 border border-sky-500/40 rounded text-sky-300 text-[10px] px-1 py-0.5"
                >
                  <option value="Spanish">English ⇄ Spanish</option>
                  <option value="Japanese">English ⇄ Japanese</option>
                  <option value="French">English ⇄ French</option>
                  <option value="German">English ⇄ German</option>
                  <option value="Chinese">English ⇄ Chinese</option>
                </select>
              </div>
              <p className="text-xs text-stone-300 leading-snug">
                Auto-detecting dual-language speech translation with spoken readout.
              </p>
            </div>

            {/* Translation Display */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <div className="text-[10px] font-mono text-stone-400 mb-1">ENGLISH (ORIGINAL)</div>
                <div className="text-sm font-bold text-stone-100">
                  {lastUserMsg ? lastUserMsg.text : '“Where is the nearest subway station?”'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/50 border border-sky-500/40 shadow-md">
                <div className="text-[10px] font-mono text-sky-400 mb-1">{targetLang.toUpperCase()} (TRANSLATED)</div>
                <div className="text-base font-bold text-sky-200">
                  {lastAssistantMsg
                    ? lastAssistantMsg.text
                    : targetLang === 'Spanish'
                    ? '¿Dónde está la estación de metro más cercana?'
                    : targetLang === 'Japanese'
                    ? '一番近い地下鉄の駅はどこですか？'
                    : 'Où se trouve la station de métro la plus proche?'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 6: YT MUSIC & GENRE RADIO ================= */}
        {currentMode === 'yt_music' && (
          <div className="flex-1 flex flex-col justify-between text-left">
            {/* Station Selector Chips */}
            <div className="grid grid-cols-3 gap-1 mb-2">
              {RADIO_STATIONS.map((station) => (
                <button
                  key={station.id}
                  onClick={() => onSelectStation(station)}
                  className={`p-1.5 rounded-lg text-left border transition-all ${
                    activeStation.id === station.id
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="text-[10px] font-bold truncate">{station.genre}</div>
                  <div className="text-[8px] text-stone-500 truncate">{station.tracks.length} tracks</div>
                </button>
              ))}
            </div>

            {/* Now Playing Visualizer Card */}
            <div className="p-3 rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 border border-rose-500/30 flex flex-col items-center text-center shadow-lg my-auto">
              <div className="w-16 h-16 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-center justify-center mb-2 shadow">
                <Radio className={`w-8 h-8 text-rose-400 ${isPlayingMusic ? 'animate-pulse' : ''}`} />
              </div>

              <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wide">
                {activeStation.name}
              </div>
              <div className="text-sm font-bold text-stone-100 truncate w-full mt-0.5">
                {activeStation.tracks[currentTrackIndex]?.title || 'Radio Stream'}
              </div>
              <div className="text-xs text-stone-400">
                {activeStation.tracks[currentTrackIndex]?.artist || 'Unknown Artist'}
              </div>

              {/* Animated Equalizer Spectrum */}
              <div className="flex items-end justify-center gap-1 h-10 w-full mt-3 px-4">
                {Array.from({ length: 20 }).map((_, i) => {
                  const h = isPlayingMusic
                    ? Math.max(4, Math.sin((i + Date.now() / 150) * 0.9) * 32 + 8)
                    : 3;
                  return (
                    <div
                      key={i}
                      className="w-1 rounded-t transition-all duration-75"
                      style={{
                        height: `${h}px`,
                        backgroundColor: '#FF2A54',
                        boxShadow: isPlayingMusic ? '0 0 4px #FF2A54' : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={onTogglePlayMusic}
                  className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-400 text-black flex items-center justify-center font-bold active:scale-95 shadow"
                >
                  {isPlayingMusic ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={onNextTrack}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center"
                  title="Next Track (Double-click PTT)"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Scrubber */}
              <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>VOL {Math.round(musicVolume * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 7: VOICE MEMO & MEETING NOTES ================= */}
        {currentMode === 'voice_memo' && (
          <div className="flex-1 flex flex-col gap-2 text-left">
            <div className="p-2 rounded-xl bg-yellow-950/40 border border-yellow-500/30">
              <div className="text-[10px] font-mono text-yellow-400 font-bold mb-0.5">
                VOICE MEMOS & ACTION ITEMS
              </div>
              <p className="text-[11px] text-stone-300">
                Audio transcriptions automatically synthesized into actionable Markdown tasks.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {voiceMemos.map((memo) => (
                <div key={memo.id} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400 mb-1">
                    <span className="font-bold truncate">{memo.title}</span>
                    <span className="text-stone-500">{memo.timestamp}</span>
                  </div>
                  <p className="text-stone-300 mb-2 leading-relaxed">{memo.summary}</p>
                  <div className="space-y-1 pt-1.5 border-t border-stone-800">
                    {memo.actionItems.map((act, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-stone-200 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MODE 8: PERSISTENT MEMORY BANK ================= */}
        {currentMode === 'memory_bank' && (
          <div className="flex-1 flex flex-col gap-2 text-left text-xs">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 mb-1">
                <span className="font-bold">LONG-TERM MEMORY SYNTHESIS</span>
                <span className="bg-purple-900/60 px-1.5 py-0.5 rounded text-[9px]">BxMemoryManager</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-snug">
                Nightly WorkManager worker distills interactions into durable knowledge for future turns.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
              {persistentMemories.length === 0 ? (
                <div className="text-stone-500 text-center py-6 font-mono text-[11px]">
                  No compiled memories yet. Talk to Gemini Box to generate daily insights.
                </div>
              ) : (
                persistentMemories.map((mem, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-stone-900 border border-purple-500/20 text-stone-200 text-xs flex items-start gap-1.5"
                  >
                    <span className="text-purple-400 font-bold">•</span>
                    <span className="leading-relaxed">{mem}</span>
                  </div>
                ))
              )}
            </div>

            {/* Memory Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={onTriggerNightlySummary}
                className="py-1.5 px-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[10px] font-mono transition-all"
              >
                Synthesize Now
              </button>
              <button
                onClick={onClearMemories}
                className="py-1.5 px-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-200 rounded text-[10px] font-mono transition-all"
              >
                Clear Bank
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM NOW-PLAYING / PTT GLANCE STRIP */}
      <div className="p-2 bg-stone-950 border-t border-stone-800 text-[11px] flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isPttActive ? '#00E676' : isAiSpeaking ? '#00FFFF' : '#666',
            }}
          />
          <span className="text-stone-300 truncate">
            {isPttActive
              ? 'MIC ACTIVE (16kHz PCM)'
              : isAiSpeaking
              ? 'SPEECH OUT (24kHz)'
              : isPlayingMusic
              ? `🎵 ${activeStation.tracks[currentTrackIndex]?.title || 'Radio'}`
              : 'PTT READY'}
          </span>
        </div>
        <span className="text-[10px] text-stone-500 shrink-0">
          {currentModeInfo.triggerKey}
        </span>
      </div>
    </div>
  );
};
