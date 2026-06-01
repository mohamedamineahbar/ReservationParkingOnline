// utils/jwtUtils.js
export const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
    );

    const payload = JSON.parse(jsonPayload);
    return payload?.roles?.includes('ROLE_ADMIN');
};
