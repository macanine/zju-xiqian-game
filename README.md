# zju-game

浙江大学西迁（"文军长征"）主题互动叙事游戏。当前 Web 原型已接入完整 8 节点故事流、资源结算、随机事件、结局判定与史料档案。

- 🎮 **MVP 故事线原型** → [`STORYLINE.md`](STORYLINE.md)（8 节点 / 17 个地点事件 / 6 个随机事件 / 6 种人物结局）
- 📦 **机读数据** → `storyline.json`（节点 · 事件 · 选项 · 数值 · 结局判定）
- 🧭 **工程化落地计划** → [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)（技术路线、核心循环、里程碑、测试）
- 🖥️ **Web 原型** → [`web/`](web/)（pnpm + TypeScript + React + Vite + Three.js）
- 🏛️ **历史教育版计划** → [EDUCATIONAL_PLAN.md](EDUCATIONAL_PLAN.md)（教育目标、轻互动、展陈与课程落地）

## 素材来源

素材来自一批微信聊天记录整理的**浙大西迁史料库**（1937–1946），图片为历史照片与博物馆西迁主题展陈翻拍。原始史料库路径：

```
~/WorkBuddy/2026-10-04-21-22-55/浙江大学西迁史料整理/
```

## 目录结构

```
zju-game/
├── README.md
├── AGENTS.md
├── STORYLINE.md                        # 设计文档（玩法、关卡、事件、数值、结局）
├── sites.json                          # 7 个站点 + 1 个专题组（galleries）· 史实
├── timeline.json                       # 24 条带日期的事件，按时间升序 · 史实
├── storyline.json                      # MVP 故事线：节点 / 事件 / 选项 / 数值 / 结局
├── package.json / pnpm-workspace.yaml  # pnpm workspace 工程化入口
├── web/                                # 现代化视觉小说工程（TypeScript + React + Vite）
└── images/                             # 25 张历史珍贵原照，单层目录，英文规范命名
```

文件名与 TypeScript 字段、ID 使用英文，文案保持中文。所有图片引用均以项目根为基准；图片按文件名的站点/专题编号前缀归组，清单如下。

开发与维护时遵循 `AGENTS.md` 规范。修改后运行测试套件校验：

```sh
pnpm test
```

## Web 原型开发

