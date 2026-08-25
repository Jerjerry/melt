import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Eye, EyeOff, Sparkles, Layers, Sliders } from 'lucide-react';
import { CAMERA_TEST_CARDS, CameraCard } from '../data/mockHardwareData';
import { playCameraMotorSound } from '../utils/audioSynthesizer';

interface CameraViewfinderProps {
  angle: number;
  onAngleChange: (newAngle: number) => void;
  onCaptureFrame: (imageDataUrl: string, promptText?: string) => void;
  isProcessing?: boolean;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  angle,
  onAngleChange,
  onCaptureFrame,
  isProcessing = false,
}) => {
  const [useWebcam, setUseWebcam] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>('circuit_555');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const selectedCard = CAMERA_TEST_CARDS.find((c) => c.id === selectedCardId) || CAMERA_TEST_CARDS[0];

  // Start / Stop Real Webcam
  const toggleWebcam = async () => {
    if (useWebcam) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setUseWebcam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setUseWebcam(true);
        setHasCameraPermission(true);
      } catch (e) {
        console.warn('Webcam not accessible or denied:', e);
        setHasCameraPermission(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleAngleStep = (targetAngle: number) => {
    playCameraMotorSound();
    onAngleChange(targetAngle);
  };

  // Capture the active frame
  const handleSnap = () => {
    if (useWebcam && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCaptureFrame(dataUrl, 'Analyze this optical frame from Rabbit R1 camera.');
      }
    } else {
      onCaptureFrame(selectedCard.svgDataUrl, selectedCard.prompt);
    }
  };

  const isPrivacy = angle >= 250 && angle <= 290;

  return (
    <div className="flex flex-col gap-2 w-full bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-xs select-none">
      {/* Header with MS35774 Stepper Motor Status */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono font-bold text-stone-200">MS35774 Stepper</span>
          <span className="text-[10px] text-amber-400 font-mono">[{angle}°]</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            id="btn_motor_selfie"
            onClick={() => handleAngleStep(0)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
              angle === 0 ? 'bg-amber-500 text-black font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            0° Selfie
          </button>
          <button
            id="btn_motor_outward"
            onClick={() => handleAngleStep(180)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
              angle === 180 ? 'bg-amber-500 text-black font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            180° Outward
          </button>
          <button
            id="btn_motor_privacy"
            onClick={() => handleAngleStep(270)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
              isPrivacy ? 'bg-amber-500 text-black font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            270° Closed
          </button>
        </div>
      </div>

      {/* Optical Viewport & Reticle */}
      <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-black border border-stone-800 flex items-center justify-center">
        {isPrivacy ? (
          <div className="flex flex-col items-center justify-center text-stone-500 gap-1">
            <EyeOff className="w-8 h-8 text-stone-600" />
            <span className="font-mono text-[11px]">CAMERA MOTOR CLOSED (270°)</span>
          </div>
        ) : useWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={selectedCard.svgDataUrl}
            alt={selectedCard.name}
            className="w-full h-full object-contain bg-stone-900"
          />
        )}

        {/* Reticle / Crosshairs Overlay when active */}
        {!isPrivacy && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Center target box */}
            <div className="w-24 h-24 border border-amber-400/50 rounded flex items-center justify-center relative">
              <div className="w-2 h-2 border-t-2 border-l-2 border-amber-400 absolute -top-1 -left-1" />
              <div className="w-2 h-2 border-t-2 border-r-2 border-amber-400 absolute -top-1 -right-1" />
              <div className="w-2 h-2 border-b-2 border-l-2 border-amber-400 absolute -bottom-1 -left-1" />
              <div className="w-2 h-2 border-b-2 border-r-2 border-amber-400 absolute -bottom-1 -right-1" />
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-75" />
            </div>
            {/* HUD Status label */}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 rounded font-mono text-[9px] text-amber-300 border border-amber-500/30">
              {useWebcam ? 'LIVE WEBCAM' : selectedCard.name.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Test Target Selector or Webcam Toggle */}
      <div className="flex items-center justify-between gap-1 mt-0.5">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[65%]">
          {CAMERA_TEST_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => {
                if (useWebcam) toggleWebcam();
                setSelectedCardId(card.id);
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap border font-mono transition-all ${
                !useWebcam && selectedCardId === card.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {card.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <button
          id="btn_toggle_webcam"
          onClick={toggleWebcam}
          className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono border transition-all ${
            useWebcam
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
              : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
          }`}
          title="Toggle live computer camera feed"
        >
          <Camera className="w-3 h-3" />
          {useWebcam ? 'Using Cam' : 'Live Cam'}
        </button>
      </div>

      {/* Action Buttons: Inspect / Sketch to App */}
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        <button
          id="btn_camera_inspect"
          disabled={isPrivacy || isProcessing}
          onClick={handleSnap}
          className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-black font-bold rounded flex items-center justify-center gap-1 text-[11px] transition-all shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          {isProcessing ? 'Analyzing...' : 'Scan & Analyze'}
        </button>

        <button
          id="btn_camera_sketch_app"
          disabled={isPrivacy || isProcessing}
          onClick={() => {
            onCaptureFrame(
              selectedCard.svgDataUrl,
              'Turn this UI sketch wireframe into an interactive Spark micro-app with rotary wheel support.'
            );
          }}
          className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-black font-bold rounded flex items-center justify-center gap-1 text-[11px] transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Sketch ➔ App
        </button>
      </div>
    </div>
  );
};
