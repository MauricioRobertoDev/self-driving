import { Assets } from "../engine/Assets";
import { Entity } from "../engine/Entity";
import { Game } from "../engine/Game";
import { lerp, Dot, polysIntersect } from "../engine/Util";
//
import { PlayerCar } from "./PlayerCar";
import { TrafficCar } from "./TrafficCar";

export class Road extends Entity {
    private left: number;
    private right: number;
    private lanesLeft: number;
    private lanesRight: number;
    private top = -100000;
    private bottom = 100000;
    public borders: [Dot, Dot][] = [];

    constructor(
        id: string,
        x: number,
        y: number,
        private width: number,
        private lanesWidth: number,
        private laneCount: number = 3,
    ) {
        super(id, x, y);
        this.left = this.position.x - this.width / 2;
        this.right = this.position.x + this.width / 2;
        this.lanesLeft = this.position.x - this.lanesWidth / 2;
        this.lanesRight = this.position.x + this.lanesWidth / 2;
        this.borders = [
            [
                { x: this.left, y: this.top },
                { x: this.left, y: this.bottom },
            ],
            [
                { x: this.right, y: this.top },
                { x: this.right, y: this.bottom },
            ],
        ];
    }

    public update(_game: Game) {
        this.checkCollisions();
    }

    public render(ctx: CanvasRenderingContext2D, assets: Assets) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";
        ctx.setLineDash([5]);

        const img = assets.getImage("race");
        const ptrn = ctx.createPattern(img, "repeat") as CanvasPattern;
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 100000, 700, -100000000);

        for (let i = 0; i <= this.laneCount; i++) {
            const x = lerp(this.lanesLeft, this.lanesRight, i / this.laneCount);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.strokeStyle = "blue";
        ctx.setLineDash([0]);
        this.borders.forEach((border) => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }

    public laneCenter(laneIndex: number) {
        const laneWidth = this.lanesWidth / this.laneCount;
        return (
            this.lanesLeft +
            laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth
        );
    }

    public getTraffic(): TrafficCar[] {
        let traffic: TrafficCar[] = [];

        this.children.forEach((child) => {
            if (child instanceof TrafficCar) traffic.push(child);
        });

        return traffic;
    }

    public getPlayers(): PlayerCar[] {
        let players: PlayerCar[] = [];

        this.children.forEach((child) => {
            if (child instanceof PlayerCar) players.push(child);
        });

        return players;
    }

    private checkCollisions(): void {
        this.getPlayers().forEach((player) => {
            // colisão com as bordas da pista
            for (let i = 0; i < this.borders.length; i++) {
                if (polysIntersect(player.polygon, this.borders[i]))
                    player.explode();
            }

            // colisão com os carros
            const traffic = this.getTraffic();
            for (let i = 0; i < traffic.length; i++) {
                const trafficCar = traffic[i] as TrafficCar;
                if (polysIntersect(player.polygon, trafficCar.polygon)) {
                    player.explode();
                }
            }
        });
    }
}