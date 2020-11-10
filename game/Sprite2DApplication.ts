import { Canvas2DApplication } from "./Canvas2DApplication";
import { CanvasKeyBoardEvent } from "./input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "./input/CanvasMouseEvent";
import { IDispatcher } from "./render/2d/manager/IDispatcher";
import { ISpriteContainer } from "./render/2d/manager/ISpriteContainer";
import { Sprite2DManager } from "./render/2d/manager/Sprite2DManager";
import { SpriteNodeManager } from "./render/2d/manager/SpriteNodeManager";

export class Sprite2DApplication extends Canvas2DApplication {
    protected _dispatcher: IDispatcher;

    public get rootContainer(): ISpriteContainer {
        return this._dispatcher.container;
    }

    constructor(canvas: HTMLCanvasElement, isHierarchial: boolean = true) {
        super(canvas);
        if (isHierarchial) {
            this._dispatcher = new SpriteNodeManager(
                canvas.width,
                canvas.height
            );
        } else {
            this._dispatcher = new Sprite2DManager();
        }
    }

    protected dispatchMouseDown(evt: CanvasMouseEvent): void {
        super.dispatchMouseDown(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }

    protected dispatchMouseUp(evt: CanvasMouseEvent): void {
        super.dispatchMouseUp(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }

    protected dispatchMouseMove(evt: CanvasMouseEvent): void {
        super.dispatchMouseMove(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }

    protected dispatchMouseDrag(evt: CanvasMouseEvent): void {
        super.dispatchMouseDrag(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }

    protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
        super.dispatchKeyDown(evt);
        this._dispatcher.dispatchKeyEvent(evt);
    }

    protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {
        super.dispatchKeyUp(evt);
        this._dispatcher.dispatchKeyEvent(evt);
    }

    protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
        super.dispatchKeyPress(evt);
        this._dispatcher.dispatchKeyEvent(evt);
    }

    public update(msec: number, diff: number): void {
        this._dispatcher.dispatchUpdate(msec, diff);
    }

    public render(): void {
        if (this.context2D) {
            this.context2D.clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            this._dispatcher.dispatchDraw(this.context2D);
        }
    }
}
