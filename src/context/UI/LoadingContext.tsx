'use client'

import React, { createContext, FC, useContext, useState } from 'react'

interface ContextProps {
    loading: boolean

    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const LoadingContext = createContext<ContextProps>({} as ContextProps)

export const LoadingProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true)

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoadingContext = () => useContext(LoadingContext)
