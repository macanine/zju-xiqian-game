import { describe, expect, it } from "vitest";
import { getSpeakerInfo } from "./speakers";
import { sound } from "./audio";
import { initialResources, resolveChoice, calculateEnding } from "./rules";
import type { Storyline } from "./content";

describe("Visual Novel Speakers & Audio", () => {
  it("resolves historical and fictional speakers correctly", () => {
    const zhu = getSpeakerInfo("hz-01");
    expect(zhu.name).toContain("竺可桢");
    expect(zhu.kind).toBe("historical");
    expect(zhu.seal).toBe("求是");

    const mayifu = getSpeakerInfo("ys-02");
    expect(mayifu.name).toContain("马一浮");
    expect(mayifu.kind).toBe("historical");

    const airraid = getSpeakerInfo("re-airraid");
    expect(airraid.badge).toBe("急避敌机");
    expect(airraid.kind).toBe("urgent");

    const fallback = getSpeakerInfo("unknown-id", "沿途记事");
    expect(fallback.name).toBe("沿途记事");
    expect(fallback.kind).toBe("narrator");
  });

  it("resolves multi-turn dialogue speakers accurately", async () => {
    const { resolveDialogueSpeaker } = await import("./speakers");
    const shen = resolveDialogueSpeaker("沈砚", "文理学院学生");
    expect(shen.name).toBe("沈砚");
    expect(shen.seal).toBe("沈");
    expect(shen.kind).toBe("fictional");

    const laoQi = resolveDialogueSpeaker("老戚", "后勤校工");
    expect(laoQi.name).toBe("老戚");
    expect(laoQi.seal).toBe("戚");

    const zhu = resolveDialogueSpeaker("竺可桢", "校长");
    expect(zhu.name).toBe("竺可桢");
    expect(zhu.seal).toBe("竺");
    expect(zhu.kind).toBe("historical");
  });

  it("provides complete passport stamps and waypoint detours", async () => {
    const { PASSPORT_STAMPS, WAYPOINTS } = await import("./passport");
    expect(PASSPORT_STAMPS.length).toBe(8);
    expect(PASSPORT_STAMPS[0].sealName).toContain("启行");
    expect(PASSPORT_STAMPS[7].sealName).toContain("归舟");

    expect(WAYPOINTS.length).toBe(5);
    const xianghu = WAYPOINTS.find((w) => w.id === "waypoint-xianghu");
    expect(xianghu).toBeDefined();
    expect(xianghu?.title).toContain("湘湖农工基地");
    expect(xianghu?.bonus.label).toContain("湘湖");
  });

  it("handles sound toggle state safely", () => {
    expect(sound.enabled).toBe(true);
    sound.enabled = false;
    expect(sound.enabled).toBe(false);
    // Should not throw even if Web Audio is suspended or disabled in test runner
    expect(() => sound.playTypeTick()).not.toThrow();
    expect(() => sound.playPageTurn()).not.toThrow();
    expect(() => sound.playSealStamp()).not.toThrow();
    expect(() => sound.playAlert()).not.toThrow();
    expect(() => sound.playMarchChime()).not.toThrow();
    sound.enabled = true;
  });

  it("resolves journey migration legs accurately", async () => {
    const { getJourneyLeg } = await import("./journey");
    const hangzhouLeg = getJourneyLeg("prologue-hangzhou");
    expect(hangzhouLeg.toName).toContain("杭州启程");
    expect(hangzhouLeg.seal).toBe("起行");

    const taiheLeg = getJourneyLeg("04-taihe");
    expect(taiheLeg.toName).toContain("泰和");
    expect(taiheLeg.seal).toBe("长堤");
    expect(taiheLeg.epigraph).toContain("浙大长堤");

    const zunyiLeg = getJourneyLeg("06-zunyi-meitan");
    expect(zunyiLeg.seal).toBe("剑桥");
    expect(zunyiLeg.epigraph).toContain("东方剑桥");
  });
});

