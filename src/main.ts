import { Game } from "./engine/Game";
import { PlayerCar } from "./game/PlayerCar";
import { Road } from "./game/Road";
import { TrafficCar } from "./game/TrafficCar";

const gm = new Game(700, window.innerHeight);

const road = new Road("ROAD", 700 / 2, 0, 700 * 0.68, 700 * 0.6, 4);
const t1 = new TrafficCar("TRAFFIC_1", road.laneCenter(0), 100, 4, Math.PI);
const t2 = new TrafficCar("TRAFFIC_2", road.laneCenter(1), -100, 4, Math.PI);
const t3 = new TrafficCar("TRAFFIC_3", road.laneCenter(2), -200, 4, 0);
const t4 = new TrafficCar("TRAFFIC_4", road.laneCenter(3), 200, 4, 0);
const p1 = new PlayerCar("PLAYER_1", road.laneCenter(2), 100, 10);

road.addChild(p1, t1, t2, t3, t4);

gm.entities.add(road);

gm.global.set("bestDriver", p1);

gm.beforeRender = () => {
    const bestDriver = gm.global.get("bestDriver");
    gm.screen.fixCamera(0, -bestDriver.position.y + gm.screen.height * 0.8);
};

gm.start();
