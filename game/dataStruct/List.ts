export class ListNode<T> {
    public next: ListNode<T> | null;
    public prev: ListNode<T> | null;
    public data: T | undefined;
    constructor(data: T | undefined = undefined) {
        this.next = this.prev = null;
        this.data = data;
    }
}

export class List<T> {
    private _headNode: ListNode<T>;
    private _length: number;

    public get length(): number {
        return this._length;
    }

    constructor() {
        this._headNode = new ListNode<T>();
        this._headNode.next = this._headNode;
        this._headNode.prev = this._headNode;
        this._length = 0;
    }

    public empty(): boolean {
        return this._headNode === this._headNode.next;
    }

    public begin(): ListNode<T> {
        if (this._headNode.next === null) {
            throw new Error("头结点的next指针必须不为null");
        }
        return this._headNode.next;
    }

    public end(): ListNode<T> {
        return this._headNode;
    }

    public contains(data: T): boolean {
        let link: ListNode<T> | null = this._headNode.next;
        while (link !== null && link !== this._headNode) {
            if (link.data !== undefined && link.data === data) {
                return true;
            }
            link = link.next;
        }
        return false;
    }

    public forNext(cb: (data: T) => void): void {
        let link: ListNode<T> | null = this._headNode.next;
        while (link !== null && link !== this._headNode) {
            if (link.data !== undefined) {
                cb(link.data);
            }
            link = link.next;
        }
    }

    public forPrev(cb: (data: T) => void): void {
        let link: ListNode<T> | null = this._headNode.prev;
        while (link !== null && link !== this._headNode) {
            if (link.data !== undefined) {
                cb(link.data);
            }
            link = link.prev;
        }
    }

    public insertBefore(node: ListNode<T>, data: T): ListNode<T> {
        let ret: ListNode<T> = new ListNode<T>(data);
        ret.next = node;
        ret.prev = node.prev;
        if (node.prev !== null) {
            node.prev.next = ret;
        }
        node.prev = ret;
        this._length++;
        return ret;
    }

    public remove(node: ListNode<T>): void {
        let next: ListNode<T> | null = node.next,
            prev: ListNode<T> | null = node.prev;
        if (prev !== null) {
            prev.next = next;
        }
        if (next !== null) {
            next.prev = prev;
        }
        this._length--;
    }

    public push(data: T): void {
        this.insertBefore(this.end(), data);
    }

    public pop(): T | undefined {
        let prev: ListNode<T> | null = this.end().prev;
        if (prev !== null) {
            let ret: T | undefined = prev.data;
            this.remove(prev);
            return ret;
        }
        return undefined;
    }

    public push_front(data: T): void {
        this.insertBefore(this.begin(), data);
    }

    public pop_front(): T | undefined {
        let ret: T | undefined = this.begin().data;
        this.remove(this.begin());
        return ret;
    }
}
