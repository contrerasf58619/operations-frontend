'use client'

import React, { useState } from 'react'
import { Manual } from './interfaces/manual.interface'
import { ManualesTable } from './components/ManualesTable'
import { PdfViewer } from './components/PdfViewer'
import { MANUALES_DATA } from './data/manuales.data'

const Manuales: React.FC = () => {
    const [selectedManual, setSelectedManual] = useState<Manual | null>(null)

    const handleViewManual = (manual: Manual) => {
        setSelectedManual(manual)
    }

    const handleCloseViewer = () => {
        setSelectedManual(null)
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-full mx-auto space-y-6'>
               {/* Table View */}
                <ManualesTable data={MANUALES_DATA} onView={handleViewManual} />
            </div>

            {/* Fullscreen PDF Modal */}
            {selectedManual && (
                <PdfViewer manual={selectedManual} onClose={handleCloseViewer} />
            )}
        </div>
    )
}

export default Manuales

