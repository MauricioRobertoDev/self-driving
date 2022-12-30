import { Game } from "../engine/Game";
import { Keyboard } from "../engine/Keyboard";
import { Dot } from "../engine/Util";
//
import { AbstractCar } from "./AbstractCar";
import { Sensor } from "./Sensor";
import { TrafficCar } from "./TrafficCar";
import { NeuralNetwork } from "../ai/NeuralNetwork";

export class PlayerCar extends AbstractCar {
    public sensor: Sensor;
    public score = 0;
    public iamBest = false;
    public brain: NeuralNetwork;

    constructor(id: string, x: number, y: number, maxSpeed: number) {
        super(id, x, y, maxSpeed);
        this.sensor = new Sensor();
        this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        this.updatePolygon();
    }

    public update(game: Game) {
        this.checkIfIsBest(game);
        if (!this.damaged) {
            const borders = game.global.get("roadBorders") as [Dot, Dot][];
            const traffic = this.getTraffic(game);

            this.updatePosition();
            this.updatePolygon();
            this.sensor.update(this, borders, traffic);
            const offsets = this.sensor.readings.map((s) =>
                s == null ? 0 : 1 - s.offset,
            );
            NeuralNetwork.setInputs(this.brain, offsets);
            this.updateControls(game.keyboard);
        }

        if (this.damaged && !this.iamBest) {
            game.entities.remove(this);
        }

        if (this.position.y > 0) {
            game.entities.remove(this);
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = 0.2;
        if (this.iamBest) {
            ctx.globalAlpha = 1;
            this.sensor.draw(ctx);
        }
        this.damaged ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "blue");
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();
    }

    protected updateControls(_keyboard: Keyboard) {
        NeuralNetwork.getOutputs(this.brain);
        _keyboard.isDown("w") ? (this.forward = true) : (this.forward = false);
        _keyboard.isDown("s") ? (this.reverse = true) : (this.reverse = false);
        _keyboard.isDown("a") ? (this.left = true) : (this.left = false);
        _keyboard.isDown("d") ? (this.right = true) : (this.right = false);
    }

    protected getTraffic(game: Game): TrafficCar[] {
        return game.entities
            .all()
            .filter((entity) => entity instanceof TrafficCar) as TrafficCar[];
    }

    protected checkIfIsBest(game: Game) {
        game.global.get("bestDriver").id === this.id
            ? (this.iamBest = true)
            : (this.iamBest = false);
    }
}
