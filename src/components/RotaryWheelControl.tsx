import React, { useRef, useState, useEffect } from 'react';
import { playRotaryClickSound } from '../utils/audioSynthesizer';

interface RotaryWheelControlProps {
  onRotate: (delta: 1 | -1) => void;
  accentColor?: string;
  size?: 'normal' | 'compact';
}

export const RotaryWheelControl: React.FC<RotaryWheelControlProps> = ({
  onRotate,
  accentColor = '#00FFFF',
  size = 'normal',
}) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const lastAccumDelta = useRef<number>(0);

  const triggerStep = (delta: 1 | -1) => {
    setRotation((prev) => prev + delta * 24);
    playRotaryClickSound(delta);
    onRotate(delta);
  };

  // Drag handlers for mouse/touch
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    lastAccumDelta.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientY - startYRef.current;
    const stepThreshold = 18; // px per detent

    if (Math.abs(diff - lastAccumDelta.current) >= stepThreshold) {
      const delta: 1 | -1 = diff > lastAccumDelta.current ? 1 : -1;
      lastAccumDelta.current = diff;
      triggerStep(delta);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    lastAccumDelta.current = 0;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Wheel listener
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta: 1 | -1 = e.deltaY > 0 ? 1 : -1;
    triggerStep(delta);
  };

  const isCompact = size === 'compact';

  return (
    <div className="flex flex-col items-center select-none">
      <div
        id="rabbit_rotary_wheel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        title="Rabbit R1 Rotary Scroll Wheel (Drag or Scroll to rotate, or use Up/Down keys)"
        className={`relative cursor-ns-resize touch-none rounded-r-md bg-stone-900 border-y-2 border-r-2 border-stone-800 shadow-inner flex flex-col justify-center items-center overflow-hidden transition-all active:brightness-125 ${
          isCompact ? 'w-5 h-20' : 'w-7 h-28'
        }`}
        style={{
          boxShadow: `inset 0 0 10px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Metal knurled ridges with simulated cylindrical perspective */}
        <div
          className="absolute inset-0 flex flex-col justify-around py-1 pointer-events-none transition-transform duration-75"
          style={{
            transform: `translateY(${(rotation % 20)}px)`,
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[2px] bg-stone-700/80 shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              style={{
                opacity: Math.sin((i / 12) * Math.PI) * 0.9 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Center tactile indicator line */}
        <div
          className="absolute left-0 w-1.5 h-6 rounded-r bg-stone-500 shadow-sm"
          style={{
            borderColor: accentColor,
          }}
        />
      </div>

      {/* Manual Click Buttons for easy clicking */}
      <div className="flex flex-col gap-1 mt-1.5">
        <button
          id="btn_wheel_up"
          onClick={() => triggerStep(-1)}
          className="w-6 h-5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded text-[10px] flex items-center justify-center border border-stone-700 active:scale-95 transition-all"
          title="Scroll Up (Up Arrow)"
        >
          ▲
        </button>
        <button
          id="btn_wheel_down"
          onClick={() => triggerStep(1)}
          className="w-6 h-5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded text-[10px] flex items-center justify-center border border-stone-700 active:scale-95 transition-all"
          title="Scroll Down (Down Arrow)"
        >
          ▼
        </button>
      </div>
    </div>
  );
};