describe("Visual Novel Narrative & Rules", () => {
  const mockStoryline: Storyline = {
    config: {
      resources: {
        supplies: { label: "图书仪器", initial: 25, min: 0, max: 25 },
        ration: { label: "口粮", initial: 12, min: 0, max: 20 },
        health: { label: "队伍健康", initial: 100, min: 0, max: 100 },
        morale: { label: "士气", initial: 60, min: 0, max: 100 },
      },
      travel: {
        rationPerLeg: -1,
        healthPerNode: -5,
        randomEventChancePerLeg: 0.35,
      },
      forcedRest: {
        effects: { health: 40, ration: -3, morale: -10 },
        skipLegs: 2,
        note: "休整",
      },
    },
    cast: { fictional: [], historical: [] },
    nodes: [],
    randomEvents: [],
    endings: {
      main: {
        id: "main",
        isFixed: true,
        title: "复员回杭",
        lines: ["一九四六年夏，回到了杭州。"],
      },
      character: {
        _rule: "priority",
        cards: [
          {
            priority: 1,
            id: "card-high",
            title: "弦歌不绝",
            condition: "supplies >= 20 && morale >= 70",
            tone: "文军长征的奇迹",
          },
          {
            priority: 99,
            id: "card-default",
            title: "烽火薪传",
            condition: "default",
            tone: "守住求是火种",
          },
        ],
      },
      epilogueFragments: {
        _rule: "flags",
        fragments: [{ flag: "siku", text: "文澜阁四库全书安然还杭。" }],
      },
    },
  };

  it("calculates initial resources and choice effects", () => {
    const res = initialResources(mockStoryline);
    expect(res.supplies).toBe(25);
    expect(res.ration).toBe(12);

    const step = resolveChoice(
      res,
      { label: "运送四库全书", effects: { supplies: -1, morale: 15 }, flag: "siku" },
      mockStoryline,
    );
    expect(step.resources.supplies).toBe(24);
    expect(step.resources.morale).toBe(75);
    expect(step.flag).toBe("siku");
  });

  it("evaluates ending conditions and epilogue fragments", () => {
    const res = initialResources(mockStoryline);
    const flags = new Set(["siku"]);
    const ending = calculateEnding(mockStoryline, { ...res, morale: 75 }, flags);

    expect(ending.card.id).toBe("card-high");
    expect(ending.card.title).toBe("弦歌不绝");
    expect(ending.fragments.length).toBe(1);
    expect(ending.fragments[0].flag).toBe("siku");
  });

  it("verifies hz-02 and all multi-choice events have rich choices and are registered as decisions", async () => {
    const { CONTENT_BUNDLE } = await import("../data");
    const decisionIds = new Set(CONTENT_BUNDLE.storyline.config.decisionEventIds ?? []);

    const hangzhou = CONTENT_BUNDLE.storyline.nodes.find((n) => n.id === "prologue-hangzhou");
    expect(hangzhou).toBeDefined();

    const hz02 = hangzhou?.locationEvents?.find((e) => e.id === "hz-02");
    expect(hz02).toBeDefined();
    expect(hz02?.choices.length).toBe(2);
    expect(decisionIds.has("hz-02")).toBe(true);
    expect(hz02?.dialogues && hz02.dialogues.length > 0).toBe(true);

    // Verify all multi-choice location events are in decisionIds and have resolution texts
    for (const node of CONTENT_BUNDLE.storyline.nodes) {
      for (const event of node.locationEvents ?? []) {
        if (event.choices.length > 1) {
          expect(decisionIds.has(event.id)).toBe(true);
          for (const choice of event.choices) {
            expect(choice.label).toBeTruthy();
            expect(choice.resolution).toBeTruthy();
          }
        }
      }
    }
  });

  it("initializes session state and validates decision event helper", async () => {
    const { CONTENT_BUNDLE } = await import("../data");
    const { newSession, isDecisionEvent, FLAG_LABELS, resourceLabels } =
      await import("./session");

    const session = newSession(CONTENT_BUNDLE);
    expect(session.seed).toBe(19370924);
    expect(session.nodeIndex).toBe(0);
    expect(session.resources.supplies).toBe(25);
    expect(session.flags.size).toBe(0);

    expect(isDecisionEvent(CONTENT_BUNDLE, "hz-01")).toBe(true);
    expect(isDecisionEvent(CONTENT_BUNDLE, "hz-02")).toBe(true);
    expect(FLAG_LABELS["siku"]).toContain("文瀾");
    expect(resourceLabels.supplies.seal).toBe("典");
  });
});

