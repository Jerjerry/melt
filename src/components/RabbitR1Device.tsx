import React from 'react';
import { RotaryWheelControl } from './RotaryWheelControl';
import { DeviceScreen, OS_MODES } from './DeviceScreen';
import { DeviceMode, RadioStation, SparkApp, ChatMessage, VoiceMemo } from '../types';
import { playPttBeep, playCameraMotorSound } from '../utils/audioSynthesizer';

interface RabbitR1DeviceProps {
  currentMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  isPttActive: boolean;
  onPttDown: () => void;
  onPttUp: () => void;
  onPttToggle: () => void;
  onPttDoubleClick: () => void;
  isAiSpeaking: boolean;
  messages: ChatMessage[];
  cameraAngle: number;
  onCameraAngleChange: (angle: number) => void;
  onCameraCapture: (dataUrl: string, promptText?: string) => void;
  isProcessing: boolean;
  // Music
  activeStation: RadioStation;
  isPlayingMusic: boolean;
  currentTrackIndex: number;
  musicVolume: number;
  onTogglePlayMusic: () => void;
  onSelectStation: (st: RadioStation) => void;
  onNextTrack: () => void;
  // Spark
  activeSparkApp: SparkApp;
  onSelectSparkApp: (app: SparkApp) => void;
  onGenerateCustomApp: (prompt: string) => void;
  // Memos & Memories
  voiceMemos: VoiceMemo[];
  persistentMemories: string[];
  onTriggerNightlySummary: () => void;
  onClearMemories: () => void;
  // Rotary Wheel
  onRotaryRotate: (delta: 1 | -1) => void;
  lastRotaryDelta: { delta: 1 | -1; timestamp: number } | null;
}

