import avatarZhu from "../assets/avatars/avatar_zhu.jpg";
import avatarShen from "../assets/avatars/avatar_shen.jpg";
import avatarZhou from "../assets/avatars/avatar_zhou.jpg";
import avatarQi from "../assets/avatars/avatar_qi.jpg";
import avatarCheng from "../assets/avatars/avatar_cheng.jpg";

export type CharacterId = "zhu" | "shen" | "zhou" | "qi" | "cheng" | "other";

export const CHARACTER_AVATARS: Record<CharacterId, string | undefined> = {
  zhu: avatarZhu,
  shen: avatarShen,
  zhou: avatarZhou,
  qi: avatarQi,
  cheng: avatarCheng,
  other: undefined,
};

export interface SpeakerInfo {
  name: string;
  badge: string;
  role: string;
  seal?: string;
  kind: "historical" | "fictional" | "narrator" | "urgent";
  characterId?: CharacterId;
  avatar?: string;
}

const SPEAKER_MAP: Record<string, SpeakerInfo> = {
  "hz-01": {
    name: "竺可桢与师生",
    badge: "江干待发",
    role: "国立浙江大学 · 1937年秋",
    seal: "求是",
    kind: "historical",
  },
  "hz-02": {
    name: "老戚与沈砚",
    badge: "装箱押运",
    role: "校工与工科新生 · 图书仪器护送组",
    seal: "典籍",
    kind: "fictional",
  },
  "xm-01": {
    name: "妙定方丈与校方",
    badge: "西天目山",
    role: "禅源寺山门 · 借舍办学",
    seal: "禅源",
    kind: "historical",
  },
  "xm-02": {
    name: "师生夜话",
    badge: "导师首创",
    role: "禅源寺青灯下 · 第一次师生共话",
    seal: "明灯",
    kind: "historical",
  },
  "jd-01": {
    name: "码头运输队",
    badge: "严陵涉水",
    role: "江干三批登舟 · 建德仓促转运",
    seal: "涉渡",
    kind: "fictional",
  },
  "jd-02": {
    name: "浙图代表与浙大",
    badge: "文澜存亡",
    role: "文澜阁《四库全书》139箱紧急护运",
    seal: "文澜",
    kind: "historical",
  },
  "jd-03": {
    name: "《浙大日报》编辑组",
    badge: "战地心声",
    role: "建德梅城 · 收听短波印报",
    seal: "求是报",
    kind: "historical",
  },
  "ja-01": {
    name: "西迁长征队伍",
    badge: "赣江道中",
    role: "金华-玉山-樟树 · 752公里步行转进",
    seal: "远涉",
    kind: "narrator",
  },
  "ja-02": {
    name: "吉安借宿师生",
    badge: "寒冬课读",
    role: "吉安中学与乡村师范借舍",
    seal: "寒窗",
    kind: "fictional",
  },
  "th-01": {
    name: "工院师生与乡民",
    badge: "浙大长堤",
    role: "泰和上田 · 负责筑堤技术与自发捐助",
    seal: "长堤",
    kind: "historical",
  },
  "th-02": {
    name: "竺可桢与全校师生",
    badge: "泰和沉哀",
    role: "松山之痛 · 张侠魂夫人追悼会",
    seal: "沉哀",
    kind: "historical",
  },
  "th-03": {
    name: "农学院师生",
    badge: "垦殖兴学",
    role: "泰和澄江学校 · 沙村垦殖实验场",
    seal: "耕读",
    kind: "historical",
  },
  "ys-01": {
    name: "宿营值守队",
    badge: "边地惊闻",
    role: "宜山临时宿营 · 警惕匪患流言",
    seal: "戒备",
    kind: "fictional",
  },
  "ys-02": {
    name: "马一浮与竺可桢",
    badge: "求是校歌",
    role: "大不自多 海纳江河 · 确立求是校训校歌",
    seal: "求是歌",
    kind: "historical",
  },
  "ys-03": {
    name: "周晚晴与行军学子",
    badge: "街头战声",
    role: "宜山墙头标语 · 民族自强抗战之声",
    seal: "自强",
    kind: "fictional",
  },
  "zy-01": {
    name: "理学院师生",
    badge: "文庙灯火",
    role: "遵义子尹路与湄潭文庙 · 破庙中的世界级研究",
    seal: "求是魂",
    kind: "historical",
  },
  "zy-02": {
    name: "李约瑟与教授群",
    badge: "东方剑桥",
    role: "英国皇家学会科学家李约瑟考察湄潭",
    seal: "剑桥",
    kind: "historical",
  },
  "zy-03": {
    name: "湄潭父老乡亲",
    badge: "鱼米之养",
    role: "黔北民间盛情腾房分粮 · 庇佑求是火种",
    seal: "民德",
    kind: "narrator",
  },
  "re-airraid": {
    name: "空袭告警",
    badge: "急避敌机",
    role: "防空哨示警 · 队伍隐蔽防空沟",
    seal: "警",
    kind: "urgent",
  },
  "re-disease": {
    name: "程小雨与救护组",
    badge: "医药救济",
    role: "农学院学子与随队医护 · 抗疟调药",
    seal: "仁心",
    kind: "fictional",
  },
  "re-traffic": {
    name: "押运队向导",
    badge: "关山阻遏",
    role: "泥泞山道车损 · 进退维谷决断",
    seal: "跋涉",
    kind: "narrator",
  },
  "re-camp": {
    name: "周晚晴与露宿同窗",
    badge: "荒野篝火",
    role: "露宿旷野油布遮风 · 围火温书",
    seal: "夜火",
    kind: "fictional",
  },
  "re-supply": {
    name: "老戚与检点员",
    badge: "箱箧清点",
    role: "校工沿途翻晒图书 · 护持国宝",
    seal: "校籍",
    kind: "fictional",
  },
  "re-aid": {
    name: "黔桂沿线乡绅",
    badge: "义助求是",
    role: "民间乡老馈送干粮蔬果 · 共赴国难",
    seal: "仁风",
    kind: "narrator",
  },
};

