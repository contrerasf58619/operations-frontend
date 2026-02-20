'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ToastContextProps {
    toast: typeof toast
}

const ToastContext = createContext<ToastContextProps>({} as ToastContextProps)

interface ToastProviderProps {
    children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </ToastContext.Provider>
    )
}

export const useToastContext = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast debe usarse dentro de un ToastProvider')
    }
    return context
}
