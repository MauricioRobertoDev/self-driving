import { MyGame } from "./game/MyGame";
import { PlayerTest } from "./game/PlayerTest";

const gm = new MyGame(700, window.innerHeight);
const t = new PlayerTest();

gm.entities.add(t);

gm.start();
