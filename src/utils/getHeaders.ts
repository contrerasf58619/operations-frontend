import Cookies from 'js-cookie'

export const getHeaders = () => {
    const accessToken = Cookies.get('access_token')

    return {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    }
}
