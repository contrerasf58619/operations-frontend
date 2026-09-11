'use client'
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { CustomButton } from '@/components/UI/Custom/CustomButton'

interface FormModalProps {
    title?: string
    buttonText?: string
    fields: Array<{
        name: string
        label: string
        type?: string
        component?: React.ReactNode
        shouldRender?: (values: Record<string, any>) => boolean
    }>
    initialValues: Record<string, any>
    validationSchema: Yup.ObjectSchema<any>
    onSubmit: (values: any, actions: any) => void
    enableReinitialize?: boolean
}

export const FormModal = ({
    title,
    buttonText,
    fields,
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize,
}: FormModalProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <CustomButton
                type='button'
                onClick={() => setIsOpen(true)}
                backgroundColor='bg-indigo-600'
                color='text-white'
            >
                {buttonText}
            </CustomButton>

            {isOpen && (
                <div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-900/50'>
                    <div className='relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg'>
                        <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-600'>
                            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                            >
                                <svg
                                    className='w-3 h-3'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 14 14'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                    />
                                </svg>
                                <span className='sr-only'>Close modal</span>
                            </button>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            enableReinitialize={enableReinitialize}
                            validationSchema={validationSchema}
                            onSubmit={async (values, actions) => {
                                await onSubmit(values, actions)
                                setIsOpen(false)
                            }}
                        >
                            {({ isSubmitting, values }) => (
                                <Form className='w-full px-6 py-4'>
                                    <div className='grid grid-cols-1 gap-4'>
                                        {fields
                                            .filter(({ shouldRender }) =>
                                                shouldRender ? shouldRender(values) : true,
                                            )
                                            .map(({ name, label, type = 'text', component }) => (
                                                <div key={name} className='flex flex-col gap-2'>
                                                    <label className='block text-sm font-medium text-gray-700'>
                                                        {label}
                                                    </label>
                                                    {component ? (
                                                        component
                                                    ) : (
                                                        <Field
                                                            type={type}
                                                            name={name}
                                                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100/20 dark:border-gray-100 dark:bg-gray-300 dark:text-white'
                                                        />
                                                    )}
                                                    <ErrorMessage
                                                        name={name}
                                                        component='div'
                                                        className='text-red-500 text-sm'
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                    <button
                                        type='submit'
                                        className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition'
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </>
    )
}
