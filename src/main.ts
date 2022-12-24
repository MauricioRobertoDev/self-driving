import { Game } from "./engine/Game";
import { Dot, polysIntersect } from "./engine/Util";
import { PlayerCar } from "./game/PlayerCar";
import { Road } from "./game/Road";
import { TrafficCar } from "./game/TrafficCar";

const gm = new Game(700, window.innerHeight);

gm.setup = () => {
    const road = new Road(
        "ROAD",
        gm.screen.width / 2,
        0,
        gm.screen.width * 0.68,
        gm.screen.width * 0.6,
    );
    const lanesCenter = [
        road.laneCenter(0),
        road.laneCenter(1),
        road.laneCenter(2),
        road.laneCenter(3),
    ];

    const t1 = new TrafficCar("T_1", lanesCenter[0], 100, 4, Math.PI);
    const t2 = new TrafficCar("T_2", lanesCenter[1], -100, 4, Math.PI);
    const t3 = new TrafficCar("T_3", lanesCenter[2], -200, 4, 0);
    const t4 = new TrafficCar("T_4", lanesCenter[3], 200, 4, 0);

    const p1 = new PlayerCar("P_1", lanesCenter[2], 100, 10);

    gm.entities.add(road, p1, t1, t2, t3, t4);

    gm.global.set("bestDriver", p1); // PlayerCar
    gm.global.set("roadBorders", road.borders); // [Dot, Dot][]
    gm.global.set("centerLane2", lanesCenter[2]); // number
    gm.global.set("centerLane3", lanesCenter[3]); // number
};

gm.afterUpdate = () => {
    const players = getAllPlayers();
    const traffic = getALlTraffic();
    const borders = gm.global.get("roadBorders");
    const laneX2 = gm.global.get("centerLane2");
    const laneX3 = gm.global.get("centerLane3");

    checkCollisions(players, borders, traffic);
    updateScoreOfPlayers(players, laneX2, laneX3);
    gm.global.set("bestDriver", getPlayerWithHighestScore(players));
};

gm.beforeRender = () => {
    const bestDriver = gm.global.get("bestDriver") as PlayerCar;
    gm.screen.fixCamera(0, -bestDriver.position.y + gm.screen.height * 0.8);
};

gm.start();

//
function getAllPlayers(): PlayerCar[] {
    return gm.entities
        .all()
        .filter((entity) => entity instanceof PlayerCar) as PlayerCar[];
}

function getALlTraffic(): TrafficCar[] {
    return gm.entities
        .all()
        .filter((entity) => entity instanceof TrafficCar) as TrafficCar[];
}

function getPlayerWithHighestScore(players: PlayerCar[]): PlayerCar {
    const currentChampion = gm.global.get("bestDriver");

    return players.reduce((prevPlayer, currentPlayer) => {
        if (currentPlayer.score > prevPlayer.score) return currentPlayer;
        return prevPlayer;
    }, currentChampion);
}

function checkCollisions(
    players: PlayerCar[],
    borders: [Dot, Dot][],
    traffic: TrafficCar[],
): void {
    players.forEach((player) => {
        // colisão com as bordas da pista
        for (let i = 0; i < borders.length; i++) {
            if (polysIntersect(player.polygon, borders[i])) {
                player.explode();
            }
        }

        // colisão com os carros
        for (let i = 0; i < traffic.length; i++) {
            const trafficCar = traffic[i] as TrafficCar;
            if (polysIntersect(player.polygon, trafficCar.polygon)) {
                player.explode();
            }
        }
    });
}

function updateScoreOfPlayers(
    players: PlayerCar[],
    lane2X: number,
    lane3X: number,
) {
    players.forEach((player) => {
        if (player.forward) {
            player.score += 1;

            if (player.angle >= Math.PI / 2 && player.angle <= Math.PI / 2)
                player.score += 1;

            const posX = player.position.x;

            if (posX - lane2X <= 10 || posX - lane3X <= 10) player.score += 1;
        }
    });
}
