import { Operation } from 'apollo-link';
import { ArgumentNode } from 'graphql';
export declare function extractKey(operation: Operation): {
    operation: Operation;
    key?: string;
};
export declare function valueForArgument({value}: ArgumentNode, variables?: Record<string, any>): string;
export declare function getVariableOrDie(variables: Record<string, any> | undefined, name: string): any;
