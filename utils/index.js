import Vue from 'vue';
export const isLogin = () => {
	const token = uni.getStorageSync('token')
	if (!token) {
		goLogin()
		return false
	}
	return true
}

export const goLogin = () => {
	uni.login({
		success(result) {
			console.log('result', result)
			if (result.code) {
				Vue.prototype.$u.api.wxCode({
					code: result.code
				}).then(res => {
					console.log('res', res)
					const {
						code,
						data,
						msg
					} = res.data
					if (code === '200') {
						if (data.type === '1') {
							uni.setStorageSync('token', 'Bearer ' + data.result)
							Vue.prototype.$u.api.getShop().then(user => {
								uni.setStorageSync('userInfo', user.data.data)
								uni.reLaunch({
									url: `/pages/index/index`
								})
							})
						} else {
							uni.setStorageSync('openId', data.result)
							uni.navigateTo({
								url: '/pages/Login/Login'
							})
						}
					} else {
						uni.showModal({
							title: '登录错误',
							content: msg,
							showCancel: false,
							success(res) {
								res.confirm && uni.navigateTo({
									url: `/pages/Login/Login`
								})
							}
						})
					}
				})
			}
		}
	})
}
