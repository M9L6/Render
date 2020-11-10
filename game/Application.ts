import { EInputEventType } from "./input/CanvasInputEvent";
import { CanvasKeyBoardEvent } from "./input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "./input/CanvasMouseEvent";
import { Vec2 } from "./math/Vec2";
import { Timer, TimerCallback } from "./utils/Timer";

export class Application implements EventListenerObject {
    private _timeId: number = -1;
    private _fps: number = 0;

    protected _start: boolean = false;
    protected _requestId: number = -1;
    protected _lastTime!: number;
    protected _startTime!: number;
    protected _isMouseDonw: boolean;

    public isSupportMouseMove: boolean;
    public canvas: HTMLCanvasElement;
    public timers: Timer[] = [];
    public get fps(): number {
        return this._fps;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener("mousedown", this, false);
        this.canvas.addEventListener("mouseup", this, false);
        this.canvas.addEventListener("mousemove", this, false);
        this.canvas.oncontextmenu = () => {
            return false;
        };
        window.addEventListener("keydown", this, false);
        window.addEventListener("keyup", this, false);
        window.addEventListener("keypress", this, false);
        this._isMouseDonw = false;
        this.isSupportMouseMove = false;
    }

    private _viewportToCanvasCoordinate(evt: MouseEvent): Vec2 {
        if (this.canvas) {
            let rect: ClientRect = this.canvas.getBoundingClientRect();
            /*if (evt.type === "mousedown") {
                console.log("boundingClientRect : " + JSON.stringify(rect));
                console.log(
                    "clientX :" + evt.clientX + " clientY :" + evt.clientY
                );
            }*/
            if (evt.target) {
                let borderLeftWidth: number = 0;
                let borderTopWidth: number = 0;
                let paddingLeft: number = 0;
                let paddingTop: number = 0;
                let decl: CSSStyleDeclaration = window.getComputedStyle(
                    evt.target as HTMLElement
                );
                let strNumber: string | null = decl.borderLeftWidth;
                if (strNumber !== null) {
                    borderLeftWidth = parseInt(strNumber, 10);
                }
                strNumber = decl.borderTopWidth;
                if (strNumber !== null) {
                    borderTopWidth = parseInt(strNumber, 10);
                }
                strNumber = decl.paddingLeft;
                if (strNumber !== null) {
                    paddingLeft = parseInt(strNumber, 10);
                }
                strNumber = decl.paddingTop;
                if (strNumber !== null) {
                    paddingTop = parseInt(strNumber, 10);
                }
                let x: number =
                    evt.clientX - rect.left - borderLeftWidth - paddingLeft;
                let y: number =
                    evt.clientY - rect.top - borderTopWidth - paddingTop;
                let pos = Vec2.create(x, y);
                /* if (evt.type === "mousedown") {
                    console.log(
                        " borderLeftWidth: " +
                            borderLeftWidth +
                            "   borderTopWidth: " +
                            borderTopWidth
                    );
                    console.log(
                        " paddingLeft: " +
                            paddingLeft +
                            "  paddingTop: " +
                            paddingTop
                    );
                    console.log("变换后的canvasPosition : " + pos);
                }*/
                return pos;
            }
        }
        alert("canvas未设置");
        throw new Error("canvas未设置");
    }

