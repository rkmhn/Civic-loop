import React, { useEffect, useState, useRef, memo } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = memo(({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  formatter,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const startValueRef = useRef<number>(value);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const startVal = startValueRef.current;
    const targetVal = value;

    if (startVal === targetVal) return;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetVal);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  let formattedText = '';
  if (formatter) {
    formattedText = formatter(displayValue);
  } else {
    if (Number.isInteger(value)) {
      formattedText = Math.round(displayValue).toLocaleString();
    } else {
      formattedText = displayValue.toFixed(1);
    }
  }

  return (
    <span className={`inline-block tabular-nums font-mono ${className}`}>
      {prefix}{formattedText}{suffix}
    </span>
  );
});
