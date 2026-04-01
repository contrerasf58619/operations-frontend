'use client'

import React, { useState, useEffect } from 'react'
import { UadList } from '../catalogs/UadList'
import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../UI/DataTable'
import { Tabs, Tab } from '../UI/Tabs'
import { PayrollBeforeDatesSelector } from '../UI/PayrollBeforeDatesSelector'
import { useOvertimeAlerts } from '@/hooks/useAlerts'

const getPercentageColor = (porcentaje: number) => {
  if (porcentaje <= 10) return 'text-green-600 bg-green-50'
  if (porcentaje > 10 && porcentaje <= 15) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
}

interface HorasExtraInterface {
  roster_id: number
  semana: string
  extras: string
  tiempo_productivo: string
  porcentaje: number
}

const columnsUpdate: ColumnDef<HorasExtraInterface>[] = [
  {
    accessorKey: "roster_id",
    header: "Roster ID",
  },
  {
    accessorKey: "semana",
    header: "Semana",
  },
  {
    accessorKey: "extras",
    header: "Extras",
  },
  {
    accessorKey: "tiempo_productivo",
    header: "Tiempo Productivo",
  },
  {
    accessorKey: "porcentaje",
    header: "Porcentaje",
    cell: (info) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}>
        {info.getValue() as number}%
      </span>
    ),
  },
]

const AlertsReport: React.FC = () => {

  const [selectedUad, setSelectedUad] = useState<number>(0)
  const [selectedNomina, setSelectedNomina] = useState<number>(0)

  const [activeTab, setActiveTab] = useState<'extras' | 'asueto' | 'jornada'>('extras')

  useEffect(() => {
    setSelectedNomina(0)
  }, [selectedUad])

  const { alerts: alertsData, loading: loadingAlerts } = useOvertimeAlerts(
    selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null
  )

  const showTable = selectedUad !== 0 && selectedNomina !== 0 && !loadingAlerts

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Alertas</h1>
        <p className="text-gray-600 mb-8">
          Consulta las alertas de tiempo productivo y extras por roster
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* UAD Selector */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <label htmlFor='uad' className="block text-sm font-semibold text-gray-900 mb-4">
              UAD
            </label>
            <div className="space-y-4">
              <UadList value={selectedUad} onChange={(v) => setSelectedUad(Number(v))} />
            </div>
          </div>

          {/* Nómina Selector */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <label htmlFor='payroll' className="block text-sm font-semibold text-gray-900 mb-4">
              Periodo de Nómina
            </label>
            <div className="space-y-4">
              <PayrollBeforeDatesSelector
                uadId={selectedUad}
                date={Number(dayjs().format('YYYYMMDD'))}
                value={selectedNomina}
                onChange={setSelectedNomina}
                disabled={!selectedUad}
              />
            </div>
          </div>
        </div>

        {/* Loading Indicator for Table */}
        {loadingAlerts && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Tabs and Data Table */}
        {showTable && (
          <div className="mt-2">
            {/* Tabs */}
            <Tabs activeTab={activeTab} onChange={(id) => setActiveTab(id as any)}>
              <Tab id="extras" label="Horas extras">
                <DataTable
                  data={alertsData}
                  columns={columnsUpdate}
                  searchPlaceholder="Buscar roster, semana, etc..."
                  noDataText="No se encontraron alertas de horas extra."
                />
              </Tab>

              <Tab id="asueto" label="Horas en asueto">
                <div className="bg-white py-16 px-6 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500 bg-gray-50/50">
                  <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">Horas en asueto</p>
                  <p className="text-sm">El contenido para esta sección estará disponible próximamente.</p>
                </div>
              </Tab>

              <Tab id="jornada" label="Horas jornada">
                <div className="bg-white py-16 px-6 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500 bg-gray-50/50">
                  <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">Horas jornada</p>
                  <p className="text-sm">El contenido para esta sección estará disponible próximamente.</p>
                </div>
              </Tab>
            </Tabs>

          </div>
        )}
      </div>

    </div>
  )
}

export default AlertsReport
