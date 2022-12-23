import { Assets } from "./Assets";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Entities {
    private _entities: Entity[] = [];

    constructor() {}

    public add(entity: Entity): void {
        this._entities.push(entity);
    }

    public get(id: string): Entity {
        const entity = this._entities.find((child) => child.id == id);

        if (entity) return entity;

        throw new Error(
            `A entidade ${id} não existe como uma entidade pai, verifique se o id está correto`,
        );
    }

    public update(game: Game) {
        this._entities.forEach((entity) => {
            entity.update(game);
            entity.updateChildren(game);
        });
    }

    public render(ctx: CanvasRenderingContext2D, assets: Assets) {
        this._entities.forEach((entity) => {
            entity.render(ctx, assets);
            entity.renderChildren(ctx, assets);
        });
    }

    public getAllByTag(tag: string): Entity[] {
        return this._entities.filter((entity) => entity.tag == tag);
    }
}
