import { HttpClient } from './classes'

/**
 * Http available methods
 */
export type HTTPMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Configuration for the http client class
 */
export type HttpClientConfig = {
    /**
     * Server url (The backend url)
     */
    apiUrl: string
    /**
     * Object containing all the available urls
     */
    endpoints: { [k: string]: any }
}

/**
 * Type for the API context
 */
export type ApiContextType = {
    /**
     * Http client instance
     */
    client?: HttpClient
}

/**
 * Configuration received for the doRequest method in the http
 * client class
 */
export type DoRequestConfig = {
    /**
     * Method for the request
     */
    method?: HTTPMethodType
    /**
     * Object with the desired payload to be sent to the api
     */
    payload?: any
    /**
     * Object containing the keys to be replaced in the url, for example, given the following
     * endponts:
     * {
     *  "users.update": "put:/api/v1/user/update/{userId}"
     * }
     * You can use the replacements to replace the token {userId} with the value of the id
     * you want to send to the api:
     * const [sendRequest, loading] = usePut('users.update', {
     *    replacements: {
     *        "userId": 1
     *    }
     * });
     * This will replace the {userId} with the given value, given as result the following url:
     * https://my-backend.com/api/v1/user/update/1
     */
    replacements?: {
        [k: string]: any
    }
}

/**
 * Configuration recevied by the hooks
 */
export type ApiConfigType<GenConfig = {}> = {
    headers?: any
    replacements?: {
        [k: string]: any
    }
} & GenConfig

/**
 * Type for the return of the hooks like useGet, useLazyGet and useDelete, which handles no payload
 */
export type HookReturnType = [
    (
        | ((p?: any, configOverride?: ApiConfigType) => Promise<any>)
        | ((p?: any, configOverride?: ApiConfigType) => Promise<any>)
    ),
    boolean
]

/**
 * Type for the return of the hooks like usePost, usePut, usePatch which handles payloads
 */
export type HookReturnWithPayloadType<PayloadType> = [
    (
        | ((payload: PayloadType) => any)
        | ((payload: PayloadType, configOverride?: ApiConfigType) => Promise<any>)
    ),
    boolean,
    { errors?: string[] }
]
