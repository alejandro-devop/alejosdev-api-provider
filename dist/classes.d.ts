import { DoRequestConfig, HttpClientConfig } from './types';
/**
 * Class with methods to handle api requests
 */
export declare class HttpClient {
    /**
     * The server or backend url
     */
    private readonly apiUrl;
    /**
     * Object containig the available application endpoints
     */
    private readonly endpoints;
    /**
     * The authentication token to be used in every requests
     */
    private apiToken?;
    constructor(config: HttpClientConfig);
    /**
     * Replace the params in the given string with the params given in the replacements object
     * example, given the "/some/some/{id}" and the replacements: { id: "var" }
     * the resulting string will be "/some/some/var"
     * @param url
     * @param replacements
     * @returns
     */
    replaceParams: (url: string, replacements?: {
        [k: string]: any;
    } | undefined) => string;
    /**
     * Searches the given key in the endpoints object.
     * @param path
     * @param config
     * @returns
     */
    resolveEndpoint: (path: string, config: DoRequestConfig) => string;
    /**
     * Executes an api request using the fetch function.
     * @param endpoint
     * @param config
     * @returns
     */
    doRequest: (endpoint: string, config: DoRequestConfig) => Promise<{
        status: number;
        headers: any;
        url: string;
        payload: any;
        response: any;
    }>;
    /**
     * sets the token to be used in the requests
     * @param token
     */
    setApiToken: (token?: string) => void;
    /**
     * returns the current token.
     * @returns string
     */
    getApiToken: () => string | undefined;
}
