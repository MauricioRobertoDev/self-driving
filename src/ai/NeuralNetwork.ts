import { Level } from "./Level";

export class NeuralNetwork {
    public levels: Level[];
    public inputs: number[] = [];

    constructor(neuronCounts: number[]) {
        this.levels = [];

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    public feedForward(givenInputs: number[]): number[] {
        let outputs = this.levels[0].feedForward(givenInputs);

        for (let i = 1; i < this.levels.length; i++) {
            outputs = this.levels[i].feedForward(outputs);
        }

        return outputs;
    }

    public setInputs(inputs: number[]): void {
        this.inputs = inputs;
    }

    public getOutputs(): number[] {
        if (!this.inputs) {
            throw new Error("Sem entradas registradas, use setInput primeiro.");
        }

        return this.feedForward(this.inputs);
    }
}
