'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'

import { AuthLayout } from '../layouts/AuthLayout'
import { useState } from 'react'
import { useAuthContext } from '@/context/auth/AuthContext'

// Yup schema
const forgotSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Must be a valid email')
        .max(100, 'Email must be at most 100 characters'),
})

export const ForgotPassword = () => {
    const [message, setMessage] = useState<string | null>(null)
    const { resetPassword } = useAuthContext()

    const formik = useFormik({
        initialValues: { username: '', email: '' },
        validationSchema: forgotSchema,
        onSubmit: async (values, helpers) => {
            setMessage(null)
            try {
                await resetPassword(values.email, values.username)
                setMessage('If the account exists, you will receive reset instructions.')
                helpers.resetForm()
            } catch (err) {
                setMessage('Something went wrong, please try again.')
                console.log(err)
            } finally {
                helpers.setSubmitting(false)
            }
        },
    })

    const uErr = formik.touched.username && formik.errors.username
    const eErr = formik.touched.email && formik.errors.email

    return (
        <AuthLayout
            title='Forgot password'
            subtitle='Enter your username and email to receive reset instructions'
        >
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

                {/* Email */}
                <label className='grid gap-2'>
                    <span className='text-sm text-gray-700'>Email</span>
                    <input
                        type='email'
                        name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='you@alliedglobal.com'
                        aria-invalid={!!eErr}
                        aria-describedby={eErr ? 'email-error' : undefined}
                        className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                            eErr ? 'ring-2 ring-red-400 focus:ring-red-500' : 'focus:ring-[#0FA3B1]'
                        }`}
                    />
                    {eErr ? (
                        <span id='email-error' className='text-xs text-red-600'>
                            {formik.errors.email}
                        </span>
                    ) : null}
                </label>

                {/* Submit */}
                <button
                    type='submit'
                    disabled={formik.isSubmitting}
                    className='w-full rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-[#FFB100] via-[#F08A00] to-[#C96E00] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    {formik.isSubmitting ? 'Sending…' : 'Send reset link'}
                </button>

                {message ? <p className='text-sm text-center text-gray-700'>{message}</p> : null}

                <div className='text-center text-sm text-gray-600'>
                    Remembered it?{' '}
                    <Link className='text-[#0FA3B1] hover:underline' href='/login'>
                        Back to sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
