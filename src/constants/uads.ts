export type UadCatalogOption = {
    name: string
    value: number
}

export const UAD_CATALOG: UadCatalogOption[] = [
    { name: 'Administrativo GT', value: 33 },
    { name: 'ATC HN', value: 9 },
    { name: 'Banrural GT', value: 14 },
    { name: 'Banrural HN', value: 30 },
    { name: 'Claro GT', value: 5 },
    { name: 'Claro HN', value: 10 },
    { name: 'DGA GT', value: 16 },
    { name: 'Hover GT', value: 11 },
    { name: 'Hover HN', value: 32 },
    { name: 'Lumen GT', value: 42 },
    { name: 'Minex GT', value: 36 },
    { name: 'Priceline GT', value: 37 },
    { name: 'Priceline HN', value: 38 },
    { name: 'Qlink HN', value: 35 },
    { name: 'Rap HN', value: 31 },
    { name: 'Reforma', value: 3 },
    { name: 'Sirius  Comcas GT', value: 25 },
    { name: 'Sirius  Comcas HN', value: 27 },
    { name: 'TPG Col', value: 43 },
    { name: 'TPG HN', value: 8 },
    { name: 'Transition GT', value: 22 },
    { name: 'Transition HN', value: 23 },
    { name: 'Verizon GT', value: 1 },
    { name: 'Verizon CL', value: 46 },
    { name: 'Filipinas', value: 41 },
    { name: 'Administrativo HN', value: 80 },
]

export const GT_UAD_IDS = new Set(
    UAD_CATALOG.filter(option => option.name.endsWith(' GT') || option.name === 'Reforma').map(
        option => option.value,
    ),
)
