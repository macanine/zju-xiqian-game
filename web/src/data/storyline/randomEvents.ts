import type { RandomEvent } from "../../domain/content";

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: "re-airraid",
    name: "空袭警报",
    weight: 1.0,
    qte: {
      windowSeconds: 3,
      prompt: "敌机空袭！师生紧急疏散至路旁沟渠",
      action: "点击「隐蔽」",
    },
    text: "尖锐的警报声。屏幕在震。",
    choices: [
      { label: "隐蔽成功", effects: {} },
      {
        label: "隐蔽失败",
        effects: { supplies: -1 },
        fallbackEffects: { health: -10 },
        note: "图书仪器 > 0 时扣 supplies；已为 0 时改扣 health",
      },
    ],
  },
  {
    id: "re-disease",
    name: "疾病侵袭",
    weight: 1.0,
    weightOverrides: { "05-yishan": 3.0 },
    text: "「有同学感染了疟疾，高烧不退。」",
    choices: [
      { label: "用学校备药", effects: { ration: -2, health: 5 } },
      {
        label: "寻找当地草药",
        outcomes: [
          { weight: 50, effects: { health: 10 } },
          { weight: 50, effects: { health: -10 } },
        ],
      },
    ],
  },
  {
    id: "re-traffic",
    name: "交通堵塞 / 车辆故障",
    weight: 1.0,
    text: "车坏了，或者路堵死了。消耗口粮后继续前行。",
    choices: [
      {
        label: "等待修理",
        effects: { ration: -2 },
      },
      {
        label: "改走水路",
        outcomes: [
          { weight: 30, effects: { supplies: -2 } },
          { weight: 70, effects: {} },
        ],
      },
    ],
  },
  {
    id: "re-camp",
    name: "露宿荒野",
    weight: 1.0,
    text: "师生露宿荒野，以油布遮风。",
    choices: [
      {
        label: "生火取暖",
        effects: { health: 5 },
        outcomes: [
          { weight: 30, effects: { morale: -5 } },
          { weight: 70, effects: {} },
        ],
      },
      { label: "轮流值守", effects: { health: -5, morale: 10 } },
    ],
  },
  {
    id: "re-supply",
    name: "物资短缺",
    weight: 1.0,
    text: "图书仪器是西迁中重点保护的对象。",
    choices: [],
    autoOutcomes: [
      { weight: 60, effects: {} },
      { weight: 40, effects: { supplies: -1 } },
    ],
  },
  {
    id: "re-aid",
    name: "当地援助",
    weight: 1.0,
    weightOverrides: { "06-zunyi-meitan": 2.0 },
    text: "湄潭百姓腾让出最好的房子，供给鱼米。",
    choices: [
      {
        label: "道谢并收下",
        effects: { ration: 3, morale: 10, health: 10 },
      },
    ],
  },
];
