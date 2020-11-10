import { EInputEventType } from "../../../input/CanvasInputEvent";
import { CanvasKeyBoardEvent } from "../../../input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../../../input/CanvasMouseEvent";
import { Mat2D } from "../../../math/Mat2D";
import { Math2D } from "../../../math/Math2D";
import { IDispatcher } from "./IDispatcher";
import { EOrder, ISprite } from "../objects/ISprite";
import { ISpriteContainer } from "./ISpriteContainer";
import { Sprite2D } from "../objects/Sprite2D";

export class Sprite2DManager implements ISpriteContainer, IDispatcher {
    private _sprites: ISprite[] = [];
    private _dragSprite: ISprite | undefined = undefined;

    public get container(): ISpriteContainer {
        return this;
    }

    public getParentSprite(): ISprite | undefined {
        return undefined;
    }
    public readonly sprite!: ISprite;

    public name: string = "Sprite2DManager";

    public addSprite(sprite: ISprite): ISpriteContainer {
        sprite.owner = this;
        this._sprites.push(sprite);
        return this;
    }

    public removeSpriteAt(idx: number): void {
        this._sprites.splice(idx, 1);
    }

    public removeSprite(sprite: ISprite): boolean {
        let idx = this.getSpriteIndex(sprite);
        if (idx !== -1) {
            this.removeSpriteAt(idx);
            return true;
        }
        return false;
    }

    public removeAll(): void {
        this._sprites = [];
    }

    public getSprite(idx: number): ISprite {
        if (idx < 0 || idx > this._sprites.length - 1) {
            throw new Error("参数idx越界");
        }
        return this._sprites[idx];
    }

    public getSpriteCount(): number {
        return this._sprites.length;
    }

    public getSpriteIndex(sprite: ISprite): number {
        for (let i = 0; i < this._sprites.length; i++) {
            if (this._sprites[i] === sprite) {
                return i;
            }
        }
        return -1;
    }

    public dispatchUpdate(msec: number, diff: number): void {
        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].update(msec, diff, EOrder.PREORDER);
        }

        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].update(msec, diff, EOrder.POSTORDER);
        }
    }

    public dispatchDraw(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this._sprites.length; i++) {
            (this._sprites[i] as Sprite2D).draw(context);
        }
    }

    public dispatchKeyEvent(evt: CanvasKeyBoardEvent): void {
        let spr: ISprite;
        for (let i = 0; i < this._sprites.length; i++) {
            spr = this._sprites[i];
            if (spr.keyEvent) {
                spr.keyEvent(spr, evt);
            }
        }
    }

    public dispatchMouseEvent(evt: CanvasMouseEvent): void {
        if (evt.type === EInputEventType.MOUSEUP) {
            this._dragSprite = undefined;
        } else if (evt.type === EInputEventType.MOUSEDRAG) {
            if (this._dragSprite !== undefined) {
                if (this._dragSprite.mouseEvent !== null) {
                    this._dragSprite.mouseEvent(this._dragSprite, evt);
                    return;
                }
            }
        }
        let spr: ISprite;
        for (let i = this._sprites.length - 1; i >= 0; i--) {
            spr = this._sprites[i];
            let mat: Mat2D | null = spr.getLocalMatrix();

            Math2D.transform(mat, evt.canvasPosition, evt.localPosition);

            if (spr.hitTest(evt.localPosition)) {
                evt.hasLocalPosition = true;
                if (evt.type === EInputEventType.MOUSEDOWN) {
                    this._dragSprite = spr;
                }
                if (spr.mouseEvent) {
                    spr.mouseEvent(spr, evt);
                    return;
                }
            }
        }
    }
}
