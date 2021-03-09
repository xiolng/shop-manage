<template>
	<view class="my-box">
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10"><u-avatar :src="shopDetail.shopLogo" size="140"></u-avatar></view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{shopDetail.shopName}}</view>
				<view class="u-font-14 u-tips-color">{{shopDetail.shopTel}}</view>
			</view>
			<view class="u-m-l-10 u-p-10"><u-icon name="scan" color="#969799" size="28"></u-icon></view>
			<view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="edit-pen" title="信息修改" @click="$u.route({
				url: `/pages/My/ShopDetail`
			})"></u-cell-item></u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="chat" title="问题反馈" @click="$u.route(`/pages/My/Feedback`)"></u-cell-item></u-cell-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			shopDetail: {
				businessHour: '',
				shopAddress: '',
				shopDetail: '',
				shopId: '',
				shopLogo: 'https://uviewui.com/common/logo.png',
				shopName: '东来顺',
				shopTel: '18888888888'
			}
		};
	},
	methods: {}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}

.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}
.user-box {
	background-color: #fff;
}
</style>
