import { NeuralNetwork } from "./ai/NeuralNetwork";
import { Visualizer } from "./ai/Visualizer";
import { Game } from "./engine/Game";
import { Dot, polysIntersect } from "./engine/Util";
import { AIPlayerCar } from "./game/AIPlayerCar";
import { PlayerCar } from "./game/PlayerCar";
import { Road } from "./game/Road";
import { TrafficCar } from "./game/TrafficCar";

const gm = new Game(700, window.innerHeight);
const nw = new Visualizer(300, window.innerHeight, 50, ["🠉", "🠈", "🠊", "🠋"]);

const amountAI = 500;
const mutationPercentage = 0.5; // 0 - 1
let generation = 0;

const mutationElement = document.getElementById("mutation") as HTMLElement;
const generationElement = document.getElementById("generation") as HTMLElement;
const scoreElement = document.getElementById("score") as HTMLElement;
const playerElement = document.getElementById("player") as HTMLElement;

gm.setup = () => {
    setDefaultEntityAndVars();
    setEventsOnButtons();

    const aiCars = generateAiCars(amountAI, gm.global.get("centerLane2"));

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

    mutationElement.innerText = "Mutação: " + mutationPercentage * 100 + "%";
    generationElement.innerText = "Geração: " + generation;
    scoreElement.innerText = "Maior Score: " + Math.round(aiCars[0].score);
    playerElement.innerText = "Atual: " + aiCars[0].id;

    // const p1 = new PlayerCar("P_1", laneX2, 0, 10);
    // gm.entities.add(p1);
    // gm.global.set("bestDriver", p1);
};

gm.afterUpdate = () => {
    const players = getAllPlayers();
    const traffic = getALlTraffic();
    const borders = gm.global.get("roadBorders");
    const laneX2 = gm.global.get("centerLane2");
    const laneX3 = gm.global.get("centerLane3");

    checkCollisions(players, borders, traffic);
    updateScoreOfPlayers(players, laneX2, laneX3);

    const currentBestDriver = getPlayerWithHighestScore(players);
    gm.global.set("bestDriver", currentBestDriver);

    nw.setNetwork(currentBestDriver.brain);

    mutationElement.innerText = "Mutação: " + mutationPercentage * 100 + "%";
    generationElement.innerText = "Geração: " + generation;
    scoreElement.innerText =
        "Maior Score: " + Math.round(currentBestDriver.score);
    playerElement.innerText = "Player: " + currentBestDriver.id;
};

gm.beforeRender = () => {
    const bestDriver = gm.global.get("bestDriver") as PlayerCar;
    gm.screen.fixCamera(0, -bestDriver.position.y + gm.screen.height * 0.8);
};

gm.start();
nw.start();

/**
 * GERA UM NÚMERO ESPECÍFICO DE AIPLAYERS
 */
function generateAiCars(amount: number, startLane: number): AIPlayerCar[] {
    const ai_cars = [];
    for (let i = 0; i < amount; i++) {
        ai_cars.push(new AIPlayerCar(`AI_${i}`, startLane, 0, 10));
    }
    return ai_cars;
}

/**
 * RETORNA TODOS OS PLAYERS
 */
function getAllPlayers(): PlayerCar[] {
    return gm.entities
        .all()
        .filter((entity) => entity instanceof PlayerCar) as PlayerCar[];
}

/**
 * RETORNA TODO O TRÁFEGO
 */
function getALlTraffic(): TrafficCar[] {
    return gm.entities
        .all()
        .filter((entity) => entity instanceof TrafficCar) as TrafficCar[];
}

/**
 * RETORNA O PLAYER COM MAIOR PONTUAÇÃO
 */
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
 * FUNÇÃO QUE DA PONTOS AOS PLAYER ASSIM PODE SE SELECIONAR COMO DEVE SER O MELHOR INDIVÍDUO
 */
function updateScoreOfPlayers(
    players: PlayerCar[],
    lane2X: number,
    lane3X: number,
): void {
    players.forEach((player) => {
        if (!player.damaged) {
            if (player.position.y < 0) {
                player.score += Math.abs(player.position.y) / 100;
            }
        }
    });
}

function setDefaultEntityAndVars(): void {
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

    const t1 = new TrafficCar("T_1", lanesCenter[0], 0, 4, Math.PI);
    const t2 = new TrafficCar("T_2", lanesCenter[1], -200, 4, Math.PI);
    const t3 = new TrafficCar("T_3", lanesCenter[2], -300, 4, 0);
    const t4 = new TrafficCar("T_4", lanesCenter[3], 100, 4, 0);

    gm.global.set("roadBorders", road.borders); // [Dot, Dot][]
    gm.global.set("centerLane2", lanesCenter[2]); // number
    gm.global.set("centerLane3", lanesCenter[3]); // number

    gm.entities.add(road, t1, t2, t3, t4);
}

/**
 * FUNÇÕES PARA ADICIONAR EVENTOS AOS BOTÕES, SALVAMENTO, DESCARTE, RECUPERAÇÃO E VISUALIZAÇÃO DO MELHOR CÉREBRO
 */
function setEventsOnButtons(): void {
    const saveBrainBtn = document.getElementById("saveBrainBtn");
    const discartBrainBtn = document.getElementById("discartBrainBtn");
    const seeBrainBtn = document.getElementById("seeBrainBtn");

    if (saveBrainBtn) saveBrainBtn.onclick = saveBrain;
    if (discartBrainBtn) discartBrainBtn.onclick = discartBrain;
    if (seeBrainBtn) seeBrainBtn.onclick = seeBrain;
}

function saveBrain(): void {
    const bestDriver = gm.global.get("bestDriver") as PlayerCar;
    localStorage.setItem("bestBrain", JSON.stringify(bestDriver.brain));
    console.log("Cérebro salvo.");
}

function discartBrain(): void {
    localStorage.removeItem("bestBrain");
    generation = 0;
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
    console.log("Sem cérebro salvo");
}
