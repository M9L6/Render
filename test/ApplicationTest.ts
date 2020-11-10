import { Application } from "../game/Application";
import { CanvasKeyBoardEvent } from "../game/input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../game/input/CanvasMouseEvent";

export class ApplicationTest extends Application {
    protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
        console.log("key : " + evt.key + " is down ");
    }

    protected dispatchMouseDown(evt: CanvasMouseEvent): void {
        console.log(" canvasPostion : " + evt.canvasPosition);
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        /* console.log(
            " elapsedMsec : " + elapsedMsec + " intervalSec : " + intervalSec
        );*/
    }

    public render(): void {
        // console.log("调用render方法");
    }
}
