export class Global {
    private _vars: Map<string, any> = new Map();

    constructor() {}

    public set(id: string, value: any): void {
        this._vars.set(id, value);
    }

    public get(id: string): any {
        if (this._vars.has(id)) return this._vars.get(id);

        throw new Error(`A variavel ${id} não existe.`);
    }
}
