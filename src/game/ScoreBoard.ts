import { PlayerCar } from "./PlayerCar";

export class ScoreBoard {
    private mutationElement: HTMLElement;
    private generationElement: HTMLElement;
    private scoreElement: HTMLElement;
    private playerElement: HTMLElement;

    constructor() {
        this.mutationElement = document.getElementById(
            "mutation",
        ) as HTMLElement;
        this.generationElement = document.getElementById(
            "generation",
        ) as HTMLElement;
        this.scoreElement = document.getElementById("score") as HTMLElement;
        this.playerElement = document.getElementById("player") as HTMLElement;
    }

    public update(
        mutation: number,
        generation: number,
        player: PlayerCar,
    ): void {
        this.mutationElement.innerText = "Mutação: " + mutation * 100 + "%";
        this.generationElement.innerText = "Geração: " + generation;
        this.scoreElement.innerText = "Score: " + Math.round(player.score);
        this.playerElement.innerText = "Player: " + player.id;
    }
}
