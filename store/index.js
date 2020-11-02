import Vuex from 'vuex'
import md5 from 'md5'
import slugify from 'slugify'

import db from '~/plugins/firestore'
import { saveUserData, clearUserData } from '~/utils'

const createStore = () => {
  return new Vuex.Store({
    state: {
      headlines: [],
      feed: [],
      category: '',
      loading: false,
      country: 'us',
      token: '',
      user: null,
      headline: null,
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
      CLEAR_TOKEN(state) {
        state.token = ''
      },
      CLEAR_USER(state) {
        state.user = null
      },
      SET_FEED(state, headlines) {
        state.feed = headlines
      },
      CLEAR_FEED(state) {
        state.feed = []
      },
      SET_HEADLINE(state, headline) {
        state.headline = headline
      },
    },
    actions: {
      async loadHeadlines({ commit }, apiUrl) {
        commit('SET_LOADING', true)
        const { articles } = await this.$axios.$get(apiUrl)
        const headlines = articles.map(article => {
          const slug = slugify(article.title, {
            replacement: '-',
            remove: /[^a-zA-Z0-9 -]/g,
            lower: true,
          })
          const headline = { ...article, slug }
          return headline
        })
        commit('SET_LOADING', false)
        commit('SET_HEADLINES', headlines)
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
            `/${userPayload.action}/`,
            {
              email: userPayload.email,
              password: userPayload.password,
              returnSecureToken: userPayload.returnSecureToken,
            }
          )
          let user
          if (userPayload.action === 'register') {
            const avatar = `http://gravatar.com/avatar/${md5(
              authUserData.email
            )}?d=identicon`
            user = { email: authUserData.email, avatar }
            await db
              .collection('users')
              .doc(userPayload.email)
              .set(user)
          } else {
            const loginRef = db.collection('users').doc(userPayload.email)
            console.log('loginRef:', loginRef)
            const loggedInUser = await loginRef.get()
            console.log('loggedInUser:', loggedInUser)
            user = loggedInUser.data()
          }
          commit('SET_USER', user)
          commit('SET_TOKEN', authUserData.idToken)
          commit('SET_LOADING', false)
          saveUserData(authUserData, user)
        } catch (error) {
          console.error(error)
          commit('SET_LOADING', false)
        }
      },
      setLogoutTimer({ dispatch }, interval) {
        setTimeout(() => dispatch('logoutUser'), interval)
      },
      logoutUser({ commit }) {
        commit('CLEAR_TOKEN')
        commit('CLEAR_USER')
        commit('CLEAR_FEED')
        clearUserData()
      },
      async addHeadlineToFeed({ commit, state }, headline) {
        const feedRef = db
          .collection(`users/${state.user.email}/feed`)
          .doc(headline.title)
        await feedRef.set(headline)
      },
      async loadUserFeed({ state, commit }) {
        if (state.user) {
          const feedRef = db.collection(`users/${state.user.email}/feed`)

          await feedRef.onSnapshot(querySnapshot => {
            let headlines = []
            querySnapshot.forEach(doc => {
              headlines.push(doc.data())
              commit('SET_FEED', headlines)
            })
            if (querySnapshot.empty) {
              headlines = []
              commit('SET_FEED', headlines)
            }
          })
        }
      },
      async removeHeadlineFromFeed({ state }, headline) {
        const headlineRef = db
          .collection(`users/${state.user.email}/feed`)
          .doc(headline.title)

        await headlineRef.delete()
      },
      async saveHeadline(context, headline) {
        const headlineRef = db.collection('headlines').doc(headline.slug)
        let headlineId
        await headlineRef.get().then(doc => {
          if (doc.exists) {
            headlineId = doc.id
          }
        })

        if (!headlineId) {
          await headlineRef.set(headline)
        }
      },
      async loadHeadline({ commit }, headlineSlug) {
        const headlineRef = db.collection('headlines').doc(headlineSlug)
        await headlineRef.get().then(doc => {
          if (doc.exists) {
            const headline = doc.data()
            commit('SET_HEADLINE', headline)
          }
        })
      },
    },
    getters: {
      headlines: state => state.headlines,
      category: state => state.category,
      loading: state => state.loading,
      country: state => state.country,
      isAuthenticated: state => !!state.token,
      user: state => state.user,
      feed: state => state.feed,
      headline: state => state.headline,
    },
  })
}

export default createStore
