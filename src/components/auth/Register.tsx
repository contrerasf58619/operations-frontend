'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'

import { AuthLayout } from '../layouts/AuthLayout'
import { useState } from 'react'
import { useAuthContext } from '@/context/auth/AuthContext'

// Yup schema for register
const registerSchema = Yup.object({
    dpi: Yup.string()
        .required('DPI is required')
        .min(6, 'DPI must be at least 6 characters')
        .max(25, 'DPI must be at most 25 characters'),
    employeeCode: Yup.string()
        .required('Employee code is required')
        .min(3, 'Employee code must be at least 3 characters')
        .max(20, 'Employee code must be at most 20 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Must be a valid email')
        .max(100, 'Email must be at most 100 characters'),
})

export const Register = () => {
    const [message, setMessage] = useState<string | null>(null)
    const { register } = useAuthContext()

    const formik = useFormik({
        initialValues: { dpi: '', employeeCode: '', email: '' },
        validationSchema: registerSchema,
        onSubmit: async (values, helpers) => {
            setMessage(null)
            try {
                await register(values.dpi, values.employeeCode, values.email)
                helpers.resetForm()
            } catch (err) {
                console.log(err)
                setMessage('Something went wrong, please try again.')
            } finally {
                helpers.setSubmitting(false)
            }
        },
    })

    const dpiErr = formik.touched.dpi && formik.errors.dpi
    const codeErr = formik.touched.employeeCode && formik.errors.employeeCode
    const emailErr = formik.touched.email && formik.errors.email

    return (
        <AuthLayout title='Create account' subtitle='Provide your details to get started'>
            <form onSubmit={formik.handleSubmit} className='grid gap-5'>
                {/* DPI */}
                <label className='grid gap-2'>
                    <span className='text-sm text-gray-700'>DPI</span>
                    <input
                        type='text'
                        name='dpi'
                        value={formik.values.dpi}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Identification Number'
                        aria-invalid={!!dpiErr}
                        aria-describedby={dpiErr ? 'dpi-error' : undefined}
                        className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                            dpiErr
                                ? 'ring-2 ring-red-400 focus:ring-red-500'
                                : 'focus:ring-[#0FA3B1]'
                        }`}
                    />
                    {dpiErr ? (
                        <span id='dpi-error' className='text-xs text-red-600'>
                            {formik.errors.dpi}
                        </span>
                    ) : null}
                </label>

                {/* Employee Code */}
                <label className='grid gap-2'>
                    <span className='text-sm text-gray-700'>Employee code</span>
                    <input
                        type='text'
                        name='employeeCode'
                        value={formik.values.employeeCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='e.g. 117749'
                        aria-invalid={!!codeErr}
                        aria-describedby={codeErr ? 'employeeCode-error' : undefined}
                        className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                            codeErr
                                ? 'ring-2 ring-red-400 focus:ring-red-500'
                                : 'focus:ring-[#0FA3B1]'
                        }`}
                    />
                    {codeErr ? (
                        <span id='employeeCode-error' className='text-xs text-red-600'>
                            {formik.errors.employeeCode}
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
                        aria-invalid={!!emailErr}
                        aria-describedby={emailErr ? 'email-error' : undefined}
                        className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                            emailErr
                                ? 'ring-2 ring-red-400 focus:ring-red-500'
                                : 'focus:ring-[#0FA3B1]'
                        }`}
                    />
                    {emailErr ? (
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
                    {formik.isSubmitting ? 'Creating…' : 'Create account'}
                </button>

                {message ? <p className='text-sm text-center text-gray-700'>{message}</p> : null}

                <div className='text-center text-sm text-gray-600'>
                    Already have an account?{' '}
                    <Link className='text-[#0FA3B1] hover:underline' href='/login'>
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
