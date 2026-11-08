import type { Storyline } from "../../domain/content";

export const STORYLINE_CONFIG: Storyline["config"] = {
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
    note: "不做 Game Over，与「主线结局固定」一致",
  },
};

export const STORYLINE_CAST: Storyline["cast"] = {
  fictional: [
    {
      id: "shen-yan",
      name: "沈砚",
      role: "工学院一年级 · 管仪器",
      bonus: "仪器类事件加成",
    },
    {
      id: "zhou-wanqing",
      name: "周晚晴",
      role: "文学院一年级 · 抄谱记日记",
      bonus: "士气类事件加成；宜山校歌线关键",
    },
    {
      id: "lao-qi",
      name: "老戚",
      role: "45 岁校工 · 管图书箱",
      bonus: "图书类事件加成",
    },
    {
      id: "cheng-xiaoyu",
      name: "程小雨",
      role: "农学院一年级 · 养蚕做标本",
      bonus: "疾病/健康类事件加成",
    },
  ],
  historical: [
    "竺可桢",
    "马一浮",
    "妙定（禅源寺方丈）",
    "苏步青",
    "王淦昌",
    "谈家桢",
    "李约瑟",
  ],
};
