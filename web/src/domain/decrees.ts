export interface DecreeStamp {
  seal: string;
  title: string;
  subtitle: string;
}

/** Historical choice markers shown after a consequential decision. */
export const DECREE_STAMPS: Record<string, DecreeStamp> = {
  siku: {
    seal: "文澜护典",
    title: "文澜四库 · 保全手令",
    subtitle: "「典籍在，文脉存；千秋文澜，誓死护送」",
  },
  dike: {
    seal: "上田筑堤",
    title: "浙大长堤 · 防洪安民手令",
    subtitle: "「工院技术，修筑安澜；军民同心，泽被后世」",
  },
  anthem: {
    seal: "校歌",
    title: "求是校歌 · 马一浮手稿立案",
    subtitle: "「大不自多，海纳江河；求是校歌，唱彻黔桂」",
  },
  memorial: {
    seal: "松山沉哀",
    title: "松山之痛 · 张侠魂追悼手令",
    subtitle: "「国尔忘家，公而忘私；素车白马，永铭松山」",
  },
  debate: {
    seal: "校训",
    title: "求是校训 · 校务会议定案",
    subtitle: "「无求是难以立学，无创新难以图强」",
  },
  doubt: {
    seal: "文军先遣",
    title: "江干启运 · 新生先遣手令",
    subtitle: "「天目深山，保全火种；先遣列队，从容启行」",
  },
  cambridge: {
    seal: "剑桥",
    title: "东方剑桥 · 战时科学高峰铭刻",
    subtitle: "「李约瑟赞誉：战火中的奇迹，东方之剑桥」",
  },
};
