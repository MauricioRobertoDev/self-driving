import { Assets } from "./Assets";
import { Game } from "./Game";
import { Dot } from "./Util";

export abstract class Entity {
    public readonly id: string;
    public position: Dot;
    public parent: Entity | null = null;
    public children: Entity[] = [];

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.position = { x, y };
    }

    /**
     * PÚBLICO
     */
    public addChild(...children: Entity[]) {
        children.forEach((child) => {
            child.parent = this;
            this.children.push(child);
        });
    }

    public getChild(id: string): Entity {
        const child = this.children.find((child) => child.id == id);

        if (child) return child;

        throw new Error(
            `A entidade ${id} não existe como filha da entidade '${this.id}'`,
        );
    }

    public removeChild(id: string): void {
        const child = this.getChild(id);
        const index = this.children.indexOf(child);

        this.children.splice(index, 1);
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
