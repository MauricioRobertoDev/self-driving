import { Entity } from "../engine/Entity";
import { Keyboard } from "../engine/Keyboard";
import { Dot } from "../engine/Util";

export abstract class AbstractCar extends Entity {
    public maxSpeed;
    public speed = 0;
    public angle = 0;
    public friction = 0.05;
    public acceleration = 0.1;
    public damaged = false;
    public polygon: Dot[] = [];
    // controles
    public forward = false;
    public reverse = false;
    public left = false;
    public right = false;
    // dimenssões
    public width = 50;
    public height = 80;

    constructor(id: string, x: number, y: number, maxSpeed: number) {
        super(id, x, y);
        this.maxSpeed = maxSpeed;
    }

    /**
     * PÚBLICO
     */
    public explode(): void {
        this.damaged = true;
        this.speed = 0;
        // TODO: IDEIA -> sprite de explosão
    }

    /**
     * PROTEGIDO
     */
    protected updatePolygon(): void {
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

    protected updatePosition(): void {
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

    protected abstract updateControls(keyboard: Keyboard): void;
}
