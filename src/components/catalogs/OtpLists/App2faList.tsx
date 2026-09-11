import { useEffect, useState, useRef } from 'react'
import { otpApi } from '@/api/otp.api'
import { useApp2FaContext } from '@/context/otp/App2faContext'

interface AppOption {
    id: number
    name: string
}

export function TwoFactorAppList() {
    const [apps, setApps] = useState<AppOption[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { selectedApp, setSelectedApp } = useApp2FaContext()
    // const [code, setCode] = useState<string | null>(null)
    const [ttl, setTtl] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await otpApi.getApp()
                setApps(resp.data)
            } catch (err) {
                console.error('Error fetching 2FA apps', err)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    useEffect(() => {
        // setCode(null)
        setTtl(0)
    }, [selectedApp])

    useEffect(() => {
        if (ttl <= 0) return
        const id = setTimeout(() => setTtl(t => t - 1), 1000)
        return () => clearTimeout(id)
    }, [ttl])

    const filtered = apps.filter(
        a =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.id.toString().includes(searchTerm),
    )

    const selectedName = apps.find(a => a.id === selectedApp)?.name ?? 'Select 2FA app'

    return (
        <div className='relative w-64' ref={dropdownRef}>
            <div
                role='button'
                tabIndex={0}
                aria-haspopup='listbox'
                aria-expanded={isOpen}
                className='border rounded px-3 py-1 cursor-pointer flex justify-between items-center'
                onClick={() => setIsOpen(o => !o)}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setIsOpen(o => !o)
                    }
                }}
            >
                <span>{selectedName}</span>
                <span className={`transform transition ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </div>
            {/* Dropdown List */}
            {isOpen && (
                <div className='absolute bg-white border mt-1 w-full max-h-56 overflow-auto z-20'>
                    <input
                        className='w-full px-2 py-1 border-b'
                        placeholder='🔍 Search...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {filtered.map(a => (
                        <button
                            key={a.id}
                            type='button'
                            className={`w-full px-3 py-1 text-left cursor-pointer hover:bg-gray-100 ${
                                selectedApp === a.id ? 'bg-indigo-100' : ''
                            }`}
                            onClick={() => {
                                setSelectedApp(a.id)
                                setIsOpen(false)
                            }}
                        >
                            {a.name}
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <div className='px-3 py-2 text-sm text-gray-500'>No apps found</div>
                    )}
                </div>
            )}
        </div>
    )
}
