'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Icons from '@/utils/icons'
import { useAuthContext } from '@/context/auth/AuthContext'
// import { useToastContext } from '@/context/UI/ToastNotificationContext'

// Yup schema
const schema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters'),
    oldPassword: Yup.string()
        .required('Current password is required')
        .min(6, 'Current password must be at least 6 characters')
        .max(128, 'Current password must be at most 128 characters'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'New password must be at least 8 characters')
        .max(128, 'New password must be at most 128 characters')
        .matches(/[A-Za-z]/, 'Must contain at least one letter')
        .matches(/[0-9]/, 'Must contain at least one number'),
    repeatPassword: Yup.string()
        .required('Please repeat the new password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
})

export const ChangePassword = () => {
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showRepeat, setShowRepeat] = useState(false)

    const { changePassword } = useAuthContext()

    const formik = useFormik({
        initialValues: { username: '', oldPassword: '', newPassword: '', repeatPassword: '' },
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const resp = await changePassword(
                    values.username,
                    values.oldPassword,
                    values.newPassword,
                    values.repeatPassword,
                )

                console.log(resp, 'que eres')

                helpers.resetForm()
            } catch (err) {
                console.log(err, 'Error ')
            } finally {
                helpers.setSubmitting(false)
            }
        },
    })

    const err = formik.errors
    const touched = formik.touched

    return (
        <div className='text-[#131416] p-6 mx-auto rounded-2xl bg-white w-full flex items-center justify-center px-6 h-[100%]'>
            <div className='w-full max-w-[440px] rounded-2xl shadow-xl border border-gray-100 p-6'>
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
                            aria-invalid={!!(touched.username && err.username)}
                            aria-describedby={
                                touched.username && err.username ? 'username-error' : undefined
                            }
                            className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                                touched.username && err.username
                                    ? 'ring-2 ring-red-400 focus:ring-red-500'
                                    : 'focus:ring-[#0FA3B1]'
                            }`}
                        />
                        {touched.username && err.username ? (
                            <span id='username-error' className='text-xs text-red-600'>
                                {err.username}
                            </span>
                        ) : null}
                    </label>

                    {/* Old password */}
                    <label className='grid gap-2'>
                        <span className='text-sm text-gray-700'>Current password</span>
                        <div className='relative'>
                            <input
                                type={showOld ? 'text' : 'password'}
                                name='oldPassword'
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder='••••••••'
                                aria-invalid={!!(touched.oldPassword && err.oldPassword)}
                                aria-describedby={
                                    touched.oldPassword && err.oldPassword
                                        ? 'oldPassword-error'
                                        : undefined
                                }
                                className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 ${
                                    touched.oldPassword && err.oldPassword
                                        ? 'ring-2 ring-red-400 focus:ring-red-500'
                                        : 'focus:ring-[#0FA3B1]'
                                }`}
                            />
                            <button
                                type='button'
                                onClick={() => setShowOld(v => !v)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#0FA3B1] ${
                                    showOld ? 'text-[#0FA3B1]' : 'text-gray-500'
                                }`}
                                aria-label={showOld ? 'Hide password' : 'Show password'}
                            >
                                {showOld ? <Icons.FaEyeSlash /> : <Icons.FaEye />}
                            </button>
                        </div>
                        {touched.oldPassword && err.oldPassword ? (
                            <span id='oldPassword-error' className='text-xs text-red-600'>
                                {err.oldPassword}
                            </span>
                        ) : null}
                    </label>

                    {/* New password */}
                    <label className='grid gap-2'>
                        <span className='text-sm text-gray-700'>New password</span>
                        <div className='relative'>
                            <input
                                type={showNew ? 'text' : 'password'}
                                name='newPassword'
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder='At least 8 characters'
                                aria-invalid={!!(touched.newPassword && err.newPassword)}
                                aria-describedby={
                                    touched.newPassword && err.newPassword
                                        ? 'newPassword-error'
                                        : undefined
                                }
                                className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 ${
                                    touched.newPassword && err.newPassword
                                        ? 'ring-2 ring-red-400 focus:ring-red-500'
                                        : 'focus:ring-[#0FA3B1]'
                                }`}
                            />
                            <button
                                type='button'
                                onClick={() => setShowNew(v => !v)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#0FA3B1] ${
                                    showNew ? 'text-[#0FA3B1]' : 'text-gray-500'
                                }`}
                                aria-label={showNew ? 'Hide password' : 'Show password'}
                            >
                                {showNew ? <Icons.FaEyeSlash /> : <Icons.FaEye />}
                            </button>
                        </div>
                        {touched.newPassword && err.newPassword ? (
                            <span id='newPassword-error' className='text-xs text-red-600'>
                                {err.newPassword}
                            </span>
                        ) : null}
                    </label>

                    {/* Repeat password */}
                    <label className='grid gap-2'>
                        <span className='text-sm text-gray-700'>Repeat new password</span>
                        <div className='relative'>
                            <input
                                type={showRepeat ? 'text' : 'password'}
                                name='repeatPassword'
                                value={formik.values.repeatPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder='Repeat new password'
                                aria-invalid={!!(touched.repeatPassword && err.repeatPassword)}
                                aria-describedby={
                                    touched.repeatPassword && err.repeatPassword
                                        ? 'repeatPassword-error'
                                        : undefined
                                }
                                className={`w-full bg-gray-100 text-[#131416] placeholder-gray-400 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 ${
                                    touched.repeatPassword && err.repeatPassword
                                        ? 'ring-2 ring-red-400 focus:ring-red-500'
                                        : 'focus:ring-[#0FA3B1]'
                                }`}
                            />
                            <button
                                type='button'
                                onClick={() => setShowRepeat(v => !v)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#0FA3B1] ${
                                    showRepeat ? 'text-[#0FA3B1]' : 'text-gray-500'
                                }`}
                                aria-label={showRepeat ? 'Hide password' : 'Show password'}
                            >
                                {showRepeat ? <Icons.FaEyeSlash /> : <Icons.FaEye />}
                            </button>
                        </div>
                        {touched.repeatPassword && err.repeatPassword ? (
                            <span id='repeatPassword-error' className='text-xs text-red-600'>
                                {err.repeatPassword}
                            </span>
                        ) : null}
                    </label>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={formik.isSubmitting}
                        className='w-full rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-[#FFB100] via-[#F08A00] to-[#C96E00] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {formik.isSubmitting ? 'Saving…' : 'Update password'}
                    </button>

                    <div className='text-center text-sm text-gray-600'>
                        Changed your mind?{' '}
                        <Link className='text-[#0FA3B1] hover:underline' href='/'>
                            Back to home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
