<template>
	<view class="login-box">
		<view class="login-title">欢迎登录商家管理系统</view>
		<u-form :model="form" ref="uForm" label-width="100" label-position="top">
			<u-form-item label="手机号" prop="username" left-icon="phone"><u-input v-model="form.username" placeholder="请输入手机号" /></u-form-item>
			<u-form-item label="密码" prop="password" left-icon="lock"><u-input v-model="form.password" placeholder="请输入密码" type="password" @confirm="submit" /></u-form-item>
		</u-form>
		<u-button type="primary" :disabled="!form.username" @click="submit">提交</u-button>
		<view class="change-login">
			<text @click="ispwd = !ispwd">{{ ispwd ? '验证码登录' : '密码登录' }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			ispwd: true,
			form: {
				username: '',
				password: '',
				validate: ''
			},
			rules: {
				username: [
					{
						required: true,
						message: `请输入手机号`,
						trigger: ['blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: `手机号码格式不正确`,
						trigger: ['change', 'blur']
					}
				],
				password: [
					{
						required: true,
						message: `请输入密码`,
						trigger: ['blur']
					}
				]
			}
		};
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$u.api.login(this.form).then(res => {
						uni.setStorageSync(`token`, `${res.data.tokenType} ${res.data.accessToken}`);
						this.$refs.uForm.resetFields();
						this.$u.route({
							type: 'reLaunch',
							url: '/pages/index/index'
						});
					});
				}
			});
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>

<style lang="scss">
.login-box {
	padding: 40rpx;
	.login-title {
		font-size: 40rpx;
		margin-bottom: 30rpx;
	}
	.change-login {
		padding: 20rpx 0;
	}
}
</style>
