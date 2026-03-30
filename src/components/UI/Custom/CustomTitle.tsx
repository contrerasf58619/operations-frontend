interface Props {
    text?: string
    size?: string
    color?: string // Puede ser un valor hexadecimal, nombre de color, RGB, etc.
}

export const CustomTitle = ({ text, size, color }: Props) => {
    return (
        <h1
            className={`my-2 font-semibold ${size ? size : 'text-base'}`}
            style={{ color: color ?? 'inherit' }} // Aplica el color dinámico
        >
            {text}
        </h1>
    )
}
