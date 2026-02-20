import { FC } from 'react'

interface LoadingProps {
    color?: string
}

export const Loading: FC<LoadingProps> = ({ color }) => {
    return (
        <div className='flex justify-center items-center h-[80vh]'>
            <div
                className={`animate-spin rounded-full h-12 w-12 border-4
        border-t-[#0FA3B1] border-r-[#FFB100] border-b-[#F08A00] border-l-[#C96E00]
        ${color || ''}`}
            ></div>
        </div>
    )
}
