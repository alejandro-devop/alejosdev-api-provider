import { DoRequestConfig, HttpClientConfig } from './types'

/**
 * Class with methods to handle api requests
 */
export class HttpClient {
    /**
     * The server or backend url
     */
    private readonly apiUrl: string
    /**
     * Object containig the available application endpoints
     */
    private readonly endpoints: { [k: string]: any }
    /**
     * The authentication token to be used in every requests
     */
    private apiToken?: string

    public constructor(config: HttpClientConfig) {
        const { apiUrl, endpoints } = config
        this.apiUrl = apiUrl
        this.endpoints = endpoints
    }

    /**
     * Replace the params in the given string with the params given in the replacements object
     * example, given the "/some/some/{id}" and the replacements: { id: "var" }
     * the resulting string will be "/some/some/var"
     * @param url
     * @param replacements
     * @returns
     */
    public replaceParams = (url: string, replacements?: { [k: string]: any }): string => {
        if (!replacements) {
            return url
        }
        return Object.keys(replacements).reduce((newUrl, key) => {
            newUrl = newUrl.replace(`{${key}}`, replacements[key])
            return newUrl
        }, url)
    }

    /**
     * Searches the given key in the endpoints object.
     * @param path
     * @param config
     * @returns
     */
    public resolveEndpoint = (path: string, config: DoRequestConfig) => {
        const { method = 'GET' } = config
        const url: string = this.endpoints[path] as string
        if (url.includes(':')) {
            const [urlMethod, urlPath] = url.split(':')
            if (urlMethod.toLowerCase() !== method.toLowerCase()) {
                throw new Error(
                    `Method does not match, required: '${urlMethod}' received: '${method.toLowerCase()}' `
                )
            }
            return `${this.apiUrl}${urlPath}`
        }
        return `${this.apiUrl}${url}`
    }

    /**
     * Executes an api request using the fetch function.
     * @param endpoint
     * @param config
     * @returns
     */
    public doRequest = async (
        endpoint: string,
        config: DoRequestConfig
    ): Promise<{
        status: number
        headers: any
        url: string
        payload: any
        response: any
    }> => {
        try {
            const { payload, method = 'GET' } = config
            let urlForRequest = this.resolveEndpoint(endpoint, config)
            urlForRequest = this.replaceParams(urlForRequest, config?.replacements)
            const requestHeaders: any = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }

            if (this.apiToken) {
                requestHeaders['Authorization'] = `Bearer ${this.apiToken}`
            }

            const fetchResponse = await fetch(urlForRequest, {
                headers: requestHeaders,
                method,
                body: JSON.stringify(payload)
            })
            const { status, headers, url } = fetchResponse
            const jsonResponse = await fetchResponse.json()
            return {
                status,
                headers,
                url,
                payload,
                response: jsonResponse
            }
        } catch (err) {
            throw err
        }
    }

    /**
     * sets the token to be used in the requests
     * @param token
     */
    public setApiToken = (token?: string) => {
        this.apiToken = token
    }

    /**
     * returns the current token.
     * @returns string
     */
    public getApiToken = () => this.apiToken
}
