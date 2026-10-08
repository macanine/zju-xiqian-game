import { useEffect, useRef, useState, type ReactElement } from "react";
import { type JourneyLeg } from "../domain/journey";
import { sound } from "../domain/audio";

export interface JourneyTransitionProps {
  leg: JourneyLeg;
  onComplete: () => void;
  photoPath?: string;
}

export function JourneyTransition({
  leg,
  onComplete,
}: JourneyTransitionProps): ReactElement {
  const [stampLanded, setStampLanded] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const completedRef = useRef(false);

  // Safe single-execution skip handler
  const handleSkip = () => {
    if (completedRef.current) return;
    completedRef.current = true;

    // Blur active elements to prevent spacebar from re-triggering previous buttons
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    sound.playPageTurn();
    onComplete();
  };

  useEffect(() => {
    // Blur any focused button immediately when transition appears
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 1. Play atmospheric march chime asynchronously without blocking initial paint
    const chimeRaf = requestAnimationFrame(() => {
      sound.playMarchChime();
    });

    // 2. Vermilion stamp lands at 1.0s with solid wood stamp sound
    const stampTimer = window.setTimeout(() => {
      if (!completedRef.current) {
        setStampLanded(true);
        sound.playSealStamp();
      }
    }, 1000);

    // 3. Begin smooth fade-out at 2.1s
    const fadeTimer = window.setTimeout(() => {
      if (!completedRef.current) {
        setFadingOut(true);
      }
    }, 2100);

    // 4. Complete transition at 2.45s
    const doneTimer = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 2450);

    // Listen to ANY key (space, enter, escape, any letter/number) for instant skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // Ignore modifier keys only
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;

      e.preventDefault();
      e.stopPropagation();
      if ("stopImmediatePropagation" in e) {
        e.stopImmediatePropagation();
      }
      handleSkip();
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase to intercept first!

    return () => {
      cancelAnimationFrame(chimeRaf);
      window.clearTimeout(stampTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onComplete]);

  return (
    <div
      className={`journey-transition-screen ${fadingOut ? "is-fading-out" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSkip();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="西迁行军地点变迁"
    >
      {/* Ancient Parchment Curtain with Ink Bloom */}
      <div className="jt-paper-backdrop" />
      <div className="jt-ink-vignette" />

      <div className="jt-scroll-card" onClick={(e) => e.stopPropagation()}>
        {/* Top March Banner */}
        <div className="jt-march-banner">
          <span className="banner-kicker">國立浙江大學西遷征途 · 轉進紀事</span>
          <span className="banner-period">{leg.period}</span>
        </div>

        {/* Departure to Destination Animated Highway */}
        <div className="jt-route-flow">
          <div className="jt-station-node is-origin">
            <span className="node-flag">自</span>
            <strong className="node-name">{leg.fromName}</strong>
          </div>

          <div className="jt-animated-road">
            <div className="road-line">
              <div className="road-pulse-light" />
            </div>
            <div className="road-meta">
              <span>{leg.provinceRoute}</span>
              <span className="road-distance">（{leg.distance}）</span>
            </div>
          </div>

          <div className="jt-station-node is-destination">
            <span className="node-flag">抵</span>
            <strong className="node-name">{leg.toName}</strong>
          </div>
        </div>

        {/* Historical Epigraph & Quotes */}
        <div className="jt-epigraph-box">
          <p className="jt-epigraph-text">{leg.epigraph}</p>
        </div>

        {/* Big Vermilion Seal Stamp Drop */}
        <div className={`jt-seal-stamp ${stampLanded ? "is-stamped" : ""}`}>
          <div className="seal-inner">
            <span>{leg.seal}</span>
          </div>
          <span className="seal-ring" />
        </div>

        {/* Skip Tip */}
        <div className="jt-skip-tip" onClick={handleSkip}>
          <span>點擊任意處或按任意鍵跳過行軍過場 ➔</span>
        </div>
      </div>
    </div>
  );
}
