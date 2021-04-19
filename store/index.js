import Vue from 'vue'
import Vuex from 'vuex'

import userInfo from './modules/userInfo.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	actions: {

	},
	getters: {

	},
	mutations: {

	},
	state: {
		username: 'foo'
	},
	modules: {
		userInfo
	}
})

export default store