export const RabbitR1Device: React.FC<RabbitR1DeviceProps> = ({
  currentMode,
  onModeChange,
  isPttActive,
  onPttDown,
  onPttUp,
  onPttToggle,
  onPttDoubleClick,
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
  onRotaryRotate,
  lastRotaryDelta,
}) => {
  const currentModeInfo = OS_MODES.find((m) => m.id === currentMode) || OS_MODES[0];

  return (
    <div className="relative flex flex-col items-center justify-center p-3 sm:p-6 select-none">
      {/* Outer Glow according to active mode */}
      <div
        className="absolute w-[360px] h-[520px] rounded-[44px] blur-3xl opacity-30 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: currentModeInfo.accentColor }}
      />

      {/* Main Rabbit R1 Orange Body Enclosure */}
      <div
        id="rabbit_r1_chassis"
        className="relative w-[340px] sm:w-[380px] h-[560px] sm:h-[620px] rounded-[36px] bg-[#FA4616] p-4 sm:p-5 shadow-2xl flex flex-col justify-between border-t-2 border-l-2 border-[#ff6940] border-b-4 border-r-4 border-[#b82e07]"
        style={{
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.1), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Top Bar on Physical Device (Lanyard hole, Camera Barrel, Screws) */}
        <div className="flex items-center justify-between px-1">
          {/* Lanyard slot / microphone cutout */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-2 rounded-full bg-[#9e2706] shadow-inner" />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-900 border border-stone-800" title="Far-Field Mic 1" />
          </div>

          {/* Device Branding */}
          <div className="font-mono font-bold tracking-widest text-[10px] text-white/70 uppercase">
            R1 • GEMINI BOX
          </div>

          {/* 360° Rotating Motorized Camera Module ("Rabbit Eye") */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-900 border border-stone-800" title="Far-Field Mic 2" />
            <div
              id="rabbit_camera_module"
              onClick={() => {
                const nextAngle = (cameraAngle + 90) % 360;
                playCameraMotorSound();
                onCameraAngleChange(nextAngle);
              }}
              title="360° Rotating Stepper Camera (Click to rotate motor)"
              className="relative w-12 h-12 rounded-full bg-stone-900 border-2 border-stone-700 shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              {/* Stepper Barrel Outer Ring */}
              <div
                className="w-9 h-9 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center transition-transform duration-500 ease-out"
                style={{
                  transform: `rotate(${cameraAngle}deg)`,
                }}
              >
                {/* Optical Glass Lens */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-950 via-stone-900 to-amber-950 border border-cyan-500/40 relative flex items-center justify-center shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-cyan-400/80 blur-[0.5px]" />
                  {/* Lens glare reflection */}
                  <div className="absolute top-1 left-1 w-1.5 h-1 rounded-full bg-white/60 -rotate-45" />
                </div>
              </div>

              {/* Angle Tick Badge */}
              <div className="absolute -bottom-1 bg-stone-950 px-1 rounded text-[8px] font-mono text-amber-400 border border-stone-800">
                {cameraAngle}°
              </div>
            </div>
          </div>
        </div>

        {/* Center Screen Display & Right Edge Controls */}
        <div className="relative flex-1 my-2 flex items-center justify-between gap-3">
          {/* The 2.88" AMOLED Screen Housing */}
          <div
            id="rabbit_screen_bezel"
            className="flex-1 h-full rounded-[22px] bg-black p-2 border-2 border-stone-900 shadow-2xl overflow-hidden flex flex-col"
            style={{
              boxShadow: `inset 0 0 15px rgba(0,0,0,1), 0 4px 6px rgba(0,0,0,0.5)`,
            }}
          >
            <DeviceScreen
              currentMode={currentMode}
              onModeChange={onModeChange}
              isPttActive={isPttActive}
              isAiSpeaking={isAiSpeaking}
              messages={messages}
              cameraAngle={cameraAngle}
              onCameraAngleChange={onCameraAngleChange}
              onCameraCapture={onCameraCapture}
              isProcessing={isProcessing}
              activeStation={activeStation}
              isPlayingMusic={isPlayingMusic}
              currentTrackIndex={currentTrackIndex}
              musicVolume={musicVolume}
              onTogglePlayMusic={onTogglePlayMusic}
              onSelectStation={onSelectStation}
              onNextTrack={onNextTrack}
              activeSparkApp={activeSparkApp}
              onSelectSparkApp={onSelectSparkApp}
              onGenerateCustomApp={onGenerateCustomApp}
              voiceMemos={voiceMemos}
              persistentMemories={persistentMemories}
              onTriggerNightlySummary={onTriggerNightlySummary}
              onClearMemories={onClearMemories}
              lastRotaryDelta={lastRotaryDelta}
            />
          </div>

          {/* Right Hardware Sidebar: Physical Rotary Wheel & Side PTT Button */}
          <div className="flex flex-col items-center justify-between h-full py-4 gap-3">
            {/* 1. Mechanical Rotary Wheel */}
            <RotaryWheelControl
              onRotate={onRotaryRotate}
              accentColor={currentModeInfo.accentColor}
            />

            {/* 2. Physical Side Push-To-Talk (PTT) Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                id="rabbit_ptt_button"
                onMouseDown={() => {
                  playPttBeep('start');
                  onPttDown();
                }}
                onMouseUp={() => {
                  playPttBeep('stop');
                  onPttUp();
                }}
                onTouchStart={() => {
                  playPttBeep('start');
                  onPttDown();
                }}
                onTouchEnd={() => {
                  playPttBeep('stop');
                  onPttUp();
                }}
                onDoubleClick={() => {
                  onPttDoubleClick();
                }}
                title="Physical Side PTT Button (Hold to Talk, Click to Toggle, Double-Click for Camera Snap)"
                className={`w-7 sm:w-8 h-20 sm:h-24 rounded-l-md border-y-2 border-l-2 border-stone-800 transition-all flex flex-col items-center justify-center text-[10px] font-mono font-bold tracking-tighter ${
                  isPttActive
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_#00E676] scale-95 translate-x-0.5'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 shadow-md active:scale-95'
                }`}
                style={{
                  boxShadow: isPttActive
                    ? 'inset 0 0 10px rgba(0,0,0,0.5), 0 0 15px #00E676'
                    : 'inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.5)',
                }}
              >
                <span className="rotate-90 whitespace-nowrap">PTT</span>
              </button>
              <span className="text-[8px] font-mono text-white/80 font-bold">HOLD</span>
            </div>
          </div>
        </div>

        {/* Bottom Hardware Section: Speaker Grill & Physical Screw Accents */}
        <div className="flex items-center justify-between px-2 pt-1">
          {/* Speaker grill perforations (12 micro-holes) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#9e2706] rounded-md shadow-inner">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-950 shadow-inner" />
            ))}
          </div>

          {/* Keyboard Quick Guide Hint */}
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/70">
            <span className="bg-black/30 px-1.5 py-0.5 rounded border border-white/20">Space = PTT</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded border border-white/20">↑/↓ = Wheel</span>
          </div>

          {/* Torx screw accent */}
          <div className="w-3 h-3 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-0.5 bg-stone-500 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
};
