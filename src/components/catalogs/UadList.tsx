import { useEffect } from "react"
import { useUserUadList } from "@/hooks/useUserUadList"

interface UadOption {
    value: string
    name: string
}

interface UadListProps {
    value?: string
    onChange?: (value: string) => void
}

export function UadList({ value = "", onChange }: UadListProps) {
    const { options } = useUserUadList()

    useEffect(() => {
        if ((value === "" || value === undefined) && options.length > 0) {
            onChange && onChange(options[0].value)
        }
    }, [options, value, onChange])

    return (
        <select
            name="uad"
            id="uad"
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
            {options.map((option: UadOption) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}