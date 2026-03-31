'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { AuthLayout } from '../layouts/AuthLayout'
import Icons from '@/utils/icons'
import { useAuthContext } from '@/context/auth/AuthContext'

// Yup validation schema
const loginSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password must be at most 128 characters'),
})

export const Login = () => {
    const { handleLogin, showPassword, onShowPassword } = useAuthContext()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const formik = useFormik({
        initialValues: { username: '', password: '' },
        validationSchema: loginSchema,
        onSubmit: async (values, helpers) => {
            setErrorMessage(null)
            try {
                await handleLogin(values.username, values.password)
                helpers.resetForm()
            } catch (err) {
                console.log(err)
                setErrorMessage('Username or password is incorrect')
            } finally {
                helpers.setSubmitting(false)
            }
        },
    })

    const uErr = formik.touched.username && formik.errors.username
    const pErr = formik.touched.password && formik.errors.password

    return (
        <AuthLayout title='Sign in' subtitle='Enter your username and password'>
            <form onSubmit={formik.handleSubmit} className='grid gap-5'>
                {/* Username */}
                <label className='grid gap-2'>
                    <span className='text-sm text-gray-700'>Username</span>
                    <input
                        type='text'
                        name='username'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='username'
                        aria-invalid={!!uErr}
                        aria-describedby={uErr ? 'username-error' : undefined}
                        className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                            uErr ? 'ring-2 ring-red-400 focus:ring-red-500' : 'focus:ring-[#0FA3B1]'
                        }`}
                    />
                    {uErr ? (
                        <span id='username-error' className='text-xs text-red-600'>
                            {formik.errors.username}
                        </span>
                    ) : null}
                </label>

                {/* Password */}
                <label className='grid gap-2'>
                    <span className='text-sm text-gray-700'>Password</span>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='••••••••'
                            aria-invalid={!!(pErr || errorMessage)}
                            aria-describedby={pErr || errorMessage ? 'password-error' : undefined}
                            className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 ${
                                pErr || errorMessage
                                    ? 'ring-2 ring-red-400 focus:ring-red-500'
                                    : 'focus:ring-[#0FA3B1]'
                            }`}
                        />
                        <button
                            type='button'
                            onClick={onShowPassword}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#0FA3B1] ${
                                showPassword ? 'text-[#0FA3B1]' : 'text-gray-500'
                            }`}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <Icons.FaEyeSlash /> : <Icons.FaEye />}
                        </button>
                    </div>
                    {errorMessage ? (
                        <span id='password-error' className='text-xs text-red-600'>
                            {errorMessage}
                        </span>
                    ) : pErr ? (
                        <span id='password-error' className='text-xs text-red-600'>
                            {formik.errors.password}
                        </span>
                    ) : null}
                </label>

                {/* Forgot */}
                <div className='flex items-center justify-between text-sm'>
                    <Link className='text-[#0FA3B1] hover:underline' href={'/forgot-password'}>
                        Forgot password?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    type='submit'
                    disabled={formik.isSubmitting}
                    className='w-full rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-[#FFB100] via-[#F08A00] to-[#C96E00] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    {formik.isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>

                {/* Register link */}
                <div className='text-center text-sm text-gray-600'>
                    Don’t have an account?{' '}
                    <Link className='text-[#0FA3B1] hover:underline' href={'/register'}>
                        Create one
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
