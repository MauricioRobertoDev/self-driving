import { Game } from "../engine/Game";
import { Keyboard } from "../engine/Keyboard";
import { Dot } from "../engine/Util";
//
import { AbstractCar } from "./AbstractCar";
import { Sensor } from "./Sensor";
import { TrafficCar } from "./TrafficCar";

export class PlayerCar extends AbstractCar {
    public sensor: Sensor;
    public score = 0;

    constructor(id: string, x: number, y: number, maxSpeed: number) {
        super(id, x, y, maxSpeed);
        this.sensor = new Sensor(this);
    }

    public update(game: Game) {
        if (!this.damaged) {
            const borders = game.global.get("roadBorders") as [Dot, Dot][];
            const traffic = this.getTraffic(game);

            this.updateControls(game.keyboard);
            this.updatePosition();
            this.updatePolygon();
            this.sensor.update(borders, traffic);
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.sensor.draw(ctx);
        this.damaged ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "blue");
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();
    }

    protected updateControls(_keyboard: Keyboard) {
        _keyboard.isDown("w") ? (this.forward = true) : (this.forward = false);
        _keyboard.isDown("s") ? (this.reverse = true) : (this.reverse = false);
        _keyboard.isDown("a") ? (this.left = true) : (this.left = false);
        _keyboard.isDown("d") ? (this.right = true) : (this.right = false);
    }

    private getTraffic(game: Game): TrafficCar[] {
        return game.entities
            .all()
            .filter((entity) => entity instanceof TrafficCar) as TrafficCar[];
    }
}
