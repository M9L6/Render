import { Shape_Hit_Draw_TestDemo } from "../../../../test/Shape_Hit_Draw_TestDemo";
import { TreeNode } from "../../../dataStruct/TreeNode";
import { EInputEventType } from "../../../input/CanvasInputEvent";
import { CanvasKeyBoardEvent } from "../../../input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../../../input/CanvasMouseEvent";
import { ERenderType } from "../objects/IRenderState";
import { ISprite } from "../objects/ISprite";
import { SpriteNode } from "../objects/SpriteNode";
import { IDispatcher } from "./IDispatcher";
import { ISpriteContainer } from "./ISpriteContainer";
import { SpriteFactory } from "./SpriteFactory";

export class SpriteNodeManager implements IDispatcher {
    private _rootNode: SpriteNode;
    private _dragSprite: ISprite | undefined = undefined;

    public get container(): ISpriteContainer {
        return this._rootNode;
    }

    constructor(width: number, height: number) {
        let spr: ISprite = SpriteFactory.createSprite(
            SpriteFactory.createGrid(width, height)
        );
        spr.name = "root";
        spr.strokeStyle = "black";
        spr.fillStyle = "white";
        spr.renderType = ERenderType.STROKE_FILL;
        this._rootNode = new SpriteNode(spr, undefined, spr.name);
        spr.owner = this._rootNode;
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

        let spr: ISprite | undefined = this._rootNode.findSprite(
            evt.canvasPosition,
            evt.localPosition
        );
        if (spr !== undefined) {
            evt.hasLocalPosition = true;
            if (evt.button === 0 && evt.type === EInputEventType.MOUSEDOWN) {
                this._dragSprite = spr;
            }
            if (evt.type === EInputEventType.MOUSEDRAG) return;
            if (spr.mouseEvent) {
                spr.mouseEvent(spr, evt);
                return;
            }
        } else {
            evt.hasLocalPosition = false;
        }
    }

    public dispatchKeyEvent(evt: CanvasKeyBoardEvent): void {
        this._rootNode.visit((node: TreeNode<ISprite>): void => {
            if (node.data !== undefined) {
                if (node.data.keyEvent !== null) {
                    node.data.keyEvent(node.data, evt);
                }
            }
        });
    }

    public dispatchUpdate(msec: number, diffSec: number): void {
        this._rootNode.update(msec, diffSec);
    }

    public dispatchDraw(context: CanvasRenderingContext2D): void {
        this._rootNode.draw(context);
    }
}
