<template>
	<view class="my-box">
		<view class="u-flex customeNav">
			<view class="abs-box">
				<view class="static-box">
					<view class="u-m-r-10 abs-item">
						<u-avatar v-if="shopDetail.shopLogo" :src="shopDetail.shopLogo.includes('https') ? shopDetail.shopLogo : `${BASE_URL}/files/${shopDetail.shopLogo}`" size="140"></u-avatar>
						<u-avatar v-else :src="`${shopDetail.shopLogo}`" size="140"></u-avatar>
					</view>
					<view class="u-flex-1 abs-item">
						<view class="u-font-18 u-p-b-20">{{ shopDetail.shopName }}</view>
						<view class="u-font-14">{{ shopDetail.shopTel }}</view>
					</view>
					<!-- <view class="u-m-l-10 u-p-10"><u-icon name="scan" color="#969799" size="28"></u-icon></view> -->
					<!-- <view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view> -->
				</view>
			</view>
		</view>

		<view class="tab-box">
			<view class="tab-title">其他服务</view>
			<u-grid :col="4">
				<u-grid-item
					@click="
						$u.route({
								url: `/pages/My/ShopDetail`
						})
					"
				>
					<u-image :src="msgImg" width="60" height="60"></u-image>
					<view class="grid-text">信息编辑</view>
				</u-grid-item>
				<u-grid-item @click="$u.route(`/pages/My/Feedback`)">
					<u-image :src="favImg" width="60" height="60"></u-image>
					<view class="grid-text">问题反馈</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- <view class="u-m-t-20">
			
			<u-cell-group>
				<u-cell-item
					icon="edit-pen"
					title="信息修改"
					@click="
						$u.route({
							url: `/pages/My/ShopDetail`
						})
					"
				></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="chat" title="问题反馈" @click="$u.route(`/pages/My/Feedback`)"></u-cell-item></u-cell-group>
		</view> -->
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import msgImg from './image/msg.svg';
import favImg from './image/fav.svg';
export default {
	data() {
		return {
			msgImg,
			favImg,
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
	onShow() {
		this.getShopDetail();
	},
	methods: {
		getShopDetail() {
			this.$u.api.getShop().then(res => {
				if (res.data.code === '200') {
					this.shopDetail = res.data.data;
					uni.setStorageSync('shopGategory', this.shopDetail.shopGategory);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}
.my-box {
	.customeNav {
		width: 100vw;
		height: 480rpx;
		position: relative;
		.abs-box {
			width: 1000px;
			background: linear-gradient(to bottom, #4ec9ff, #0063ff);
			display: flex;
			justify-content: center;
			padding: 250rpx calc(100vw - 1000px) 50rpx;
			border-radius: 0 0 100% 100%;
			overflow: hidden;
			position: absolute;
			left: -300px;
			top: 0;
			box-sizing: border-box;
			color: #fff;
			.static-box {
				width: 100vw;
				padding: 0 40rpx;
				display: flex;
				align-items: center;
			}
		}
	}
	.tab-box {
		background: #fff;
		margin: 10rpx 20rpx;
		.tab-title {
			font-size: 32rpx;
			padding: 20rpx;
		}
		.grid-text {
			font-size: 30rpx;
			margin-top: 20rpx;
		}
	}
}
.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}
</style>
