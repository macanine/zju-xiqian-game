import type { Effects } from "./content";

export interface PassportStamp {
  id: string;
  stationName: string;
  sealName: string;
  sealChar: string;
  period: string;
  epigraph: string;
  unlockedAtOrder: number;
}

export interface WaypointStory {
  id: string;
  name: string;
  stationNear: string;
  coord: { x: number; y: number };
  title: string;
  snippet: string;
  fullStory: string;
  bonus: { label: string; effect: string; effects?: Effects };
  sealChar: string;
}

export const PASSPORT_STAMPS: PassportStamp[] = [
  {
    id: "stamp-hangzhou",
    stationName: "序章 · 杭州",
    sealName: "钱塘启行 · 杭县关防",
    sealChar: "启",
    period: "1937年9月",
    epigraph: "淞沪会战炮火连天，全校师生由江干码头登舟，离别西子湖畔，播迁文军火种。",
    unlockedAtOrder: 0,
  },
  {
    id: "stamp-xitianmushan",
    stationName: "第一站 · 西天目山",
    sealName: "禅源古刹 · 借舍弦诵",
    sealChar: "禅",
    period: "1937年9月—11月",
    epigraph: "妙定方丈腾出空房安顿一年级新生；师友围坐桐油灯下，导师制于此首创推行。",
    unlockedAtOrder: 1,
  },
  {
    id: "stamp-jiande",
    stationName: "第二站 · 建德",
    sealName: "严陵急渡 · 四库同舟",
    sealChar: "严",
    period: "1937年11月—12月",
    epigraph: "携带七百余箱图书仪器与文澜阁《四库全书》百三十九箱。每晚收听战况，创办《浙大日报》。",
    unlockedAtOrder: 2,
  },
  {
    id: "stamp-jian",
    stationName: "第三站 · 吉安",
    sealName: "白鹭长歌 · 赣江远涉",
    sealChar: "涉",
    period: "1938年1月—2月",
    epigraph: "严冬徒步七百五十二公里，沿途冒敌机轰炸；借乡村师范与吉安中学寒假校舍上课。",
    unlockedAtOrder: 3,
  },
  {
    id: "stamp-taihe",
    stationName: "第四站 · 泰和",
    sealName: "澄江安澜 · 浙大长堤",
    sealChar: "堤",
    period: "1938年2月—8月",
    epigraph: "工院师生负责技术筑成防洪大堤；设澄江学校与沙村垦殖场；全校沉哀追悼张侠魂师母。",
    unlockedAtOrder: 4,
  },
  {
    id: "stamp-yishan",
    stationName: "第五站 · 宜山",
    sealName: "国立浙大 · 求是立宪",
    sealChar: "求",
    period: "1938年8月—1940年1月",
    epigraph: "确立「求是」校训；马一浮先生题写校歌「树我邦国，天下来同」；标营惨遭日机猛烈轰炸。",
    unlockedAtOrder: 5,
  },
  {
    id: "stamp-zunyi-meitan",
    stationName: "第六站 · 遵义湄潭",
    sealName: "文庙春秋 · 东方剑桥",
    sealChar: "剑",
    period: "1940年—1946年",
    epigraph: "破庙文庙筑成世界级实验室；坚守黔北七载，李约瑟两度来访赞为「东方剑桥」。",
    unlockedAtOrder: 6,
  },
  {
    id: "stamp-return",
    stationName: "终章 · 复员回杭",
    sealName: "万里归舟 · 钱塘重光",
    sealChar: "光",
    period: "1946年夏秋",
    epigraph: "九年万岁长征，二千六百公里。路还在，学校也还在。师生与全部图书重器完整复员杭州！",
    unlockedAtOrder: 7,
  },
];

