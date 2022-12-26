import { lerp } from "../engine/Util";
import { Level } from "./Level";
import { NeuralNetwork } from "./NeuralNetwork";
import { Screen } from "./Screen";

export class Visualizer {
    public screen: Screen;

    public margin: number;
    public top: number;

    public left: number;

    public width: number;
    public height: number;
    public network: NeuralNetwork | null = null;
    public symbols: string[];

    constructor(
        width: number,
        height: number,
        margin: number = 50,
        symbols: string[] = [],
    ) {
        this.screen = new Screen(width, height, "black");

        this.margin = margin;

        this.width = this.screen.width - margin * 2;
        this.height = this.screen.height - margin * 2;

        this.top = margin;
        this.left = margin;

        this.symbols = symbols;
    }

    private loop(time: number = 0): void {
        this.screen.clear();
        this.screen.height = this.screen.height;
        this.screen.width = this.screen.width;
        this.screen.context.lineDashOffset = -time / 50;
        this.drawNetwork();

        requestAnimationFrame(this.loop.bind(this));
    }

    public setNetwork(network: NeuralNetwork): Visualizer {
        this.network = network;
        return this;
    }

    public start() {
        if (this.network) {
            this.loop();
        }
    }

    public drawNetwork() {
        if (this.network) {
            const levelHeight = this.height / this.network.levels.length;
            for (let i = this.network.levels.length - 1; i >= 0; i--) {
                const levelTop =
                    this.top +
                    lerp(
                        this.height - levelHeight,
                        0,
                        this.network.levels.length == 1
                            ? 0.5
                            : i / (this.network.levels.length - 1),
                    );
                this.screen.context.setLineDash([7, 3]);
                this.drawLevel(
                    this.network.levels[i],
                    levelTop,
                    this.left,
                    this.width,
                    levelHeight,
                    i == this.network.levels.length - 1,
                );
            }
        }
    }

    public drawLevel(
        level: Level,
        top: number,
        left: number,
        width: number,
        height: number,
        symbols: boolean,
    ) {
        const nodeRadius = 18;
        const ctx = this.screen.context;
        const right = left + width;
        const bottom = top + height;
        const { inputs, outputs, weights, biases } = level;

        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(this.getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(this.getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = this.getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        for (let i = 0; i < inputs.length; i++) {
            const x = this.getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = this.getRGBA(inputs[i]);
            ctx.fill();
        }

        for (let i = 0; i < outputs.length; i++) {
            const x = this.getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = this.getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.getRGBA(biases[i]);
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (symbols && this.symbols[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = nodeRadius * 1.5 + "px Arial";
                ctx.fillText(this.symbols[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(this.symbols[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    private getNodeX(
        nodes: number[],
        index: number,
        left: number,
        right: number,
    ): number {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1),
        );
    }

    private getRGBA(value: number) {
        const A = Math.abs(value);
        const R = value < 0 ? 0 : 255;
        const G = R;
        const B = value > 0 ? 0 : 255;
        return "rgba(" + R + "," + G + "," + B + "," + A;
    }
}
