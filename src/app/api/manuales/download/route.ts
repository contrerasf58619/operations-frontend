import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')

    if (!fileUrl) {
        return new NextResponse('URL parameter is required', { status: 400 })
    }

    try {
        const response = await fetch(fileUrl)
        if (!response.ok) {
            return new NextResponse(`Error fetching file: ${response.statusText}`, {
                status: response.status,
            })
        }

        const buffer = await response.arrayBuffer()
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error: any) {
        console.error('Error in manuales download proxy:', error)
        return new NextResponse(error?.message || 'Error processing request', { status: 500 })
    }
}
