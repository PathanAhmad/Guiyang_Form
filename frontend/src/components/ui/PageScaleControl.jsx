import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'pageScale';
const DEFAULT_SCALE = 80; // 80%
const MIN_SCALE = 50;     // 50%
const MAX_SCALE = 150;    // 150%
const STEP = 10;          // 10%

function clamp(value) {
  if (value < MIN_SCALE) return MIN_SCALE;
  if (value > MAX_SCALE) return MAX_SCALE;
  return value;
}

function readStoredScale() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (Number.isFinite(parsed)) return clamp(parsed);
  } catch {
    // ignore storage errors and fall back to default
  }
  return DEFAULT_SCALE;
}

function writeStoredScale(value) {
  try {
    localStorage.setItem(STORAGE_KEY, String(clamp(value)));
  } catch {
    // ignore storage errors
  }
}

// Custom event name to sync scale across components
const SCALE_EVENT = 'page-scale-change';

// eslint-disable-next-line react-refresh/only-export-components
export function usePageScale() {
  const [scale, setScale] = useState(readStoredScale);
  const isSettingRef = useRef(false);

  const updateScale = (next) => {
    const nextValue = clamp(typeof next === 'function' ? next(scale) : next);
    isSettingRef.current = true;
    setScale(nextValue);
    writeStoredScale(nextValue);
    window.dispatchEvent(new CustomEvent(SCALE_EVENT, { detail: { scale: nextValue } }));
    // release flag on next tick
    setTimeout(() => { isSettingRef.current = false; }, 0);
  };

  const resetScale = () => updateScale(DEFAULT_SCALE);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && !isSettingRef.current) {
        const next = readStoredScale();
        setScale(next);
      }
    };
    const onCustom = (e) => {
      if (!isSettingRef.current && e?.detail?.scale != null) {
        setScale(clamp(e.detail.scale));
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(SCALE_EVENT, onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SCALE_EVENT, onCustom);
    };
  }, []);

  return { scale, setScale: updateScale, resetScale, min: MIN_SCALE, max: MAX_SCALE, step: STEP };
}

export default function PageScaleControl() {
  const { scale, setScale, resetScale, min, max, step } = usePageScale();

  const decrease = () => setScale((s) => clamp(s - step));
  const increase = () => setScale((s) => clamp(s + step));

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md border border-gray-200 shadow-sm">
      <button
        type="button"
        onClick={decrease}
        className="px-2 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
        aria-label="Decrease scale"
        disabled={scale <= min}
      >
        −
      </button>
      <span className="text-xs tabular-nums text-gray-800 w-12 text-center select-none">{scale}%</span>
      <button
        type="button"
        onClick={increase}
        className="px-2 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
        aria-label="Increase scale"
        disabled={scale >= max}
      >
        +
      </button>
      <button
        type="button"
        onClick={resetScale}
        className="ml-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded border border-gray-200"
      >
        Reset
      </button>
    </div>
  );
}


