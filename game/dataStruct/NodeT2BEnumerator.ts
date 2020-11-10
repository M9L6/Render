import { IAdapter, Indexer } from "./IAdapter";
import { IEnumerator } from "./IEnumerator";
import { TreeNode } from "./TreeNode";

export class NodeT2BEnumerator<
    T,
    IdxFunc extends Indexer,
    Adapter extends IAdapter<TreeNode<T>>
> implements IEnumerator<TreeNode<T>> {
    private _node: TreeNode<T> | undefined;
    private _adpter!: IAdapter<TreeNode<T>>;
    private _currNode!: TreeNode<T> | undefined;
    private _indexer!: IdxFunc;

    public get current(): TreeNode<T> | undefined {
        return this._currNode;
    }

    constructor(
        node: TreeNode<T> | undefined,
        func: IdxFunc,
        adpater: new () => Adapter
    ) {
        if (node === undefined) return;
        this._node = node;
        this._indexer = func;
        this._adpter = new adpater();
        this._adpter.add(this._node);
        this._currNode = undefined;
    }

    public reset(): void {
        if (this._node === undefined) {
            return;
        }
        this._currNode = undefined;
        this._adpter.clear();
        this._adpter.add(this._node);
    }

    public moveNext(): boolean {
        if (this._adpter.isEmpty) {
            return false;
        }
        this._currNode = this._adpter.remove();
        if (this._currNode !== undefined) {
            let len: number = this._currNode.childCount;
            for (let i = 0; i < len; i++) {
                let childIdx: number = this._indexer(len, i);
                let child: TreeNode<T> | undefined = this._currNode.getChildAt(
                    childIdx
                );
                if (child !== undefined) {
                    this._adpter.add(child);
                }
            }
        }
        return true;
    }
}
