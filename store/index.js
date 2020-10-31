import Vuex from 'vuex'
import md5 from 'md5'

const createStore = () => {
  return new Vuex.Store({
    state: {
      headlines: [],
      category: '',
      loading: false,
      country: 'us',
      token: '',
      user: null,
    },
    mutations: {
      SET_HEADLINES(state, headlines) {
        state.headlines = headlines
      },
      SET_CATEGORY(state, category) {
        state.category = category
      },
      SET_LOADING(state, loading) {
        state.loading = loading
      },
      SET_COUNTRY(state, country) {
        state.country = country
      },
      SET_TOKEN(state, token) {
        state.token = token
      },
      SET_USER(state, user) {
        state.user = user
      },
    },
    actions: {
      async loadHeadlines({ commit }, apiUrl) {
        commit('SET_LOADING', true)
        const { articles } = await this.$axios.$get(apiUrl)
        commit('SET_LOADING', false)
        commit('SET_HEADLINES', articles)
      },
      changeCategory({ commit }, category) {
        commit('SET_CATEGORY', category)
      },
      changeCountry({ commit }, country) {
        commit('SET_COUNTRY', country)
      },
      async authenticateUser({ commit }, userPayload) {
        try {
          commit('SET_LOADING', true)
          const authUserData = await this.$axios.$post(
            '/register/',
            userPayload
          )
          const avatar = `http://gravatar.com/avatar/${md5(
            authUserData.email
          )}?d=identicon`
          const user = { email: authUserData.email, avatar }
          commit('SET_USER', user)
          commit('SET_TOKEN', authUserData.idToken)
          commit('SET_LOADING', false)
        } catch (error) {
          console.error(error)
          commit('SET_LOADING', false)
        }
      },
    },
    getters: {
      headlines: state => state.headlines,
      category: state => state.category,
      loading: state => state.loading,
      country: state => state.country,
      isAuthenticated: state => !!state.token,
      user: state => state.user,
    },
  })
}

export default createStore
