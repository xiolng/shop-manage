<template>
	<view class="wxauth-box">
		<view class="shop-logo">
			<u-image :src="shopLogo" width='200' height='200' shape="circle" />
		</view>
		<view class="btn-item">
			<u-button type="success" open-type="getUserInfo" @getuserinfo="getUserInfo" long>微信授权</u-button>
		</view>
		<view class="btn-item">
			<u-button type="info" long>平台协议</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shopLogo: ''
			}
		},
		mounted() {
			this.shopLogo = uni.getStorageSync('shopDetail').shopLogo
		},
		methods: {
			getUserInfo(res){
				console.log('userInfo', res)
				uni.setStorageSync('userInfo', res.detail.userInfo)
				uni.navigateTo({
					url: '../Login/Login'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.wxauth-box{
	min-height: 80vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.shop-logo{
		width: 200rpx;
		height: 200rpx;
		border-radius: 200rpx;
		margin-bottom: 40rpx;
	}
	.btn-item{
		width: 100%;
		padding: 20rpx 80rpx;
		box-sizing: border-box;
	}
}
</style>
