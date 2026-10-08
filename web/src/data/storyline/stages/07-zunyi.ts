import type { StoryNode } from "../../../domain/content";

export const zunyiMeitanNode: StoryNode = {
  id: "06-zunyi-meitan",
  order: 6,
  name: "遵义 / 湄潭 / 永兴",
  period: { label: "1940年—1946年", start: "1940", end: "1946" },
  summary:
    "办学七年。大一新生在湄潭永兴，大二以上老生在遵义；湄潭文庙成为办公室与图书馆。李约瑟誉「东方剑桥」。",
  facts: [
    "1940年初抵达黔北，在遵义、湄潭、永兴三地安顿，坚持办学七年。",
    "湄潭文庙成为办公室和图书馆所在地。",
    "教学质量居西迁大学之首。",
    "1944年4月、10月，李约瑟两次访问遵义、湄潭，誉之为「东方剑桥」，并写道「在重庆与贵阳之间叫遵义的小城里，可以找到浙江大学，是中国最好的四所大学之一」。",
    "在浙大西迁至湄潭工作学习过的院士达50多位。",
    "设计稿补充（待核实）：汇聚苏步青、王淦昌、谈家桢等学者，培养出李政道、程开甲等科学家。",
  ],
  teachingEvents: ["re-aid"],
  images: [
    "images/06_guizhou_01_fourth_move_to_zunyi_meitan.jpg",
    "images/06_guizhou_02_staff_students_and_meitan_history.jpg",
    "images/06_guizhou_03_zunyi_history_wall.jpg",
    "images/06_guizhou_04_student_records_and_gradebooks.jpg",
    "images/06_guizhou_05_tung_oil_lamp_and_temple_tiles.jpg",
    "images/07_guizhou_01_jiangxi_guild_hall_wanshou_palace.jpg",
    "images/07_guizhou_02_zunyi_campus_gate.jpg",
    "images/07_guizhou_03_academicians_photo_wall.jpg",
    "images/07_guizhou_04_migration_achievements.jpg",
    "images/07_guizhou_05_campus_reconstruction_and_return.jpg",
    "images/08_achievements_01_colleges_and_research_units.jpg",
    "images/08_achievements_02_social_science_scholars.jpg",
    "images/08_achievements_03_cave_classroom_scene.jpg",
    "images/08_achievements_04_national_zju_under_zhu.jpg",
    "images/08_achievements_05_westward_migration_teachers_wall.jpg",
  ],
  locationEvents: [
    {
      id: "zy-01",
      title: "黔北弦歌 · 湄潭文庙与永兴",
      text: "一九四零年初，浙大历经两千六百公里艰难跋涉，终抵黔北遵义、湄潭、永兴三地，开启长达七年的办学奇迹。湄潭百姓腾让文庙正殿，安顿文澜阁《四库全书》与七百箱图书仪器。",
      dialogues: [
        {
          speaker: "程小雨",
          role: "农学院一年级",
          text: "湄潭的父老乡亲太淳朴了！不仅把文庙大成殿腾给我们做图书馆，连自家堂屋都让给教授！",
        },
        {
          speaker: "老戚",
          role: "校工技师",
          text: "文庙干燥宽敞，正是安顿《四库全书》与重型仪器的福地。只是乡亲们的春耕稻田人手极缺，农学院是否能搭把手？",
        },
        {
          speaker: "沈砚",
          role: "工学院一年级",
          text: "我们既然要在此扎下根来，这片土地就是我们的第二故乡！",
        },
      ],
      choices: [
        {
          label: "整饬文庙大成殿 · 建立大后方开架图书馆",
          note: "让先圣殿宇重现璀璨书香，万卷图书井然陈列，守护大后方学术命脉",
          effects: { supplies: 2 },
          resolution:
            "湄潭文庙大成殿被改造成浙大典藏图书馆，文澜《四库》安放得当，成为西南大后方最璀璨的文化灯塔。",
        },
        {
          label: "深入永兴田埂助农春耕 · 改良黔北水利茶蚕",
          note: "农工学子投身黔北泥田改良水利肥水，与湄潭百姓休戚与共、患难相恤",
          effects: { morale: 10, ration: 3 },
          resolution:
            "学子们卷起裤腿踏入黔北泥田，以科学农艺助农增产，湄潭百姓视浙大师生如骨肉至亲，鱼米相济。",
        },
      ],
    },
    {
      id: "zy-02",
      title: "东方剑桥 · 李约瑟来访",
      text: "一九四四年，英国皇家学会会员李约瑟博士作为中英科学合作馆馆长，两次远道考察遵义与湄潭。在破庙茅舍中见证世界一流的科学奇迹。",
      dialogues: [
        {
          speaker: "李约瑟",
          role: "剑桥学者（史实记事）",
          text: "「不可思议！在地图上几乎找不到的偏僻山村，在煤油灯与破庙里，竟进行着世界最前沿的实验！这是真正的『东方的剑桥』！」",
        },
        {
          speaker: "沈砚",
          role: "工学院一年级",
          text: "王淦昌先生在破庙里探讨中子核物理，苏步青先生在桐油灯下创立微分几何学派，谈家桢先生在祠堂里做瓢虫遗传实验……",
        },
        {
          speaker: "周晚晴",
          role: "文学院一年级",
          text: "李约瑟博士提出想深入记录浙大的学术奇迹，并询问我们身处绝境却依然穷理求真的根本动力。",
        },
      ],
      choices: [
        {
          label: "引其深入考察破庙与桐油灯下的前沿实验室",
          note: "让西方学界亲见极端困顿中傲然崛起的中国科学奇迹，在国际学坛奠定「东方剑桥」之崇高声誉",
          effects: { morale: 15 },
          flag: "cambridge",
          resolution:
            "李约瑟赞叹不已，回国后公开发表长文，盛赞浙大为『东方的剑桥』，令中国战时科学精神震动世界学坛！",
        },
        {
          label: "向其阐述文澜《四库》与中国古代科技典籍",
          note: "系统阐释中国古代农桑、天文与水利科技的深厚积淀，为其日后《中国科学技术史》奠基",
          effects: { supplies: 1, morale: 10 },
          resolution:
            "师生与李约瑟深入探讨古代科技智慧，为其日后鸿篇巨著《中国科学技术史》提供了关键灵感与实物文献佐证。",
        },
      ],
    },
    {
      id: "zy-03",
      title: "鱼米深情 · 黔北百姓援助",
      text: "在遵义、湄潭、永兴办学七年间，黔北地方倾尽所有相助浙大，腾房让粮、守望相助。滋养了五十余位未来院士学者。",
      dialogues: [
        {
          speaker: "老戚",
          role: "校工技师",
          text: "湄潭百姓送来了新碾的稻米和鲜鱼，老乡们说：『只要浙大的先生学生吃得饱，咱们中国的后代就有希望！』",
        },
        {
          speaker: "周晚晴",
          role: "文学院一年级",
          text: "七年峥嵘岁月，五十多位未来的中科院院士在这片土地上诞生，黔北青山绿水养育了中国科学的参天大树。",
        },
      ],
      choices: [],
      note: "固定触发随机事件 re-aid（正面事件）",
    },
  ],
};
