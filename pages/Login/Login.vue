<template>
	<view class="login-box">
		<view class="login-title">欢迎登录商家管理系统</view>
		<u-form :model="form" ref="uForm" label-width="100" label-position="top">
			<u-form-item label="租户编码" prop="tenantCode" left-icon="phone"><u-input v-model="form.tenantCode" placeholder="请输入租户编码" /></u-form-item>
			<u-form-item label="手机号" prop="phone" left-icon="phone"><u-input v-model="form.phone" placeholder="请输入手机号" /></u-form-item>
			<u-form-item label="验证码" prop="validateCode" left-icon="email">
				<u-input :border="border" placeholder="请输入验证码" v-model="form.validateCode" type="text"></u-input>
				<u-button slot="right" type="error" size="mini" @click="getCode">{{ codeTips }}</u-button>
			</u-form-item>
		</u-form>
		<u-button type="primary" :disabled="!form.phone" @click="submit">提交</u-button>
		<!-- <view class="change-login">
			<text @click="ispwd = !ispwd">{{ ispwd ? '验证码登录' : '密码登录' }}</text>
		</view> -->
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<u-top-tips ref='uTips'></u-top-tips>
	</view>
</template>

<script>
export default {
	data() {
		return {
			ispwd: true,
			form: {
				tenantCode: '',
				phone: '',
				validateCode: ''
			},
			rules: {
				phone: [
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
				validateCode: [
					{
						required: true,
						message: `请输入验证码`,
						trigger: ['blur']
					}
				],
				tenantCode: [
					{
						required: true,
						message: `请输入租户编码`,
						trigger: ['blur']
					}
				]
			},
			codeTips: ''
		};
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$u.api.wxLogin(this.form).then(res => {
						console.log('res', res)
						if(res.data.code && res.data.code !== '200'){
							this.$refs.uTips.show({
								type: 'error',
								title: res.data.msg
							})
							return false
						}
						uni.setStorageSync('tenantCode', this.form.tenantCode)
						uni.setStorageSync(`token`, `${res.data.tokenType} ${res.data.accessToken}`);
						this.$refs.uForm.resetFields();
						this.$u.route({
							type: 'reLaunch',
							url: '/pages/index/index'
						});
					});
				}
			});
		},
		codeChange(text) {
			this.codeTips = text;
		},
		// 获取验证码
		getCode() {
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码',
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		},
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
