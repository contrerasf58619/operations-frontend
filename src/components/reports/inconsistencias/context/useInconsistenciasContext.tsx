import { createContext, useContext } from 'react'
import { useInconsistencias } from '../hooks/useInconsistencias'

type InconsistenciasContextType = ReturnType<typeof useInconsistencias>

const InconsistenciasContext = createContext<InconsistenciasContextType | null>(null)

export const InconsistenciasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useInconsistencias()
    return (
        <InconsistenciasContext.Provider value={value}>{children}</InconsistenciasContext.Provider>
    )
}

export const useInconsistenciasContext = () => {
    const context = useContext(InconsistenciasContext)
    if (!context) {
        throw new Error('useInconsistenciasContext must be used within an InconsistenciasProvider')
    }
    return context
}
