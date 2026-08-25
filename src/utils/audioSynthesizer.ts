/**
 * Web Audio API synthesizer for Rabbit R1 hardware haptics, motor sounds,
 * PTT triggers, and ambient genre radio stems.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Tactile Rotary Wheel Mechanical Click
export function playRotaryClickSound(direction: 1 | -1 = 1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(direction > 0 ? 1800 : 1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.015);

    filter.type = 'highpass';
    filter.frequency.value = 800;

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    // Ignore audio context autoplay limitations if user hasn't interacted yet
  }
}

// 2. Camera Stepper Motor Mechanical Sound
export function playCameraMotorSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.12);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// 3. PTT Button Activation & Deactivation Beep
export function playPttBeep(state: 'start' | 'stop') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (state === 'start') {
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.04); // E6
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    }
  } catch (e) {}
}

// 4. Speech Synthesis & Barge-in Audio Control
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  // Instant barge-in: cancel any previous speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting for cleaner speech output
  const cleanText = text
    .replace(/```[\s\S]*?```/g, 'Code block output.')
    .replace(/[#*`_~[\]]/g, '')
    .replace(/\bhttps?:\/\/\S+/gi, 'link')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Choose optimal English voice if available
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en')
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

// 5. Procedural Synthesizer for Genre Radio
let musicGain: GainNode | null = null;
let musicInterval: number | null = null;

export function startGenreRadioAudio(genre: string, volume: number = 0.5) {
  stopGenreRadioAudio();
  try {
    const ctx = getAudioContext();
    musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    musicGain.connect(ctx.destination);

    // Chords and tempo per genre
    let chords: number[][] = [];
    let tempoMs = 600;

    if (genre.toLowerCase().includes('lo-fi') || genre.toLowerCase().includes('chill')) {
      // Warm jazzy 7th chords: Dm7 -> G7 -> Cmaj7 -> Am7
      chords = [
        [293.66, 349.23, 440.0, 523.25], // Dm7
        [392.0, 493.88, 587.33, 698.46], // G7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
      ];
      tempoMs = 800;
    } else if (genre.toLowerCase().includes('synthwave') || genre.toLowerCase().includes('cyber')) {
      // 80s minor arps: Em -> C -> D -> Bm
      chords = [
        [164.81, 329.63, 392.0, 493.88],
        [130.81, 261.63, 329.63, 392.0],
        [146.83, 293.66, 369.99, 440.0],
        [123.47, 246.94, 293.66, 369.99],
      ];
      tempoMs = 450;
    } else if (genre.toLowerCase().includes('rock')) {
      // Power chords: E5 -> G5 -> A5 -> C5
      chords = [
        [164.81, 246.94, 329.63],
        [196.0, 293.66, 392.0],
        [220.0, 329.63, 440.0],
        [130.81, 196.0, 261.63],
      ];
      tempoMs = 500;
    } else {
      // Ambient Jazz
      chords = [
        [220.0, 277.18, 329.63, 415.3],
        [174.61, 220.0, 261.63, 329.63],
      ];
      tempoMs = 700;
    }

    let chordIndex = 0;
    const playChord = () => {
      if (!musicGain || !ctx) return;
      const curChord = chords[chordIndex % chords.length];
      chordIndex++;

      curChord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = genre.includes('synth') ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.04 / (i + 1), ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tempoMs / 1000 * 0.9);

        osc.connect(noteGain);
        noteGain.connect(musicGain!);

        osc.start();
        osc.stop(ctx.currentTime + tempoMs / 1000);
      });
    };

    playChord();
    musicInterval = window.setInterval(playChord, tempoMs);
  } catch (e) {}
}

export function setGenreRadioVolume(volume: number) {
  if (musicGain && audioCtx) {
    musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)) * 0.15, audioCtx.currentTime);
  }
}

export function stopGenreRadioAudio() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  musicGain = null;
}
