import React, { createContext, useRef, useMemo, useEffect, useState, useCallback, useContext } from 'react';

/**
 * Class with methods to handle api requests
 */
class HttpClient {
    /**
     * The server or backend url
     */
    apiUrl;
    /**
     * Object containig the available application endpoints
     */
    endpoints;
    /**
     * The authentication token to be used in every requests
     */
    apiToken;
    constructor(config) {
        const { apiUrl, endpoints } = config;
        this.apiUrl = apiUrl;
        this.endpoints = endpoints;
    }
    /**
     * Replace the params in the given string with the params given in the replacements object
     * example, given the "/some/some/{id}" and the replacements: { id: "var" }
     * the resulting string will be "/some/some/var"
     * @param url
     * @param replacements
     * @returns
     */
    replaceParams = (url, replacements) => {
        if (!replacements) {
            return url;
        }
        return Object.keys(replacements).reduce((newUrl, key) => {
            newUrl = newUrl.replace(`{${key}}`, replacements[key]);
            return newUrl;
        }, url);
    };
    /**
     * Searches the given key in the endpoints object.
     * @param path
     * @param config
     * @returns
     */
    resolveEndpoint = (path, config) => {
        const { method = 'GET' } = config;
        const url = this.endpoints[path];
        if (url.includes(':')) {
            const [urlMethod, urlPath] = url.split(':');
            if (urlMethod.toLowerCase() !== method.toLowerCase()) {
                throw new Error(`Method does not match, required: '${urlMethod}' received: '${method.toLowerCase()}' `);
            }
            return `${this.apiUrl}${urlPath}`;
        }
        return `${this.apiUrl}${url}`;
    };
    /**
     * Executes an api request using the fetch function.
     * @param endpoint
     * @param config
     * @returns
     */
    doRequest = async (endpoint, config) => {
        try {
            const { payload, method = 'GET' } = config;
            let urlForRequest = this.resolveEndpoint(endpoint, config);
            urlForRequest = this.replaceParams(urlForRequest, config?.replacements);
            const requestHeaders = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
            if (this.apiToken) {
                requestHeaders['Authorization'] = `Bearer ${this.apiToken}`;
            }
            const fetchResponse = await fetch(urlForRequest, {
                headers: requestHeaders,
                method,
                body: JSON.stringify(payload)
            });
            const { status, headers, url } = fetchResponse;
            const jsonResponse = await fetchResponse.json();
            return {
                status,
                headers,
                url,
                payload,
                response: jsonResponse
            };
        }
        catch (err) {
            throw err;
        }
    };
    /**
     * sets the token to be used in the requests
     * @param token
     */
    setApiToken = (token) => {
        this.apiToken = token;
    };
    /**
     * returns the current token.
     * @returns string
     */
    getApiToken = () => this.apiToken;
}

const ApiCtx = createContext({});
const ApiProvider = ApiCtx.Provider;
ApiCtx.Consumer;

/**
 * Context for the API requests, it instance the http client and allow access to it
 * through the React context api.
 * @param param0
 * @returns
 */
const ApiContext = ({ children, apiUrl, endpoints, token, logged }) => {
    const client = useRef(new HttpClient({
        apiUrl: apiUrl || '',
        endpoints
    })).current;
    client.setApiToken(token);
    const apiToken = useMemo(() => client.getApiToken(), [client]);
    useEffect(() => {
        if (logged && apiToken !== token) {
            client.setApiToken(token);
        }
    }, [apiToken, logged, token, client]);
    return (React.createElement(ApiProvider, { value: {
            client
        } }, children));
};

/**
 * Hook to access the API client context
 * @returns
 */
const useApiCtx = () => {
    return useContext(ApiCtx);
};
/**
 * Hook to execute api request using the api client
 * @param endpoint
 * @param config
 * @returns
 */
const useRequest = (endpoint, config) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState();
    const { client } = useApiCtx();
    const executed = useRef(false);
    /**
     * Function to send the request to the server, it just uses the
     * doRequest method from the Client class
     * @param p
     * @returns
     */
    const sendRequest = async (p, configOverride) => {
        setLoading(true);
        executed.current = true;
        try {
            /**
             * The errors are stored in a different state so they can be returned
             * as a part of the response, also the backed is programmed to
             * always return an errors variable with the compilation of errors.
             */
            setErrors(undefined);
            const { response } = (await client?.doRequest(endpoint, {
                ...config,
                ...configOverride,
                payload: p
            })) || {};
            const { errors } = response;
            if (!response.status && errors) {
                setErrors(errors);
            }
            setLoading(false);
            return response;
        }
        catch (err) {
            console.error(err);
            setLoading(false);
            return {};
        }
    };
    return [sendRequest, loading, { errors, executed: executed.current }];
};
/**
 * Hook which works as a facade for the useRequest hook, it can
 * be used to prepare a get request which can be triggered by user
 * actions or programmaticaly
 * @param endpoint
 * @returns
 */
const useGetLazy = (endpoint, config) => {
    const [sendRequest, loading, { executed }] = useRequest(endpoint, {
        ...config,
        method: 'GET'
    });
    return [sendRequest, loading, { executed }];
};
/**
 * Function which executes a get request as soon as the component is loaded.
 * @param endpoint
 * @returns
 */
const useGet = (endpoint, config) => {
    const [sendRequest, loading, { executed }] = useGetLazy(endpoint, config);
    const [dataFetched, setDataFetched] = useState();
    const getData = useCallback(async () => {
        const { data } = await sendRequest();
        setDataFetched(data);
    }, [sendRequest]);
    useEffect(() => {
        if (!executed) {
            getData();
        }
    }, [executed, getData]);
    return [dataFetched, loading, { refetch: getData }];
};
/**
 * Facade for the useRequest hook, it overrides the method to be a post
 * @param endpoint
 * @param config
 * @returns
 */
const usePost = (endpoint, config) => {
    const [sendRequest, loading, { errors }] = useRequest(endpoint, {
        ...config,
        method: 'POST'
    });
    return [sendRequest, loading, { errors }];
};
/**
 * Facade for the useRequest, it prepares a put request
 * @param endpoint
 * @param config
 * @returns
 */
const usePut = (endpoint, config) => {
    const [sendRequest, loading, { errors }] = useRequest(endpoint, {
        ...config,
        method: 'PUT'
    });
    return [sendRequest, loading, { errors }];
};
/**
 * Facade for the useRequest, it prepares a delete request
 * @param endpoint
 * @param config
 * @returns
 */
const useDelete = (endpoint, config) => {
    const [sendRequest, loading] = useRequest(endpoint, {
        ...config,
        method: 'DELETE'
    });
    const handleDelete = async (configOverride) => {
        return await sendRequest(undefined, configOverride);
    };
    return [handleDelete, loading];
};
/**
 * Facade for useRequest hook, it prepares a patch request
 * @param endpoint
 * @param config
 * @returns
 */
const usePatch = (endpoint, config) => {
    const [sendRequest, loading, { errors }] = useRequest(endpoint, {
        ...config,
        method: 'PATCH'
    });
    return [sendRequest, loading, { errors }];
};

export { ApiContext as default, useDelete, useGet, useGetLazy, usePatch, usePost, usePut, useRequest };
//# sourceMappingURL=index.js.map
