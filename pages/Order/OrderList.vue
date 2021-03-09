<template>
	<view class="order-list-page">
		<view class="order-item" v-for="item in orderList" :key="item.orderId">
			<view class="order-content">
				<view class="content-txt">订单编号：{{ item.orderNo }}</view>
				<view class="content-txt">订单状态：{{ item.orderStatus }}</view>
				<view class="content-txt">支付状态：{{ item.payStatus }}</view>
				<view class="content-txt">订单日期：{{ item.createTime }}</view>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="(goods, index) in item.orderDetails" :key="index">
					<view class="order-img"><u-image :src="goods.productCover" width="100%" height="100rpx"></u-image></view>
					<view class="order-detail">
						<view class="detail-txt">商品名称：{{ goods.productName }}</view>
						<view class="detail-txt">商品数量：{{ goods.productNumber }}</view>
						<view class="detail-txt">单价：{{ goods.productPrice }}</view>
					</view>
				</view>
			</view>
			<view class="all-price">共{{ item.orderDetails.length }}件，总价格：{{ addPrice(item) }}元</view>
			<view class="order-addrenss">
				<u-icon name="map"></u-icon>
				<view class="address-txt">{{ item.buyerAddress }}</view>
			</view>
			<view class="order-btn"><u-button type="primary" size="mini" @click="pushGoods(item)">发货</u-button></view>
		</view>
		
		
		<u-loadmore :status="status" />
		<u-top-tips ref="uTips" navbar-height="0" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderList: [
				{
					buyerAddress: 'a',
					buyerId: 'a',
					buyerName: 'a',
					buyerTel: 'a',
					createBy: 'a',
					createTime: 'a',
					orderDetails: [
						{
							createBy: 'a',
							createTime: 'a',
							isDel: 0,
							orderDetailId: 'a',
							orderId: 'a',
							orderNo: 'a',
							productCover: 'a',
							productId: 'a',
							productIntro: 'a',
							productName: 'a',
							productNumber: 0,
							productPrice: 10,
							updateBy: 'a',
							updateTime: 'a'
						},
						{
							createBy: 'b',
							createTime: 'b',
							isDel: 0,
							orderDetailId: 'b',
							orderId: 'b',
							orderNo: 'b',
							productCover: 'b',
							productId: 'b',
							productIntro: 'b',
							productName: 'b',
							productNumber: 0,
							productPrice: 23,
							updateBy: 'b',
							updateTime: 'b'
						}
					],
					orderId: 'a',
					orderNo: 'a',
					orderPrice: 330,
					orderStatus: 0,
					payStatus: 0,
					updateBy: 'a',
					updateTime: 'a'
				},
				{
					buyerAddress: 'a',
					buyerId: 'a',
					buyerName: 'a',
					buyerTel: 'a',
					createBy: 'a',
					createTime: 'a',
					orderDetails: [
						{
							createBy: 'a',
							createTime: 'a',
							isDel: 0,
							orderDetailId: 'a',
							orderId: 'a',
							orderNo: 'a',
							productCover: 'a',
							productId: 'a',
							productIntro: 'a',
							productName: 'a',
							productNumber: 0,
							productPrice: 20,
							updateBy: 'a',
							updateTime: 'a'
						},
						{
							createBy: 'b',
							createTime: 'b',
							isDel: 0,
							orderDetailId: 'b',
							orderId: 'b',
							orderNo: 'b',
							productCover: 'b',
							productId: 'b',
							productIntro: 'b',
							productName: 'b',
							productNumber: 0,
							productPrice: 43,
							updateBy: 'b',
							updateTime: 'b'
						}
					],
					orderId: 'b',
					orderNo: 'a',
					orderPrice: 43,
					orderStatus: 0,
					payStatus: 0,
					updateBy: 'a',
					updateTime: 'a'
				}
			],
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0
			},
			status: ''
		};
	},
	mounted() {},
	methods: {
		pushGoods(item) {
			this.$u.api
				.sendProduct({
					orderId: item.orderId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.$refs.uTips.show({
							title: '发货成功',
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
			item.orderDetails.map(v => {
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
