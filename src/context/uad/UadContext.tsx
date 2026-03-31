'use client'
import React, { createContext, FC, useContext, useState } from 'react'

interface ContextProps {
    selectedUad: number | null
    setSelectedUad: React.Dispatch<React.SetStateAction<number | null>>
}

const UadContext = createContext<ContextProps>({} as ContextProps)

export const UadProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [selectedUad, setSelectedUad] = useState<number | null>(null)

    return (
        <UadContext.Provider value={{ selectedUad, setSelectedUad }}>
            {children}
        </UadContext.Provider>
    )
}

export const useUadContext = () => useContext(UadContext)
