import { setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { isURL, validatenull } from '@/util/validate'
import { encryption, deepClone } from '@/util/util'
import webiste from '@/config/website'
import { loginByUsername, getUserInfo, getMenu, getTopMenu, logout, refeshToken } from '@/api/user'

function arrayToTree(list, pid = 0) {
  return list.filter(item => item.pid === pid).map(item => ({
    ...item,
    children: arrayToTree(list, item.id),
  }));
}
function addPath (ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'label',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$")
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])
  && !ele[propsDefault.path].startsWith("/")
  && !ele[propsDefault.path].endsWith(".cr")
  ) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children]?.forEach(child => {
      if (!isURL(child[propsDefault.path]) 
        && !child[propsDefault.path].startsWith("/")
        && !child[propsDefault.path].endsWith(".cr")
        ) //我加的规则，我自己在后台已经弄好的绝对路径
      {
        child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ?? 'index'}`
      }
      addPath(child);
    })
  }

}
const user = {
  state: {
    userInfo: {},
    permission: {},
    roles: [],
    canReadSys:[],
    zb_send_list:[],
    menuId: getStore({ name: 'menuId' }) || {},
    menu: getStore({ name: 'menu' }) || [],
    menuAll: getStore({ name: 'menuAll' }) || [],
    token: getStore({ name: 'token' }) || '',
    token_refresh: getStore({ name: 'token_refresh' }) || '',
  },
  actions: {
    //根据用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        type: 'Aes',
        key: 'ONxYDyNaCoyTzsp83JoQ3YYuMPHxk3j7',
        param: ['username', 'password']
      });
      
      return new Promise((resolve) => {//userInfo.redomStr
        loginByUsername(user.username, user.password, userInfo.code,user ).then(res => {
          
          const data = res.data;
          commit('SET_TOKEN', data);
          commit('SET_REFRESH_TOKEN', res.refresh_token);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        })
      })
    },
    //根据手机号登录
    LoginByPhone ({ commit }, userInfo) {
      return new Promise((resolve) => {
        loginByUsername(userInfo.phone, userInfo.code).then(res => {
          const data = res.data;
          commit('SET_TOKEN', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        })
      })
    },
    GetUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data;
          commit('SET_USERINFO', data.userInfo);
          commit('SET_ROLES', data.roles);
          commit('SET_PERMISSION', data.permission)
          commit('SET_CANREADSYS', data.canReadSys)
          commit('SET_ZBSENDLIST', data.zb_send_list)
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      })
    },
    //刷新token
    RefreshToken ({ state, commit }) {
      
      return new Promise((resolve, reject) => {
        refeshToken(state.token_refresh).then(res => {
          const data = res.data;
          commit('SET_TOKEN', data);
          //commit('SET_REFRESH_TOKEN', res.refresh_token);
          
          resolve(data);
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_MENUID', {})
          commit('SET_MENUALL', []);
          commit('SET_MENU', [])
          commit('SET_ROLES', [])
          commit('SET_CANREADSYS', [])
          commit('SET_ZBSENDLIST', [])
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_MENUID', {})
        commit('SET_MENUALL', []);
        commit('SET_MENU', [])
        commit('SET_ROLES', [])
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
    GetTopMenu () {
      return new Promise(resolve => {
        getTopMenu().then((res) => {
          const data = res.data || []
          resolve(data)
        })
      })
    },
    //获取系统菜单
    GetMenu ({ commit }, parentId) {
      return new Promise(resolve => {
        
        getMenu(parentId).then((res) => {
          let menu =(res.data.length>0 && res.data[0].hasOwnProperty('pid'))? deepClone(arrayToTree(res.data)): deepClone(res.data);
          
          menu.forEach(ele => {
            addPath(ele, true);
          })
          commit('SET_MENU', menu)
          resolve(menu)
        })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      //setToken(token)
      state.token = token;
      setStore({ name: 'token', content: token, type: 'session' })
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.token_refresh = token;
      setStore({ name: 'token_refresh', content: token, type: 'session' })
    },
    SET_MENUID (state, menuId) {
      state.menuId = menuId;
      setStore({ name: 'menuId', content: state.menuId, type: 'session' })
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_MENUALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({ name: 'menuAll', content: state.menuAll, type: 'session' })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      let menuAll = state.menuAll;
      if (!validatenull(menu)) {
        const obj = menuAll.filter(ele => ele.path === menu[0].path)[0]
        if (!obj) {
          menuAll = menuAll.concat(menu);
          state.menuAll = menuAll
        }
        setStore({ name: 'menuAll', content: state.menuAll, type: 'session' })
      }
      setStore({ name: 'menu', content: state.menu, type: 'session' })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_CANREADSYS: (state, canReadSys) => {
      state.canReadSys = canReadSys;
    },
    SET_ZBSENDLIST: (state, zb_send_list) => {
      state.zb_send_list = zb_send_list
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = {};
      permission.forEach(ele => {
        state.permission[ele] = true;
      });
    }
  }

}
export default user