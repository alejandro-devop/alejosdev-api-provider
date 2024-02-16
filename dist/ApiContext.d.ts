import React from 'react';
interface APIContextProps {
    children?: React.ReactNode;
    endpoints: {
        [k: string]: any;
    };
    apiUrl?: string;
    token?: string;
    logged?: boolean;
}
/**
 * Context for the API requests, it instance the http client and allow access to it
 * through the React context api.
 * @param param0
 * @returns
 */
declare const ApiContext: React.FC<APIContextProps>;
export default ApiContext;