    private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
        let event: MouseEvent = evt as MouseEvent;
        let mousePosition: Vec2 = this._viewportToCanvasCoordinate(event);
        let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(
            mousePosition,
            event.button,
            event.altKey,
            event.ctrlKey,
            event.shiftKey
        );
        return canvasMouseEvent;
    }

    private _toCanvasKeyBoardEvent(evt: Event): CanvasKeyBoardEvent {
        let event: KeyboardEvent = evt as KeyboardEvent;
        let canvasKeyBoardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(
            event.key,
            event.keyCode,
            event.repeat,
            event.altKey,
            event.ctrlKey,
            event.shiftKey
        );
        return canvasKeyBoardEvent;
    }

    private _handleTimers(intervalSec: number): void {
        for (let i = 0; i < this.timers.length; i++) {
            let timer: Timer = this.timers[i];
            if (timer.enabled === false) continue;
            timer.countdown -= intervalSec;
            if (timer.countdown < 0) {
                timer.callback(timer.id, timer.callbackData);
                if (timer.onlyOnce === false) {
                    timer.countdown = timer.timeout;
                } else {
                    this.removeTimer(timer.id);
                }
            }
        }
    }

    protected dispatchMouseDown(evt: CanvasMouseEvent): void {
        evt.type = EInputEventType.MOUSEDOWN;
    }

    protected dispatchMouseUp(evt: CanvasMouseEvent): void {
        evt.type = EInputEventType.MOUSEUP;
    }

    protected dispatchMouseMove(evt: CanvasMouseEvent): void {
        evt.type = EInputEventType.MOUSEMOVE;
    }

    protected dispatchMouseDrag(evt: CanvasMouseEvent): void {
        evt.type = EInputEventType.MOUSEDRAG;
    }

    protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
        evt.type = EInputEventType.KEYPRESS;
    }

    protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
        evt.type = EInputEventType.KEYDOWN;
    }

    protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {
        evt.type = EInputEventType.KEYUP;
    }

    public addTimer(
        callback: TimerCallback,
        timeout: number = 1.0,
        onlyOnce: boolean = false,
        data: any = undefined
    ): number {
        let timer: Timer;
        for (let i = 0; i < this.timers.length; i++) {
            timer = this.timers[i];
            if (timer.enabled === false) {
                timer.callback = callback;
                timer.callbackData = data;
                timer.timeout = timeout;
                timer.countdown = timeout;
                timer.enabled = true;
                timer.onlyOnce = onlyOnce;
                return timer.id;
            }
        }
        timer = new Timer(callback);
        timer.callbackData = data;
        timer.timeout = timeout;
        timer.countdown = timeout;
        timer.enabled = true;
        timer.id = ++this._timeId;
        timer.onlyOnce = onlyOnce;
        this.timers.push(timer);
        return timer.id;
    }

    public removeTimer(id: number): boolean {
        let found: boolean = false;
        for (let i = 0; i < this.timers.length; i++) {
            if (this.timers[i].id === id) {
                let timer: Timer = this.timers[i];
                timer.enabled = false;
                found = true;
                break;
            }
        }
        return found;
    }

    public handleEvent(evt: Event): void {
        switch (evt.type) {
            case "mousedown":
                this._isMouseDonw = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt));
                break;
            case "mouseup":
                this._isMouseDonw = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt));
                break;
            case "mousemove":
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt));
                }
                if (this._isMouseDonw) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt));
                }
                break;
            case "keypress":
                this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt));
                break;
            case "keydown":
                this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt));
                break;
            case "keyup":
                this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt));
                break;
            default:
                break;
        }
    }

    public start(): void {
        if (!this._start) {
            this._start = true;
            this._requestId = -1;
            this._startTime = -1;
            this._lastTime = -1;

            this._requestId = requestAnimationFrame((elapsedMsec): void => {
                this.step(elapsedMsec);
            });
        }
    }

    public stop(): void {
        if (this._start) {
            cancelAnimationFrame(this._requestId);
            this._requestId = -1;
            this._lastTime = -1;
            this._startTime = -1;
            this._start = false;
        }
    }

    public isRunning(): boolean {
        return this._start;
    }

    protected step(timeStamp: number): void {
        if (this._startTime === -1) this._startTime = timeStamp;
        if (this._lastTime === -1) this._lastTime = timeStamp;
        let elapsedMsec: number = timeStamp - this._startTime;

        let intervalSec: number = timeStamp - this._lastTime;
        if (intervalSec !== 0) {
            this._fps = 1000 / intervalSec;
        }
        intervalSec /= 1000;
        this._lastTime = timeStamp;
        this._handleTimers(intervalSec);
        /* console.log(
            "elapsedTime = " + elapsedMsec + "  intervalSec = " + intervalSec
        );*/
        this.update(elapsedMsec, intervalSec);
        this.render();
        this._requestId = requestAnimationFrame((elapsedMsec): void => {
            this.step(elapsedMsec);
        });
    }

    public update(elapsedMsec: number, intervalSec: number): void {}

    public render(): void {}
}
