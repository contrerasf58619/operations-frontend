'use client'
import { createContext, FC, useContext, useState, useEffect, JSX } from 'react'
import { catalogsApi } from '@/api/catalogs.api'

import { Loading } from '@/components/UI/Loading'

import Icons from '@/utils/icons'
import { useGetEmployeeCode } from '@/hooks/useGetEmployeeCode'

interface ContextProps {
    sidebarState: SidebarState
    toggleSideBar: boolean
    onClickSidebarCollapse: (name: string) => void
    onOpenSideBar: () => void
    onCloseSideBar: () => void
}

interface SidebarState {
    parents: Array<{
        name: string
        icon: JSX.Element
        collapsed: boolean
        childs: Array<{
            name: string
            url: string
        }>
    }>
}

const INITIAL_STATE: SidebarState = {
    parents: [],
}

export const SidebarContext = createContext({} as ContextProps)

export const SidebarProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [sidebarState, setSidebarState] = useState<SidebarState>(INITIAL_STATE)
    const [toggleSideBar, setToggleSideBar] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { employeeCode } = useGetEmployeeCode()

    // Transform data from API
    const transformMenuData = (data: any) => {
        return data.map((parent: any) => {
            const IconParent = Icons[parent.icon as keyof typeof Icons]

            return {
                name: parent.name.length > 14 ? parent.name.slice(0, 14) + '...' : parent.name,
                icon: IconParent ? <IconParent /> : null,
                collapsed: true,
                childs: parent.children.map((child: any) => {
                    const IconChild = Icons[child.icon as keyof typeof Icons]

                    return {
                        name: child.name,
                        url: child.route_relative,
                        icon: IconChild ? <IconChild /> : null,
                    }
                }),
            }
        })
    }

    useEffect(() => {
        const fetchMenuData = async () => {
            setLoading(true)

            try {
                if (employeeCode) {
                    const resp = await catalogsApi.getMenus(Number(employeeCode))

                    const transformedData = transformMenuData(resp.data.data)

                    setSidebarState({ parents: transformedData })
                }
            } catch (error) {
                console.error('Error fetching menu data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMenuData()
    }, [setLoading, employeeCode])

    const onClickSidebarCollapse = (name: string) => {
        const updatedParents = sidebarState.parents.map(parent => ({
            ...parent,
            collapsed: parent.name === name ? !parent.collapsed : true,
        }))
        setSidebarState({ parents: updatedParents })
    }

    const onOpenSideBar = () => {
        setToggleSideBar(true)
    }

    const onCloseSideBar = () => {
        setToggleSideBar(false)
    }

    return (
        <SidebarContext.Provider
            value={{
                sidebarState,
                toggleSideBar,
                onCloseSideBar,
                onOpenSideBar,
                onClickSidebarCollapse,
            }}
        >
            {loading ? <Loading /> : children}{' '}
        </SidebarContext.Provider>
    )
}

export const useSidebarContext = () => useContext(SidebarContext)
