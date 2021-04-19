export default {
	state: uni.getStorageSync('userInfo') || {
		nickname: '', // 昵称
		phone: '', // 手机号
		avatarUrl: '', // 头像
		tenantMemberId: '', // 会员id
		province: '', // 省
		city: '', // 市
		country: '', // 区
	},
	mutations: {
		setUserInfo(state, userInfo){
			console.log(333222111, userInfo)
			Object.keys(userInfo).map(v => {
				state[v] = userInfo[v]
			})
		}
	},
	actions: {
		setUserInfoAction(context, userInfo){
			console.log(111111)
			context.commit('setUserInfo', userInfo)
		}
	}
}