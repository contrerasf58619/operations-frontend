export interface MenuChild {
    name: string
    url: string
    icon: string
}

export interface MenuParent {
    name: string
    icon: any
    childs: MenuChild[]
    collapsed: boolean
}

export interface SidebarState {
    parents: MenuParent[]
}

export interface MenuData {
    id: number
    parent_id: number
    app_id: number
    position: number
    name: string
    route: string
    route_relative: string | null
    show: boolean
    active: boolean
    icon: string | null
    date_created?: string
    date_mod?: string | null
    user_created: number
    user_mod?: number | null
    children?: MenuData[]
}
