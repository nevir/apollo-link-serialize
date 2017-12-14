/// <reference types="zen-observable" />
import { ApolloLink, Observable, Operation, NextLink, FetchResult } from 'apollo-link';
export interface Subscription {
    closed: boolean;
    unsubscribe(): void;
}
export interface Observer<T> {
    start?(subscription: Subscription): any;
    next?(value: T): void;
    error?(errorValue: any): void;
    complete?(): void;
}
export interface OperationQueueEntry {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
    subscription?: {
        unsubscribe: () => void;
    };
}
export default class SerializingLink extends ApolloLink {
    private opQueues;
    request(origOperation: Operation, forward: NextLink): Observable<{}>;
    private dequeue;
    private enqueue;
    private cancelOp;
    private startFirstOpIfNotStarted;
}
