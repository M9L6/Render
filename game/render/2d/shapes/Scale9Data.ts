import { Inset } from "./Inset";

export class Scale9Dta {
    public image: HTMLImageElement;

    private _inset: Inset;

    public set inset(v: Inset) {
        this._inset = v;
    }

    public get leftMargin(): number {
        return this._inset.leftMargin;
    }

    public get topMargin(): number {
        return this._inset.topMargin;
    }

    public get rightMargin(): number {
        return this._inset.rightMargin;
    }

    public get bottomMargin(): number {
        return this._inset.bottomMargin;
    }

    constructor(img: HTMLImageElement, inset: Inset) {
        this.image = img;
        this._inset = inset;
    }
}
