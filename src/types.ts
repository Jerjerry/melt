export type DeviceMode = 
  | 'flash_live'     // Mode 1: Neon Cyan (#00FFFF)
  | 'pro_intern'     // Mode 2: Deep Purple (#BB86FC)
  | 'vision_scanner' // Mode 3: Amber Orange (#FFA500)
  | 'spark_apps'     // Mode 4: Emerald Green (#00E676)
  | 'interpreter'    // Mode 5: Electric Blue (#00B0FF)
  | 'yt_music'       // Mode 6: Crimson Pink (#FF2A54)
  | 'voice_memo'     // Sun Gold (#FFD600)
  | 'memory_bank';   // Slate Purple (#9C27B0)

export interface ModeInfo {
  id: DeviceMode;
  name: string;
  shortName: string;
  accentColor: string;
  bgGlow: string;
  iconName: string;
  description: string;
  triggerKey: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  mode?: DeviceMode;
  sources?: Array<{ title: string; url: string }>;
  codeOutput?: string;
  imageUrl?: string;
}

export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number; // in seconds
  albumArt?: string;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  description: string;
  tracks: RadioTrack[];
}

export interface VoiceMemo {
  id: string;
  title: string;
  timestamp: string;
  duration: number;
  transcript: string;
  summary: string;
  actionItems: string[];
}

export interface DeviceTelemetry {
  cpuTempC: number;
  ramUsageMb: number;
  ramTotalMb: number;
  batteryPct: number;
  batteryState: 'discharging' | 'charging' | 'full';
  networkType: 'WiFi 5GHz' | 'LTE Cat-7' | 'Offline';
  cameraAngleDeg: number;
  audioSampleRateIn: number;
  audioSampleRateOut: number;
  isKioskLocked: boolean;
  aecActive: boolean;
  thermalGovernor: 'schedutil' | 'powersave' | 'performance';
}

export interface SparkApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  html: string;
  category: 'utility' | 'productivity' | 'game' | 'hardware';
  author: 'Built-in' | 'Gemini Spark';
}

export type SwarmClusterId = 
  | 'voice_dsp'
  | 'vision_motor'
  | 'spark_engine'
  | 'music_radio'
  | 'memory_persona'
  | 'kernel_soc';

export interface SwarmAgent {
  id: number;
  name: string;
  code: string;
  cluster: SwarmClusterId;
  clusterName: string;
  role: string;
  status: 'idle' | 'active' | 'optimizing' | 'completed';
  progress: number;
  latencyMs: number;
  tasksCompleted: number;
  currentTask: string;
  lastLog: string;
  metrics: {
    tps: number;
    memoryMb: number;
    efficiency: number;
  };
}
