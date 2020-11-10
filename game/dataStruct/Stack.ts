import { AdpterBase } from "./AdpterBase";

export class Stack<T> extends AdpterBase<T> {
    public remove(): T | undefined {
        if (this._arr.length > 0) {
            return this._arr.pop();
        }
        return undefined;
    }
}
