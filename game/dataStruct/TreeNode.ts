import { Indexer, IndexerL2R } from "./IAdapter";

export type NodeCallback<T> = (nodex: TreeNode<T>) => void;
export class TreeNode<T> {
    private _parent: TreeNode<T> | undefined;
    private _children: Array<TreeNode<T>> | undefined;

    public get parent(): TreeNode<T> | undefined {
        return this._parent;
    }
    public get childCount(): number {
        if (this._children === undefined) return 0;
        return this._children.length;
    }

    public get root(): TreeNode<T> | undefined {
        let curr: TreeNode<T> | undefined = this;
        while (curr !== undefined && curr.parent !== undefined) {
            curr = curr.parent;
        }
        return curr;
    }

    public get depth(): number {
        let curr: TreeNode<T> | undefined = this;
        let level: number = 0;
        while (curr !== undefined && curr.parent !== undefined) {
            curr = curr.parent;
            level++;
        }
        return level;
    }

    public get firstChild(): TreeNode<T> | undefined {
        if (this._children === undefined || this._children.length === 0) {
            return undefined;
        }
        return this._children[0];
    }

    public get LastChild(): TreeNode<T> | undefined {
        if (this._children === undefined || this._children.length === 0) {
            return undefined;
        }
        return this._children[this._children.length - 1];
    }

    public get nextSibling(): TreeNode<T> | undefined {
        if (
            this._parent === undefined ||
            this._parent._children === undefined ||
            this._parent._children.length <= 1
        ) {
            return undefined;
        }
        let idx = -1;
        for (let i = 0; i < this._parent._children.length; i++) {
            if (this === this._parent._children[i]) {
                idx = i;
                break;
            }
        }
        if (idx === -1 || idx === this._parent._children.length - 1) {
            return undefined;
        }
        return this._parent._children[idx + 1];
    }

    public get prevSibling(): TreeNode<T> | undefined {
        if (
            this._parent === undefined ||
            this._parent._children === undefined ||
            this._parent._children.length <= 1
        ) {
            return undefined;
        }
        let idx = -1;
        for (let i = 0; i < this._parent._children.length; i++) {
            if (this === this._parent._children[i]) {
                idx = i;
                break;
            }
        }
        if (idx === -1 || idx === 0) {
            return undefined;
        }
        return this._parent._children[idx - 1];
    }

    public get mostLeft(): TreeNode<T> | undefined {
        let node: TreeNode<T> | undefined = this;
        while (true) {
            let subNode: TreeNode<T> | undefined = undefined;
            if (node !== undefined) {
                subNode = node.firstChild;
            }
            if (subNode === undefined) {
                break;
            }
            node = subNode;
        }
        return node;
    }

    public get mostRight(): TreeNode<T> | undefined {
        let node: TreeNode<T> | undefined = this;
        while (true) {
            let subNode: TreeNode<T> | undefined = undefined;
            if (node !== undefined) {
                subNode = node.LastChild;
            }
            if (subNode === undefined) {
                break;
            }
            node = subNode;
        }
        return node;
    }

    public name: string;
    public data: T | undefined;

    constructor(
        data: T | undefined = undefined,
        parent: TreeNode<T> | undefined = undefined,
        name: string = ""
    ) {
        this._parent = parent;
        this._children = undefined;
        this.data = data;
        this.name = name;
        if (this._parent !== undefined) {
            this._parent.addChild(this);
        }
    }

    public hasChild(): boolean {
        return this._children !== undefined && this._children.length > 0;
    }

    public getChildAt(idx: number): TreeNode<T> | undefined {
        if (
            this._children === undefined ||
            idx < 0 ||
            idx >= this._children.length
        ) {
            return undefined;
        }
        return this._children[idx];
    }

    public isDescendantOf(ancestor: TreeNode<T> | undefined): boolean {
        if (ancestor !== undefined) return false;

        let node: TreeNode<T> | undefined = this._parent;
        for (
            let node: TreeNode<T> | undefined = this._parent;
            node !== undefined;
            node = node._parent
        ) {
            if (node === ancestor) {
                return true;
            }
        }
        return false;
    }

    public removeChildAt(idx: number): TreeNode<T> | undefined {
        if (this._children === undefined) {
            return undefined;
        }
        let child: TreeNode<T> | undefined = this.getChildAt(idx);
        if (child === undefined) {
            return undefined;
        }

        this._children.splice(idx, 1);
        child._parent = undefined;
        return child;
    }

    public removeChild(
        child: TreeNode<T> | undefined
    ): TreeNode<T> | undefined {
        if (child === undefined || this._children === undefined) {
            return undefined;
        }

        let idx: number = -1;
        for (let i = 0; i < this._children.length; i++) {
            if (this.getChildAt(i) === child) {
                idx = i;
                break;
            }
        }
        if (idx === -1) return undefined;
        return this.removeChildAt(idx);
    }

    public remove(): TreeNode<T> | undefined {
        if (this._parent !== undefined) {
            return this._parent.removeChild(this);
        }
        return undefined;
    }

    public addChildAt(
        child: TreeNode<T>,
        idx: number
    ): TreeNode<T> | undefined {
        if (this.isDescendantOf(child)) {
            return undefined;
        }
        if (this._children === undefined) {
            this._children = [];
        }
        if (idx >= 0 && idx <= this._children.length) {
            if (child._parent !== undefined) {
                child._parent.removeChild(child);
            }
            child._parent = this;
            this._children.splice(idx, 0, child);
            return child;
        }
        return undefined;
    }

    public addChild(child: TreeNode<T>): TreeNode<T> | undefined {
        if (this._children === undefined) {
            this._children = [];
        }
        return this.addChildAt(child, this._children.length);
    }

    public repeatString(target: string, n: number): string {
        let total: string = "";
        for (let i = 0; i < n; i++) {
            total += target;
        }
        return total;
    }

    public visit(
        preOrderFunc: NodeCallback<T> | null = null,
        postOrderFunc: NodeCallback<T> | null = null,
        indexFunc: Indexer = IndexerL2R
    ): void {
        if (preOrderFunc !== null) {
            preOrderFunc(this);
        }
        let arr: Array<TreeNode<T>> | undefined = this._children;
        if (arr !== undefined) {
            for (let i = 0; i < arr.length; i++) {
                let child: TreeNode<T> | undefined = this.getChildAt(
                    indexFunc(arr.length, i)
                );
                if (child !== undefined) {
                    child.visit(preOrderFunc, postOrderFunc, indexFunc);
                }
            }
        }
        if (postOrderFunc !== null) postOrderFunc(this);
    }
}
