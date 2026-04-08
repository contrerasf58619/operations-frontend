import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'

import { Tabs, Tab } from '../components/UI/Tabs'

const meta = {
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Componente de pestañas reutilizable para organizar contenido en secciones navegables.',
            },
        },
    },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        activeTab: 'tab1',
        onChange: () => {},
        children: null,
    },
    render: function Render() {
        const [activeTab, setActiveTab] = useState('tab1')

        return (
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
                <Tab id='tab1' label='General'>
                    <p>Contenido de la pestaña General.</p>
                </Tab>
                <Tab id='tab2' label='Configuración'>
                    <p>Contenido de la pestaña Configuración.</p>
                </Tab>
                <Tab id='tab3' label='Reportes'>
                    <p>Contenido de la pestaña Reportes.</p>
                </Tab>
            </Tabs>
        )
    },
}
