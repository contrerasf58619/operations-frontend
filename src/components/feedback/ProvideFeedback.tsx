'use client'

import { useState, useCallback, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { inputFields } from './constants/form'
import {
    useCoachingUsers,
    useCreateCoachingSession,
    useUploadAttachment,
} from '@/hooks/coachingSession'
import { CoachingSession } from '@/api/coachingSession.api'
import {
    getBehavioralIndicator,
    getBehavioralIndicatorOther,
    isFieldVisible,
    isOtherValue,
} from './utils'
import { AttachmentResponse, FormFieldConfig } from './entities'
import { useGetEmployeeCode } from '@/hooks'
import { useEmployeeContext } from '@/context/employee/EmployeeContext'
import dayjs from 'dayjs'

const ProvideFeedback = () => {
    const [attachments, setAttachments] = useState<FileList | null>(null)
    const { users } = useCoachingUsers(43, '124140,124941,130541,130543,133230,130461')
    const { saving, createCoachingSession } = useCreateCoachingSession()
    const { uploading, uploadAttachment } = useUploadAttachment()
    const { employeeCode } = useGetEmployeeCode()
    const { employee } = useEmployeeContext()
    const name = `${employee?.employee.contacto.NOMBRE1} ${employee?.employee.contacto.APELLIDO1}`

    const [formValues, setFormValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {}
        inputFields.forEach(f => {
            initial[(f as FormFieldConfig).name] = ''
        })
        return initial
    })

    const fields = inputFields.map(field => {
        if (field.name === 'leader_code') {
            return {
                ...field,
                options: users.map(user => ({
                    id: user.ROSTER_ID,
                    label: user.FIRST_NAME + ' ' + user.LAST_NAME,
                    value: user.ROSTER_ID,
                })),
            }
        }
        return field
    }) as FormFieldConfig[]

    useEffect(() => {
        setFormValues(prev => {
            const next = { ...prev }
            let changed = false
            fields.forEach(field => {
                if (field.dependsOn && !isFieldVisible(field, prev) && prev[field.name] !== '') {
                    next[field.name] = ''
                    changed = true
                }
            })
            return changed ? next : prev
        })
    }, [formValues, fields])

    const handleChange = useCallback((name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let attachmentResponse: AttachmentResponse[] = []
        if (attachments?.length) {
            attachmentResponse = await uploadAttachment(attachments)
        }

        const behavioralIndicator = isOtherValue(getBehavioralIndicator(formValues) as string)
            ? `${getBehavioralIndicatorOther(formValues)} - ${getBehavioralIndicator(formValues)}`
            : getBehavioralIndicator(formValues)

        const leader = users.find(user => user.ROSTER_ID === Number(formValues.leader_code))
        const data = {
            leader_name: leader?.FIRST_NAME + ' ' + leader?.LAST_NAME,
            agent_name: formValues.agent_name,
            agent_employee_code: formValues.agent_employee_code,
            agent_email: formValues.agent_email,
            coaching_date: formValues.coaching_date,
            coaching_type: formValues.coaching_type,
            metric: formValues.metric,
            behavioral_indicator: behavioralIndicator,
            coaching_comments: formValues.coaching_comments,
            strengths: formValues.strengths,
            opportunities: formValues.opportunities,
            action_plan: formValues.action_plan,
            leader_commitment: formValues.leader_commitment,
            coaching_related_attachments: attachmentResponse
                .map((file: AttachmentResponse) => file.key)
                .join(','),
            leader_code: formValues.leader_code,
            created_by: employeeCode,
            uadId: 43,
        }

        await createCoachingSession(data as CoachingSession)

        setFormValues(() => {
            const initial: Record<string, string> = {}
            inputFields.forEach(f => {
                initial[f.name] = ''
            })
            return initial
        })

        setAttachments(null)
    }

    const inputClasses =
        'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors bg-white'

    const renderSelect = (field: FormFieldConfig) => (
        <select
            name={field.name}
            value={formValues[field.name]}
            onChange={e => handleChange(field.name, e.target.value)}
            disabled={field.disabled}
            required={field.required}
            className={inputClasses}
        >
            <option value=''>{field.placeholder}</option>
            {field.options?.map(opt => (
                <option key={opt.id} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    )

    const renderText = (field: FormFieldConfig) => (
        <input
            type='text'
            name={field.name}
            value={formValues[field.name]}
            onChange={e => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            required={field.required}
            pattern={field.pattern}
            className={inputClasses}
        />
    )

    const renderDate = (field: FormFieldConfig) => (
        <DatePicker
            selected={formValues[field.name] ? dayjs(formValues[field.name]).toDate() : null}
            onChange={(date: Date | null) => {
                handleChange(field.name, dayjs(date).format('YYYY-MM-DD'))
            }}
            placeholderText={field.placeholder}
            dateFormat='yyyy/MM/dd'
            disabled={field.disabled}
            className={inputClasses}
        />
    )

    const renderRadio = (field: FormFieldConfig) => (
        <div className='flex flex-col gap-2'>
            {field.options?.map(opt => (
                <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        formValues[field.name] === opt.value
                            ? 'border-teal bg-teal/5 text-teal'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <input
                        type='radio'
                        name={field.name}
                        value={opt.value}
                        checked={formValues[field.name] === opt.value}
                        onChange={e => {
                            handleChange(field.name, e.target.value)
                            if (!isOtherValue(e.target.value)) {
                                handleChange(`${field.name}_other`, '')
                            }
                        }}
                        className='accent-teal w-4 h-4'
                    />
                    <span className='text-sm'>{opt.label}</span>
                </label>
            ))}

            {isOtherValue(formValues[field.name]) && (
                <input
                    type='text'
                    placeholder='Please specify...'
                    value={formValues[`${field.name}_other`] || ''}
                    onChange={e => handleChange(`${field.name}_other`, e.target.value)}
                    className={`${inputClasses} mt-1`}
                    required
                />
            )}
        </div>
    )

    const renderTextarea = (field: FormFieldConfig) => (
        <textarea
            name={field.name}
            value={formValues[field.name]}
            onChange={e => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            required={field.required}
            rows={4}
            className={inputClasses + ' resize-y'}
        />
    )

    const renderUploadFile = (field: FormFieldConfig) => (
        <div className='flex flex-col gap-1'>
            <input
                type='file'
                onChange={e => setAttachments(e.target.files)}
                name={field.name}
                accept={field.allowedExtensions?.join(',')}
                multiple={field.maxFiles ? field.maxFiles > 1 : false}
                disabled={field.disabled}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal/10 file:text-teal hover:file:bg-teal/20 file:cursor-pointer file:transition-colors'
            />
            {field.maxFiles && (
                <span className='text-xs text-gray-400'>
                    Max {field.maxFiles} file(s) — up to {field.maxFileSizeMB ?? 100}MB each
                </span>
            )}
        </div>
    )

    const renderField = (field: FormFieldConfig) => {
        switch (field.type) {
            case 'select':
                return renderSelect(field)
            case 'text':
                return renderText(field)
            case 'date':
                return renderDate(field)
            case 'radio':
                return renderRadio(field)
            case 'textarea':
                return renderTextarea(field)
            case 'upload file':
                return renderUploadFile(field)
            default:
                return null
        }
    }

    return (
        <div className='min-h-screen flex justify-center '>
            <form
                onSubmit={handleSubmit}
                className='w-full max-w-2xl flex flex-col gap-6 bg-gray-50 p-5 rounded-lg'
            >
                <div className='text-left mb-2'>
                    <h1 className='text-4xl font-bold mb-2 text-gray-900'>
                        GWL Temporary Coaching Form
                    </h1>
                    <p className='text-md text-gray-600 mt-5'>
                        Hi,{' '}
                        <span className='capitalize'>
                            {name !== 'Your name' ? `${name.toLocaleLowerCase()}` : ''}
                        </span>
                        . When you submit this form, the owner will see your name and email address.
                    </p>
                </div>

                {fields.map(field => {
                    const visible = isFieldVisible(field, formValues)
                    if (!visible) return null

                    return (
                        <div key={field.id} className='flex flex-col gap-1.5'>
                            <label
                                htmlFor={field.name}
                                className='text-sm font-medium text-gray-700'
                            >
                                {field.label}
                                {field.required && <span className='text-red-500 ml-0.5'>*</span>}
                            </label>
                            {renderField(field)}
                        </div>
                    )
                })}

                <div className='pt-4 border-t border-gray-200'>
                    <button
                        type='submit'
                        disabled={saving || uploading}
                        className='w-full py-3 font-semibold rounded-lg px-6 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 justify-center'
                    >
                        {(saving || uploading) && (
                            <div className='inline-block animate-spin'>
                                <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                            </div>
                        )}
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProvideFeedback
