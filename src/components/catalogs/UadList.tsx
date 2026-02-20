import { useUserUadList } from "@/hooks/useUserUadList"

export function UadList() {
    const { options } = useUserUadList()

    return (
        <select name="" id="" className="w-full p-2 border rounded">
            {options.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}