import { Canvas2DApplication } from "../game/Canvas2DApplication";
import { Rectangle } from "../game/math/Rectangle";
import { Size } from "../game/math/Size";
import { Vec2 } from "../game/math/Vec2";

export enum ETextLayout {
    LEFT_TOP,
    RIGHT_TOP,
    RIGHT_BOTTOM,
    LEFT_BOTTOM,
    CENTER_MIDDLE,
    CENTER_TOP,
    RIGHT_MIDDLE,
    CENTER_BOTTOM,
    LEFT_MIDDLE,
}

export class TestCanvas2dApplication extends Canvas2DApplication {
    private _lineDashOffset: number = 0;
    private _linearGardient!: CanvasGradient;
    private _radialGradient!: CanvasGradient;

    private _state0TimeId: number = -1;

    private _state: number = 0;
    public set state(value: number) {
        this._state = value % 5;
        switch (this._state) {
            case 0:
                if (this._state0TimeId < 0) {
                    this._state0TimeId = this.addTimer(
                        this.timeCallback.bind(this),
                        0.033
                    );
                }
                break;
            default:
                this.removeTimer(this._state0TimeId);
                this._state0TimeId = -1;
                break;
        }
    }

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this._state0TimeId = this.addTimer(this.timeCallback.bind(this), 0.033);
    }

    private _drawRect(x: number, y: number, w: number, h: number): void {
        if (this.context2D !== null) {
            this.context2D.save();

            this.context2D.fillStyle = "grey";
            this.context2D.strokeStyle = "blue"; //"rgb(0,0,255)"

            this.context2D.lineWidth = 2;

            this.context2D.setLineDash([10, 5]);
            this.context2D.lineDashOffset = this._lineDashOffset;

            this.context2D.beginPath();
            this.context2D.moveTo(x, y);
            this.context2D.lineTo(x + w, y);
            this.context2D.lineTo(x + w, y + h);
            this.context2D.lineTo(x, y + h);
            this.context2D.closePath();
            this.context2D.fill();
            this.context2D.stroke();
            this.context2D.restore();
        }
    }

    private _updateLineDashOffset(): void {
        this._lineDashOffset++;
        if (this._lineDashOffset > 10000) {
            this._lineDashOffset = 0;
        }
    }

    private _fillLinearRect(x: number, y: number, w: number, h: number): void {
        if (this.context2D !== null) {
            this.context2D.save();
            if (this._linearGardient === undefined) {
                this._linearGardient = this.context2D.createLinearGradient(
                    x,
                    y,
                    x + w,
                    y + h
                );
                this._linearGardient.addColorStop(0.0, "grey");
                this._linearGardient.addColorStop(0.5, "green");
                this._linearGardient.addColorStop(0.75, "#00f");
                this._linearGardient.addColorStop(1.0, "black");
            }
            this.context2D.fillStyle = this._linearGardient;
            this.context2D.beginPath();
            this.context2D.rect(x, y, w, h);
            this.context2D.fill();
            this.context2D.restore();
        }
    }

    private _fillRadialRect(x: number, y: number, w: number, h: number): void {
        if (this.context2D !== null) {
            this.context2D.save();

            if (this._radialGradient === undefined) {
                let centX: number = x + w * 0.5,
                    centY: number = y + h * 0.5;
                let radius: number = Math.min(w, h);
                radius *= 0.5;
                this._radialGradient = this.context2D.createRadialGradient(
                    centX,
                    centY,
                    radius * 0.3,
                    centX,
                    centY,
                    radius
                );
                this._radialGradient.addColorStop(0.0, "black");
                this._radialGradient.addColorStop(0.25, "rgba(255,0,0,1)");
                this._radialGradient.addColorStop(0.5, "green");
                this._radialGradient.addColorStop(0.75, "#00f");
                this._radialGradient.addColorStop(1.0, "white");
            }
            this.context2D.fillStyle = this._radialGradient;
            this.context2D.beginPath();
            this.context2D.fillRect(x, y, w, h);

            this.context2D.restore();
        }
    }

    private _fillCircle(
        x: number,
        y: number,
        r: number,
        fillStyle: string | CanvasGradient | CanvasPattern = "red"
    ): void {
        if (this.context2D !== null) {
            this.context2D.save();

            this.context2D.fillStyle = fillStyle;
            this.context2D.beginPath();
            this.context2D.arc(x, y, r, 0, Math.PI * 2);
            this.context2D.fill();

            this.context2D.restore();
        }
    }

    private _strokeLine(x0: number, y0: number, x1: number, y1: number): void {
        if (this.context2D !== null) {
            this.context2D.beginPath();
            this.context2D.moveTo(x0, y0);
            this.context2D.lineTo(x1, y1);
            this.context2D.stroke();
        }
    }

    private _strokeCoord(
        orginX: number,
        orginY: number,
        width: number,
        height: number
    ): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = "red";
            this._strokeLine(orginX, orginY, orginX + width, orginY);
            this.context2D.strokeStyle = "blue";
            this._strokeLine(orginX, orginY, orginX, orginY + height);
            this.context2D.restore();
        }
    }

    private _strokeGrid(color: string = "grey", interval: number = 10) {
        if (this.context2D !== null) {
            this.context2D.save();

            this.context2D.strokeStyle = color;
            this.context2D.lineWidth = 0.5;
            for (let i = interval + 0.5; i < this.canvas.width; i += interval) {
                this._strokeLine(i, 0, i, this.canvas.height);
            }
            for (
                let i = interval + 0.5;
                i < this.canvas.height;
                i += interval
            ) {
                this._strokeLine(0, i, this.canvas.width, i);
            }

            this._fillCircle(
                this.canvas.width / 2,
                this.canvas.height / 2,
                5,
                "green"
            );
            this._fillText(
                "origin",
                this.canvas.width / 2,
                this.canvas.height / 2,
                "black"
            );

            this._strokeCoord(
                this.canvas.width / 2,
                this.canvas.height / 2,
                this.canvas.width / 2,
                this.canvas.height / 2
            );

            this.context2D.restore();
        }
    }

    private _fillText(
        txt: string,
        x: number,
        y: number,
        color: string = "white",
        align: CanvasTextAlign = "left",
        baseline: CanvasTextBaseline = "top",
        font: string = "10px sans-serif"
    ): void {
        if (this.context2D !== null) {
            this.context2D.save();

            this.context2D.textAlign = align;
            this.context2D.textBaseline = baseline;
            this.context2D.font = font;
            this.context2D.fillStyle = color;
            this.context2D.fillText(txt, x, y);

            this.context2D.restore();
        }
    }

    private _calcTextSize(
        text: string,
        char: string = "W",
        scale: number = 0.5
    ): Size {
        if (this.context2D !== null) {
            let size: Size = new Size();
            size.width = this.context2D.measureText(text).width;
            let w: number = this.context2D.measureText(char).width;
            size.height = w + w * scale;
            return size;
        }
        alert("context2D渲染上下文为null");
        throw new Error("context2D渲染上下文为null");
    }

    private _calcLocalTextRectangle(
        layout: ETextLayout,
        text: string,
        parentWidth: number,
        parentHeight: number
    ): Rectangle {
        let s: Size = this._calcTextSize(text);
        let o: Vec2 = Vec2.create();

        let left: number = 0,
            top: number = 0;
        let right: number = parentWidth - s.width;
        let bottom: number = parentHeight - s.height;

        let center: number = right * 0.5;
        let middle: number = bottom * 0.5;

        switch (layout) {
            case ETextLayout.LEFT_TOP:
                o.x = left;
                o.y = top;
                break;
            case ETextLayout.RIGHT_TOP:
                o.x = right;
                o.y = top;
                break;
            case ETextLayout.RIGHT_BOTTOM:
                o.x = right;
                o.y = bottom;
                break;
            case ETextLayout.LEFT_BOTTOM:
                o.x = left;
                o.y = bottom;
                break;
            case ETextLayout.CENTER_MIDDLE:
                o.x = center;
                o.y = middle;
                break;
            case ETextLayout.CENTER_TOP:
                o.x = center;
                o.y = top;
                break;
            case ETextLayout.RIGHT_MIDDLE:
                o.x = right;
                o.y = middle;
                break;
            case ETextLayout.CENTER_BOTTOM:
                o.x = center;
                o.y = bottom;
                break;
            case ETextLayout.LEFT_MIDDLE:
                o.x = left;
                o.y = middle;
                break;
        }
        return new Rectangle(o, s);
    }

    private _strokeRect(
        x: number,
        y: number,
        w: number,
        h: number,
        color: string = "red",
        lineWidth: number = 10
    ): void {
        if (this.context2D !== null) {
            this.context2D.save();

            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect(x, y, w, lineWidth);
            this.context2D.rect(
                x + w - lineWidth,
                y + lineWidth,
                lineWidth,
                y - lineWidth
            );
            this.context2D.rect(x, y + h - lineWidth, w - lineWidth, lineWidth);
            this.context2D.rect(
                x,
                y + lineWidth,
                lineWidth,
                y + h - 2 * lineWidth
            );
            this.context2D.fill();

            this.context2D.restore();
        }
    }

    private _fillRectWithTitle(
        x: number,
        y: number,
        w: number,
        h: number,
        title: string = "",
        layout: ETextLayout = ETextLayout.CENTER_MIDDLE,
        color: string = "grey",
        showCoord: boolean = true
    ): void {
        if (this.context2D !== null) {
            this.context2D.save();

            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect(x, y, w, h);
            this.context2D.fill();

            if (title.length !== 0) {
                let rect: Rectangle = this._calcLocalTextRectangle(
                    layout,
                    title,
                    w,
                    h
                );
                this._fillText(
                    title,
                    x + rect.origin.x,
                    y + rect.origin.y,
                    "white",
                    "left",
                    "top",
                    "10px sans-serif"
                );
                this._strokeRect(
                    x + rect.origin.x,
                    y + rect.origin.y,
                    rect.size.width,
                    rect.size.height,
                    "rgba(0,0,0,0.5)"
                );
                this._fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
            }
            if (showCoord) {
                this._strokeCoord(x, y, w + 20, h + 20);
                this._fillCircle(x, y, 3);
            }
            this.context2D.restore();
        }
    }

    private _testCanvas2DTextLayout(): void {
        let x: number = 20;
        let y: number = 20;
        let width: number = this.canvas.width - x * 2;
        let height: number = this.canvas.height - y * 2;
        let drawX: number = x,
            drawY: number = y;
        let radius: number = 3;

        this._fillRectWithTitle(x, y, width, height);

        this._fillText(
            "left-top",
            drawX,
            drawY,
            "black",
            "left",
            "top",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x + width;
        drawY = y;
        this._fillText(
            "right-top",
            drawX,
            drawY,
            "black",
            "right",
            "top",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x;
        drawY = y + height;
        this._fillText(
            "left-bottom",
            drawX,
            drawY,
            "black",
            "left",
            "bottom",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x + width;
        drawY = y + height;
        this._fillText(
            "right-bottom",
            drawX,
            drawY,
            "black",
            "right",
            "bottom",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x + width * 0.5;
        drawY = y + height * 0.5;
        this._fillText(
            "center-middle",
            drawX,
            drawY,
            "black",
            "center",
            "middle",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x + width * 0.5;
        drawY = y;
        this._fillText(
            "center-top",
            drawX,
            drawY,
            "black",
            "center",
            "top",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x + width * 0.5;
        drawY = y + height;
        this._fillText(
            "center-bottom",
            drawX,
            drawY,
            "black",
            "center",
            "bottom",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x;
        drawY = y + height * 0.5;
        this._fillText(
            "left-middle",
            drawX,
            drawY,
            "black",
            "left",
            "middle",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");

        drawX = x + width;
        drawY = y + height * 0.5;
        this._fillText(
            "right-middle",
            drawX,
            drawY,
            "black",
            "right",
            "middle",
            "20px sans-serif"
        );
        this._fillCircle(drawX, drawY, radius, "red");
    }

    private _loadAndDrawImage(url: string): void {
        let img = new Image();
        img.src = url;
        img.onload = (evt: Event): void => {
            if (this.context2D !== null) {
                this.context2D.drawImage(img, 10, 10);
            }
        };
    }

    public timeCallback(id: number, data: any): void {
        this._updateLineDashOffset();
        //this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
    }

    public render(): void {
        if (this.context2D !== null) {
            this.context2D.clearRect(
                0,
                0,
                this.context2D.canvas.width,
                this.context2D.canvas.height
            );
            switch (this._state) {
                case 0:
                    this._drawRect(
                        10,
                        10,
                        this.canvas.width - 20,
                        this.canvas.height - 20
                    );
                    break;
                case 1:
                    this._fillLinearRect(
                        10,
                        10,
                        this.canvas.width - 20,
                        this.canvas.height - 20
                    );
                    break;
                case 2:
                    this._fillRadialRect(
                        10,
                        10,
                        this.canvas.width - 20,
                        this.canvas.height - 20
                    );
                    break;
                case 3:
                    this._strokeGrid();
                    break;
                case 4:
                    this._testCanvas2DTextLayout();
                    break;
            }
        }
    }
}