export const WAYPOINTS: WaypointStory[] = [
  {
    id: "waypoint-xianghu",
    name: "萧山湘湖",
    stationNear: "杭州 ➔ 天目山",
    coord: { x: 86, y: 39 },
    title: "湘湖农工基地 · 抢运良种标本",
    snippet: "附设高工与农校迁萧山湘湖，保护农业实验桑蚕与水稻良种。",
    fullStory:
      "1937年秋，在主力新生迁往天目山的同时，附设高级工业学校和农业学校迁往萧山县湘湖。农学院师生在日机威胁下抢收了多年培育的优质棉种、良种水稻与珍贵病虫标本，并运至大后方保存，为日后后方垦殖奠定基石。",
    bonus: { label: "收录湘湖农学手札", effect: "口粮 +1", effects: { ration: 1 } },
    sealChar: "农",
  },
  {
    id: "waypoint-jinhua",
    name: "金华转运点",
    stationNear: "建德 ➔ 吉安",
    coord: { x: 73, y: 50 },
    title: "浙赣枢纽 · 车皮与木船的争夺",
    snippet: "金华火车站人潮汹涌，校工老戚与沈砚通宵守候铁道调度车皮。",
    fullStory:
      "浙赣铁路沿线各路难民与溃兵塞满车站。浙大押运队数昼夜守在站台风雨中，凭教育部公函与竺校长的威信，终于协调到数节运煤敞篷车皮。学子们用油布紧紧裹住精密物理天平与天文書籍，在寒风中向玉山开拔。",
    bonus: { label: "收录铁路调度便笺", effect: "士气 +5", effects: { morale: 5 } },
    sealChar: "轨",
  },
  {
    id: "waypoint-zhangshu",
    name: "樟树药市",
    stationNear: "吉安途经地",
    coord: { x: 61, y: 52 },
    title: "药不到樟树不齐 · 救护组采购草药",
    snippet: "程小雨带领救护组深入千年药都，采购常山、柴胡以备沿途疟疾。",
    fullStory:
      "樟树自古为江南药都。时值严冬，师生中冻疮、咳嗽频发。农学院程小雨带领学子寻访老药铺，当地药商得知是浙江大学流亡师生，特意捐赠了大量上等金鸡纳霜代用品与行军干粮，民心向学之情令人泪目。",
    bonus: { label: "收录樟树本草手抄", effect: "队伍健康 +10", effects: { health: 10 } },
    sealChar: "药",
  },
  {
    id: "waypoint-shacun",
    name: "泰和沙村",
    stationNear: "泰和周边",
    coord: { x: 52, y: 68 },
    title: "沙村垦殖场 · 荒滩化为万亩粮仓",
    snippet: "农学院协助地方开辟沙村垦殖场，安置难民并解决师生蔬菜供给。",
    fullStory:
      "在泰和期间，浙大不仅创设澄江学校收容难童，农学院更派出卢守耕、孙稚荪等教授深入沙村荒滩，运用水土保持与土壤改良技术开辟了数千亩垦殖场，传授高产甘蔗与优质稻种植法，成为战时大学反哺地方生产的典范。",
    bonus: { label: "收录沙村屯垦图卷", effect: "口粮 +2", effects: { ration: 2 } },
    sealChar: "垦",
  },
  {
    id: "waypoint-yongxing",
    name: "湄潭永兴",
    stationNear: "遵义湄潭",
    coord: { x: 17, y: 43 },
    title: "永兴分部 · 欧阳翥在茶林间授课",
    snippet: "大一新生在永兴古街安顿，古寺书斋，茶山滴翠，师生如家人。",
    fullStory:
      "1940年起，浙大一年级新生设在距湄潭总校约二十公里的永兴场。欧阳翥等名师在此执教生物学，生物标本摆满了江仙殿与万寿宫。永兴百姓热情朴素，房东常送来山茶与糯米糍粑，弦歌不绝，被誉为最纯粹的书生桃源。",
    bonus: { label: "收录永兴茶山随笔", effect: "士气 +8", effects: { morale: 8 } },
    sealChar: "茶",
  },
];
