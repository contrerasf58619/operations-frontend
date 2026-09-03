import TotpWidget from '@/components/modules/otp/Otp'
import { App2FaProvider } from '@/context/otp/App2faContext'

export default function OtpPage() {
    return (
        <App2FaProvider>
            <TotpWidget />
        </App2FaProvider>
    )
}
