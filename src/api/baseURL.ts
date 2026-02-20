export const baseURL = (
    api: string,
    path: string,
    params?: Record<string, string | number | undefined>,
): string => {
    if (!api) {
        throw new Error('API base URL is required')
    }

    const url = new URL(path, api)

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString())
            }
        })
    }

    return url.toString()
}
