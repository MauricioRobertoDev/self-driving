export class Assets {
    private _images: Map<string, HTMLImageElement> = new Map();

    constructor() {
        this._loadImagesOfGame();
    }

    /**
     * PÚBLICO
     */
    public addImage(id: string, img: HTMLImageElement): Assets {
        this._validateImage(img);
        this._images.set(id, img);
        return this;
    }

    public getImage(id: string): HTMLImageElement {
        if (!this._images.has(id)) {
            throw new Error(
                "A imagem requisitada não existe, veja que ela está no html com o atributo 'game'",
            );
        }

        return this._images.get(id) as HTMLImageElement;
    }

    /**
     * PRIVADO
     */
    private _loadImagesOfGame(): void {
        const images = document.getElementsByTagName("img");

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img.hasAttribute("game")) {
                img.style.display = "none";
                this._validateImage(img);
                this._images.set(img.id, img);
            }
        }
    }

    private _validateImage(img: HTMLImageElement): void {
        if (img.src == undefined)
            throw new Error(
                `Uma imagem não tem caminho definido, veja o src das imagens.`,
            );

        if (img.id == undefined)
            throw new Error(`A imagem com caminho "${img.src}" não tem um id.`);

        if (img.width == 0 || img.height == 0)
            throw new Error(`A imagem com id "${img.id}" não tem dimenssões.`);
    }
}
