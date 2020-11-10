import { AdpterBase } from "./AdpterBase";
import { TreeNode } from "./TreeNode";

export class Queue<T> extends AdpterBase<T> {
    public remove(): T | undefined {
        if (this._arr.length > 0) {
            return this._arr.shift();
        }
        return undefined;
    }
}