Node.js 22+ 与 pnpm 11+：

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
```

`web/scripts/copy-assets.mjs` 会在开发和构建前将根目录的三份 JSON 与 `images/` 复制到临时静态目录；源数据仍只维护在仓库根目录。游戏从杭州开始，按 8 个节点推进到 1946 年终章。Three.js 常驻渲染路线地形、节点、雾层、粒子和史料影像，镜头沿路线连续推进；React DOM 负责清晰的文字、选择和档案 HUD。历史照片保留原始文件并支持查看大图，数据加载失败会显示错误页，不使用代码内史实备用文案。

## 图片素材清单（共 25 张）

| 站点 | 文件 | 内容 |
|:--|:--|:--|
| 01 西天目山 | `01_xitianmushan_01_zenyuan_temple_gate_1937_autumn.png` | 禅源寺山门，竺可桢勘察搬迁校舍 |
| 02 建德 | `02_jiande_01_jianggan_wharf_departure_1937_nov.png` | 码头篷船，师生分三批乘船出发 |
| 02 建德 | `02_jiande_02_carrying_books_and_instruments.png` | 肩挑箱笼行进队伍 |
| 02 建德 | `02_jiande_03_first_move_and_siku_protection.jpg` | 初迁建德 / 保护四库全书 / 导师制 |
| 04 泰和 | `04_taihe_01_second_move_and_taihe_tragedy.jpg` | 二迁吉安泰和 / 泰和之殇 |
| 04 泰和 | `04_taihe_02_zhu_kezhen_fountain_pen_and_taihe_history.jpg` | 竺可桢赠张侠魂水笔 + 防洪大堤等图注 |
| 05 宜山 | `05_yishan_01_third_move_and_air_raids.jpg` | 三迁宜山、标营、日机轰炸、校景分布图 |
| 05 宜山 | `05_yishan_02_migration_bell_and_zhu_inscription.jpg` | 西迁铁钟 + 「竺可桢题」书法 |
| 05 宜山 | `05_yishan_03_motto_and_anthem_ma_yifu.jpg` | 「求是」校训确立、校歌歌词与乐谱、马一浮 |
| 05 宜山 | `05_yishan_04_university_anthem_manuscript.jpg` | 马一浮手书校歌稿本 |
| 06 遵义湄潭 | `06_guizhou_01_fourth_move_to_zunyi_meitan.jpg` | 四迁遵义湄潭，含胡锦涛 1985 年题词 |
| 06 遵义湄潭 | `06_guizhou_02_staff_students_and_meitan_history.jpg` | 团体合影、湄潭附小旧址、湄潭风光 |
| 06 遵义湄潭 | `06_guizhou_03_zunyi_history_wall.jpg` | 遵义时期合影与校舍旧照 |
| 06 遵义湄潭 | `06_guizhou_04_student_records_and_gradebooks.jpg` | 成绩册、钱临照/张其昀学籍卡 |
| 06 遵义湄潭 | `06_guizhou_05_tung_oil_lamp_and_temple_tiles.jpg` | 竺可桢一家所用桐油灯、文庙瓦当 |
| 07 贵州七年 | `07_guizhou_01_jiangxi_guild_hall_wanshou_palace.jpg` | 万寿宫楼阁旧照 |
| 07 贵州七年 | `07_guizhou_02_zunyi_campus_gate.jpg` | 遵义校本部大门 |
| 07 贵州七年 | `07_guizhou_03_academicians_photo_wall.jpg` | 院士照片墙 + 「国立浙江大学」校门 |
| 07 贵州七年 | `07_guizhou_04_migration_achievements.jpg` | 办学成果版面 + 展柜实物 |
| 07 贵州七年 | `07_guizhou_05_campus_reconstruction_and_return.jpg` | 重建校园 / 战后复员 / 接收台北帝国大学 |
| 08 专题 | `08_achievements_01_colleges_and_research_units.jpg` | 7 学院 26 学系、研究所一览、人数统计 |
| 08 专题 | `08_achievements_02_social_science_scholars.jpg` | 社科名家人像墙、篆刻、书法对联 |
| 08 专题 | `08_achievements_03_cave_classroom_scene.jpg` | 山洞课堂场景复原 |
| 08 专题 | `08_achievements_04_national_zju_under_zhu.jpg` | 竺可桢肖像、1936 年出任校长、「求是」校训 |
| 08 专题 | `08_achievements_05_westward_migration_teachers_wall.jpg` | 西迁时期名师肖像墙（10 位） |

## 素材完整性

**原对话中的 25 张图已全部归档**，无缺图。

唯一的"空站"是 **03 吉安** —— 原聊天记录在该段只有文字、本来就没有配图，不是遗漏。

> 前几轮整理时曾出现大量图片未随导出包出现的情况，原因见史料库 README 的「关于"图片缺失"的说明」：微信在 macOS 端对图片惰性缓存，导出工具读本地缓存，未浏览过的图片会漏掉。**以后导出前先在微信里逐张点开图片**，可避免反复补图。

## 数据文件用法

三个 JSON 都不含代码依赖，任何引擎/框架直接 `import` 或 `fetch` 即可。

### `sites.json`

- `sites[]`（7 项，西迁各站）：`id` / `order` / `name` / `place` / `coords`（**近似坐标，需自行校对**）/ `period` / `summary` / `events[]` / `tags[]` / `images[]`。
  `images[]` 是**路径字符串数组**，路径以项目根为基准（如 `images/02_jiande_01_jianggan_wharf_departure_1937_nov.png`）。
- `galleries[]`（1 项，专题补充）：`id` / `name` / `period` / `summary` / `facts` / `images[]`。
  ⚠️ 与 `sites` 不同，`galleries` 的 `images[]` 是**对象数组** `{ path, caption }`，因为专题图需要逐张说明。

### `timeline.json`

- `timeline[]`：24 条事件，字段 `date` / `stageId`（关联 `sites.json` 的 `id`）/ `stage` / `text` / `type`（`event` 18 条 / `milestone` 5 条 / `honor` 1 条）。
- `date` 是**可排序的归一化值**（「1946年秋」记为 `1946-09`，精确到月的条目不含日），字符串排序即为时间顺序。

### `storyline.json`（MVP 故事线）

- `config`：资源初值（图书仪器 25 / 口粮 12 / 健康 100 / 士气 60）、赶路消耗、随机事件概率 35%、健康归零的强制休整规则。
- `cast`：4 名**虚构角色**（沈砚 / 周晚晴 / 老戚 / 程小雨）+ 真实历史人物白名单（只作史实卡，不设结局）。
- `nodes[]`（8 个）：`id` / `order` / `name` / `period` / `facts[]` / `images[]` / `locationEvents[]`。
  `locationEvents[].choices[].effects` 的键统一为 `supplies` / `ration` / `health` / `morale`，`flag` 为剧情标记。
- `randomEvents[]`（6 个）：含 QTE、概率分支 `outcomes[{weight, effects}]`、按节点的权重覆盖 `weightOverrides`。
- `endings`：`main`（固定主线）+ `character.cards`（6 张结局卡，按 `priority` 命中即止）+ `epilogueFragments`（7 条后记，按标记追加）。

> 与 `sites.json` / `timeline.json` 的分工：后两者是**史实底座**，`storyline.json` 是**玩法层**，只引用史实、不重复定义。

### 可转化成的游戏元素

- **关卡推进**：按 `timeline` 日期顺序切分为 7 个站点关卡。
- **关键节点**：`type: "milestone"` 的 5 条 = 求是校训确立、李约瑟"东方剑桥"、复员东归等剧情转折点。
- **场景背景**：`images[]` 直接作为站点背景或图鉴卡片。
- **史料卡牌**：`sites[].achievements` / `quote` / `supplies`，以及 `galleries[0].facts`（7 学院 26 学系、5 个研究所、在校生 613→1963 / 毕业生 86→327、复员后 2171 人等）可做成收集要素。
- **人物图鉴**：08 专题的「社科名家」「聘请名师」两面人像墙可做成人物解锁面板。

## 注意事项

1. **图片版权**：素材含历史老照片与博物馆展陈翻拍，若对外发布（尤其商用）请先核实来源与授权。项目内部开发使用问题不大。
2. **坐标为近似值**，`coords.approximate = true` 已标注，正式使用前请校对。
3. **史料存疑点**：泰和防洪大堤长度有「约 7.5 公里（15 华里）」与「长约 5 华里」两种记载，本数据集采用前者。
4. **人物姓名**：08 专题两面人像墙因翻拍清晰度有限，未逐一誊录姓名，使用时以原图为准。
5. 三份 JSON 中的 `_meta` 字段为说明，可忽略。
