import { useEffect, useRef, useState, type ReactElement } from "react";
import { sound } from "../domain/audio";

export interface TypewriterProps {
  text: string;
  speed?: number; // ms per char, default ~32ms
  onComplete?: () => void;
  isCompleted?: boolean;
  className?: string;
  soundEnabled?: boolean;
}

export function TypewriterText({
  text,
  speed = 32,
  onComplete,
  isCompleted = false,
  className = "",
  soundEnabled = true,
}: TypewriterProps): ReactElement {
  const [displayedLength, setDisplayedLength] = useState(isCompleted ? text.length : 0);
  const timerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Track if completion has been notified to parent
  const notifiedRef = useRef(isCompleted);

  // Reset or instantly complete when text or isCompleted changes
  useEffect(() => {
    if (isCompleted) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setDisplayedLength(text.length);
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
      return;
    }

    setDisplayedLength(0);
    notifiedRef.current = false;
    let index = 0;

    const tick = () => {
      index += 1;
      setDisplayedLength(index);

      if (soundEnabled && index % 2 === 0) {
        sound.playTypeTick(0.9 + (index % 5) * 0.05);
      }

      if (index >= text.length) {
        timerRef.current = null;
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
        return;
      }

      const currentChar = text[index - 1] ?? "";
      let delay = speed;
      // Natural cadence pauses on punctuation
      if (/[。！？!?]/.test(currentChar)) {
        delay = speed * 4.2;
      } else if (/[，、；;：:]/.test(currentChar)) {
        delay = speed * 2.2;
      } else if (/[…—]/.test(currentChar)) {
        delay = speed * 3.2;
      }

      timerRef.current = window.setTimeout(tick, delay);
    };

    timerRef.current = window.setTimeout(tick, speed);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speed, isCompleted, soundEnabled]);

  const visibleText = text.slice(0, displayedLength);
  const isTyping = displayedLength < text.length && !isCompleted;

  return (
    <span className={`typewriter-content ${className}`}>
      {visibleText}
      {isTyping && <span className="typewriter-cursor" aria-hidden="true" />}
    </span>
  );
}
