<template>
	<view class="order-box">
		<view><u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" bar-width="140"></u-tabs-swiper></view>
		<view class="swiper-box">
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiper-content">
				<swiper-item class="swiper-item" :key="0" @touchmove.stop="() => true">
					<movable-area class="movable-box">
						<movable-view class="search-btn" :x="x" :y="y" direction="all" @change="onChange" inertia @click="goSearch">
							<u-icon name="search" size="40rpx"></u-icon>
						</movable-view>
						<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
							<OrderList ref="OrderList" v-if="current === 0" :order-list="orderList" />
						</scroll-view>
					</movable-area>
				</swiper-item>
				<swiper-item class="swiper-item" :key="1" @touchmove.stop="() => true">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom"><OrdersReceived v-if="current === 1"></OrdersReceived></scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import OrderList from './OrderList.vue';
import OrdersReceived from './OrdersReceived.vue';
export default {
	components: {
		OrderList,
		OrdersReceived
	},
	data() {
		return {
			showSearch: false,
			searchData: {
				buyerAddress: '',
				buyerName: '',
				buyerTel: '',
			},
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0
			},
			x: this.$u.sys().windowWidth - 90,
			y: this.$u.sys().windowHeight - 200,
			old: {
				x: this.$u.sys().windowWidth - 90,
				y: this.$u.sys().windowHeight - 200
			},
			list: [
				{
					name: ' 订单列表 '
				},
				{
					name: ' 订单统计 '
				}
			],
			// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
			current: 0, // tabs组件的current值，表示当前活动的tab选项
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			orderList: []
		};
	},
	onLoad(options) {
		console.log('wef', options)
		this.searchData = {
				buyerAddress: (options && options.buyerAddress) || '',
				buyerName: (options && options.buyerName) || '',
				buyerTel: (options && options.buyerTel) || ''
		}
		if(options && options.orderStatus && options.orderStatus !== '0'){
			this.searchData.orderStatus = options.orderStatus
		}
	},
	onShow() {
		this.getOrder();
	},
	onHide(){
		this.page.pageNum = 1
	},
	methods: {
		goSearch(){
			uni.navigateTo({
				url: `/pages/Order/OrderSearch`
			})
		},
		getOrder() {
			const vm = this
			this.$u.api
				.pageOrder({
					...this.searchData,
					...this.page
				})
				.then(res => {
					this.searchData.buyerAddress = '';
					this.searchData.buyerName = '';
					this.searchData.buyerTel = '';
					delete this.searchData.orderStatus
					const { data, code, total } = res.data;
					if (code === '200') {
						if(vm.page.pageNum == 1){
							vm.orderList = []
						}
						if (data.length <= 0) {
							vm.$refs.uTips.show({
								title: '已加载全部',
								type: 'warning'
							});
							return false;
						}
						vm.orderList = vm.page.pageNum == 1 ? data : vm.orderList.concat(data);
						vm.page.total = total;
						vm.page.pageNum += 1;
					}
				});
		},
		onChange: function(e) {
			this.old.x = e.detail.x;
			this.old.y = e.detail.y;
		},
		// scroll-view到底部加载更多
		onreachBottom() {
			this.current === 0 && this.getOrder();
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
			index == 0 ? this.getOrder() : ''
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		}
	},
	onPullDownRefresh() {
		this.getOrder();
		uni.stopPullDownRefresh();
	}
};
</script>

<style lang="scss">
.order-box {
	.swiper-box {
		margin: 20rpx;
		background-color: $u-bg-color;
		.swiper-content {
			/* #ifdef H5 */
			height: calc(100vh - 154px);
			/* #endif */
			/* #ifdef MP-WEIXIN */
			height: calc(100vh - 68px);
			/* #endif */

			.movable-box {
				width: 100%;
				height: 100%;
			}
			.search-btn {
				position: fixed;
				right: 0;
				z-index: 9999;
				width: 100rpx;
				height: 100rpx;
				background-color: $u-type-primary;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 100%;
			}
		}
	}
}
</style>
