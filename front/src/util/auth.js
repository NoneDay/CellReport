import Cookies from 'js-cookie'
const TokenKey = 'x-access-token'
var inFifteenMinutes = new Date(new Date().getTime() + 120 * 60 * 1000);
export function getToken() {
    
    return localStorage.getItem(TokenKey)
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return localStorage.setItem(TokenKey, token)
    return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
    return localStorage.removeItem(TokenKey)
    return Cookies.remove(TokenKey)
}