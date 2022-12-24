import { Assets } from "./Assets";
import { Entities } from "./Entities";
import { Global } from "./Global";
import { Keyboard } from "./Keyboard";
import { Screen } from "./Screen";

export class Game {
    private _running = false;

    public screen: Screen;
    public keyboard: Keyboard;
    public assets: Assets;
    public entities: Entities;
    public global: Global;

    public setup: (() => void) | null = null;
    public beforeUpdate: (() => void) | null = null;
    public afterUpdate: (() => void) | null = null;
    public beforeRender: (() => void) | null = null;
    public afterRender: (() => void) | null = null;

    constructor(width: number, height: number) {
        this.screen = new Screen(width, height);
        this.keyboard = new Keyboard();
        this.assets = new Assets();
        this.entities = new Entities();
        this.global = new Global();
    }

    /**
     * PÚBLICO
     */
    public start(): void {
        this._running = true;
        if (this.setup) this.setup();
        this.loop();
    }

    public stop(): void {
        this._running = false;
    }

    /**
     * PRIVADO
     */
    private loop(): void {
        this.update();
        this.render();

        if (this._running) {
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    private update() {
        if (this.beforeUpdate) this.beforeUpdate();

        this.entities.update(this);

        if (this.afterUpdate) this.afterUpdate();
    }

    private render() {
        this.screen.clear();
        this.screen.height = this.screen.height;
        this.screen.width = this.screen.width;

        if (this.beforeRender) this.beforeRender();

        this.entities.render(this.screen.context, this.assets);

        if (this.afterRender) this.afterRender();
    }
}
