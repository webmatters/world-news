import { getUserFromCookie, getUserFromLocalStorage } from '~/utils'

export default function({ store, req }) {
  if (process.server && !req) return

  const userData = process.server
    ? getUserFromCookie(req)
    : getUserFromLocalStorage()

  if (!userData) {
    return
  } else if (!userData.jwt || Date.now() > userData.expiresIn) {
    store.commit('CLEAR_TOKEN')
    store.commit('CLEAR_USER')
  } else {
    store.commit('SET_TOKEN', userData.jwt)
    store.commit('SET_USER', { email: userData.user, avatar: userData.avatar })
    const timeToLogout = userData.expiresIn - Date.now()
    store.dispatch('setLogoutTimer', timeToLogout)
  }
}
