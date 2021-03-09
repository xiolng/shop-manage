<template>
	<view class="commodity-management">
		<!-- 顶部-浮动，搜索、新增 -->
		<u-sticky>
			<view class="position-box">
				<view class="search-box"><u-search v-model="page.productName" placeholder="请输入商品名称搜索" @search="page.pageNum = 1, getGoodsList()" @custom="page.pageNum = 1, getGoodsList()"></u-search></view>
				<view class="add-box"><u-button type="primary" @click="$u.route(`/pages/CommodityManagement/CreateGoods`)">新增商品</u-button></view>
			</view>
		</u-sticky>
		<!-- 商品列表 -->
		<view class="goods-box">
			<view class="goods-list">
				<view class="goods-item" v-for="(item, index) in list" :key="item.id">
					<view class="goods-img">
						<u-image :src="BASE_URL + '/files/' + item.productCover" width="100%" height="100rpx" @click="previewImg(`${BASE_URL}/files/${item.productCover}`)" lazy-load></u-image>
					</view>
					<view class="goods-title u-line-2">{{ item.productName }}</view>
					<view class="goods-btn">
						<u-button size="mini" :type="item.isPut ? 'success' : 'info'" @click="Putaway(item, index)">{{ item.isPut ? '上架' : '下架' }}</u-button>
						<u-button
							size="mini"
							type="primary"
							@click="
								$u.route({
									url: '/pages/CommodityManagement/CreateGoods',
									params: {
										id: item.productId
									}
								})
							"
						>
							编辑
						</u-button>
						<u-button size="mini" type="error" @click="deleteGoods(item.productId, index)">删除</u-button>
					</view>
				</view>
			</view>
		</view>

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			list: [],
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				productName: ''
			}
		};
	},
	onLoad() {
		this.getGoodsList();
	},
	methods: {
		// 获取商品列表
		getGoodsList() {
			this.$u.api.pageProduct(this.page).then(res => {
				const { data, code, total } = res.data;
				if (data.length <= 0) {
					this.$refs.uTips.show({
						title: `已加载全部`,
						type: 'warning'
					});
					return false;
				}
				this.page.total = total;
				this.list = this.page.pageNum === 1 ? data : this.list.concat(data);
			});
		},
		Putaway(item, index) {
			this.$u.api[item.isPut ? 'notPut' : 'isPut']({ productId: item.productId }).then(res => {
				if (res.data.code === '200') {
					this.$refs.uTips.show({
						title: item.isPut ? '下架成功' : '上架成功',
						type: 'primary'
					});
					item.isPut = !item.isPut;
					this.$forceUpdate();
				}
			});
		},
		/**
		 * 删除商品
		 * @param {Object} id
		 * @param {Object} index
		 */
		deleteGoods(id, index) {
			this.$u.api
				.deleteProduct({
					productId: id
				})
				.then(res => {
					const { data, code } = res.data;
					if (code === '200') {
						this.$refs.uTips.show({
							title: `删除成功`,
							type: 'primary'
						});
						this.list.splice(index, 1);
					}
				});
		},
		/**
		 * 全屏预览图片
		 * @param {Object} url
		 */
		previewImg(url) {
			uni.previewImage({
				urls: [url]
			});
		}
	}
};
</script>

<style lang="scss">
.commodity-management {
	// 顶部浮动
	.position-box {
		padding: 20rpx;
		background-color: #fff;
		.search-box {
			margin-bottom: 20rpx;
		}
		.add-box {
			margin-bottom: 20rpx;
		}
	}
	// 商品列表
	.goods-box {
		padding: 20rpx;
		.goods-list {
			.goods-item {
				display: flex;
				padding-bottom: 10rpx;
				border-bottom: 1px solid $uni-bg-color-grey;
				margin-bottom: 20rpx;
				.goods-img {
					flex-grow: 1;
					width: 100rpx;
					flex-shrink: 0;
				}
				.goods-title {
					flex-grow: 1;
					margin: 0 10rpx;
					line-height: 50rpx;
				}
				.goods-btn {
					flex-grow: 2;
					width: 50%;
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.u-btn {
						margin: 0 10rpx;
					}
				}
			}
		}
	}
}
</style>
