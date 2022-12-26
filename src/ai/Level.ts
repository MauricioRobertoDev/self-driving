export class Level {
    public inputs: number[];
    public outputs: number[];
    public biases: number[];
    public weights: number[][] = [];

    constructor(inputCount: number, outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        // cada neuronio de saida tem um biases, um valor acima do qual ele irá disparar
        this.biases = new Array(outputCount);

        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        this.randomize();
    }

    private randomize(): void {
        for (let i = 0; i < this.inputs.length; i++) {
            for (let j = 0; j < this.outputs.length; j++) {
                this.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < this.biases.length; i++) {
            this.biases[i] = Math.random() * 2 - 1;
        }
    }

    public feedForward(givenInputs: number[]): number[] {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < this.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputs.length; j++) {
                sum += this.inputs[j] * this.weights[j][i];
            }
            sum > this.biases[i]
                ? (this.outputs[i] = 1)
                : (this.outputs[i] = 0);
        }

        return this.outputs;
    }
}
