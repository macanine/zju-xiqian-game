import type { Storyline } from "../../domain/content";
import { STORYLINE_CONFIG, STORYLINE_CAST } from "./config";
import { prologueHangzhouNode } from "./stages/01-hangzhou";
import { xitianmushanNode } from "./stages/02-xitianmushan";
import { jiandeNode } from "./stages/03-jiande";
import { jianNode } from "./stages/04-jian";
import { taiheNode } from "./stages/05-taihe";
import { yishanNode } from "./stages/06-yishan";
import { zunyiMeitanNode } from "./stages/07-zunyi";
import { finale1946Node } from "./stages/08-return";
import { RANDOM_EVENTS } from "./randomEvents";
import { STORYLINE_ENDINGS } from "./endings";

export const STORYLINE_DATA: Storyline = {
  config: STORYLINE_CONFIG,
  cast: STORYLINE_CAST,
  nodes: [
    prologueHangzhouNode,
    xitianmushanNode,
    jiandeNode,
    jianNode,
    taiheNode,
    yishanNode,
    zunyiMeitanNode,
    finale1946Node,
  ],
  randomEvents: RANDOM_EVENTS,
  endings: STORYLINE_ENDINGS,
};
