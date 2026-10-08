import type {
  Choice,
  Effects,
  RandomEvent,
  ResourceKey,
  Storyline,
} from "./content";

export type Resources = Record<ResourceKey, number>;

export interface Resolution {
  resources: Resources;
  flag?: string;
  effects: Effects;
  log: string;
  forcedRest: boolean;
}

export const RESOURCE_KEYS: ResourceKey[] = [
  "supplies",
  "ration",
  "health",
  "morale",
];

export function initialResources(storyline: Storyline): Resources {
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [key, storyline.config.resources[key].initial]),
  ) as Resources;
}

export function applyEffects(
  current: Resources,
  effects: Effects,
  storyline: Storyline,
): Resources {
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => {
      const config = storyline.config.resources[key];
      return [
        key,
        Math.min(
          config.max,
          Math.max(config.min, current[key] + (effects[key] ?? 0)),
        ),
      ];
    }),
  ) as Resources;
}

function mergeEffects(first: Effects, second: Effects): Effects {
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [
      key,
      (first[key] ?? 0) + (second[key] ?? 0),
    ]).filter(([, value]) => value !== 0),
  );
}

function pickOutcome(
  outcomes: Array<{ weight: number; effects: Effects }>,
  randomValue: number,
): Effects {
  const total = outcomes.reduce((sum, outcome) => sum + outcome.weight, 0);
  if (total <= 0) throw new Error("概率权重总和必须大于 0");
  let cursor = randomValue * total;
  for (const outcome of outcomes) {
    cursor -= outcome.weight;
    if (cursor < 0) return outcome.effects;
  }
  return outcomes[outcomes.length - 1].effects;
}

export function resolveChoice(
  current: Resources,
  choice: Choice,
  storyline: Storyline,
  randomValue = 0.5,
): Resolution {
  let effects = choice.outcomes
    ? pickOutcome(choice.outcomes, randomValue)
    : (choice.effects ?? {});
  const blocked = RESOURCE_KEYS.some((key) => {
    const amount = effects[key] ?? 0;
    return (
      amount < 0 && current[key] + amount < storyline.config.resources[key].min
    );
  });
  if (blocked && choice.fallbackEffects) effects = choice.fallbackEffects;

  let next = applyEffects(current, effects, storyline);
  let forcedRest = false;
  if (next.health <= 0) {
    forcedRest = true;
    next = applyEffects(next, storyline.config.forcedRest.effects, storyline);
  }
  const parts = RESOURCE_KEYS.filter((key) => next[key] !== current[key]).map(
    (key) =>
      `${storyline.config.resources[key].label}${next[key] - current[key] >= 0 ? "+" : ""}${next[key] - current[key]}`,
  );
  return {
    resources: next,
    flag: choice.flag,
    effects: forcedRest
      ? mergeEffects(effects, storyline.config.forcedRest.effects)
      : effects,
    log: parts.join(" · ") || "局面没有变化",
    forcedRest,
  };
}

export function eventWeight(event: RandomEvent, nodeId: string): number {
  return event.weightOverrides?.[nodeId] ?? event.weight;
}

export function selectWeightedEvent(
  events: RandomEvent[],
  nodeId: string,
  randomValue: number,
): RandomEvent {
  const weighted = events
    .map((event) => ({ event, weight: eventWeight(event, nodeId) }))
    .filter((item) => item.weight > 0);
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  if (!weighted.length || total <= 0) throw new Error("没有可用的随机事件");
  let cursor = randomValue * total;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor < 0) return item.event;
  }
  return weighted[weighted.length - 1].event;
}

export function randomAt(seed: number, counter: number): number {
  let state = (seed + counter * 0x9e3779b9) >>> 0;
  state = (1664525 * state + 1013904223) >>> 0;
  return state / 0x100000000;
}

export function calculateEnding(
  storyline: Storyline,
  resources: Resources,
  flags: Set<string>,
): EndResult {
  const preserveRate =
    resources.supplies / storyline.config.resources.supplies.max;
  const values: Record<string, number> = { preserveRate, ...resources };
  const cards = [...storyline.endings.character.cards].sort(
    (a, b) => a.priority - b.priority,
  );
  const card =
    cards.find(
      (candidate) =>
        candidate.condition === "default" ||
        evaluateCondition(candidate.condition, values, flags),
    ) ?? cards[cards.length - 1];
  const fragments = storyline.endings.epilogueFragments.fragments.filter(
    (fragment) => flags.has(fragment.flag),
  );
  return { card, fragments, preserveRate };
}

function evaluateCondition(
  condition: string,
  values: Record<string, number>,
  flags: Set<string>,
): boolean {
  return condition.split("&&").every((part) => {
    const expression = part.trim();
    const flagMatch = expression.match(/^flag\(([^)]+)\)$/);
    if (flagMatch) return flags.has(flagMatch[1]);
    const valueMatch = expression.match(
      /^([a-zA-Z]+)\s*(>=|<=|>|<|===|==)\s*([0-9.]+)$/,
    );
    if (!valueMatch) return false;
    const [, key, operator, raw] = valueMatch;
    const actual = values[key];
    const expected = Number(raw);
    if (actual === undefined) return false;
    if (operator === ">=" || operator === "===" || operator === "==")
      return actual >= expected;
    if (operator === "<=") return actual <= expected;
    if (operator === ">") return actual > expected;
    return actual < expected;
  });
}

export interface EndResult {
  card: Storyline["endings"]["character"]["cards"][number];
  fragments: Storyline["endings"]["epilogueFragments"]["fragments"];
  preserveRate: number;
}
