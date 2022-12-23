import { Assets } from "./Assets";
import { Game } from "./Game";
import { Vector } from "./Vector";

export abstract class Entity {
    private _id: string;
    public angle = 0;
    public position: Vector;
    public parent: Entity | null = null;
    public children: Map<string, Entity> = new Map();

    constructor(id: string, x: number, y: number) {
        this._id = id;
        this.position = new Vector(x, y);
    }

    /**
     * GETTERS E SETTERS
     */
    public get id(): string {
        return this._id;
    }

    /**
     * PÚBLICO
     */
    public addChild(...children: Entity[]) {
        children.forEach((child) => {
            child.parent = this;
            this.children.set(child.id, child);
        });
    }

    public getChild(id: string): Entity {
        if (this.children.has(id)) {
            return this.children.get(id) as Entity;
        }

        throw new Error(
            `A entidade ${id} não existe como filha da entidade '${this.id}'`,
        );
    }

    public removeChild(child: Entity) {
        if (child.parent === this) {
            child.parent = null;
        }
        this.children.delete(child.id);
    }

    // lógica
    public abstract update(game: Game): void;

    public updateChildren(game: Game): void {
        this.children.forEach((child) => child.update(game));
    }

    // desenho
    public abstract render(ctx: CanvasRenderingContext2D, assets: Assets): void;

    public renderChildren(ctx: CanvasRenderingContext2D, assets: Assets): void {
        this.children.forEach((child) => child.render(ctx, assets));
    }
}
