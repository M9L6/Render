import { ISprite } from "../objects/ISprite";

export interface ISpriteContainer {
    name: string;
    addSprite(sprite: ISprite): ISpriteContainer;
    removeSprite(sprite: ISprite): boolean;
    removeAll(includeThis: boolean): void;
    getSpriteIndex(sprite: ISprite): number;
    getSprite(idx: number): ISprite;
    getSpriteCount(): number;

    getParentSprite(): ISprite | undefined;
    readonly sprite: ISprite | undefined;
}
