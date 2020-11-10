import { IAdapter } from "./IAdapter";

export abstract class AdpterBase<T> implements IAdapter<T> {
    protected _arr: Array<T>;

    constructor() {
        this._arr = [];
    }

    public add(t: T): void {
        this._arr.push(t);
    }

    public abstract remove(): T | undefined;

    public get length(): number {
        return this._arr.length;
    }

    public get isEmpty(): boolean {
        return this._arr.length <= 0;
    }

    public clear(): void {
        this._arr = [];
    }

    public toString(): string {
        return this._arr.toString();
    }
}
