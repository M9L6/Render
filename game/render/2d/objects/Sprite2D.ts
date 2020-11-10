import { Mat2D } from "../../../math/Mat2D";
import { Transform2D } from "../../../math/Transform2D";
import { Vec2 } from "../../../math/Vec2";
import { ERenderType } from "./IRenderState";
import { IShape } from "../shapes/IShape";
import {
    EOrder,
    ISprite,
    KeyboardEventHandler,
    MouseEventHandler,
    RenderEventHandler,
    UpdateEventHandler,
} from "./ISprite";
import { ISpriteContainer } from "../manager/ISpriteContainer";
import { SpriteNode } from "./SpriteNode";
import { TreeNode } from "../../../dataStruct/TreeNode";

export class Sprite2D implements ISprite {
    public showCoordSystem: boolean = false;
    public renderType: ERenderType = ERenderType.FILL;
    public isVisible: boolean = true;
    public fillStyle: string | CanvasGradient | CanvasPattern = "white";
    public strokeStyle: string | CanvasGradient | CanvasPattern = "black";
    public lineWidth: number = 1;

    public transform: Transform2D = new Transform2D();

    public name: string;
    public shape: IShape;
    public data: any;
    public owner!: ISpriteContainer;

    public mouseEvent: MouseEventHandler | null = null;
    public keyEvent: KeyboardEventHandler | null = null;
    public updateEvent: UpdateEventHandler | null = null;
    public renderEvent: RenderEventHandler | null = null;

    public set x(x: number) {
        this.transform.position.x = x;
    }
    public get x(): number {
        return this.transform.position.x;
    }

    public set y(y: number) {
        this.transform.position.y = y;
    }
    public get y(): number {
        return this.transform.position.y;
    }

    public set rotation(rotation: number) {
        this.transform.rotation = rotation;
    }
    public get rotation(): number {
        return this.transform.rotation;
    }

    public set scaleX(s: number) {
        this.transform.scale.x = s;
    }
    public get scaleX(): number {
        return this.transform.scale.x;
    }

    public set scaleY(s: number) {
        this.transform.scale.y = s;
    }
    public get scaleY(): number {
        return this.transform.scale.y;
    }

    constructor(shape: IShape, name: string) {
        this.name = name;
        this.shape = shape;
    }

    public getWorldMatrix(): Mat2D {
        if (this.owner instanceof SpriteNode) {
            let arr: TreeNode<ISprite>[] = [];
            let curr: TreeNode<ISprite> | undefined = this.owner as SpriteNode;
            while (curr !== undefined) {
                arr.push(curr);
                curr = curr.parent;
            }
            let out: Mat2D = Mat2D.create();
            let currMat: Mat2D;
            for (let i = arr.length - 1; i >= 0; i--) {
                curr = arr[i];
                if (curr.data) {
                    currMat = (curr.data as Sprite2D).transform.toMatrix();
                    Mat2D.multiply(out, currMat, out);
                }
            }
            return out;
        }
        return this.transform.toMatrix();
    }

    public getLocalMatrix(): Mat2D {
        let src: Mat2D = this.getWorldMatrix();
        let out: Mat2D = Mat2D.create();
        if (Mat2D.invert(src, out)) {
            return out;
        } else {
            alert("矩阵求逆失败");
            throw new Error("矩阵求逆失败");
        }
    }

    public update(mesc: number, diff: number, order: EOrder): void {
        if (this.updateEvent) {
            this.updateEvent(this, mesc, diff, order);
        }
    }

    public hitTest(localPt: Vec2): boolean {
        if (this.isVisible) {
            return this.shape.hitTest(localPt, this);
        } else {
            return false;
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.isVisible) {
            this.shape.beginDraw(this, this, context);
            if (this.renderEvent !== null) {
                this.renderEvent(this, context, EOrder.PREORDER);
            }
            this.shape.draw(this, this, context);
            if (this.renderEvent !== null) {
                this.renderEvent(this, context, EOrder.POSTORDER);
            }
            this.shape.endDraw(this, this, context);
        }
    }
}
