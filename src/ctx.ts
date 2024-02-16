import { createContext } from 'react'
import { ApiContextType } from './types'

export const ApiCtx = createContext<ApiContextType>({})

export const ApiProvider = ApiCtx.Provider
export const ApiConsumer = ApiCtx.Consumer
