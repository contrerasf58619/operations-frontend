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
                <div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50'>
                    <div className='relative p-6 w-full max-w-4xl bg-white rounded-2xl shadow-lg dark:bg-gray-700'>
                        <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600 border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                {title}
                            </h3>
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
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                                        {fields
                                            .filter(({ shouldRender }) =>
                                                shouldRender ? shouldRender(values) : true,
                                            )
                                            .map(({ name, label, type = 'text', component }) => (
                                                <div key={name} className='mb-4'>
                                                    <label className='block text-sm font-medium text-gray-700'>
                                                        {label}
                                                    </label>
                                                    {component ? (
                                                        component
                                                    ) : (
                                                        <Field
                                                            type={type}
                                                            name={name}
                                                            className='input-field w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500 input-field'
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
