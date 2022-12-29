import { NeuralNetwork } from "./ai/NeuralNetwork";
import { Visualizer } from "./ai/Visualizer";
import { Game } from "./engine/Game";
import { Dot, polysIntersect } from "./engine/Util";
import { AIPlayerCar } from "./game/AIPlayerCar";
import { PlayerCar } from "./game/PlayerCar";
import { Road } from "./game/Road";
import { ScoreBoard } from "./game/ScoreBoard";
import { TrafficCar } from "./game/TrafficCar";

const gm = new Game(700, window.innerHeight);
const visu = new Visualizer(300, window.innerHeight, 50, ["🠉", "🠈", "🠊", "🠋"]);
const board = new ScoreBoard();

const amountAI = 500;
const mutationPercentage = 0.2; // 0 - 1
let generation = 0;
const playerMaxSpeed = 7;
const trafficMaxSpeed = 4;

gm.setup = () => {
    setEventsOnButtons();
    buildRoad();
    buildDefaultTraffic();
    buildAiCars();
    setInterval(resetGeneration, 1000 * 30);
};

gm.afterUpdate = (time) => {
    const players = getAllPlayers();
    const traffic = getALlTraffic();

    checkCollisions(players, gm.global.get("roadBorders"), traffic);
    updateScoreOfPlayers(players);

    const currentBestDriver = getPlayerWithHighestScore(players);
    gm.global.set("bestDriver", currentBestDriver);

    visu.drawNetwork(currentBestDriver.brain, time);

    board.update(mutationPercentage, generation, currentBestDriver);
};

gm.beforeRender = () => {
    const bestDriver = gm.global.get("bestDriver") as PlayerCar;
    gm.screen.fixCamera(0, -bestDriver.position.y + gm.screen.height * 0.8);
};

gm.start();

/**
 * CONSTROEM E ADICIOAM ÀS ENTIDADES AO JOGO
 */
function buildAiCars(): void {
    const lane3 = gm.global.get("centerLane3");
    const aiCars = [];

    for (let i = 0; i < amountAI; i++) {
        aiCars.push(new AIPlayerCar(`AI_${i}`, lane3, 0, playerMaxSpeed));
    }

    if (generation > 0) {
        const bestBrainStr = recoverBrain();
        if (bestBrainStr) {
            for (let i = 0; i < aiCars.length; i++) {
                aiCars[i].brain = JSON.parse(bestBrainStr);
                if (i != 0) {
                    NeuralNetwork.mutate(aiCars[i].brain, mutationPercentage);
                }
            }
            generation++;
        }
    }

    gm.entities.add(...aiCars);
    gm.global.set("bestDriver", aiCars[0]);
}

function buildRoad(): void {
    const road = new Road(
        "ROAD",
        gm.screen.width / 2,
        0,
        gm.screen.width * 0.68,
        gm.screen.width * 0.6,
    );

    gm.global.set("roadBorders", road.borders); // [Dot, Dot][]
    gm.global.set("centerLane1", road.laneCenter(0)); // number
    gm.global.set("centerLane2", road.laneCenter(1)); // number
    gm.global.set("centerLane3", road.laneCenter(2)); // number
    gm.global.set("centerLane4", road.laneCenter(3)); // number

    gm.entities.add(road);
}

function buildDefaultTraffic(): void {
    const trafficCars = [];

    const lane1 = gm.global.get("centerLane1");
    const lane2 = gm.global.get("centerLane2");
    const lane3 = gm.global.get("centerLane3");
    const lane4 = gm.global.get("centerLane4");

    trafficCars.push(
        new TrafficCar("T_1", lane1, 0, trafficMaxSpeed, Math.PI),
        new TrafficCar("T_2", lane2, -200, trafficMaxSpeed, Math.PI),
        new TrafficCar("T_3", lane3, -300, trafficMaxSpeed, 0),
        new TrafficCar("T_4", lane4, 100, trafficMaxSpeed, 0),
    );

    gm.entities.add(...trafficCars);
}

/**
 * RETORNAM ENTIDADES ESPECÍFICAS
 */
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

/**
 * ATUALIZAM O SCORE DO PLAYER E PEGAM O MAIOR
 */
function updateScoreOfPlayers(players: PlayerCar[]): void {
    players.forEach((player) => {
        if (!player.damaged) {
            if (player.position.y < 0) {
                player.score += Math.abs(player.position.y) / 100;
            }
        }
    });
}

function getPlayerWithHighestScore(players: PlayerCar[]): PlayerCar {
    const currentChampion = gm.global.get("bestDriver");

    return players.reduce((prevPlayer, currentPlayer) => {
        if (currentPlayer.score > prevPlayer.score) return currentPlayer;
        return prevPlayer;
    }, currentChampion);
}

/**
 * FUNÇÃO QUE VEREFICA AS COLISÕES QUE NÓS QUEREMOS OU SEJA PLAYER -> TRÁFEGO, PLAYER -> BORDAS
 */
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

/**
 * FUNÇÃO QUE RESETA A ATUAL GERAÇÃO CRIANDO A PRÓXIMA COM O MELHOR DA CÉREBRO DA ATUAL
 */
function resetGeneration(): void {
    saveBrain();
    gm.entities.removeAll();
    buildRoad();
    buildDefaultTraffic();
    buildAiCars();
    generation++;
}

/**
 * FUNÇÕES PARA ADICIONAR EVENTOS AOS BOTÕES, SALVAMENTO, DESCARTE, RECUPERAÇÃO E VISUALIZAÇÃO DO MELHOR CÉREBRO
 */
function setEventsOnButtons(): void {
    const saveBrainBtn = document.getElementById("saveBrainBtn");
    const discartBrainBtn = document.getElementById("discartBrainBtn");
    const seeBrainBtn = document.getElementById("seeBrainBtn");
    const resetGameBtn = document.getElementById("resetGameBtn");

    if (saveBrainBtn) saveBrainBtn.onclick = saveBrain;
    if (discartBrainBtn) discartBrainBtn.onclick = discartBrain;
    if (seeBrainBtn) seeBrainBtn.onclick = seeBrain;
    if (resetGameBtn) resetGameBtn.onclick = resetGame;
}

function saveBrain(): void {
    discartBrain();
    const bestDriver = gm.global.get("bestDriver") as PlayerCar;
    localStorage.setItem("bestBrain", JSON.stringify(bestDriver.brain));
    console.log("Cérebro salvo.");
}

function discartBrain(): void {
    localStorage.removeItem("bestBrain");
    console.log("Cérebro deletado.");
}

function recoverBrain(): string | void {
    if (localStorage.getItem("bestBrain")) {
        console.log("Cérebro recuperado.");
        return localStorage.getItem("bestBrain") as string;
    }
    console.log("Sem cérebro para recuperar, criado um novo");
}

function seeBrain(): void {
    const bestBrain = localStorage.getItem("bestBrain");
    if (bestBrain) {
        console.table(bestBrain);
        console.log("Cérebro mostrado.");
        return;
    }
    console.log("Sem cérebro salvo para ver");
}

function resetGame(): void {
    discartBrain();
    gm.entities.removeAll();
    buildRoad();
    buildDefaultTraffic();
    buildAiCars();
    generation = 0;
}
