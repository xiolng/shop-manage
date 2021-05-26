<template>
	<view>
		<view class="search-box">
				<view class="search-title">搜索</view>
				<u-form :model="searchData" label-width="160" ref="searchRef" label-position="top">
					<u-form-item label="买家地址:"><u-input placeholder="请输入买家地址" v-model="searchData.buyerAddress"></u-input></u-form-item>
					<u-form-item label="买家姓名:"><u-input placeholder="请输入买家姓名" v-model="searchData.buyerName"></u-input></u-form-item>
					<u-form-item label="买家电话:"><u-input placeholder="请输入买家电话" v-model="searchData.buyerTel"></u-input></u-form-item>
					<u-form-item label="订单状态:">
						<u-radio-group v-model="searchData.orderStatus">
							<u-radio :name="3">已发货</u-radio>
							<u-radio :name="2">未发货</u-radio>
							<u-radio :name="8">已取消</u-radio>
						</u-radio-group>
					</u-form-item>
				</u-form>
				<u-button type="primary" @click="searchPage">搜索</u-button>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			searchData: {
				buyerAddress: '',
				buyerName: '',
				buyerTel: '',
				orderStatus: 0
			},
				
			}
		},
		methods: {
		searchPage() {
			uni.reLaunch({
				url: `/pages/Order/Order?buyerAddress=${this.searchData.buyerAddress}&buyerName=${this.searchData.buyerName}&buyerTel=${this.searchData.buyerTel}&orderStatus=${this.searchData.orderStatus}`
			})
		},
			
		}
	}
</script>

<style lang="scss">

	.search-box {
		height: 100%;
		padding: 40rpx;
		// background-color: rgba($color: $u-type-primary, $alpha: 0.05);
		box-sizing: border-box;
		.search-title {
			// margin-bottom: 40rpx;
			border-bottom: 1px solid #eee;
			padding-bottom: 20rpx;
		}
		.u-btn {
			margin-top: 40rpx;
		}
	}
</style>
