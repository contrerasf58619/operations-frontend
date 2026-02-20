import { uadApi } from '@/api/uad.api'
import { useEffect, useState } from 'react'

export function useUserUadList() {
    const [options, setOptions] = useState<{value: number, name: string}[]>([])
    useEffect(() => {
        const resp = uadApi.getUADs().then(resp => {
            const uads = resp.data.data
            setOptions(uads)
        })
    }, [])

    return { options }
}