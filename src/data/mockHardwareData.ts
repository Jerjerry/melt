import { SparkApp } from '../types';

export interface CameraCard {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  svgDataUrl: string;
}

// 1. Interactive Camera Test Cards
export const CAMERA_TEST_CARDS: CameraCard[] = [
  {
    id: 'circuit_555',
    name: 'NE555 Timer Circuit',
    category: 'Hardware & Electronics',
    description: 'Breadboard schematic with NE555 IC, capacitors, and resistors in astable mode.',
    prompt: 'Identify the IC in this schematic, calculate its output frequency, and explain pinouts.',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="%23111"><rect width="480" height="360" fill="%230d1117"/><path d="M40 40h400v280H40z" fill="%23161b22" stroke="%2330363d"/><rect x="180" y="110" width="120" height="140" rx="8" fill="%2321262d" stroke="%2300FFFF" stroke-width="2"/><text x="240" y="185" fill="%2300FFFF" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">NE555P</text><text x="240" y="205" fill="%238b949e" font-family="monospace" font-size="11" text-anchor="middle">PRECISION TIMER</text><path d="M120 130h60M120 160h60M120 190h60M120 220h60M300 130h60M300 160h60M300 190h60M300 220h60" stroke="%23FFA500" stroke-width="3"/><circle cx="120" cy="130" r="4" fill="%2300E676"/><circle cx="360" cy="130" r="4" fill="%23FF2A54"/><text x="110" y="134" fill="%238b949e" font-size="12" font-family="monospace" text-anchor="end">GND (1)</text><text x="370" y="134" fill="%238b949e" font-size="12" font-family="monospace">VCC (8)</text><text x="110" y="164" fill="%238b949e" font-size="12" font-family="monospace" text-anchor="end">TRIG (2)</text><text x="370" y="164" fill="%238b949e" font-size="12" font-family="monospace">DISCH (7)</text><text x="110" y="194" fill="%238b949e" font-size="12" font-family="monospace" text-anchor="end">OUT (3)</text><text x="370" y="194" fill="%238b949e" font-size="12" font-family="monospace">THRESH (6)</text><text x="110" y="224" fill="%238b949e" font-size="12" font-family="monospace" text-anchor="end">RESET (4)</text><text x="370" y="224" fill="%238b949e" font-size="12" font-family="monospace">CTRL (5)</text><text x="240" y="75" fill="%23f0f6fc" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">ASTABLE MULTIVIBRATOR TEST CARD</text></svg>`,
  },
  {
    id: 'sketch_wireframe',
    name: 'Handmade UI Wireframe',
    category: 'Sketch-to-App Generator',
    description: 'A hand-drawn pen sketch of a Pomodoro dial and start/pause trigger buttons.',
    prompt: 'Turn this hand-drawn sketch directly into an interactive HTML5 Spark micro-app.',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="%23fff"><rect width="480" height="360" fill="%23fdfbf7"/><path d="M30 30h420v300H30z" fill="%23fff" stroke="%23d0c9b8" stroke-dasharray="6,6"/><circle cx="240" cy="160" r="70" fill="none" stroke="%232c3e50" stroke-width="4" stroke-linecap="round"/><text x="240" y="170" fill="%232c3e50" font-family="cursive, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">25:00</text><rect x="130" y="260" width="100" height="42" rx="8" fill="none" stroke="%2327ae60" stroke-width="3"/><text x="180" y="286" fill="%2327ae60" font-family="cursive, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">START</text><rect x="250" y="260" width="100" height="42" rx="8" fill="none" stroke="%23e74c3c" stroke-width="3"/><text x="300" y="286" fill="%23e74c3c" font-family="cursive, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">RESET</text><text x="240" y="70" fill="%2334495e" font-family="cursive, sans-serif" font-size="20" text-anchor="middle">App Sketch: Focus Timer with Wheel Dial</text></svg>`,
  },
  {
    id: 'math_notes',
    name: 'Physics Equation Notes',
    category: 'STEM & Reasoning',
    description: 'Handwritten Maxwell equations and kinetic energy calculation.',
    prompt: 'Solve the energy equation and explain step by step.',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="%23111"><rect width="480" height="360" fill="%230f172a"/><text x="40" y="60" fill="%2338bdf8" font-family="monospace" font-size="18" font-weight="bold">RELATIVISTIC KINETIC ENERGY</text><text x="40" y="120" fill="%23f8fafc" font-family="monospace" font-size="24">E_k = (gamma - 1) * m * c^2</text><text x="40" y="170" fill="%2394a3b8" font-family="monospace" font-size="18">where gamma = 1 / sqrt(1 - v^2/c^2)</text><text x="40" y="220" fill="%2334d399" font-family="monospace" font-size="18">Let v = 0.85c,  m = 1.67e-27 kg</text><text x="40" y="270" fill="%23fbbf24" font-family="monospace" font-size="18">Calculate E_k in MeV</text><rect x="30" y="295" width="420" height="40" rx="6" fill="%231e293b"/><text x="40" y="320" fill="%23a7f3d0" font-family="monospace" font-size="14">Target: Compute relativistic factor and total energy</text></svg>`,
  },
  {
    id: 'foreign_sign',
    name: 'Tokyo Metro Sign',
    category: 'Vision Translation',
    description: 'Japanese railway station directional signboard.',
    prompt: 'Translate all Japanese text on this station sign and tell me which exit leads to Shibuya.',
    svgDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="%23111"><rect width="480" height="360" fill="%231e293b"/><rect x="30" y="40" width="420" height="280" rx="12" fill="%23000" stroke="%23475569" stroke-width="4"/><rect x="40" y="50" width="400" height="50" fill="%2300b0ff"/><text x="60" y="82" fill="%23fff" font-family="sans-serif" font-size="22" font-weight="bold">東口・渋谷方面 (East Exit / Shibuya)</text><text x="60" y="150" fill="%23fff" font-family="sans-serif" font-size="28" font-weight="bold">出口 3 番線</text><text x="60" y="185" fill="%2394a3b8" font-family="sans-serif" font-size="16">Platform 3 • Yamanote Line</text><text x="60" y="240" fill="%23facc15" font-family="sans-serif" font-size="20">エレベーター利用可 (Elevator Available)</text><path d="M380 150l30 30-30 30v-20h-40v-20h40z" fill="%2300E676"/></svg>`,
  },
];

