import { NeuralNetwork } from "../ai/NeuralNetwork";
import { Keyboard } from "../engine/Keyboard";
//
import { PlayerCar } from "./PlayerCar";
//

export class AIPlayerCar extends PlayerCar {
    constructor(id: string, x: number, y: number, maxSpeed: number) {
        super(id, x, y, maxSpeed);
    }

    protected updateControls(_keyboard: Keyboard) {
        const outputs = NeuralNetwork.getOutputs(this.brain);

        this.forward = outputs[0] ? true : false;
        this.left = outputs[1] ? true : false;
        this.right = outputs[2] ? true : false;
        this.reverse = outputs[3] ? true : false;
    }
}
