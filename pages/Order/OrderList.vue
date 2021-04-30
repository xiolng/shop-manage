<template>
	<view class="order-list-page">
		<view class="order-item" v-for="item in orderList" :key="item.orderId">
			<view class="order-content">
				<view class="content-txt">订单编号：{{ item.orderNo }}</view>
				<view class="content-txt">订单状态：{{ orderStatus[item.orderStatus] }}</view>
				<view class="content-txt">支付状态：{{ payStatus[item.payStatus] }}</view>
				<view class="content-txt">订单日期：{{ item.createTime }}</view>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="(goods, index) in item.orderDetailListOutDTOList" :key="index">
					<view class="order-img"><u-image :src="BASE_URL + '/files/' + goods.productCover" width="100%" height="100rpx"></u-image></view>
					<view class="order-detail">
						<view class="detail-txt">商品名称：{{ goods.productName }}</view>
						<view class="detail-txt">商品数量：{{ goods.productNumber }}</view>
						<view class="detail-txt">单价：{{ goods.productPrice }}</view>
					</view>
				</view>
			</view>
			<view class="all-price">共{{ item.orderDetailListOutDTOList.length }}件，总价格：{{ addPrice(item) }}元</view>
			<view class="order-addrenss">
				<u-icon name="map"></u-icon>
				<view class="address-txt">{{ item.buyerAddress }}</view>
			</view>
			<view class="order-btn" v-if="item.orderStatus >= 1 || item.orderStatus <= 7">
				<u-button type="primary" size="mini" @click="pushGoods(item)">{{ gategorys[gategoryNum] }}</u-button>
			</view>
		</view>

		<u-loadmore :status="status" />
		<u-top-tips ref="uTips" navbar-height="0" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	props: {
		orderList: Array
	},
	data() {
		return {
			BASE_URL,
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0
			},
			status: '',
			orderStatus: ['初始', '待发货', '发货', '', '', '', '', '', '取消', '完成'],
			payStatus: ['初始', '已支付'],
			gategorys: ['送货', '送外卖', '送餐', '发货'],
			gategoryNum: 0
		};
	},
	mounted() {
		this.gategoryNum = uni.getStorageSync('shopGategory');
	},
	methods: {
		pushGoods(item) {
			this.$u.api
				.sendProduct({
					orderId: item.orderId
				})
				.then(res => {
					if (res.data.code === '200') {
						console.log(this.gategoryNum, 'eeee', this.gategorys);
						this.$refs.uTips.show({
							title: this.gategorys[this.gategoryNum] + '成功',
							type: 'primary'
						});
					} else {
						this.$refs.uTips.show({
							title: res.data.msg,
							type: 'error'
						});
					}
				});
		},
		// 总价格
		addPrice(item) {
			let allPrice = 0;
			item.orderDetailListOutDTOList &&
				item.orderDetailListOutDTOList.map(v => {
					allPrice += +v.productPrice;
				});
			return allPrice;
		}
	}
};
</script>

<style lang="scss">
.order-list-page {
	.order-item {
		background-color: #fff;
		margin: 20rpx;
		padding: 20rpx;
		.order-content {
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #eee;
			.content-txt {
				font-size: 24rpx;
				margin-bottom: 10rpx;
			}
		}
		.goods-list {
			padding: 0 20rpx;
			.goods-item {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				.order-img {
					width: 100rpx;
					flex-shrink: 0;
					align-items: center;
					margin-right: 20rpx;
				}
				.order-detail {
					flex-grow: 1;
					margin-right: 10rpx;
					.detail-txt {
						font-size: 24rpx;
					}
				}
			}
		}
		.all-price {
			line-height: 80rpx;
			text-align: right;
			padding-right: 40rpx;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
		}
		.order-addrenss {
			display: flex;
			align-items: center;
			margin: 20rpx 0;
			.address-txt {
				margin-left: 20rpx;
			}
		}

		.order-btn {
			text-align: right;
		}
	}
}
</style>
