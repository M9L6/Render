export interface IAdapter<T> {
    add(t: T): void;
    remove(): T | undefined;
    clear(): void;
    length: number;
    isEmpty: boolean;
}

export type Indexer = (len: number, idx: number) => number;

export function IndexerL2R(len: number, idx: number): number {
    return idx;
}

export function IndexerR2L(len: number, idx: number): number {
    return len - idx - 1;
}
