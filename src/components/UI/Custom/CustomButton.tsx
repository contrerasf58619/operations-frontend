interface Props {
    onClick?: () => void
    backgroundColor: string
    color?: string
    type: 'submit' | 'reset' | 'button' | undefined
    children: React.ReactNode
}

export const CustomButton = ({ onClick, type, backgroundColor, color, children }: Props) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={`${backgroundColor} inline-block px-6 py-2 rounded-md font-semibold cursor-pointer`}
        >
            <div className={`text-[11px] 2xl:text-xs ${color}`}>{children}</div>
        </button>
    )
}
