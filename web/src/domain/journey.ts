export interface JourneyLeg {
  fromName: string;
  toName: string;
  period: string;
  distance: string;
  epigraph: string;
  seal: string;
  provinceRoute: string;
}

export const JOURNEY_LEGS: Record<string, JourneyLeg> = {
  "prologue-hangzhou": {
    fromName: "杭州孤山与江干",
    toName: "序章 · 杭州启程",
    period: "民国二十六年秋 · 一九三七年九月",
    distance: "淞沪告急 · 临危谋定",
    epigraph: "「淞沪会战爆发，杭州告急。竺可桢校长决定将新生迁往天目山，开启文军长征。」",
    seal: "起行",
    provinceRoute: "浙江 · 杭嘉湖平原",
  },
  "01-xitianmushan": {
    fromName: "杭州江干码头",
    toName: "西天目山 · 禅源寺",
    period: "民国二十六年秋 · 一九三七年九月",
    distance: "步车兼行 · 百余公里",
    epigraph: "「借禅源寺古刹余屋设绛帐。导师制在此首创，教授与学子共围一盏油灯。」",
    seal: "禅源",
    provinceRoute: "浙江 · 浙西天目山区",
  },
  "02-jiande": {
    fromName: "西天目山",
    toName: "建德 · 梅城",
    period: "民国二十六年冬 · 一九三七年十一月",
    distance: "江干三批登舟 · 水陆转进",
    epigraph: "「携图书仪器七百余箱，文澜阁《四库全书》百三十九箱。每晚收听战况，创办《浙大日报》。」",
    seal: "严陵",
    provinceRoute: "浙江 · 新安江与富春江交汇",
  },
  "03-jian": {
    fromName: "建德梅城",
    toName: "江西 · 吉安",
    period: "民国二十六年底至二十七年初 · 1937—1938",
    distance: "行程七百五十二公里 · 徒步转进",
    epigraph: "「杭州沦陷当日撤离建德，经金华、玉山、樟树抵吉安。时值隆冬，借白鹭洲书院与中学寒舍上课。」",
    seal: "远涉",
    provinceRoute: "浙赣铁路沿线 ➔ 赣江流域",
  },
  "04-taihe": {
    fromName: "吉安白鹭洲",
    toName: "泰和 · 上田村",
    period: "民国二十七年二月 · 一九三八年二月",
    distance: "赣江水路与陆路并行",
    epigraph: "「师生协力修筑浙大长堤以御洪水；设澄江学校与沙村垦殖场。同悼松山张侠魂夫人之痛。」",
    seal: "长堤",
    provinceRoute: "江西 · 吉泰盆地赣江之滨",
  },
  "05-yishan": {
    fromName: "泰和上田",
    toName: "广西 · 宜山",
    period: "民国二十七年八月 · 一九三八年八月",
    distance: "翻越南岭 · 千里跋涉",
    epigraph: "「大不自多，海纳江河。马一浮作校歌，竺可桢定求是校训。战火硝烟中确立浙大立身之本。」",
    seal: "求是",
    provinceRoute: "赣南 ➔ 湘桂山峦 ➔ 黔江之畔",
  },
  "06-zunyi-meitan": {
    fromName: "广西宜山",
    toName: "贵州 · 遵义与湄潭",
    period: "民国二十九年一月 · 一九四〇年一月",
    distance: "跨黔桂关隘 · 驻留七载",
    epigraph: "「破庙与祠堂建成世界级实验室。李约瑟博士赞誉为东方剑桥，在黔北艰苦岁月中弦歌达到极盛。」",
    seal: "剑桥",
    provinceRoute: "黔北高原 · 娄山关南麓",
  },
  "finale-1946": {
    fromName: "贵州遵义湄潭",
    toName: "终章 · 一九四六复员回杭",
    period: "民国三十五年夏秋 · 一九四六年",
    distance: "万里归舟 · 凯旋钱塘",
    epigraph: "「九年流亡，二千六百公里。路还在，学校也还在。全校图书、仪器与师生完整复员杭州！」",
    seal: "重光",
    provinceRoute: "黔 ➔ 湘 ➔ 赣 ➔ 浙 · 钱塘故土",
  },
};

export function getJourneyLeg(nodeId: string): JourneyLeg {
  return (
    JOURNEY_LEGS[nodeId] || {
      fromName: "西迁征途",
      toName: "求是新站",
      period: "抗战西迁时期",
      distance: "沿途跋涉",
      epigraph: "「文军长征，薪火相传。」",
      seal: "长征",
      provinceRoute: "西迁之路",
    }
  );
}
