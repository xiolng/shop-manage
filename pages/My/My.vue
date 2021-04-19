<template>
	<view class="my-box">
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar v-if="shopDetail.shopLogo" :src="BASE_URL +'/files/'+ shopDetail.shopLogo" size="140"></u-avatar>
				<u-avatar v-else :src="shopDetail.shopLogo" size="140"></u-avatar>
				</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{shopDetail.shopName}}</view>
				<view class="u-font-14 u-tips-color">{{shopDetail.shopTel}}</view>
			</view>
			<!-- <view class="u-m-l-10 u-p-10"><u-icon name="scan" color="#969799" size="28"></u-icon></view> -->
			<!-- <view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view> -->
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
	import {BASE_URL} from '../../Api/BASE_API.js'
export default {
	data() {
		return {
			BASE_URL,
			shopDetail: {
				businessHour: '',
				shopAddress: '',
				shopDetail: '',
				shopId: '',
				shopLogo: '',
				shopName: '',
				shopTel: ''
			}
		};
	},
	onShow(){
		this.getShopDetail()
	},
	methods: {
		getShopDetail(){
			this.$u.api.getShop().then(res => {
				if(res.data.code === '200'){
					this.shopDetail = res.data.data
					uni.setStorageSync('shopGategory', this.shopDetail.shopGategory)
				}
			})
		}
	}
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
