import type { SitesData } from "../domain/content";

export const SITES_DATA: SitesData = {
  sites: [
    {
      id: "01-xitianmushan",
      order: 1,
      name: "西天目山·禅源寺",
      place: "浙江省临安市西天目山禅源寺",
      period: { start: "1937-09", end: "1937-11", label: "1937年9月" },
      summary:
        "1937年9月，淞沪会战爆发后杭州告急。竺可桢校长决定将一年级新生迁往西天目山禅源寺上课，同时将附设的高级工业职业学校和农业职业学校迁往萧山县湘湖。",
      events: [
        { date: "1937-09-14", text: "竺可桢与禅源寺方丈妙定商定租借寺院余屋" },
        { date: "1937-09-24", text: "一年级新生迁至禅源寺" },
      ],
      tags: ["禅源寺", "一年级新生", "竺可桢"],
      images: ["images/01_xitianmushan_01_zenyuan_temple_gate_1937_autumn.png"],
    },
    {
      id: "02-jiande",
      order: 2,
      name: "建德",
      place: "浙江省建德县梅城镇",
      period: { start: "1937-11", end: "1937-12", label: "1937年11月" },
      summary:
        "1937年11月5日，日军在距杭州仅100多公里的金山卫登陆，浙大决定迁校建德（今梅城镇）。11月11日起，师生分三批从江干码头乘船出发，于15日全部到达建德。",
      events: [
        { date: "1937-11-05", text: "日军金山卫登陆，杭州告急，决定迁校建德" },
        { date: "1937-11-11", text: "师生分三批自江干码头乘船出发" },
        { date: "1937-11-15", text: "师生全部到达建德" },
      ],
      tags: ["江干码头", "四库全书", "浙大日报", "金山卫登陆"],
      images: [
        "images/02_jiande_01_jianggan_wharf_departure_1937_nov.png",
        "images/02_jiande_02_carrying_books_and_instruments.png",
        "images/02_jiande_03_first_move_and_siku_protection.jpg",
      ],
    },
    {
      id: "03-jian",
      order: 3,
      name: "吉安",
      place: "江西省吉安县",
      period: {
        start: "1937-12-24",
        end: "1938-01-20",
        label: "1937年12月—1938年1月",
      },
      summary:
        "1937年12月24日，即杭州沦陷之日，浙大开始撤离建德，经金华、玉山、樟树，行程752公里，于1938年1月20日抵达江西吉安。利用乡村师范和吉安中学放寒假期间，学校借屋上课。图书仪器则沿赣江等水路入赣。",
      events: [
        { date: "1937-12-24", text: "杭州沦陷当日，浙大开始撤离建德" },
        { date: "1938-01-20", text: "抵达江西吉安" },
      ],
      tags: ["金华", "玉山", "樟树", "赣江水路"],
      images: [],
    },
    {
      id: "04-taihe",
      order: 4,
      name: "泰和",
      place: "江西省泰和县上田村",
      period: { start: "1938-02-18", end: "1938-08", label: "1938年2月—8月" },
      summary:
        "1938年2月中旬，吉安中学与乡村师范寒假期满，浙大师生于2月18日由水路和陆路迁移到泰和，临时校址设在上田村。",
      events: [
        {
          date: "1938-02-18",
          text: "师生由水路和陆路迁抵泰和，临时校址设在上田村",
        },
        {
          date: "1938-07-23",
          text: "竺可桢在桂林考察时接电报催其返回泰和；次子竺衡已因痢疾去世，年仅12岁",
        },
        { date: "1938-09-15", text: "夫人张侠魂与次子竺衡葬于泰和松山" },
      ],
      tags: [
        "上田村",
        "防洪大堤",
        "澄江学校",
        "沙村垦殖场",
        "竺衡",
        "张侠魂",
      ],
      images: [
        "images/04_taihe_01_second_move_and_taihe_tragedy.jpg",
        "images/04_taihe_02_zhu_kezhen_fountain_pen_and_taihe_history.jpg",
      ],
    },
    {
      id: "05-yishan",
      order: 5,
      name: "宜山",
      place: "广西省宜山县（今河池市宜州区）",
      period: {
        start: "1938-08-13",
        end: "1939-12",
        label: "1938年8月—1939年12月",
      },
      summary:
        "1938年7月，赣北战事剧烈，浙大决定再迁广西宜山。8月13日起分批出发，图书仪器沿赣粤间水路入桂，师生循赣湘公路、湘桂铁路西行。11月1日，浙江大学在广西宜山开学上课。以原工读学校为总办公室，以文庙、湖广会馆为礼堂、教室，并在东门外标营搭盖草屋为临时教室和学生宿舍。",
      events: [
        { date: "1938-08-13", text: "分批出发西行入桂" },
        {
          date: "1938-11-01",
          text: "在宜山开学上课；竺可桢作《王阳明与大学生的典范》演讲，提出以「求是」二字为校训",
        },
        {
          date: "1938-11-19",
          text: "校务会议正式通过，确定「求是」为浙江大学校训；同时请马一浮撰写校歌歌词",
        },
        { date: "1939-02", text: "18架日机对宜山狂轰滥炸，标营校舍遭猛烈轰炸" },
      ],
      tags: [
        "求是校训",
        "马一浮",
        "校歌",
        "标营",
        "文庙",
        "湖广会馆",
        "日机轰炸",
      ],
      images: [
        "images/05_yishan_01_third_move_and_air_raids.jpg",
        "images/05_yishan_02_migration_bell_and_zhu_inscription.jpg",
        "images/05_yishan_03_motto_and_anthem_ma_yifu.jpg",
        "images/05_yishan_04_university_anthem_manuscript.jpg",
      ],
    },
    {
      id: "06-zunyi-meitan",
      order: 6,
      name: "遵义·湄潭·永兴",
      place: "贵州省遵义、湄潭、永兴",
      period: {
        start: "1939-12-13",
        end: "1940-02",
        label: "1939年12月—1940年2月",
      },
      summary:
        "1939年11月，日军在广西南部沿海登陆，学校又一次决定迁校，派人去云贵勘察校址，定为迁往贵州遵义、湄潭。12月13日启程，次年2月抵达黔北，在遵义、湄潭、永兴三地安定下来，坚持办学。",
      events: [
        { date: "1939-11", text: "日军在广西南部沿海登陆，决定再迁" },
        { date: "1939-12-13", text: "启程西行" },
        { date: "1940-02", text: "抵达黔北，落脚遵义、湄潭、永兴三地" },
      ],
      tags: ["遵义", "湄潭", "永兴", "黔北"],
      images: [
        "images/06_guizhou_01_fourth_move_to_zunyi_meitan.jpg",
        "images/06_guizhou_02_staff_students_and_meitan_history.jpg",
        "images/06_guizhou_03_zunyi_history_wall.jpg",
        "images/06_guizhou_04_student_records_and_gradebooks.jpg",
        "images/06_guizhou_05_tung_oil_lamp_and_temple_tiles.jpg",
      ],
    },
    {
      id: "07-guizhou-7years",
      order: 7,
      name: "贵州办学七年与复员回杭",
      place: "贵州省遵义、湄潭、永兴",
      period: { start: "1940", end: "1946", label: "1940年—1946年" },
      summary:
        "1940年初，浙江大学抵达贵州遵义、湄潭、永兴三地，在此办学七年。大一新生在湄潭永兴，大二以上老生在遵义。理学院、农学院和师范学院的理组先后迁到湄潭，湄潭文庙成为办公室和图书馆所在地。",
      events: [
        {
          date: "1940",
          text: "抵达遵义、湄潭、永兴，开始为期七年的办学",
        },
        { date: "1944-04", text: "李约瑟首次访问遵义、湄潭的浙大" },
        { date: "1944-10", text: "李约瑟再次访问" },
        { date: "1945-10", text: "龙泉分校师生率先启程回杭" },
        { date: "1945-11", text: "龙泉分校在杭复课" },
        {
          date: "1946-05-07",
          text: "遵义总校开始分批回杭，改遵义校址为留守处",
        },
        { date: "1946", text: "秋，浙江大学全面复员杭州" },
      ],
      tags: [
        "湄潭文庙",
        "永兴",
        "万寿宫",
        "江西会馆",
        "东方剑桥",
        "李约瑟",
        "复员东归",
        "龙泉分校",
      ],
      images: [
        "images/07_guizhou_01_jiangxi_guild_hall_wanshou_palace.jpg",
        "images/07_guizhou_02_zunyi_campus_gate.jpg",
        "images/07_guizhou_03_academicians_photo_wall.jpg",
        "images/07_guizhou_04_migration_achievements.jpg",
        "images/07_guizhou_05_campus_reconstruction_and_return.jpg",
      ],
    },
  ],
  galleries: [
    {
      id: "g-achievements-teachers",
      name: "办学成就与名师（专题，非迁校站点）",
      period: "1937—1946（西迁全程）",
      summary:
        "西迁办学成果、师资与人物专题：办学规模扩大、研究院所、聘请名师、竺可桢校长，以及「躲避轰炸的山洞课堂」场景复原。",
      images: [
        {
          path: "images/08_achievements_01_colleges_and_research_units.jpg",
          caption: "办学规模扩大、研究院所一览、在校生与毕业生统计",
        },
        {
          path: "images/08_achievements_02_social_science_scholars.jpg",
          caption: "浙大西迁时期的社科名家",
        },
        {
          path: "images/08_achievements_03_cave_classroom_scene.jpg",
          caption: "躲避轰炸的山洞课堂（场景复原）",
        },
        {
          path: "images/08_achievements_04_national_zju_under_zhu.jpg",
          caption: "竺可桢校长时期的国立浙江大学",
        },
        {
          path: "images/08_achievements_05_westward_migration_teachers_wall.jpg",
          caption: "聘请名师（名师墙）",
        },
      ],
    },
  ],
};
