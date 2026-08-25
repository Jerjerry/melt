import React, { useState, useEffect, useRef } from 'react';
import { RabbitR1Device } from './components/RabbitR1Device';
import { DeveloperStudio } from './components/DeveloperStudio';
import { DeviceMode, ChatMessage, RadioStation, SparkApp, VoiceMemo } from './types';
import { RADIO_STATIONS } from './data/radioStations';
import { BUNDLED_SPARK_APPS, CAMERA_TEST_CARDS } from './data/mockHardwareData';
import {
  speakText,
  stopSpeaking,
  startGenreRadioAudio,
  stopGenreRadioAudio,
  setGenreRadioVolume,
  playRotaryClickSound,
  playPttBeep,
} from './utils/audioSynthesizer';
import { OS_MODES } from './components/DeviceScreen';
import { Radio, Mic, Eye, Sparkles, Terminal, Volume2 } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<DeviceMode>('flash_live');
  const [isPttActive, setIsPttActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      role: 'assistant',
      text: 'Gemini Box (Project Bx) OS initialized on Rabbit R1 hardware. Hold the side PTT button to speak, or spin the rotary wheel to cycle operating modes.',
      timestamp: new Date().toLocaleTimeString(),
      mode: 'flash_live',
    },
  ]);
  const [cameraAngle, setCameraAngle] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Music & Radio State
  const [activeStation, setActiveStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.7);

  // Spark Micro-Apps
  const [activeSparkApp, setActiveSparkApp] = useState<SparkApp>(BUNDLED_SPARK_APPS[1]); // Pomodoro timer default
  const [allSparkApps, setAllSparkApps] = useState<SparkApp[]>(BUNDLED_SPARK_APPS);

  // Voice Memos
  const [voiceMemos, setVoiceMemos] = useState<VoiceMemo[]>([
    {
      id: 'vm_1',
      title: 'Rabbit R1 Hardware & Architecture Specs',
      timestamp: 'Today, 10:15 AM',
      duration: 48,
      transcript:
        'Debloating standard AOSP on MT6765. Mapped rotary encoder to app scrubbers and volume. Dual-mic hardware AEC verified.',
      summary:
        'Hardware verification confirmed 1,000 mAh battery standby run times of ~18 hours with schedutil CPU governor.',
      actionItems: [
        'Flash custom AOSP system partition with fastboot',
        'Verify ms35774 stepper motor sysfs degree writes',
        'Mount Spark micro-apps in single-page WebView container',
      ],
    },
  ]);

  // Persistent Memories Bank
  const [persistentMemories, setPersistentMemories] = useState<string[]>([
    'User prioritizes hardware battery efficiency and low-latency full-duplex voice streams.',
    'Prefers 90s Rock and Lo-Fi beats on headless YouTube Music radio.',
    'Frequently designs tactile circular micro-apps steered with the physical rotary wheel.',
  ]);

  const [customPersona, setCustomPersona] = useState<string>(
    'Ultra-concise, technical, and direct. Deliver instant answers formatted for a pocket 2.88" screen.'
  );

  const [lastRotaryDelta, setLastRotaryDelta] = useState<{ delta: 1 | -1; timestamp: number } | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(true);

  // Speech Recognition Reference for Real Mic PTT
  const speechRecognitionRef = useRef<any>(null);
  const speechTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              speechTranscriptRef.current += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (interim) {
            speechTranscriptRef.current = interim;
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e?.error);
        };

        speechRecognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }
  }, []);

  const startMicRecording = () => {
    speechTranscriptRef.current = '';
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
      } catch (e) {
        // Recognition might already be running
      }
    }
  };

  const stopMicRecordingAndDispatch = (fallbackPrompt: string) => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    const finalQuery = speechTranscriptRef.current.trim() || fallbackPrompt;
    dispatchVoiceTurn(finalQuery);
  };

  // Swarm Boost Handler
  const handleRunSwarmBoost = () => {
    const boostMsg: ChatMessage = {
      id: `sw_${Date.now()}`,
      role: 'system',
      text: '⚡ [30-AGENT SWARM ACCELERATION] All 30 background neural agents synchronized. Latency dropped to 8ms, throughput scaled to 4,800 ops/s across Voice DSP, Stepper Vision, Spark Sandbox, and MT6765 SoC.',
      timestamp: new Date().toLocaleTimeString(),
      mode: currentMode,
    };
    setMessages((prev) => [...prev, boostMsg]);
  };

  const handleTriggerSwarmAction = (agentId: number, taskName: string) => {
    const agentMsg: ChatMessage = {
      id: `sw_ag_${Date.now()}`,
      role: 'system',
      text: `[SWARM AGENT #${agentId}] Executed priority task: ${taskName}`,
      timestamp: new Date().toLocaleTimeString(),
      mode: currentMode,
    };
    setMessages((prev) => [...prev, agentMsg]);
  };

  // Check health on start
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiKeyAvailable(data.hasApiKey);
      })
      .catch(() => {});
  }, []);

  // Rotary Wheel Step Handler
  const handleRotaryRotate = (delta: 1 | -1) => {
    setLastRotaryDelta({ delta, timestamp: Date.now() });

    if (currentMode === 'yt_music') {
      // In music mode, wheel adjusts volume
      setMusicVolume((prev) => {
        const nextVol = Math.max(0.1, Math.min(1.0, prev + delta * 0.05));
        setGenreRadioVolume(nextVol);
        return nextVol;
      });
    } else if (currentMode === 'vision_scanner') {
      // In vision mode, wheel micro-steps the stepper motor
      setCameraAngle((prev) => (prev + delta * 15 + 360) % 360);
    } else if (currentMode === 'spark_apps') {
      // In spark apps mode, event is posted to iframe (handled in DeviceScreen)
    } else {
      // Idle on HUD: cycle 8 modes
      const currentIndex = OS_MODES.findIndex((m) => m.id === currentMode);
      const nextIndex = (currentIndex + delta + OS_MODES.length) % OS_MODES.length;
      setCurrentMode(OS_MODES[nextIndex].id);
    }
  };

  // PTT Voice Interaction Dispatch
  const dispatchVoiceTurn = async (queryText: string, imagePart?: string) => {
    // Native barge-in: cancel any previous speech and lower/pause music
    stopSpeaking();
    setIsAiSpeaking(false);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString(),
      mode: currentMode,
      imageUrl: imagePart,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          mode: currentMode === 'pro_intern' ? 'pro' : 'flash',
          systemInstruction: customPersona,
          memories: persistentMemories,
          history: messages.slice(-6),
          image: imagePart,
        }),
      });

      const data = await res.json();
      const replyText = data.text || 'Understood.';

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString(),
        mode: currentMode,
        sources: data.searchSources,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Check if user requested a music station
      if (
        queryText.toLowerCase().includes('play') ||
        queryText.toLowerCase().includes('radio') ||
        queryText.toLowerCase().includes('music') ||
        queryText.toLowerCase().includes('station')
      ) {
        const found = RADIO_STATIONS.find((st) =>
          queryText.toLowerCase().includes(st.genre.toLowerCase())
        );
        if (found) {
          setActiveStation(found);
          setCurrentTrackIndex(0);
          setIsPlayingMusic(true);
          startGenreRadioAudio(found.genre, musicVolume);
        }
      }

      // Check if user requested an app in Spark mode
      if (
        (currentMode === 'spark_apps' || queryText.toLowerCase().includes('create an app') || queryText.toLowerCase().includes('build a timer') || queryText.toLowerCase().includes('make a')) &&
        !imagePart
      ) {
        handleGenerateCustomApp(queryText);
      }

      // Read aloud via TTS
      speakText(
        replyText,
        () => setIsAiSpeaking(true),
        () => setIsAiSpeaking(false)
      );
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Spark Micro-App Builder
  const handleGenerateCustomApp = async (prompt: string, imagePart?: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/generate-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image: imagePart }),
      });
      const data = await res.json();
      if (data.html) {
        const newApp: SparkApp = {
          id: `app_${Date.now()}`,
          name: data.appName || 'Custom Spark App',
          description: prompt,
          icon: 'Sparkles',
          category: 'utility',
          author: 'Gemini Spark',
          html: data.html,
        };
        setAllSparkApps((prev) => [newApp, ...prev]);
        setActiveSparkApp(newApp);
        setCurrentMode('spark_apps');
      }
    } catch (e) {
      console.error('App gen failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Camera Frame Capture Handler
  const handleCameraCapture = (imageDataUrl: string, promptText?: string) => {
    const prompt = promptText || 'Analyze this camera view from the Rabbit R1.';
    if (prompt.toLowerCase().includes('sketch') || prompt.toLowerCase().includes('app')) {
      handleGenerateCustomApp(prompt, imageDataUrl);
    } else {
      dispatchVoiceTurn(prompt, imageDataUrl);
    }
  };

  // Music Player Controls
  const handleTogglePlayMusic = () => {
    if (isPlayingMusic) {
      stopGenreRadioAudio();
      setIsPlayingMusic(false);
    } else {
      startGenreRadioAudio(activeStation.genre, musicVolume);
      setIsPlayingMusic(true);
    }
  };

  const handleSelectStation = (station: RadioStation) => {
    setActiveStation(station);
    setCurrentTrackIndex(0);
    startGenreRadioAudio(station.genre, musicVolume);
    setIsPlayingMusic(true);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % activeStation.tracks.length;
    setCurrentTrackIndex(nextIdx);
    startGenreRadioAudio(activeStation.genre, musicVolume);
    setIsPlayingMusic(true);
  };

  // Nightly Memory Distillation Worker
  const handleTriggerNightlySummary = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/summarize-memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayChats: messages }),
      });
      const data = await res.json();
      if (data.memories && data.memories.length > 0) {
        setPersistentMemories((prev) => [...data.memories, ...prev].slice(0, 15));
      }
    } catch (e) {
      console.error('Summary failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPttActive) {
          playPttBeep('start');
          setIsPttActive(true);
          startMicRecording();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleRotaryRotate(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleRotaryRotate(1);
      } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (OS_MODES[idx]) {
          setCurrentMode(OS_MODES[idx].id);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPttActive) {
          playPttBeep('stop');
          setIsPttActive(false);
          stopMicRecordingAndDispatch('What is the latest system state on Rabbit R1?');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPttActive, currentMode, activeStation, musicVolume]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-[#FA4616] selection:text-white">
      {/* Top Universal App Header */}
      <header className="px-4 sm:px-6 py-3 border-b border-stone-800 bg-black/60 backdrop-blur-md flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-[#FA4616] flex items-center justify-center font-black text-white text-xs shadow-md">
            R1
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-stone-100 tracking-tight flex items-center gap-2">
              Rabbit R1 Gemini Box OS
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Project Bx Master
              </span>
            </h1>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Dedicated pocket AI hardware simulator & full-stack development workbench
            </p>
          </div>
        </div>

        {/* Global Controls & Mode Pills */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg">
            <span className="text-stone-500">SoC:</span>
            <span className="text-stone-300 font-bold">MT6765</span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-500">RAM:</span>
            <span className="text-emerald-400 font-bold">920 MB / 4.0 GB</span>
          </div>

          <div
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border"
            style={{
              borderColor: OS_MODES.find((m) => m.id === currentMode)?.accentColor,
              backgroundColor: `${OS_MODES.find((m) => m.id === currentMode)?.accentColor}15`,
              color: OS_MODES.find((m) => m.id === currentMode)?.accentColor,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: OS_MODES.find((m) => m.id === currentMode)?.accentColor }}
            />
            {OS_MODES.find((m) => m.id === currentMode)?.name.toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Split Layout: Rabbit R1 Device on Left, Developer Studio on Right */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Physical Hardware Device (480x640 AMOLED screen + Rotary Wheel + PTT + Stepper Motor) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center">
          <RabbitR1Device
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            isPttActive={isPttActive}
            onPttDown={() => {
              setIsPttActive(true);
              startMicRecording();
            }}
            onPttUp={() => {
              setIsPttActive(false);
              stopMicRecordingAndDispatch('Tell me about the Gemini Box capabilities.');
            }}
            onPttToggle={() => {
              if (isPttActive) {
                setIsPttActive(false);
                stopMicRecordingAndDispatch('Tell me about the Gemini Box capabilities.');
              } else {
                setIsPttActive(true);
                startMicRecording();
              }
            }}
            onPttDoubleClick={() => {
              // Double click PTT triggers vision snapshot
              if (currentMode === 'vision_scanner') {
                handleCameraCapture(CAMERA_TEST_CARDS[0].svgDataUrl, CAMERA_TEST_CARDS[0].prompt);
              } else if (currentMode === 'yt_music') {
                handleNextTrack();
              } else {
                setCurrentMode('vision_scanner');
              }
            }}
            isAiSpeaking={isAiSpeaking}
            messages={messages}
            cameraAngle={cameraAngle}
            onCameraAngleChange={setCameraAngle}
            onCameraCapture={handleCameraCapture}
            isProcessing={isProcessing}
            activeStation={activeStation}
            isPlayingMusic={isPlayingMusic}
            currentTrackIndex={currentTrackIndex}
            musicVolume={musicVolume}
            onTogglePlayMusic={handleTogglePlayMusic}
            onSelectStation={handleSelectStation}
            onNextTrack={handleNextTrack}
            activeSparkApp={activeSparkApp}
            onSelectSparkApp={setActiveSparkApp}
            onGenerateCustomApp={handleGenerateCustomApp}
            voiceMemos={voiceMemos}
            persistentMemories={persistentMemories}
            onTriggerNightlySummary={handleTriggerNightlySummary}
            onClearMemories={() => setPersistentMemories([])}
            onRotaryRotate={handleRotaryRotate}
            lastRotaryDelta={lastRotaryDelta}
          />
        </div>

        {/* RIGHT COLUMN: Full Developer Studio Workbench */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col w-full h-full min-h-[580px]">
          <DeveloperStudio
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            onSimulateVoicePrompt={(p) => dispatchVoiceTurn(p)}
            onSimulateCameraSnap={() => {
              setCurrentMode('vision_scanner');
              handleCameraCapture(CAMERA_TEST_CARDS[0].svgDataUrl, CAMERA_TEST_CARDS[0].prompt);
            }}
            onRotaryRotate={handleRotaryRotate}
            isProcessing={isProcessing}
            activeSparkApp={activeSparkApp}
            onSelectSparkApp={setActiveSparkApp}
            onGenerateCustomApp={handleGenerateCustomApp}
            persistentMemories={persistentMemories}
            onTriggerNightlySummary={handleTriggerNightlySummary}
            onClearMemories={() => setPersistentMemories([])}
            customPersona={customPersona}
            onUpdatePersona={setCustomPersona}
            apiKeyStatus={apiKeyAvailable}
            onTriggerSwarmAction={handleTriggerSwarmAction}
            onRunSwarmBoost={handleRunSwarmBoost}
          />
        </div>
      </main>
    </div>
  );
}
