'use client'

import { UadList } from "../catalogs/UadList"
import { ConexionNetaTable } from "./ConexionNetaTable"

export function GeneralReport() {
    return (
        <main>
            <div className="w-md">
                <UadList />
            </div>
            <div className="w-full">
                <ConexionNetaTable />
            </div>
        </main>
    )
}