const skeletonRowsCount = 8

function SkeletonCell({ index }: { index: number }) {
    const widths = ['w-12', 'w-40', 'w-20', 'w-16', 'w-24', 'w-16', 'w-20']
    const width = widths[index % widths.length]
    return (
        <td className='px-6 py-4'>
            <div className={`h-3.5 rounded-full ${width} bg-slate-200 animate-pulse`} />
        </td>
    )
}

export function TableSkeleton({ columns }: { columns: number }) {
    return (
        <>
            {Array.from({ length: skeletonRowsCount }).map((__, rowIndex) => (
                <tr key={rowIndex} className='border-b border-slate-100'>
                    {Array.from({ length: columns }).map((__, colIndex) => (
                        <SkeletonCell key={colIndex} index={colIndex} />
                    ))}
                </tr>
            ))}
        </>
    )
}
