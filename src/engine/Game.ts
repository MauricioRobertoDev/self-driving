import { Assets } from "./Assets";
import { Keyboard } from "./Keyboard";
import { Screen } from "./Screen";

export abstract class Game {
    private _running = false;

    public screen: Screen;
    public keyboard: Keyboard;
    public assets: Assets;

    constructor(width: number, height: number) {
        this.screen = new Screen(width, height);
        this.keyboard = new Keyboard();
        this.assets = new Assets();
    }

    /**
     * PÚBLICO
     */
    public start(): void {
        this._running = true;
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
        console.log("update");
    }

    private render() {
        this.screen.clear();
        this.screen.height = this.screen.height;
        this.screen.width = this.screen.width;
    }
}