// 2. Bundled Pre-installed Spark Micro-Apps
export const BUNDLED_SPARK_APPS: SparkApp[] = [
  {
    id: 'calc_unit',
    name: 'Scientific & Unit Calc',
    description: 'Touch calculator with rotary wheel arithmetic dial and converter.',
    icon: 'Calculator',
    category: 'utility',
    author: 'Built-in',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: -apple-system, sans-serif; }
  body { background: #000; color: #fff; height: 100vh; display: flex; flex-direction: column; padding: 12px; }
  .screen { background: #111; border-radius: 12px; padding: 14px; text-align: right; margin-bottom: 12px; border: 1px solid #333; }
  .expr { font-size: 13px; color: #888; min-height: 18px; }
  .val { font-size: 34px; font-weight: 800; color: #00FFFF; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex: 1; }
  button { background: #1a1a1a; color: #fff; border: none; border-radius: 10px; font-size: 20px; font-weight: 600; cursor: pointer; }
  button:active { background: #333; }
  .op { background: #262626; color: #00FFFF; }
  .eq { background: #00FFFF; color: #000; font-weight: 800; grid-column: span 2; }
  .clear { background: #FF2A54; color: #fff; }
</style>
</head>
<body>
  <div class="screen"><div id="expr" class="expr"></div><div id="val" class="val">0</div></div>
  <div class="grid">
    <button class="clear" onclick="clr()">C</button><button class="op" onclick="op('(')">(</button><button class="op" onclick="op(')')">)</button><button class="op" onclick="op('/')">÷</button>
    <button onclick="num('7')">7</button><button onclick="num('8')">8</button><button onclick="num('9')">9</button><button class="op" onclick="op('*')">×</button>
    <button onclick="num('4')">4</button><button onclick="num('5')">5</button><button onclick="num('6')">6</button><button class="op" onclick="op('-')">-</button>
    <button onclick="num('1')">1</button><button onclick="num('2')">2</button><button onclick="num('3')">3</button><button class="op" onclick="op('+')">+</button>
    <button onclick="num('0')">0</button><button onclick="num('.')">.</button><button class="eq" onclick="calc()">=</button>
  </div>
<script>
  let cur = '0', exp = '';
  function num(n) { cur = (cur==='0'&&n!=='.')?n:cur+n; document.getElementById('val').innerText=cur; }
  function op(o) { exp += cur+' '+o+' '; cur='0'; document.getElementById('expr').innerText=exp; document.getElementById('val').innerText='0'; }
  function clr() { cur='0'; exp=''; document.getElementById('expr').innerText=''; document.getElementById('val').innerText='0'; }
  function calc() { try { exp+=cur; let r=eval(exp.replace(/×/g,'*').replace(/÷/g,'/')); document.getElementById('expr').innerText=exp+' ='; document.getElementById('val').innerText=r; cur=String(r); exp=''; }catch(e){ document.getElementById('val').innerText='Error'; cur='0'; exp=''; } }
  window.onRotaryWheel = function(delta) { let n = parseFloat(cur)||0; cur=String(n+delta); document.getElementById('val').innerText=cur; };
</script>
</body>
</html>`,
  },
  {
    id: 'pomodoro_dial',
    name: 'Pomodoro Focus Dial',
    description: 'Circular countdown timer with rotary wheel dial and haptics.',
    icon: 'Timer',
    category: 'productivity',
    author: 'Built-in',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: -apple-system, sans-serif; }
  body { background: #000; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 16px; text-align: center; }
  .dial-box { position: relative; width: 220px; height: 220px; margin-bottom: 24px; }
  svg { transform: rotate(-90deg); width: 100%; height: 100%; }
  circle { fill: none; stroke-width: 10; }
  .bg-circle { stroke: #222; }
  .fg-circle { stroke: #00E676; stroke-dasharray: 628; stroke-dashoffset: 0; transition: stroke-dashoffset 0.3s linear; }
  .time-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 42px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .label { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .btns { display: flex; gap: 12px; width: 100%; max-width: 260px; }
  button { flex: 1; height: 52px; border-radius: 12px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; }
  .btn-start { background: #00E676; color: #000; }
  .btn-reset { background: #222; color: #fff; }
  .hint { font-size: 11px; color: #666; margin-top: 14px; }
</style>
</head>
<body>
  <div class="label">POMODORO FOCUS</div>
  <div class="dial-box">
    <svg viewBox="0 0 220 220"><circle class="bg-circle" cx="110" cy="110" r="95"></circle><circle id="progress" class="fg-circle" cx="110" cy="110" r="95"></circle></svg>
    <div id="display" class="time-text">25:00</div>
  </div>
  <div class="btns">
    <button id="toggleBtn" class="btn-start" onclick="toggleTimer()">START</button>
    <button class="btn-reset" onclick="resetTimer()">RESET</button>
  </div>
  <div class="hint">Spin hardware wheel to dial minutes</div>
<script>
  let totalSec = 25 * 60, remaining = totalSec, running = false, interval = null;
  const circumference = 2 * Math.PI * 95;
  function updateDisplay() {
    const m = Math.floor(remaining/60).toString().padStart(2,'0');
    const s = (remaining%60).toString().padStart(2,'0');
    document.getElementById('display').innerText = m+':'+s;
    document.getElementById('progress').style.strokeDashoffset = circumference - (remaining/totalSec)*circumference;
  }
  function toggleTimer() {
    running = !running;
    const btn = document.getElementById('toggleBtn');
    if (running) {
      btn.innerText = 'PAUSE'; btn.style.background = '#FFA500';
      interval = setInterval(() => {
        if (remaining > 0) { remaining--; updateDisplay(); }
        else { clearInterval(interval); running = false; btn.innerText = 'START'; btn.style.background = '#00E676'; if(window.AndroidBridge) window.AndroidBridge.vibrate(); }
      }, 1000);
    } else { clearInterval(interval); btn.innerText = 'RESUME'; btn.style.background = '#00E676'; }
  }
  function resetTimer() { clearInterval(interval); running = false; remaining = totalSec; const btn = document.getElementById('toggleBtn'); btn.innerText = 'START'; btn.style.background = '#00E676'; updateDisplay(); }
  window.onRotaryWheel = function(delta) { if (!running) { let mins = Math.max(1, Math.min(60, Math.floor(totalSec/60) + delta)); totalSec = mins * 60; remaining = totalSec; updateDisplay(); } };
  window.addEventListener('wheel', (e) => window.onRotaryWheel(e.deltaY > 0 ? -1 : 1));
  updateDisplay();
</script>
</body>
</html>`,
  },
  {
    id: 'rotary_pong',
    name: 'Rotary Pong Arcade',
    description: 'Classic arcade paddle game steered with the physical rotary wheel.',
    icon: 'Gamepad2',
    category: 'game',
    author: 'Built-in',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #000; color: #fff; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; overflow: hidden; }
  canvas { background: #111; border: 2px solid #00FFFF; border-radius: 12px; }
  .hud { width: 300px; display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 800; font-size: 18px; color: #00FFFF; }
  .info { font-size: 11px; color: #888; margin-top: 8px; }
</style>
</head>
<body>
  <div class="hud"><span>ROTARY PONG</span><span id="score">0</span></div>
  <canvas id="game" width="300" height="380"></canvas>
  <div class="info">Spin Rotary Wheel to steer paddle</div>
<script>
  const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
  let paddleX = 110, paddleWidth = 80, paddleHeight = 12, ballX = 150, ballY = 50, ballDX = 3, ballDY = 4, score = 0;
  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00FFFF'; ctx.shadowBlur = 10; ctx.shadowColor = '#00FFFF';
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.beginPath(); ctx.arc(ballX, ballY, 8, 0, Math.PI * 2); ctx.fillStyle = '#FF2A54'; ctx.shadowColor = '#FF2A54'; ctx.fill(); ctx.closePath();
    ballX += ballDX; ballY += ballDY;
    if (ballX + 8 > canvas.width || ballX - 8 < 0) ballDX = -ballDX;
    if (ballY - 8 < 0) ballDY = -ballDY;
    if (ballY + 8 >= canvas.height - paddleHeight - 10 && ballX >= paddleX && ballX <= paddleX + paddleWidth) {
      ballDY = -Math.abs(ballDY); ballDX = (ballX - (paddleX + paddleWidth / 2)) * 0.15; score += 10; document.getElementById('score').innerText = score;
    } else if (ballY > canvas.height) { ballX = 150; ballY = 50; ballDY = 4; score = 0; document.getElementById('score').innerText = score; }
    requestAnimationFrame(draw);
  }
  window.onRotaryWheel = function(delta) { paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX + delta * 15)); };
  window.addEventListener('wheel', (e) => window.onRotaryWheel(e.deltaY > 0 ? 1 : -1));
  draw();
</script>
</body>
</html>`,
  },
  {
    id: 'hw_diag',
    name: 'Hardware Diagnostics HUD',
    description: 'Live sensor telemetry, MT6765 SoC thermals, and motor step test.',
    icon: 'Activity',
    category: 'hardware',
    author: 'Built-in',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: monospace; }
  body { background: #000; color: #00FFFF; padding: 14px; font-size: 12px; height: 100vh; display: flex; flex-direction: column; gap: 10px; }
  .card { background: #111; border: 1px solid #00FFFF; border-radius: 8px; padding: 10px; }
  .title { font-weight: bold; color: #fff; margin-bottom: 6px; font-size: 13px; }
  .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .val { color: #00E676; }
  button { background: #222; border: 1px solid #00FFFF; color: #fff; padding: 8px; border-radius: 6px; margin-top: 6px; width: 100%; cursor: pointer; font-weight: bold; }
</style>
</head>
<body>
  <div class="card">
    <div class="title">⚡ MT6765 HELIO P35 TELEMETRY</div>
    <div class="row"><span>CPU Policy:</span><span class="val">schedutil</span></div>
    <div class="row"><span>Core Temp:</span><span class="val" id="temp">41.2°C</span></div>
    <div class="row"><span>RAM Used:</span><span class="val">920 MB / 4.0 GB</span></div>
  </div>
  <div class="card">
    <div class="title">📷 MS35774 STEPPER MOTOR</div>
    <div class="row"><span>Sysfs Node:</span><span class="val">/sys/platform/step_motor</span></div>
    <div class="row"><span>Angle:</span><span class="val" id="angle">180° (Outward)</span></div>
    <button onclick="testMotor()">STEP MOTOR +45°</button>
  </div>
  <div class="card">
    <div class="title">🎙️ DSP DUAL-MIC BEAMFORMING</div>
    <div class="row"><span>Hardware AEC:</span><span class="val">ACTIVE</span></div>
    <div class="row"><span>Noise Suppress:</span><span class="val">-18 dB</span></div>
    <div class="row"><span>Auto Gain:</span><span class="val">+6 dB</span></div>
  </div>
<script>
  let curAngle = 180;
  function testMotor() {
    curAngle = (curAngle + 45) % 360;
    document.getElementById('angle').innerText = curAngle + '°';
    if(window.AndroidBridge && window.AndroidBridge.rotateCamera) {
      window.AndroidBridge.rotateCamera(curAngle);
    }
  }
  setInterval(() => {
    document.getElementById('temp').innerText = (40.5 + Math.random()*2).toFixed(1) + '°C';
  }, 2000);
</script>
</body>
</html>`,
  },
];

// 3. Full Master Android Source Files for Codebase Explorer
export const MASTER_ANDROID_CODEBASE: Record<string, { filename: string; language: string; content: string }> = {
  'MainActivity.kt': {
    filename: 'app/src/main/java/com/r1/geminikiosk/MainActivity.kt',
    language: 'kotlin',
    content: `package com.r1.geminikiosk

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import com.r1.geminikiosk.live.BxLiveStream
import com.r1.geminikiosk.music.BxMusicEngine
import com.r1.geminikiosk.motor.CameraMotorManager
import com.r1.geminikiosk.memory.BxMemoryManager

/**
 * Master State Machine and Kiosk Launcher for Rabbit R1 Gemini Box (Project Bx).
 * Intercepts physical Rotary Wheel scan codes and side PTT button events.
 */
class MainActivity : Activity() {

    private lateinit var liveStream: BxLiveStream
    private lateinit var musicEngine: BxMusicEngine
    private lateinit var motorManager: CameraMotorManager
    private lateinit var memoryManager: BxMemoryManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Single-App Kiosk Mode Lock
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        )
        try {
            startLockTask()
        } catch (e: Exception) {
            // Log kiosk lock fallback
        }

        setContentView(R.layout.activity_main)
        
        liveStream = BxLiveStream(this)
        musicEngine = BxMusicEngine(this)
        motorManager = CameraMotorManager(this)
        memoryManager = BxMemoryManager(this)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_VOLUME_DOWN, KeyEvent.KEYCODE_F8, KeyEvent.KEYCODE_HEADSETHOOK -> {
                // Physical PTT Button Down -> Start 16kHz PCM Stream
                liveStream.startVoiceRecording()
                true
            }
            KeyEvent.KEYCODE_DPAD_UP -> {
                // Rotary Wheel Scroll Up
                onRotaryScrolled(-1)
                true
            }
            KeyEvent.KEYCODE_DPAD_DOWN -> {
                // Rotary Wheel Scroll Down
                onRotaryScrolled(1)
                true
            }
            else -> super.onKeyDown(keyCode, event)
        }
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_VOLUME_DOWN, KeyEvent.KEYCODE_F8, KeyEvent.KEYCODE_HEADSETHOOK -> {
                // Physical PTT Button Up -> Send turn payload
                liveStream.stopVoiceRecordingAndDispatch()
                true
            }
            else -> super.onKeyUp(keyCode, event)
        }
    }

    private fun onRotaryScrolled(delta: Int) {
        // Cycle active OS mode or adjust volume / micro-app canvas
    }
}`,
  },
  'BxLiveStream.kt': {
    filename: 'app/src/main/java/com/r1/geminikiosk/live/BxLiveStream.kt',
    language: 'kotlin',
    content: `package com.r1.geminikiosk.live

import android.content.Context
import android.media.AudioRecord
import com.r1.geminikiosk.audio.AudioTrackPlayer
import okhttp3.*
import java.util.concurrent.TimeUnit

/**
 * Low-Latency Gemini Multimodal Live API WebSocket Client.
 * Handles 16 kHz Mono PCM audio uplink and 24 kHz AudioTrack streaming output.
 */
class BxLiveStream(private val context: Context) {

    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .build()

    private var webSocket: WebSocket? = null
    private val audioPlayer = AudioTrackPlayer()

    fun connect(apiKey: String) {
        val url = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=$apiKey"
        val request = Request.Builder().url(url).build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(ws: WebSocket, response: Response) {
                // Send initial setup config (Voice: Zephyr, 16kHz in / 24kHz out)
            }

            override fun onMessage(ws: WebSocket, text: String) {
                // Parse serverContent.modelTurn.parts inline PCM audio chunks
            }
        })
    }

    fun startVoiceRecording() {
        // Purge speaker buffer for instant <40ms barge-in
        audioPlayer.flushBuffer()
    }

    fun stopVoiceRecordingAndDispatch() {
        // Finalize speech frame
    }
}`,
  },
  'BxMusicEngine.kt': {
    filename: 'app/src/main/java/com/r1/geminikiosk/music/BxMusicEngine.kt',
    language: 'kotlin',
    content: `package com.r1.geminikiosk.music

import android.content.Context
import android.media.MediaPlayer
import kotlinx.coroutines.*
import org.json.JSONObject

/**
 * Headless YouTube Music & Genre Radio Engine for Rabbit R1.
 * Resolves raw Opus/AAC streams via InnerTube WEB_REMIX without video decoding.
 */
class BxMusicEngine(private val context: Context) {

    private var mediaPlayer: MediaPlayer? = null
    private val trackQueue = mutableListOf<String>()

    fun startGenreStation(genre: String) {
        CoroutineScope(Dispatchers.IO).launch {
            val streamUrl = queryInnerTubeAudioStream(genre)
            withContext(Dispatchers.Main) {
                playAudioStream(streamUrl)
            }
        }
    }

    private fun queryInnerTubeAudioStream(query: String): String {
        // Direct JSON query to InnerTube ANDROID_VR endpoint
        return "https://rr4---sn-xxx.googlevideo.com/videoplayback?..."
    }

    private fun playAudioStream(url: String) {
        mediaPlayer?.release()
        mediaPlayer = MediaPlayer().apply {
            setDataSource(url)
            prepareAsync()
            setOnPreparedListener { start() }
        }
    }
}`,
  },
  'CameraMotorManager.kt': {
    filename: 'app/src/main/java/com/r1/geminikiosk/motor/CameraMotorManager.kt',
    language: 'kotlin',
    content: `package com.r1.geminikiosk.motor

import android.content.Context
import java.io.File
import java.io.FileOutputStream

/**
 * Direct Sysfs Controller for the Rabbit R1 MS35774 Stepper Motor.
 * Controls 360° rotation between Selfie (0°), Outward (180°), and Privacy (270°).
 */
class CameraMotorManager(private val context: Context) {

    private val ORIENTATION_NODE = "/sys/devices/platform/step_motor_ms35774/orientation"
    private val DEGREE_NODE = "/sys/devices/platform/step_motor_ms35774/degree"

    fun rotateTo(degrees: Int) {
        val clamped = degrees % 360
        try {
            val file = File(DEGREE_NODE)
            if (file.exists()) {
                FileOutputStream(file).use { it.write(clamped.toString().toByteArray()) }
            }
        } catch (e: Exception) {
            // Sysfs permission fallback
        }
    }

    fun setMode(mode: String) {
        // "selfie", "outward", "privacy"
    }
}`,
  },
  'Install_Bx_OS.sh': {
    filename: 'scripts/Install_Bx_OS.sh',
    language: 'bash',
    content: `#!/usr/bin/env bash
# ==============================================================================
# Rabbit R1 Gemini Box (Project Bx) Automated Provisioning & Debloat Script
# MediaTek MT6765 | 2.88" 480x640 (180 DPI) | Kiosk Mode
# ==============================================================================

set -e

echo "🔌 Checking Rabbit R1 ADB Connection..."
adb wait-for-device

echo "📱 Setting 2.88\" Display Density & Resolution..."
adb shell wm size 480x640
adb shell wm density 180

echo "⚡ Configuring MT6765 CPU Governor..."
adb shell "echo schedutil > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor"
adb shell "echo schedutil > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor"

echo "🗑️ Debloating Background Stock Services for Maximum Battery..."
adb shell pm uninstall --user 0 com.android.chrome || true
adb shell pm uninstall --user 0 com.android.providers.calendar || true
adb shell pm uninstall --user 0 com.android.music || true

echo "🚀 Installing Gemini Box Master Kiosk APK..."
adb install -r app/build/outputs/apk/debug/app-debug.apk

echo "🔒 Setting Gemini Box as Default Home Launcher..."
adb shell cmd package set-home-activity com.r1.geminikiosk/.MainActivity

echo "✅ Provisioning Complete! Rebooting device into Gemini Box Kiosk..."
adb reboot`,
  },
  'ARCHITECTURE.md': {
    filename: 'ARCHITECTURE.md',
    language: 'markdown',
    content: `# 📦 Project Bx: Gemini Box for Rabbit R1 Architecture

## Hardware Specs:
- **Processor**: MediaTek Helio P35 (MT6765), 8x Cortex-A53
- **RAM / Storage**: 4GB LPDDR4x / 128GB eMMC
- **Display**: 2.88" Portrait 480x640 LCD (~277 PPI, Density 180)
- **Rotary Wheel**: Uninterrupted rotary encoder (DPAD_UP / DPAD_DOWN)
- **Side Button**: Single multi-function PTT button
- **Motorized Camera**: 360° MS35774 Stepper Motor via Sysfs

## Core Software Engines:
1. **BxLiveStream**: WebSocket bidirectional 16kHz PCM audio stream with <40ms hardware barge-in.
2. **BxBrain**: Gemini 2.5 Pro with Google Search Grounding and Python code sandbox.
3. **BxMusicEngine**: Headless InnerTube Opus audio player with 20+ track genre radio auto-queue.
4. **BxAppViewer**: Isolated HTML5/JS WebView container with \`AndroidBridge\` for tactile micro-apps.
5. **BxMemoryManager**: Local turn logging with automated nightly WorkManager memory synthesis.`,
  },
};
