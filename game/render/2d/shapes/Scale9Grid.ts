import { Rectangle } from "../../../math/Rectangle";
import { Size } from "../../../math/Size";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { Rect } from "./Rect";
import { Scale9Dta } from "./Scale9Data";

export enum EImageFillType {
    NONE,
    STRETCH,
    REPEAT,
    REPEAT_X,
    REPEAT_Y,
}

export class Scale9Grid extends Rect {
    public data: Scale9Dta;
    public srcRects!: Rectangle[];
    public destRects!: Rectangle[];

    public get type(): string {
        return "Scale9Grid";
    }

    constructor(
        data: Scale9Dta,
        width: number,
        height: number,
        u: number,
        v: number
    ) {
        super(width, height, u, v);
        this.data = data;
        this._calcDestRects();
    }

    private _calcDestRects(): void {
        this.srcRects = [];
        this.destRects = [];
        let rc: Rectangle;

        //left-top
        rc = new Rectangle();
        rc.origin.reset(0, 0);
        rc.size.width = this.data.leftMargin;
        rc.size.height = this.data.topMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(this.x, this.y);
        rc.size.width = this.data.leftMargin;
        rc.size.height = this.data.topMargin;
        this.destRects.push(rc);

        //center-top
        rc = new Rectangle();
        rc.origin.reset(this.data.leftMargin, 0);
        rc.size.width =
            this.data.image.width -
            this.data.leftMargin -
            this.data.rightMargin;
        rc.size.height = this.data.topMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(this.x + this.data.leftMargin, this.y);
        rc.size.width =
            this.width - this.data.leftMargin - this.data.rightMargin;
        rc.size.height = this.data.topMargin;
        this.destRects.push(rc);

        //right-top
        rc = new Rectangle();
        rc.origin.reset(this.data.image.width - this.data.rightMargin, 0);
        rc.size.width = this.data.rightMargin;
        rc.size.height = this.data.topMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(this.x + this.width - this.data.rightMargin, this.y);
        rc.size.width = this.data.rightMargin;
        rc.size.height = this.data.topMargin;
        this.destRects.push(rc);

        //left-middle
        rc = new Rectangle();
        rc.origin.reset(0, this.data.topMargin);
        rc.size.width = this.data.leftMargin;
        rc.size.height =
            this.data.image.height -
            this.data.topMargin -
            this.data.bottomMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(this.x, this.y + this.data.topMargin);
        rc.size.width = this.data.leftMargin;
        rc.size.height =
            this.height - this.data.topMargin - this.data.bottomMargin;
        this.destRects.push(rc);

        //center-middle
        rc = new Rectangle();
        rc.origin.reset(this.data.leftMargin, this.data.topMargin);
        rc.size.width =
            this.data.image.width -
            this.data.leftMargin -
            this.data.rightMargin;
        rc.size.height =
            this.data.image.height -
            this.data.topMargin -
            this.data.bottomMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(
            this.x + this.data.leftMargin,
            this.y + this.data.topMargin
        );
        rc.size.width =
            this.width - this.data.leftMargin - this.data.rightMargin;
        rc.size.height =
            this.height - this.data.topMargin - this.data.bottomMargin;
        this.destRects.push(rc);

        //right-middle
        rc = new Rectangle();
        rc.origin.reset(
            this.data.image.width - this.data.rightMargin,
            this.data.topMargin
        );
        rc.size.width = this.data.rightMargin;
        rc.size.height =
            this.data.image.height -
            this.data.topMargin -
            this.data.bottomMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(
            this.x + this.width - this.data.rightMargin,
            this.y + this.data.topMargin
        );
        rc.size.width = this.data.rightMargin;
        rc.size.height =
            this.height - this.data.topMargin - this.data.bottomMargin;
        this.destRects.push(rc);

        //left-bottom
        rc = new Rectangle();
        rc.origin.reset(0, this.data.image.height - this.data.bottomMargin);
        rc.size.width = this.data.leftMargin;
        rc.size.height = this.data.bottomMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(this.x, this.y + this.height - this.data.bottomMargin);
        rc.size.width = this.data.leftMargin;
        rc.size.height = this.data.bottomMargin;
        this.destRects.push(rc);

        //center-bottom
        rc = new Rectangle();
        rc.origin.reset(
            this.data.leftMargin,
            this.data.image.height - this.data.bottomMargin
        );
        rc.size.width =
            this.data.image.width -
            this.data.leftMargin -
            this.data.rightMargin;
        rc.size.height = this.data.bottomMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(
            this.x + this.data.leftMargin,
            this.y + this.height - this.data.bottomMargin
        );
        rc.size.width =
            this.width - this.data.leftMargin - this.data.rightMargin;
        rc.size.height = this.data.bottomMargin;
        this.destRects.push(rc);

        //right-bottom
        rc = new Rectangle();
        rc.origin.reset(
            this.data.image.width - this.data.rightMargin,
            this.data.image.height - this.data.bottomMargin
        );
        rc.size.width = this.data.rightMargin;
        rc.size.height = this.data.bottomMargin;
        this.srcRects.push(rc);

        rc = new Rectangle();
        rc.origin.reset(
            this.x + this.width - this.data.rightMargin,
            this.y + this.height - this.data.bottomMargin
        );
        rc.size.width = this.data.rightMargin;
        rc.size.height = this.data.bottomMargin;
        this.destRects.push(rc);
    }

    private _drawImage(
        context: CanvasRenderingContext2D,
        img: HTMLImageElement | HTMLCanvasElement,
        destRect: Rectangle,
        srcRect: Rectangle,
        fillType: EImageFillType = EImageFillType.STRETCH
    ): boolean {
        if (destRect === null || srcRect === null) return false;
        if (fillType === EImageFillType.STRETCH) {
            context.drawImage(
                img,
                srcRect.origin.x,
                srcRect.origin.y,
                srcRect.size.width,
                srcRect.size.height,
                destRect.origin.x,
                destRect.origin.y,
                destRect.size.width,
                destRect.size.height
            );
        } else {
            let rows: number = Math.ceil(
                    destRect.size.width / srcRect.size.width
                ),
                cols: number = Math.ceil(
                    destRect.size.height / srcRect.size.height
                );

            let left: number = 0,
                top: number = 0,
                right: number = 0,
                bottom: number = 0,
                width: number = 0,
                height: number = 0;

            let destRight: number = destRect.origin.x + destRect.size.width,
                destBottom: number = destRect.origin.y + destRect.size.height;
            if (fillType === EImageFillType.REPEAT_X) {
                cols = 1;
            } else if (fillType === EImageFillType.REPEAT_Y) {
                rows = 1;
            }
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    left = destRect.origin.x + i * srcRect.size.width;
                    top = destRect.origin.y + j * srcRect.size.height;
                    width = srcRect.size.width;
                    height = srcRect.size.height;
                    right = left + width;
                    bottom = right + height;
                    if (right > destRight) {
                        width = srcRect.size.width - (right - destRight);
                    }
                    if (bottom > destBottom) {
                        height = srcRect.size.height - (bottom - destBottom);
                    }
                    context.drawImage(
                        img,
                        srcRect.origin.x,
                        srcRect.origin.y,
                        width,
                        height,
                        left,
                        top,
                        width,
                        height
                    );
                }
            }
        }

        return true;
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        for (let i = 0; i < this.srcRects.length; i++) {
            this._drawImage(
                context,
                this.data.image,
                this.destRects[i],
                this.srcRects[i],
                EImageFillType.STRETCH
            );
        }
    }
}
