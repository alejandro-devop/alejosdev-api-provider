import React, { useRef, useEffect, useMemo } from 'react'
import { HttpClient } from './classes'
import { ApiProvider } from './ctx'

interface APIContextProps {
    children?: React.ReactNode
    endpoints: { [k: string]: any }
    apiUrl?: string
    token?: string
    logged?: boolean
}

/**
 * Context for the API requests, it instance the http client and allow access to it
 * through the React context api.
 * @param param0
 * @returns
 */
const ApiContext: React.FC<APIContextProps> = ({ children, apiUrl, endpoints, token, logged }) => {
    const client = useRef(
        new HttpClient({
            apiUrl: apiUrl || '',
            endpoints
        })
    ).current
    client.setApiToken(token)

    const apiToken = useMemo(() => client.getApiToken(), [client])

    useEffect(() => {
        if (logged && apiToken !== token) {
            client.setApiToken(token)
        }
    }, [apiToken, logged, token, client])

    return (
        <ApiProvider
            value={{
                client
            }}
        >
            {children}
        </ApiProvider>
    )
}

export default ApiContext
