<template>
	<view class="order-list-page">
		<view class="order-item" v-for="item in orderList" :key="item.orderId" @click="getOrder(item)">
			<view class="order-content">
				<view class="content-txt">订单编号：{{ item.orderNo }}</view>
				<view class="price-status" :style="{color: (item.orderStatus <8 || item.orderStatus >= 9) && item.payStatus == 4 ? themeColor.primary: themeColor.error}">{{ (item.orderStatus < 8 || item.orderStatus >= 9) ? payStatus[item.payStatus]: '已取消' }}</view>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="(goods, index) in item.orderDetailListOutDTOList" :key="index">
					<view class="order-img"><u-image :src="BASE_URL + '/files/' + goods.productCover" width="100%" height="140rpx"></u-image></view>
					<view class="order-detail">
						<view class="detail-txt u-line-1" style="font-size: 30rpx;">{{ goods.productName }}</view>
						<view class="detail-txt u-line-1" style="color: #999; font-size: 24rpx;">订单状态：{{ orderStatus[item.orderStatus] }}</view>
				<view class="content-txt u-line-1" style="color: #999; font-size: 24rpx;">订单日期：{{ item.createTime }}</view>
						<view class="detail-txt" style="display: flex; justify-content: space-between;"><text :style="{color: themeColor.error}">￥{{ goods.productPrice }}</text><text>x{{ goods.productNumber }}</text></view>
					</view>
				</view>
			</view>
			<view class="all-price">共{{ item.orderDetailListOutDTOList.length }}件，总价格：{{ item.orderPrice }}元</view>
			<view class="order-addrenss">
				<u-icon name="map"></u-icon>
				<view class="address-txt">{{ item.buyerAddress }}</view>
			</view>
			<view class="btn-group">
				<view class="order-btn" v-if="item.orderStatus >= 2 && item.orderStatus <= 7 && (item.orderStatus !== 3 && item.payStatus >= 4) && gategoryNum !== 3">
					<u-button type="primary" size="mini" @click="changeEnter(item)">{{ gategorys[gategoryNum] }}</u-button>
				</view>
				<view class="order-btn" v-if="item.orderStatus >= 2 && item.orderStatus <= 7 && gategoryNum === 3">
					<u-button type="primary" size="mini" @click="changeEnter(item)">更新物流</u-button>
				</view>
				<view class="order-btn" v-if="item.orderStatus !== '8' && item.orderStatus !== 8"><u-button type="error" size="mini" @click="cancelOrder(item)">取消订单</u-button></view>
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
			orderStatus: ['订单已提交', '订单已提交', '待发货', '已发货', '', '', '', '', '取消', '完成'],
			payStatus: ['待支付', '待支付', '', '', '支付成功', '支付失败'],
			gategorys: ['送货', '送外卖', '送餐', '发货'],
			gategoryNum: 0,
			logisticsData: {},
			activeItem: {},
			themeColor: this.$u.color
		};
	},
	mounted() {
		this.gategoryNum = uni.getStorageSync('shopGategory');
		console.log(this.$u.color)
	},
	methods: {
		getOrder(item){
			this.$u.api.getOrderById({
				orderId: item.orderId
			})
		},
		// 判断是否是电商需要填写物流信息
		changeEnter(item) {
			this.activeItem = item;
			if (this.gategoryNum === 3) {
				uni.navigateTo({
					url: `/pages/Order/CreateLogistics?orderId=${item.orderId}`
				});
			} else {
				this.pushGoods(item);
			}
		},
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
		cancelOrder(item){
			this.$u.api.cancelOrder({
				orderId: item.orderId
			}).then(res => {
				const {data, code} = res.data
				if(code == '200'){
					this.$refs.uTips.show({
						type: 'primary',
						title: '取消成功'
					})
					item.orderStatus = 8
					this.$forceUpdate()
				}
			})
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
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #eee;
			.content-txt {
			}
		}
		.goods-list {
			padding: 0 20rpx;
			.goods-item {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				.order-img {
					width: 140rpx;
					flex-shrink: 0;
					align-items: center;
					margin-right: 20rpx;
					border: 1px solid #eee;
					border-radius: 10rpx;
				}
				.order-detail {
					min-height: 140rpx;
					display: flex;
					flex-grow: 1;
					flex-direction: column;
					justify-content: space-between;
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
	}
	.form-box {
		padding: 40rpx;
	}
	.btn-group {
		display: flex;
		justify-content: flex-end;
		.order-btn {
			text-align: right;
			margin-left: 20rpx;
		}
	}
}
</style>
