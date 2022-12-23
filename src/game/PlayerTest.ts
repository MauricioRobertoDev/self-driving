import { Assets } from "../engine/Assets";
import { Entity } from "../engine/Entity";
import { Game } from "../engine/Game";
import { Keyboard } from "../engine/Keyboard";
import { Dot } from "../engine/Util";

export class PlayerTest extends Entity {
    public maxSpeed = 10;
    public speed = 5;
    public angle = 0;
    public friction = 0.05;
    public acceleration = 0.2;
    public damaged = false;
    public polygon: Dot[] = [];
    // controls
    public forward = false;
    public reverse = false;
    public left = false;
    public right = false;

    public width = 50;
    public height = 80;

    constructor() {
        super("t", 0, 0);
    }

    public update(game: Game): void {
        this.updateControls(game.keyboard);
        this.updatePosition();
    }

    public render(ctx: CanvasRenderingContext2D, assets: Assets): void {
        this.updatePolygon();

        this.damaged ? (ctx.fillStyle = "gray") : (ctx.fillStyle = "blue");
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();
    }

    private updateControls(_keyboard: Keyboard) {
        _keyboard.isDown("w") ? (this.forward = true) : (this.forward = false);
        _keyboard.isDown("s") ? (this.reverse = true) : (this.reverse = false);
        _keyboard.isDown("a") ? (this.left = true) : (this.left = false);
        _keyboard.isDown("d") ? (this.right = true) : (this.right = false);
    }

    private updatePolygon(): void {
        this.polygon = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        this.polygon.push({
            x: this.position.x - Math.sin(this.angle - alpha) * rad,
            y: this.position.y - Math.cos(this.angle - alpha) * rad,
        });
        this.polygon.push({
            x: this.position.x - Math.sin(this.angle + alpha) * rad,
            y: this.position.y - Math.cos(this.angle + alpha) * rad,
        });
        this.polygon.push({
            x: this.position.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.position.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        this.polygon.push({
            x: this.position.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.position.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
    }

    private updatePosition(): void {
        if (this.forward) {
            this.speed += this.acceleration;
            // TODO
        }
        if (this.reverse) this.speed -= this.acceleration;

        if (this.speed > 0) this.speed -= this.friction;
        if (this.speed < 0) this.speed += this.friction;

        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

        if (Math.abs(this.speed) < this.friction) this.speed = 0;

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.left) this.angle += 0.03 * flip;
            if (this.right) this.angle -= 0.03 * flip;
        }

        this.position.x -= Math.sin(this.angle) * this.speed;
        this.position.y -= Math.cos(this.angle) * this.speed;
    }
}
