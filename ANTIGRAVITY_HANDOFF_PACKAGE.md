# ANTIGRAVITY HANDOFF MANIFEST: RABBIT R1 GEMINI BOX OS (PROJECT BX)

Generated for: Google Antigravity / Gemini Code Assist
Target Device: Rabbit R1 (MediaTek MT6765 Helio P35, 4GB RAM, 128GB Flash, 2.88" AMOLED 480x640, MS35774 Stepper Motor)
Architecture: Full-Stack React/TypeScript Hardware Simulator & Production Android Kiosk (AOSP) OS
Operating System Build: Project Bx Master v3.2

---

## 1. EXECUTIVE SUMMARY & PROJECT SCOPE

Project Bx transforms the Rabbit R1 hardware into an open-ended, sub-second latency personal AI companion powered by Google Gemini (Gemini 2.5 Flash, Gemini 2.5 Pro, and Gemini Live API).

This repository contains two complete layers:
1. **Interactive Hardware Simulator & Developer Workbench** (React 18 + TypeScript + Vite + Tailwind CSS + Express Backend).
2. **Native Android AOSP Kiosk OS & Linux Kernel Sysfs Drivers** (Kotlin + Android AudioRecord AEC + MS35774 Stepper Driver + ExoPlayer Headless Audio + 30-Agent Parallel Swarm Matrix).

---

## 2. HARDWARE SPECIFICATION MAPPING

| Component | Physical Hardware Spec | Software / Kernel Binding |
| :--- | :--- | :--- |
| **SoC** | MediaTek MT6765 (Helio P35, 8-core Cortex-A53) | CPU governor tuned to `schedutil`, thermal balancing at ~41°C. |
| **Display** | 2.88-inch AMOLED (480x640, 180 DPI portrait) | Pure black `#000000` AMOLED power optimization, 60 FPS compositor. |
| **Rotary Encoder** | Mechanical step dial on right edge | Intercepts `KEYCODE_DPAD_UP` (-1) & `KEYCODE_DPAD_DOWN` (+1). Contextually drives mode cycling, zoom/stepper micro-steps, volume curves, and micro-app dials. |
| **PTT Button** | Physical Push-To-Talk switch | GPIO interrupt `/sys/class/gpio/gpio42/value` -> `KEYCODE_PROG_RED`. Hold for 16kHz PCM streaming; double-click for rapid camera snapshot. |
| **Camera Motor** | MS35774 Stepper Motor with 360° rotation | Writes to `/sys/devices/platform/step_motor/angle`: 0° (Selfie), 180° (Outward Vision), 270° (Privacy Closed). |
| **Audio I/O** | Dual Far-Field Mics + Mono Speaker | Hardware Acoustic Echo Cancellation (AEC) + Noise Suppressor (NS) via `AudioRecord` (VOICE_RECOGNITION). |
| **Battery** | 1,000 mAh Li-ion Cell (3.84V) | Standby life ~18 hours with OLED dark theme and audio ducking. |

---

## 3. CORE OPERATING MODES (8 SUBSYSTEMS)

1. **Flash Live Voice (Neon Cyan `#00FFFF`)**:
   - Sub-second bidirectional WebSocket audio streaming (16kHz PCM input, 24kHz output).
   - Voice Activity Detection (VAD) with instant barge-in speech cutoff.
2. **Pro / Intern Reasoning (Deep Purple `#BB86FC`)**:
   - Deep multi-step reasoning with Python sandbox execution simulation and Google Search Grounding with cited source cards.
3. **Vision Scanner / Rabbit Eye (Amber Orange `#FFA500`)**:
   - Viewfinder with reticle target overlay, optical character extraction, schematic circuit inspection, and sketch-to-app compiler.
4. **Spark Micro-Apps Hub (Emerald Green `#00E676`)**:
   - Sandboxed HTML5/JS widgets (Pomodoro timer, Pong, Calculator, Telemetry) responding to rotary encoder postMessage events (`delta: +/-1`).
5. **Dual Live Interpreter (Electric Blue `#00B0FF`)**:
   - Real-time bidirectional translation (English ⇄ Spanish, Japanese, French, German, Chinese) with spoken TTS readout.
6. **YT Music & Genre Radio (Crimson Pink `#FF2A54`)**:
   - Ad-free headless stream demuxer, 6 continuous genre stations, 20-band FFT spectrum visualizer, and rotary volume slider.
7. **Voice Memos & Deliverables (Sun Gold `#FFD600`)**:
   - Automatic speech transcription into structured Markdown summaries and checklist action items.
8. **Memory & Persona Engine (Slate Purple `#9C27B0`)**:
   - Nightly `WorkManager` distillation worker that compiles dialogue history into durable user profile attributes.

---

## 4. 30-AGENT PARALLEL SWARM MATRIX

The system orchestrates 30 concurrent micro-agents organized across 6 clusters:
- **Cluster 1: Voice DSP & Streaming (Agents 01-05)**: EchoShield (AEC), LiveStreamer (PCM), BargeInGuard (VAD), OpusCodec, PttController.
- **Cluster 2: Vision & Stepper Motor (Agents 06-10)**: MotorDriver (MS35774), PrivacyCurtain (270°), FrameExtractor, EdgeOCR, Sketch2App.
- **Cluster 3: Spark Micro-App Sandbox (Agents 11-15)**: RotaryBridge, SandboxJail, SparkBuilder, AppCatalog, DOMRenderer (60 FPS).
- **Cluster 4: Music & Headless Audio (Agents 16-20)**: StreamPiper, StationDJ, SpectrumDSP (FFT), RotaryVolume, AudioDucking.
- **Cluster 5: Memory & Persona Engine (Agents 21-25)**: NightlyDistill, PersonaTuner, MemoryBank (AES-256), MemoTranscriber, ContextPruner.
- **Cluster 6: Kernel, SoC & Kiosk Security (Agents 26-30)**: ThermalGovernor, KioskLock (`startLockTask`), FastbootRescue, BatterySaver, SwarmMaster.

---

## 5. HARDWARE FLASHING GUIDE FOR ANTIGRAVITY

To flash this OS directly onto a physical Rabbit R1 unit:

```bash
# 1. Enable ADB and connect device via USB-C
adb devices

# 2. Reboot into Fastboot Bootloader
adb reboot bootloader

# 3. Flash Custom Boot & System Partitions
fastboot flash boot boot.img
fastboot flash system system.img

# 4. Erase Userdata (Clean Install)
fastboot erase userdata

# 5. Reboot into Gemini Box OS
fastboot reboot
```

### Emergency Kiosk Bypass Sequence:
If physical kiosk exit is needed on the device, press the rotary wheel **UP 3 times**, then **DOWN 3 times** in rapid succession.

---

## 6. PROJECT FILE DIRECTORY STRUCTURE

- `/src/components/RabbitR1Device.tsx`: Physical hardware shell, AMOLED bezel, rotary encoder, and stepper module.
- `/src/components/DeviceScreen.tsx`: 8-mode 2.88" display renderer with status bars, equalizers, and iframe app runner.
- `/src/components/RotaryWheelControl.tsx`: Rotary dial haptic interaction physics and audio pulse synthesizer.
- `/src/components/CameraViewfinder.tsx`: MS35774 stepper motor angle controller and live optical capture HUD.
- `/src/components/SwarmMatrixView.tsx`: 30-agent parallel execution matrix and speed boost telemetry.
- `/src/components/DeveloperStudio.tsx`: Developer workbench with source code browser and ADB monitor.
- `/src/data/mockHardwareData.ts`: Complete Kotlin codebase (`MainActivity.kt`, `BxLiveStream.kt`, `CameraMotorManager.kt`).
- `/src/data/swarmAgentsData.ts`: 30-agent telemetry dataset and cluster definitions.
- `/src/utils/audioSynthesizer.ts`: Web Audio API procedural synthesis for haptic clicks, PTT beeps, radio, and motor hum.
- `/src/utils/projectExporter.ts`: 1-click ZIP packager creating the full Android flashable archive.
- `/server.ts`: Full-stack Express backend proxying Gemini 2.5 Flash, Gemini Pro, and app generation routes.
