import { useEffect, useState } from 'react'

export function useTableScrollNeeded(columnCount: number) {
    const [needsScroll, setNeedsScroll] = useState(true)

    useEffect(() => {
        const checkScroll = () => {
            const width = window.innerWidth

            if (width < 1010) {
                setNeedsScroll(true)
            } else if (width < 1888) {
                setNeedsScroll(columnCount > 5)
            } else if (width < 2750) {
                setNeedsScroll(columnCount > 9)
            } else {
                setNeedsScroll(columnCount > 15)
            }
        }

        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [columnCount])

    return needsScroll
}
