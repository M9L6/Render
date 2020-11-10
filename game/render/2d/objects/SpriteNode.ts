import { IEnumerator } from "../../../dataStruct/IEnumerator";
import { NodeEnumeratorFactory } from "../../../dataStruct/NodeEnumeratorFactory";
import { TreeNode } from "../../../dataStruct/TreeNode";
import { Mat2D } from "../../../math/Mat2D";
import { Math2D } from "../../../math/Math2D";
import { Vec2 } from "../../../math/Vec2";
import { ISpriteContainer } from "../manager/ISpriteContainer";
import { EOrder, ISprite } from "./ISprite";
import { Sprite2D } from "./Sprite2D";

export class SpriteNode extends TreeNode<ISprite> implements ISpriteContainer {
    public get sprite(): ISprite | undefined {
        return this.data;
    }

    constructor(
        sprite: ISprite,
        parent: SpriteNode | undefined = undefined,
        name: string = "SpriteNode"
    ) {
        super(sprite, parent, name);
    }

    public addSprite(sprite: ISprite): ISpriteContainer {
        return new SpriteNode(sprite, this, sprite.name);
    }

    public removeSprite(sprite: ISprite): boolean {
        let idx: number = this.getSpriteIndex(sprite);
        if (idx === -1) return false;
        if (this.removeChildAt(idx) === undefined) {
            return false;
        }
        return true;
    }

    public removeAll(includeThis: boolean): void {
        let iter: IEnumerator<TreeNode<ISprite>>;
        iter = NodeEnumeratorFactory.create_bf_r2l_b2t_iter(this);
        let current: TreeNode<ISprite> | undefined = undefined;
        while (iter.moveNext()) {
            current = iter.current;
            if (current !== undefined) {
                if (current.data !== undefined) {
                    if (current === this) {
                        if (includeThis === true) {
                            current.data = undefined;
                            current = current.remove();
                        }
                    } else {
                        current.data = undefined;
                        current = current.remove();
                    }
                }
            }
        }
    }

    public getSprite(idx: number): ISprite {
        if (idx < 0 || idx > this.childCount - 1) {
            throw new Error("参数idx越界");
        }
        let spr: ISprite | undefined = (this.getChildAt(idx) as SpriteNode)
            .sprite;
        if (spr === undefined) {
            alert("sprite为undefined");
            throw new Error("sprite为undefined");
        }
        return spr;
    }

    public getParentSprite(): ISprite | undefined {
        let parent: SpriteNode | undefined = this.parent as SpriteNode;
        if (parent !== undefined) {
            return parent.sprite;
        }
        return undefined;
    }

    public getSpriteCount(): number {
        return this.childCount;
    }

    public addChildAt(
        child: TreeNode<ISprite>,
        idx: number
    ): TreeNode<ISprite> | undefined {
        let ret: TreeNode<ISprite> | undefined = super.addChildAt(child, idx);
        if (ret !== undefined) {
            if (ret.data) {
                ret.data.owner = ret as SpriteNode;
            }
        }
        return ret;
    }

    public getSpriteIndex(sprite: ISprite): number {
        for (let i = 0; i < this.childCount; i++) {
            let child: SpriteNode = this.getChildAt(i) as SpriteNode;
            if (
                child !== undefined &&
                child.sprite !== undefined &&
                child.sprite === sprite
            ) {
                return i;
            }
        }
        return -1;
    }

    public findSprite(
        src: Vec2,
        localPoint: Vec2 | null = null
    ): ISprite | undefined {
        let iter: IEnumerator<TreeNode<
            ISprite
        >> = NodeEnumeratorFactory.create_bf_r2l_b2t_iter(this.root);
        let current: TreeNode<ISprite> | undefined = undefined;
        let mat: Mat2D;
        let dest: Vec2 = Vec2.create();
        while (iter.moveNext()) {
            current = iter.current;
            if (current !== undefined) {
                if (current.data !== undefined) {
                    mat = current.data.getLocalMatrix();
                    Math2D.transform(mat, src, dest);
                    if (current.data.hitTest(dest)) {
                        if (localPoint !== null) {
                            localPoint.x = dest.x;
                            localPoint.y = dest.y;
                        }
                        return current.data;
                    }
                }
            }
        }
        return undefined;
    }

    public update(msec: number, diffSec: number): void {
        if (this.sprite !== undefined) {
            this.sprite.update(msec, diffSec, EOrder.PREORDER);
            this._updateChildren(msec, diffSec);
            this.sprite.update(msec, diffSec, EOrder.POSTORDER);
        }
    }

    protected _updateChildren(msec: number, diffSec: number) {
        for (let i = 0; i < this.childCount; i++) {
            let child: TreeNode<ISprite> | undefined = this.getChildAt(i);
            if (child !== undefined) {
                let spriteNode: SpriteNode = child as SpriteNode;
                spriteNode.update(msec, diffSec);
            }
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.sprite !== undefined) {
            (this.sprite as Sprite2D).draw(context);
            this._drawChildren(context);
        }
    }

    protected _drawChildren(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.childCount; i++) {
            let child: TreeNode<ISprite> | undefined = this.getChildAt(i);
            if (child !== undefined) {
                let spriteNode: SpriteNode = child as SpriteNode;
                spriteNode.draw(context);
            }
        }
    }
}
