import type { Endings } from "../../domain/content";

export const STORYLINE_ENDINGS: Endings = {
  main: {
    id: "main-1946",
    isFixed: true,
    title: "1946 年秋，浙江大学全面复员杭州",
    lines: [
      "离杭前学生 633 人，归来时已达 2171 人。",
      "学校发展为文、理、工、农、医、法、师范共 7 个学院、26 个学系。",
      "李约瑟说：「在重庆与贵阳之间叫遵义的小城里，可以找到浙江大学，是中国最好的四所大学之一。」",
      "1986 年，彭真委员长视察浙大，誉之为「文军长征」。",
    ],
  },
  character: {
    _rule: "按优先级从高到低匹配，命中即止。保全率 = supplies / 25。",
    cards: [
      {
        priority: 1,
        id: "end-changzheng",
        title: "文军长征",
        condition: "preserveRate >= 0.80 && health >= 70 && morale >= 70",
        tone: "全员圆满，收束到校训「求是」",
      },
      {
        priority: 2,
        id: "end-dike",
        title: "长堤无言",
        condition: "flag(dike) && health < 50",
        tone: "修堤耗尽了身体，但堤与「浙大码头」还在",
      },
      {
        priority: 3,
        id: "end-anthem",
        title: "和声不散",
        condition: "flag(anthem) && morale >= 70",
        tone: "结尾落在那句「树我邦国，天下来同」",
      },
      {
        priority: 4,
        id: "end-books",
        title: "一路书香",
        condition: "preserveRate >= 0.80 && morale < 70",
        tone: "书保住了，人却话少了",
      },
      {
        priority: 5,
        id: "end-siku",
        title: "四库同行",
        condition: "flag(siku) && preserveRate >= 0.60",
        tone: "那 139 箱文澜阁《四库全书》也一路平安",
      },
      {
        priority: 6,
        id: "end-ordinary",
        title: "寻常一兵",
        condition: "default",
        tone: "平平淡淡的幸存者——多数人都是这样走完的",
      },
    ],
  },
  epilogueFragments: {
    _rule: "在结局卡之后逐条附加。持有该标记即追加对应后记，顺序固定如下。用于让剧情标记全部产生回收，而不必增加结局卡数量。",
    fragments: [
      {
        flag: "doubt",
        text: "在西天目山的那个夜里，你问过「还能不能读书」。十年后你有了答案。",
      },
      {
        flag: "memorial",
        text: "泰和松山。你在追悼会上写下了自己的名字。",
      },
      {
        flag: "debate",
        text: "表决「求是」那天，你本想投另一个词。后来你明白了它为什么是「求是」。",
      },
      {
        flag: "anthem",
        text: "那句「树我邦国，天下来同」，是你一笔一笔抄下来的。",
      },
      {
        flag: "siku",
        text: "文澜阁《四库全书》139 箱，与你一路同行。",
      },
      {
        flag: "dike",
        text: "泰和那道「浙大长堤」，第二年挡住了洪水，江边还叫「浙大码头」。",
      },
      {
        flag: "cambridge",
        text: "后来有人把这里称作「东方剑桥」——你带李约瑟看过的那间实验室，还在。",
      },
    ],
  },
};
