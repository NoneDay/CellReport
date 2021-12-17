import request from '@/router/axios';

export const loginByUsername = (username, password, code, redomStr) => request({
    url:  '/user/login',
    method: 'post',
    meta: {
        isToken: false
    },
    data: {
        username,
        password,
        code,
        redomStr
    }
})

export const getUserInfo = () => request({
    url:  '/user/getUserInfo',
    method: 'get',noloading:true
});

export function refeshToken(auth){
    return request({
        url:  '/user/refresh',
        headers:{'Authorization':'Bearer ' + auth},
        method: 'post',noloading:true
    })
}
export const getMenu = (type = 0) => request({
    url:  `/user/getMenu/${type}`,
    method: 'get',
    data:{type},noloading:true
});

export const getTopMenu = () => request({
    url:  '/user/getTopMenu',
    method: 'get',noloading:true
});

export const sendLogs = (list) => request({
    url:  '/user/logout',
    method: 'post',
    data: list
})

export const logout = () => request({
    url:  '/user/logout',
    meta: {
        isToken: false
    },
    method: 'get'
})