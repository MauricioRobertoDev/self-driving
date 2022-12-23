export class Keyboard {
    private _keyPressed: Array<string> = [];

    constructor() {
        document.addEventListener("keydown", this._keyDownEvent.bind(this));
        document.addEventListener("keyup", this._keyUpEvent.bind(this));
    }

    /**
     * PÚBLICO
     */
    public isDown(key: string) {
        return this._keyPressed.indexOf(key) !== -1;
    }

    /**
     * PRIVADO
     */
    private _keyDownEvent(evt: KeyboardEvent) {
        if (this._keyPressed.indexOf(evt.key) === -1) {
            this._keyPressed.push(evt.key);
        }
    }

    private _keyUpEvent(evt: KeyboardEvent) {
        if (this._keyPressed.indexOf(evt.key) !== -1) {
            this._keyPressed = this._keyPressed.filter(
                (key) => key !== evt.key,
            );
        }
    }
}
