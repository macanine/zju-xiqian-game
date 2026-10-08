import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  assetUrl,
  type Choice,
  type ContentBundle,
} from "../domain/content";
import type { Resources } from "../domain/rules";
import { sound } from "../domain/audio";
import { getSpeakerInfo, resolveDialogueSpeaker } from "../domain/speakers";
import { TypewriterText } from "../scene/TypewriterText";
import {
  FLAG_LABELS,
  resourceLabels,
  type QueuedEvent,
  type Session,
} from "../domain/session";

export function VNEventScreen({
  session,
  item,
  autoPlay,
  soundEnabled,
  hideUI,
  onToggleHideUI,
  onToggleAutoPlay,
  onOpenBacklog,
  onChoice,
  onViewImage,
  isBlocked = false,
}: {
  content: ContentBundle;
  session: Session;
  item: QueuedEvent;
  autoPlay: boolean;
  soundEnabled: boolean;
  hideUI: boolean;
  onToggleHideUI: () => void;
  onToggleAutoPlay: () => void;
  onOpenBacklog: () => void;
  onChoice: (choice: Choice) => void;
  onViewImage: (path: string) => void;
  isBlocked?: boolean;
}): ReactElement {
  const [typingComplete, setTypingComplete] = useState(false);
  const [skipRequested, setSkipRequested] = useState(false);
  const lastSkipTimeRef = useRef<number>(0);
  const isAdvancingRef = useRef(false);

  const dialogues = (item.kind === "location" ? item.event.dialogues : undefined) || [];
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [resolutionStage, setResolutionStage] = useState<{
    choice: Choice;
    narrative: string;
    flag?: string;
  } | null>(null);

  const [stampOverlay, setStampOverlay] = useState<{
    seal: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const [qteLeft, setQteLeft] = useState(
    item.kind === "random" && item.event.qte ? item.event.qte.windowSeconds : 0,
  );
  const [qteDone, setQteDone] = useState(false);

  // Reset completion state on new event
  useEffect(() => {
    setDialogueIndex(0);
    setResolutionStage(null);
    setStampOverlay(null);
    setTypingComplete(false);
    setSkipRequested(false);
    lastSkipTimeRef.current = 0;
    isAdvancingRef.current = false;
  }, [item.event.id, session.queueIndex]);

  const node = item.node;
  const event = item.event;
  const choices = event.choices;
  const isQte = Boolean(item.kind === "random" && item.event.qte);
  const qte = item.kind === "random" ? item.event.qte : undefined;
  const inDialogue = dialogueIndex < dialogues.length && !resolutionStage;
  const currentDialogue = inDialogue ? dialogues[dialogueIndex] : null;
  const hasMultipleChoices = choices.length > 1;
  const autoAdvance = !hasMultipleChoices && !isQte && !inDialogue && !resolutionStage;

  const title = item.kind === "location" ? item.event.title : item.event.name;
  const speakerMeta = resolutionStage
    ? {
        name: "行軍決斷",
        badge: "手令裁定",
        role: "國立浙江大學西遷手令",
        seal: "令",
        kind: "historical" as const,
      }
    : currentDialogue
      ? resolveDialogueSpeaker(currentDialogue.speaker, currentDialogue.role)
      : getSpeakerInfo(event.id, title);

  const imagePath =
    item.kind === "location" ? node.images[item.photoIndex] : undefined;

  const activeText = resolutionStage
    ? resolutionStage.narrative
    : currentDialogue
      ? currentDialogue.text
      : event.text;

  const activeKey = resolutionStage
    ? `res-${item.event.id}`
    : currentDialogue
      ? `dlg-${item.event.id}-${dialogueIndex}`
      : `main-${item.event.id}`;

  // QTE Countdown Logic
  useEffect(() => {
    if (!isQte || !qte) return;
    sound.playAlert();
    setQteLeft(qte.windowSeconds);
    setQteDone(false);
    let left = qte.windowSeconds;
    const timer = window.setInterval(() => {
      left -= 1;
      if (left <= 0) {
        window.clearInterval(timer);
        setQteLeft(0);
        setQteDone(true);
        onChoice(
          choices[1] ?? {
            label: "隱蔽失敗",
            effects: { supplies: -1 },
          },
        );
        return;
      }
      setQteLeft(left);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [item, isQte, qte, onChoice, choices]);

  // Major Historical Decrees Stamp Metadata
  const DECREE_MAP: Record<string, { seal: string; title: string; subtitle: string }> = {
    siku: {
      seal: "文瀾護典",
      title: "文瀾四庫 · 保全手令",
      subtitle: "「典籍在，文脈存；千秋文瀾，誓死護送」",
    },
    dike: {
      seal: "上田築堤",
      title: "浙大長堤 · 防洪安民手令",
      subtitle: "「工院技術，修筑安澜；军民同心，泽被后世」",
    },
    anthem: {
      seal: "求是校歌",
      title: "求是校歌 · 馬一浮手稿立案",
      subtitle: "「大不自多，海纳江河；求是校歌，唱彻黔桂」",
    },
    memorial: {
      seal: "松山沉哀",
      title: "松山之痛 · 張俠魂追悼手令",
      subtitle: "「国尔忘家，公而忘私；素车白马，永铭松山」",
    },
    debate: {
      seal: "求是校訓",
      title: "求是校訓 · 校務會議定案",
      subtitle: "「无求是难以立学，无创新难以图强」",
    },
    doubt: {
      seal: "文軍先遣",
      title: "江干啟運 · 新生先遣手令",
      subtitle: "「天目深山，保全火种；先遣列队，从容启行」",
    },
    cambridge: {
      seal: "東方劍橋",
      title: "東方劍橋 · 戰時科學高峰銘刻",
      subtitle: "「李约瑟赞誉：战火中的奇迹，东方之剑桥」",
    },
  };

  // Choice Selection Trigger: Opens Historical Consequence & Echo Stage
  const handleSelectChoice = (choice: Choice) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const narrative =
      choice.resolution ||
      (choice.outcomes
        ? "命運之簽已定，隊伍隨機應變，破關前行。"
        : "手令已下達，全體師生恪遵校令，堅毅向前。");

    const decree = choice.flag ? DECREE_MAP[choice.flag] : null;
    if (decree) {
      sound.playResonantSealStamp();
      setStampOverlay(decree);
      window.setTimeout(() => {
        setStampOverlay(null);
        setResolutionStage({
          choice,
          narrative,
          flag: choice.flag,
        });
        setTypingComplete(false);
        setSkipRequested(false);
      }, 1250);
      return;
    }

    sound.playSealStamp();
    setResolutionStage({
      choice,
      narrative,
      flag: choice.flag,
    });
    setTypingComplete(false);
    setSkipRequested(false);
  };

  // Handle advance or skip with debounce protection
  const handleAdvanceOrSkip = () => {
    if (isBlocked) return;

    // 1. If typing is still in progress, INSTANTLY reveal full text (Skip typing)
    if (!typingComplete) {
      setSkipRequested(true);
      setTypingComplete(true);
      lastSkipTimeRef.current = Date.now();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    // 2. Debounce protection: ignore advance if skip just happened within 260ms
    if (Date.now() - lastSkipTimeRef.current < 260) {
      return;
    }

    // 3. If in resolution consequence stage: confirming resolution advances to next event!
    if (resolutionStage) {
      if (!isAdvancingRef.current) {
        isAdvancingRef.current = true;
        sound.playPageTurn();
        onChoice(resolutionStage.choice);
      }
      return;
    }

    // 4. If in multi-turn dialogue: advance to next dialogue turn!
    if (inDialogue) {
      sound.playPageTurn();
      setDialogueIndex((prev) => prev + 1);
      setTypingComplete(false);
      setSkipRequested(false);
      return;
    }

    // 5. If main event text is already completely shown and non-interactive, advance
    if (autoAdvance && !isAdvancingRef.current) {
      isAdvancingRef.current = true;
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      sound.playPageTurn();
      onChoice(
        choices[0] ?? {
          label: "繼續前行",
          outcomes: item.kind === "random" ? item.event.autoOutcomes : undefined,
        },
      );
    }
  };

  // Auto-play timer once typing completes
  useEffect(() => {
    if (!autoPlay || !typingComplete || isQte || isBlocked) return;
    if (!inDialogue && !resolutionStage && hasMultipleChoices) return;

    const timer = window.setTimeout(() => {
      handleAdvanceOrSkip();
    }, resolutionStage ? 2600 : inDialogue ? 1800 : 2200);

    return () => window.clearTimeout(timer);
  }, [autoPlay, typingComplete, isQte, isBlocked, inDialogue, resolutionStage, hasMultipleChoices]);

  // Keyboard navigation for desktop visual novel enthusiasts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBlocked) return;
      if (e.repeat) return; // Ignore long-press repeats to prevent accidental skips
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Blur active buttons so space doesn't re-trigger previous clicks
      if (document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.blur();
      }

      // Hotkeys
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        onToggleHideUI();
        return;
      }
      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        onToggleAutoPlay();
        return;
      }
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        onOpenBacklog();
        return;
      }

      // Number keys for choices (only when options are visible and not in dialogue/resolution)
      if (
        typingComplete &&
        hasMultipleChoices &&
        !inDialogue &&
        !resolutionStage &&
        ["1", "2", "3", "4"].includes(e.key)
      ) {
        const idx = parseInt(e.key, 10) - 1;
        if (choices[idx]) {
          e.preventDefault();
          handleSelectChoice(choices[idx]);
          return;
        }
      }

      // If still typing: ANY key (space, enter, letters, arrows) reveals full text instantly!
      if (!typingComplete) {
        if (!["Shift", "Control", "Alt", "Meta", "Tab", "CapsLock"].includes(e.key)) {
          e.preventDefault();
          handleAdvanceOrSkip();
          return;
        }
      }

      // If text is already full: Space, Enter, or ArrowDown advances
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        handleAdvanceOrSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isBlocked,
    typingComplete,
    inDialogue,
    resolutionStage,
    autoAdvance,
    choices,
    hasMultipleChoices,
    onChoice,
    onToggleHideUI,
    onToggleAutoPlay,
    onOpenBacklog,
  ]);

  return (
    <section className="vn-event-screen" onClick={handleAdvanceOrSkip}>
      {/* Visual Novel Snapshot in Top Corner (Clickable) */}
      {imagePath && !hideUI && (
        <div className="vn-snapshot-frame" onClick={(e) => e.stopPropagation()}>
          <button
            className="snapshot-thumbnail"
            onClick={(e) => {
              e.stopPropagation();
              onViewImage(imagePath);
            }}
            title="檢閱該歷史現場高清原檔大圖"
          >
            <img src={assetUrl(imagePath)} alt={title} />
            <div className="snapshot-seal-tag">
              <span className="tag-seal">影</span>
              <span>檢閱原照</span>
            </div>
          </button>
        </div>
      )}

      {/* Main Dialogue Box */}
      <div className={`vn-dialogue-box ${hideUI ? "is-hidden" : ""}`}>
        {/* Speaker Badge and Identity Plate */}
        <div className={`vn-speaker-badge speaker-theme-${speakerMeta.characterId || "default"}`}>
          {speakerMeta.avatar ? (
            <div className="speaker-avatar-wrap">
              <img src={speakerMeta.avatar} alt={speakerMeta.name} className="speaker-avatar-img" />
              <span className="badge-seal">{speakerMeta.seal}</span>
            </div>
          ) : (
            <div className="badge-seal">{speakerMeta.seal}</div>
          )}
          <div className="badge-names">
            <span className="speaker-name">{speakerMeta.name}</span>
            <span className="speaker-role">{speakerMeta.role}</span>
          </div>
          <div className="station-period-indicator">
            {inDialogue ? (
              <span className="dialogue-beat-counter">
                第 {dialogueIndex + 1} / {dialogues.length} 幕
              </span>
            ) : (
              <>
                <i className="station-bullet">◆</i>
                <span>{node.period.label}</span>
              </>
            )}
          </div>
        </div>

        {/* Narrative Text Area with Typewriter */}
        <div className="vn-dialogue-content">
          <h2 className="event-kicker-title">
            {resolutionStage
              ? "決策手令 · 歷史迴響"
              : inDialogue
                ? `${title} · 對白 ${dialogueIndex + 1}/${dialogues.length}`
                : title}
          </h2>

          {resolutionStage ? (
            <div className="vn-resolution-panel" onClick={(e) => e.stopPropagation()}>
              <div className="resolution-chosen-pill">
                <span className="res-seal">令</span>
                <span className="res-choice-label">已擬定手令：{resolutionStage.choice.label}</span>
              </div>

              <p className="event-narrative-text">
                <TypewriterText
                  key={activeKey}
                  text={activeText}
                  speed={24}
                  soundEnabled={soundEnabled}
                  isCompleted={skipRequested || typingComplete}
                  onComplete={() => setTypingComplete(true)}
                />
              </p>

              {/* Resource fluctuations & Flag badge */}
              <div className="resolution-effects-row">
                {Object.entries(resolutionStage.choice.effects ?? {}).map(([resKey, delta]) => {
                  const meta = resourceLabels[resKey as keyof Resources];
                  if (!meta || delta === undefined) return null;
                  const isPositive = delta > 0;
                  return (
                    <span key={resKey} className={`res-delta-chip ${isPositive ? "is-pos" : "is-neg"}`}>
                      <span className="res-chip-seal">{meta.seal}</span>
                      {meta.name} {isPositive ? `+${delta}` : delta}
                    </span>
                  );
                })}
                {resolutionStage.flag && (
                  <span className="res-flag-chip">
                    <span className="res-chip-seal">印</span>
                    【銘刻史實印記 · {FLAG_LABELS[resolutionStage.flag] || resolutionStage.flag}】
                  </span>
                )}
              </div>

              {typingComplete && (
                <div className="resolution-confirm-row">
                  <button
                    className="vn-resolution-confirm-btn"
                    onClick={(e) => {
                      (e.currentTarget as HTMLElement)?.blur();
                      if (isAdvancingRef.current) return;
                      isAdvancingRef.current = true;
                      sound.playPageTurn();
                      onChoice(resolutionStage.choice);
                    }}
                  >
                    <span>定奪無悔 · 繼續西征</span>
                    <span className="btn-arrow">➔</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="event-narrative-text">
              <TypewriterText
                key={activeKey}
                text={activeText}
                speed={26}
                soundEnabled={soundEnabled}
                isCompleted={skipRequested || typingComplete}
                onComplete={() => setTypingComplete(true)}
              />
            </p>
          )}
        </div>

        {/* QTE Quick-Time Event Bar for Sudden Air Raids */}
        {isQte && (
          <div className="vn-qte-action-bar" onClick={(e) => e.stopPropagation()}>
            <div className="qte-timer-pill">
              <span className="qte-num">{qteLeft}</span>
              <span className="qte-sec">秒</span>
            </div>
            <div className="qte-prompt">
              <b>{qte?.prompt}</b>
              <p>敵機空襲警報呼嘯！全體師生立即避險！</p>
            </div>
            <button
              className="vn-qte-action-btn"
              disabled={qteDone}
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                setQteDone(true);
                sound.playSealStamp();
                onChoice(
                  choices[0] ?? {
                    label: qte?.action ?? "隱蔽成功",
                    effects: {},
                  },
                );
              }}
            >
              {qteDone ? "已落位避險" : (qte?.action ?? "立即隱蔽！")}
            </button>
          </div>
        )}

        {/* Decision Slips / Choices List (Only when dialogue finishes) */}
        {!isQte &&
          hasMultipleChoices &&
          typingComplete &&
          !inDialogue &&
          !resolutionStage && (
            <div className="vn-choices-deck" onClick={(e) => e.stopPropagation()}>
              <div className="choices-prompt-tag">請定奪本節決策手令（按數字鍵或點擊）：</div>
              <div className="choices-grid">
                {choices.map((choice, index) => (
                  <button
                    key={`${choice.label}-${index}`}
                    className="vn-choice-slip"
                    onClick={() => handleSelectChoice(choice)}
                  >
                    <span className="choice-number">
                      {["甲", "乙", "丙", "丁"][index] ?? String(index + 1)}
                    </span>
                    <div className="choice-body">
                      <b className="choice-text">{choice.label}</b>
                      {choice.note && <span className="choice-note">{choice.note}</span>}
                    </div>
                    <span className="choice-seal-stamp">擬定</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Continuation Prompt when dialogue turns or non-interactive text completes */}
        {inDialogue && typingComplete && (
          <div className="vn-advance-prompt" onClick={handleAdvanceOrSkip}>
            <span>點擊任意處、按空格或回車 推進對白（{dialogueIndex + 1}/{dialogues.length}）➔</span>
          </div>
        )}

        {!inDialogue && !resolutionStage && autoAdvance && typingComplete && (
          <div className="vn-advance-prompt" onClick={handleAdvanceOrSkip}>
            <span>點擊任意處、按空格或回車 繼續閱歷 ➔</span>
          </div>
        )}

        {/* Progress Footer Dots */}
        <div className="vn-progress-deck" aria-hidden="true">
          <div className="progress-track">
            <i
              style={{
                width: `${((session.queueIndex + 1) / Math.max(session.queue.length, 1)) * 100}%`,
              }}
            />
          </div>
          <span className="progress-fraction">
            {session.queueIndex + 1} / {session.queue.length}
          </span>
        </div>
      </div>

      {/* Major Historical Decree Vermilion Seal Slam Modal Overlay */}
      {stampOverlay && (
        <div className="vn-decree-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="decree-stamp-modal">
            <div className="decree-seal-box">
              <span className="seal-outer-frame">
                <span className="seal-inner-frame">
                  <b className="decree-seal-text">{stampOverlay.seal}</b>
                </span>
              </span>
            </div>
            <h3 className="decree-title">{stampOverlay.title}</h3>
            <p className="decree-subtitle">{stampOverlay.subtitle}</p>
            <div className="decree-tag">
              <span className="decree-ink-dot">●</span> 史實手令銘刻
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
