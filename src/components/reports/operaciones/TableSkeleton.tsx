const skeletonRowsCount = 8

function SkeletonCell({ index }: { index: number }) {
    const widths = ['w-2/3', 'w-4/5', 'w-1/2', 'w-3/5', 'w-3/4', 'w-1/2', 'w-2/3']
    const width = widths[index % widths.length]
    return (
        <td className='px-3 py-2.5 xl:px-4 xl:py-3 min-w-[90px] lg:min-w-[110px] xl:min-w-[130px]'>
            <div className={`h-3.5 rounded-full ${width} bg-slate-200 animate-pulse`} />
        </td>
    )
}

export function TableSkeleton({ columns }: { columns: number }) {
    return (
        <>
            {Array.from({ length: skeletonRowsCount }).map((item, rowIndex) => (
                <tr key={rowIndex} className='border-b border-slate-100'>
                    {Array.from({ length: columns }).map((item, colIndex) => (
                        <SkeletonCell key={colIndex} index={colIndex} />
                    ))}
                </tr>
            ))}
        </>
    )
}
