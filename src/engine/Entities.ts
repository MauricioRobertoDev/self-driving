import { Assets } from "./Assets";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Entities {
    private _entities: Map<string, Entity> = new Map();

    constructor() {}

    public add(entity: Entity): void {
        this._entities.set(entity.id, entity);
    }

    public get(id: string): Entity {
        if (this._entities.has(id)) {
            return this._entities.get(id) as Entity;
        }

        throw new Error(
            `A entidade ${id} não existe como uma entidade pai, verefique se o id está correto`,
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
}
