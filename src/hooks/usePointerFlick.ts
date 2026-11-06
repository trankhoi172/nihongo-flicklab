import { useRef, useState, useCallback } from 'react';
import type { FlickDirection } from '../types/keyboard';
import type { FlickSensitivity } from '../types/settings';
import { soundEffects } from '../utils/audio';

interface PointerFlickOptions {
  sensitivity: FlickSensitivity;
  soundEnabled: boolean;
  soundVolume: number;
  onFlickCommit: (direction: FlickDirection) => void;
}

export function usePointerFlick({
  sensitivity,
  soundEnabled,
  soundVolume,
  onFlickCommit,
}: PointerFlickOptions) {
  const [isPressing, setIsPressing] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<FlickDirection>('center');
  const [pressCoord, setPressCoord] = useState<{ x: number; y: number } | null>(null);

  const startPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const activePointerId = useRef<number | null>(null);
  const lastDirectionRef = useRef<FlickDirection>('center');

  // Sensitivity thresholds in CSS pixels
  const threshold = sensitivity === 'low' ? 20 : sensitivity === 'high' ? 38 : 28;

  const calculateDirection = useCallback(
    (dx: number, dy: number): FlickDirection => {
      const dist = Math.hypot(dx, dy);
      if (dist < threshold) {
        return 'center';
      }

      // Angle in degrees from -180 to 180
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;

      if (deg >= -45 && deg < 45) {
        return 'right';
      } else if (deg >= 45 && deg < 135) {
        return 'down';
      } else if (deg >= -135 && deg < -45) {
        return 'up';
      } else {
        return 'left';
      }
    },
    [threshold]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      soundEffects.unlock();

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}

      activePointerId.current = e.pointerId;
      startPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      lastDirectionRef.current = 'center';

      setIsPressing(true);
      setCurrentDirection('center');
      setPressCoord({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPressing || activePointerId.current !== e.pointerId || !startPos.current) {
        return;
      }

      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const dir = calculateDirection(dx, dy);

      if (dir !== lastDirectionRef.current) {
        lastDirectionRef.current = dir;
        setCurrentDirection(dir);
        if (soundEnabled && dir !== 'center') {
          soundEffects.playFlickDirection(soundVolume);
        }
      }
    },
    [isPressing, calculateDirection, soundEnabled, soundVolume]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPressing || activePointerId.current !== e.pointerId) {
        return;
      }

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      const finalDir = lastDirectionRef.current;
      setIsPressing(false);
      setCurrentDirection('center');
      setPressCoord(null);
      activePointerId.current = null;
      startPos.current = null;

      onFlickCommit(finalDir);
    },
    [isPressing, onFlickCommit]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (activePointerId.current === e.pointerId) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        setIsPressing(false);
        setCurrentDirection('center');
        setPressCoord(null);
        activePointerId.current = null;
        startPos.current = null;
      }
    },
    []
  );

  return {
    isPressing,
    currentDirection,
    pressCoord,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
