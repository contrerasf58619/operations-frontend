import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export interface EmployeeData {
    employee: {
        ID_EMPLEADO: number
        FECHA_INGRESO: string
        ID_ESTATUS_EMPLEADO: number
        COD_CONTACTO: number
        ID_PUESTO: number
        ID_UNIDAD: number
        ID_SITE: number
        GRUPO_NOMINA: number
        ID_EMPRESA: number
        FECHA_CONTRATO_PERMANENTE: string | null
        FECHA_BAJA: string | null
        contacto: {
            COD_CONTACTO: number
            NOMBRE1: string
            NOMBRE2: string
            APELLIDO1: string
            APELLIDO2: string
            COD_PAIS: string
        }
        puesto: {
            ID_PUESTO: number
            PUESTO: string
        }
        departamento: {
            ID_DEPARTAMENTO: number
            DEPARTAMENTO: string
        }
        site: {
            ID_SITE: number
            NOMBRE_SITE: string
        }
        grupo_nomina: {
            ID_GRUPO_NOMINA: number
            GRUPO_NOMINA: string
            UAD: string | null
        }
    }
    vacaciones: Array<{
        ANIO_INICIO: number
        ANIO_FINAL: number
        ID_EMPLEADO: number
        DIAS_UTILIZADOS: number
        inicio: string
        ganadas: number
        disponibles: number
    }>
    disponibles: number
}

export interface ResponseApi {
    status: number
    data: EmployeeData
}

export const rrhhApi = {
    getEmployeeByCode(code: string) {
        const route = baseURL(api, `rrhh/empleado/${code}`)
        return axios.get<ResponseApi>(route, {
            headers: getHeaders(),
            params: { employeeCode: code },
        })
    },
}
