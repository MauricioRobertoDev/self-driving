import { getIntersection, lerp } from "../engine/Util";
import { Dot } from "../engine/Util";
//
import { PlayerCar } from "./PlayerCar";
import { TrafficCar } from "./TrafficCar";

export type RayDot = { x: number; y: number; offset: number };

export class Sensor {
    public rays: [Dot, Dot][] = [];
    public readings: RayDot[] = [];
    constructor(
        public rayCount = 5,
        public rayLength = 500,
        public raySpread = Math.PI / 2,
    ) {}

    public update(
        car: PlayerCar,
        roadBorders: [Dot, Dot][],
        traffic: TrafficCar[],
    ): void {
        this._castRays(car);
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            const reading = this._getReading(
                this.rays[i],
                roadBorders,
                traffic,
            );
            if (reading) this.readings[i] = reading;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.rayCount; i++) {
            const hasReading = this.readings[i];
            let end = this.rays[i][1];
            if (hasReading) end = this.readings[i];

            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            ctx.strokeStyle = hasReading ? "red" : "#FED330";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            if (hasReading) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    private _castRays(car: PlayerCar): void {
        this.rays = []; // se não pode isso tu vai explodir de tanto item no array
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle =
                lerp(
                    this.raySpread / 2,
                    -this.raySpread / 2,
                    this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1),
                ) + car.angle;
            const start = { x: car.position.x, y: car.position.y };
            const end = {
                x: car.position.x - Math.sin(rayAngle) * this.rayLength,
                y: car.position.y - Math.cos(rayAngle) * this.rayLength,
            };
            this.rays.push([start, end]);
        }
    }

    private _getReading(
        ray: [Dot, Dot],
        roadBorders: [Dot, Dot][],
        traffic: TrafficCar[],
    ): RayDot | null {
        let touches: RayDot[] = [];
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1],
            );
            if (touch) touches.push(touch);
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length],
                );
                if (touch) touches.push(touch);
            }
        }

        if (touches.length > 0) {
            const offsets = touches.map((e) => e.offset);
            const minOffset = Math.min(...offsets);
            const t = touches.find((t) => t.offset === minOffset);
            return t ? t : null;
        }
        return null;
    }
}
