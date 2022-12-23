import { Game } from "../engine/Game";
import { Keyboard } from "../engine/Keyboard";
//
import { AbstractCar } from "./AbstractCar";

export class TrafficCar extends AbstractCar {
    constructor(
        id: string,
        x: number,
        y: number,
        maxSpeed: number,
        angle: number,
    ) {
        super(id, x, y, maxSpeed);
        this.angle = angle;
    }

    public update(game: Game) {
        if (!this.damaged) {
            this.updateControls(game.keyboard);
            this.updatePosition();
            this.updatePolygon();
        }
    }

    /**
     * PÚBLICO
     */
    public render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "orange";
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
    }

    /**
     * PROTEGIDO
     */
    protected updateControls(_keyboard: Keyboard) {
        this.forward = true;
    }
}
