import { ApiConfigType, DoRequestConfig, HookReturnType, HookReturnWithPayloadType } from './types';
/**
 * Hook to execute api request using the api client
 * @param endpoint
 * @param config
 * @returns
 */
export declare const useRequest: <PayloadType = {}>(endpoint: string, config?: ApiConfigType<DoRequestConfig>) => [any, any, any?];
/**
 * Hook which works as a facade for the useRequest hook, it can
 * be used to prepare a get request which can be triggered by user
 * actions or programmaticaly
 * @param endpoint
 * @returns
 */
export declare const useGetLazy: (endpoint: string, config?: ApiConfigType) => [() => Promise<any>, boolean, {
    executed: boolean;
}];
/**
 * Function which executes a get request as soon as the component is loaded.
 * @param endpoint
 * @returns
 */
export declare const useGet: <ResponseType_1>(endpoint: string, config?: ApiConfigType<{}>) => [ResponseType_1, boolean, {
    refetch: any;
}];
/**
 * Facade for the useRequest hook, it overrides the method to be a post
 * @param endpoint
 * @param config
 * @returns
 */
export declare const usePost: <PayloadType = {}>(endpoint: string, config?: ApiConfigType<{}>) => HookReturnWithPayloadType<PayloadType>;
/**
 * Facade for the useRequest, it prepares a put request
 * @param endpoint
 * @param config
 * @returns
 */
export declare const usePut: <PayloadType = {}>(endpoint: string, config?: ApiConfigType<{}>) => HookReturnWithPayloadType<PayloadType>;
/**
 * Facade for the useRequest, it prepares a delete request
 * @param endpoint
 * @param config
 * @returns
 */
export declare const useDelete: (endpoint: string, config?: ApiConfigType<{}>) => HookReturnType;
/**
 * Facade for useRequest hook, it prepares a patch request
 * @param endpoint
 * @param config
 * @returns
 */
export declare const usePatch: <PayloadType = {}>(endpoint: string, config?: ApiConfigType<{}>) => HookReturnWithPayloadType<PayloadType>;
