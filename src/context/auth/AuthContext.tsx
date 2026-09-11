'use client'

import { createContext, FC, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { awsOperationApi } from '@/api/aws.operation.api'
import { useToastContext } from '../UI/ToastNotificationContext'
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth'

interface ContextProps {
    showPassword: boolean

    handleLogin: (username: string, password: string) => void
    resetPassword: (email: string, username: string) => void
    register: (dpi: string, employeeCode: string, email: string) => void
    changePassword: (
        username: string,
        oldPassword: string,
        newPassword: string,
        repeatPassword: string,
    ) => void
    handleLogout: () => void
    onShowPassword: () => void
}

export const AuthContext = createContext({} as ContextProps)

export const AuthProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const { toast } = useToastContext()

    const router = useRouter()

    const handleLogin = async (username: string, password: string) => {
        try {
            const cognito = await signIn({
                username,
                password,
            })

            if (cognito.isSignedIn) {
                const { tokens } = await fetchAuthSession()
                const accessToken = tokens?.idToken?.toString() || ''
                const employeeCode = tokens?.idToken?.payload?.['custom:code'] || ''
                Cookies.set('access_token', accessToken)
                Cookies.set('employeeCode', String(employeeCode))

                router.push('/')
            } else {
                throw new Error('Invalid credentials')
            }
        } catch (error) {
            console.error('Error during login:', error)
            throw error
        }
    }

    const handleLogout = async () => {
        try {
            await signOut()
            Cookies.remove('access_token')
            Cookies.remove('employeeCode')
            router.push('/login')
        } catch (error) {
            console.log('Error during logout: ', error)
            Cookies.remove('access_token')
            Cookies.remove('employeeCode')
            router.push('/login')
        }
    }

    const resetPassword = async (email: string, username: string) => {
        const payload = {
            email,
            username,
        }

        try {
            const resp = await awsOperationApi.resetPassword(payload)
            if (resp.status) {
                toast.success('Successful transaction')
            }

            return resp
        } catch (error) {
            console.log('Error during reset password: ', error)
            toast.success('Error while reset password')
        }
    }

    const register = async (dpi: string, code: string, email: string) => {
        const payload = {
            dpi,
            code,
            email,
        }

        try {
            const resp = await awsOperationApi.register(payload)
            if (resp.status) {
                toast.success('Successful transaction')
            }

            return resp
        } catch (error: any) {
            console.log('Error during creating account: ', error)
            toast.error(error.response.data.message)
        }
    }

    const changePassword = async (
        username: string,
        oldPassword: string,
        newPassword: string,
        repeatPassword: string,
    ) => {
        const payload = {
            username,
            oldPassword,
            newPassword,
            repeatPassword,
        }

        try {
            const resp = await awsOperationApi.changePassword(payload)
            if (resp.status) {
                toast.success('Successful transaction')
            }

            return resp
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const onShowPassword = () => {
        setShowPassword(prevState => !prevState)
    }

    return (
        <AuthContext.Provider
            value={{
                showPassword,
                onShowPassword,
                handleLogin,
                handleLogout,
                resetPassword,
                register,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