export function getSpeakerInfo(eventId?: string, fallbackTitle?: string): SpeakerInfo {
  if (eventId && SPEAKER_MAP[eventId]) {
    return SPEAKER_MAP[eventId];
  }
  return {
    name: fallbackTitle || "西迁史记",
    badge: "求是纪事",
    role: "国立浙江大学西迁备忘录",
    seal: "浙大",
    kind: "narrator",
  };
}

export function resolveDialogueSpeaker(name: string, role?: string): SpeakerInfo {
  if (name.includes("沈砚")) {
    return {
      name: "沈砚",
      badge: "工科学子",
      role: role || "工学院一年级 · 管仪器",
      seal: "沈",
      kind: "fictional",
      characterId: "shen",
      avatar: CHARACTER_AVATARS.shen,
    };
  }
  if (name.includes("周晚晴")) {
    return {
      name: "周晚晴",
      badge: "文科学子",
      role: role || "文学院一年级 · 抄谱记史",
      seal: "周",
      kind: "fictional",
      characterId: "zhou",
      avatar: CHARACTER_AVATARS.zhou,
    };
  }
  if (name.includes("老戚")) {
    return {
      name: "老戚",
      badge: "护箱技师",
      role: role || "45岁校工 · 管图书箱",
      seal: "戚",
      kind: "fictional",
      characterId: "qi",
      avatar: CHARACTER_AVATARS.qi,
    };
  }
  if (name.includes("程小雨")) {
    return {
      name: "程小雨",
      badge: "农科学子",
      role: role || "农学院一年级 · 养蚕做标本",
      seal: "程",
      kind: "fictional",
      characterId: "cheng",
      avatar: CHARACTER_AVATARS.cheng,
    };
  }
  if (name.includes("竺可桢") || name.includes("竺校长")) {
    return {
      name: "竺可桢",
      badge: "求是校长",
      role: role || "国立浙江大学校长（史实言行）",
      seal: "竺",
      kind: "historical",
      characterId: "zhu",
      avatar: CHARACTER_AVATARS.zhu,
    };
  }
  if (name.includes("李约瑟")) {
    return {
      name: "李约瑟",
      badge: "剑桥使者",
      role: role || "英国皇家学会会员 / 科学史家（史实考察）",
      seal: "李",
      kind: "historical",
    };
  }
  if (name.includes("妙定")) {
    return {
      name: "妙定方丈",
      badge: "古刹方丈",
      role: role || "禅源寺主持（史料记事）",
      seal: "妙",
      kind: "historical",
    };
  }
  return {
    name,
    badge: "行军见闻",
    role: role || "亲历者述评",
    seal: name.slice(0, 1),
    kind: "narrator",
  };
}
