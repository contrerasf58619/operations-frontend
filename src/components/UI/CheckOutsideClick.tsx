'use client'

import { JSX, useEffect, useRef } from 'react'

interface Props {
    onCloseClick: () => void
    onCloseStaffClick?: () => void
    onClickClientsPathClose?: () => void
    children: JSX.Element | JSX.Element[]
}

export const CheckOutsideClick = ({
    onCloseClick,
    onCloseStaffClick,
    onClickClientsPathClose,
    children,
}: Props) => {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                if (onCloseClick) onCloseClick()
                if (onCloseStaffClick) onCloseStaffClick()
                if (onClickClientsPathClose) onClickClientsPathClose()
            }
        }

        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [onCloseClick, onCloseStaffClick, onClickClientsPathClose]) // Add dependencies here

    if (!children) {
        return null
    }

    return <div ref={ref}>{children}</div>
}
