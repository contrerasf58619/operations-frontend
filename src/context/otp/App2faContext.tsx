'use client'
import React, { createContext, FC, useContext, useState } from 'react'

interface ContextProps {
    selectedApp: number
    setSelectedApp: (type: number) => void
}

const App2FaContext = createContext<ContextProps>({
    selectedApp: 1,
    setSelectedApp: () => {},
})

export const App2FaProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [selectedApp, setSelectedApp] = useState<number>(1)

    return (
        <App2FaContext.Provider value={{ selectedApp, setSelectedApp }}>
            {children}
        </App2FaContext.Provider>
    )
}

export const useApp2FaContext = () => useContext(App2FaContext)
