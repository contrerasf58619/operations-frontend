import React, { ReactElement, ReactNode } from 'react'

export interface TabProps {
    id: string
    label: string
    children: ReactNode
}

export const Tab: React.FC<TabProps> = ({ children }) => {
    return <>{children}</>
}

export interface TabsProps {
    activeTab: string
    onChange: (tabId: string) => void
    children: ReactNode
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children }) => {
    const tabs = React.Children.toArray(children).filter(
        React.isValidElement,
    ) as ReactElement<TabProps>[]
    const activeContent = tabs.find(tab => tab.props.id === activeTab)?.props.children

    return (
        <>
            <div className='border-b border-gray-200 mb-4'>
                <div className='-mb-px flex space-x-8' aria-label='Tabs' role='tablist'>
                    {tabs.map(tab => {
                        const { id, label } = tab.props
                        const isActive = activeTab === id
                        return (
                            <button
                                aria-selected={isActive}
                                aria-controls={id}
                                aria-label={label}
                                tabIndex={isActive ? 0 : -1}
                                role='tab'
                                key={id}
                                onClick={() => onChange(id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    isActive
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div role='tabpanel' aria-labelledby={activeTab}>
                {activeContent}
            </div>
        </>
    )
}
