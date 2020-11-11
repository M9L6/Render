export class TypedArrayList<T extends Uint16Array | Float32Array | Uint8Array> {
    private _arr: T;
    private _typedArrayContructor: new (length: number) => T;
    private _length: number;
    private _capacity: number;

    public capacityChangedCallback:
        | ((arr: TypedArrayList<T>) => void)
        | null = null;

    public get length(): number {
        return this._length;
    }

    public get capacity(): number {
        return this._capacity;
    }

    public get typeArray(): T {
        return this._arr;
    }

    constructor(
        typedArrayConstructor: new (capacity: number) => T,
        capacity: number = 8
    ) {
        this._typedArrayContructor = typedArrayConstructor;
        this._capacity = capacity;
        if (this._capacity === 0) {
            this._capacity = 8;
        }
        this._arr = new this._typedArrayContructor(this._capacity);
        this._length = 0;
    }

    public push(num: number): number {
        if (this._length >= this._capacity) {
            if (this._capacity > 0) {
                this._capacity += this._capacity;
                if (this.capacityChangedCallback !== null)
                    this.capacityChangedCallback(this);
            }
            let oldArray: T = this._arr;
            this._arr = new this._typedArrayContructor(this._capacity);
            this._arr.set(oldArray);
        }
        this._arr[this._length++] = num;
        return this._length;
    }

    public pushArray(nums: number[]): number {
        for (let i = 0; i < nums.length; i++) {
            this.push(nums[i]);
        }
        return this._length;
    }

    public subArray(start: number = 0, end: number = this._length): T {
        return this._arr.subarray(start, end) as T;
    }

    public slice(start: number = 0, end: number = this._length): T {
        return this._arr.slice(start, end) as T;
    }

    public clear(): void {
        this._length = 0;
    }

    public at(idx: number): number {
        if (idx < 0 || idx >= this.length) {
            throw new Error("索引越界");
        }
        return this._arr[idx];
    }
}
