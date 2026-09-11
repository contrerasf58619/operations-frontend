'use client'
import * as Yup from 'yup'
import Cookies from 'js-cookie'
import { TwoFactorAppList } from '@/components/catalogs/OtpLists/App2faList'
import { FormModal } from '@/components/UI/Modals/FormModalCreate'
import { useToastContext } from '@/context/UI/ToastNotificationContext'
import { otpApi } from '@/api/otp.api'
import { useApp2FaContext } from '@/context/otp/App2faContext'

interface AppRegistrationModalProps {
    onRegistered?: () => void
}

export function AppRegistrationModal({ onRegistered }: AppRegistrationModalProps) {
    const { selectedApp } = useApp2FaContext()
    const { toast } = useToastContext()

    const userId = Number(Cookies.get('employeeCode') || 0)

    const initialValues = {
        userId,
        appId: selectedApp,
        secret: '',
        email: '',
    }

    const validationSchema = Yup.object({
        secret: Yup.string().required('La clave secreta es requerida'),
        email: Yup.string().email('Debe ser un correo válido').required('El correo es requerido'),
    })

    const handleSubmit = async (
        values: typeof initialValues,
        actions: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
        try {
            await otpApi.registerSecret(values.userId, values.appId, values.secret, values.email)
            toast.success('Registro 2FA exitoso')
            onRegistered?.()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al registrar 2FA')
        } finally {
            actions.setSubmitting(false)
        }
    }

    return (
        <FormModal
            title='Importar Secreto Externo'
            buttonText='Importar Secreto'
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            fields={[
                {
                    name: 'appId',
                    label: 'Aplicación',
                    component: <TwoFactorAppList />,
                },
                {
                    name: 'secret',
                    label: 'Clave secreta (Base32)',
                    type: 'text',
                },
                {
                    name: 'email',
                    label: 'Correo electrónico',
                    type: 'email',
                },
            ]}
        />
    )
}
