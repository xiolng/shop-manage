<template>
	<view class="commodity-management">
		<!-- 顶部-浮动，搜索、新增 -->
		<u-sticky>
			<view class="position-box">
				<view class="search-box">
					<u-search
						v-model="page.productName"
						placeholder="请输入商品名称搜索"
						@clear="(page.pageNum = 1), getGoodsList(true)"
						@search="(page.pageNum = 1), getGoodsList(true)"
						@custom="(page.pageNum = 1), getGoodsList(true)"
						:action-style="{ width: '100rpx', background: $u.color.primary, color: '#fff', borderRadius: '30rpx', padding: '10rpx 20rpx', overflow: 'hidden', flexShrink: 0 }"
					></u-search>
				</view>
			</view>
		</u-sticky>
		<!-- 商品列表 -->
		<scroll-view scroll-y style="height: 90vh;width: 100%;" @scrolltolower="onreachBottom">
			<view class="goods-box">
				<view class="goods-list">
					<view class="goods-item" v-for="(item, index) in list" :key="item.productId">
						<view class="goods-img">
							<u-image
								:src="BASE_URL + '/files/' + item.productCover"
								width="100%"
								height="100rpx"
								@click="previewImg(`${BASE_URL}/files/${item.productCover}`)"
								lazy-load
							></u-image>
						</view>
						<div class="goods-right">
							<view class="goods-title">
								<view class="u-line-1">{{ item.productName }}</view>
								<view class="goods-stock">库存：{{ item.stock }}</view>
							</view>
							<view v-if="item.openBtn" class="more-btn" @click="changeBtn(item, index)">操作</view>
							<view class="goods-btn" :class="!item.openBtn ? '' : 'btn-close'">
								<u-button size="mini" shape="circle" :type="item.isPut ? 'success' : 'info'" @click="Putaway(item, index)">{{ item.isPut ? '已上架' : '已下架' }}</u-button>
								<u-button
									size="mini"
									type="primary"
									shape="circle"
									@click="
										$u.route({
											url: '/pages/CommodityManagement/CreateGoods',
											params: {
												id: item.productId,
												type: item.productType
											}
										})
									"
								>
									编辑
								</u-button>
								<u-button size="mini" shape="circle" type="error" @click="deleteGoods(item.productId, index)">删除</u-button>
								<u-button size="mini" shape="circle" type="warning" @click="getShare(item)">分享</u-button>
							</view>
						</div>
					</view>
				</view>
				<u-loadmore status="nomore" />
			</view>
		</scroll-view>
		<view class="add-box"><u-button type="primary" shape="circle" @click="addCommodity">新增商品</u-button></view>
		<u-popup v-model="showShare" mode="bottom">
			<view class="share-box">
				<u-button type="default" open-type="share">
					<u-icon name="chat" size="100" color="#00aa00" />
					<view>分享好友</view>
				</u-button>
				<u-button
					type="default"
					@click="
						showShare = false;
						showShareBanner = true;
					"
				>
					<u-icon name="photo" size="100" color="#ff5500" />
					<view>生成海报</view>
				</u-button>
			</view>
		</u-popup>
		<ShareGoods
			v-if="showShareBanner"
			@cancel="
				() => {
					showShare = false;
					showShareBanner = false;
				}
			"
			:goods-detail="goodsDetail"
		></ShareGoods>
		<u-top-tips ref="uTips" />
		<u-action-sheet :list="actionList" v-model="showChangeCommodity" @click="actionClick" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import { ShareGoods } from '../../components/ShareGoods/ShareGoods.vue';
export default {
	components: {
		ShareGoods
	},
	data() {
		return {
			BASE_URL,
			list: [],
			page: {
				pageNum: 1,
				pageSize: 20,
				total: 0,
				productName: ''
			},
			showShare: false,
			showShareBanner: false,
			goodsDetail: {},
			// 饭店选择实体商品或虚拟商品创建
			showChangeCommodity: false,
			actionList: [{ text: '实体商品', subText: '店内实体商品' }, { text: '券码商品', subText: '如：核销码等' }]
		};
	},
	created() {
		this.getGoodsList();
	},
	onShareAppMessage(e) {
		console.log('e', e);
		this.showShare = false;
		const vm = this;
		return {
			title: this.goodsDetail.productName,
			imageUrl: BASE_URL + '/files/' + this.goodsDetail.productCover,
			content: this.goodsDetail.productIntro,
			desc: this.goodsDetail.productIntro,
			path: `/pages/sharePath/sharePath?id=${this.goodsDetail.productId}`,
			query: `id=${this.goodsDetail.productId}`,
			success() {
				vm.$u.showToast(`分享成功`);
			},
			fail() {
				vm.$u.showToast({
					title: '分享失败',
					icon: 'none'
				});
			}
		};
	},
	methods: {
		actionClick(index) {
			console.log('index', index);
			this.$u.route(`/pages/CommodityManagement/CreateGoods?type=${index}`);
		},
		addCommodity() {
			const type = uni.getStorageSync('shopGategory');
			if (type === 2) {
				this.showChangeCommodity = true;
			} else {
				this.$u.route(`/pages/CommodityManagement/CreateGoods`);
			}
		},
		// 获取商品列表
		getGoodsList(isAdd) {
			this.page.pageNum = isAdd ? 1 : this.page.pageNum;
			this.$u.api.pageProduct(this.page).then(res => {
				const { data, code, total } = res.data;
				data.map(v => {
					v.openBtn = false;
					return v;
				});
				if (data.length <= 0) {
					this.list = isAdd ? data : this.list;
					this.$refs.uTips.show({
						title: `已加载全部`,
						type: 'warning'
					});
					return false;
				}
				this.page.total = total;
				this.list = this.page.pageNum === 1 ? data : this.list.concat(data);
				this.page.pageNum += 1;
			});
		},
		getShare(item) {
			this.$u.api
				.getProductById({
					productId: item.productId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.goodsDetail = res.data.data;
						this.showShare = true;
					}
				});
		},
		changeBtn(item, index) {
			this.list.map(v => (v.openBtn = false));
			this.list[index].openBtn = true;
			this.$forceUpdate();
			console.log(item.openBtn);
		},
		Putaway(item, index) {
			console.log(item, index);
			this.$u.api[item.isPut ? 'notPut' : 'isPut']({ productId: item.productId }).then(res => {
				if (res.data.code === '200') {
					this.$refs.uTips.show({
						title: item.isPut ? '下架成功' : '上架成功',
						type: 'primary'
					});
					item.isPut = !item.isPut;
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
		},
		onreachBottom() {
			this.getGoodsList();
		}
	}
};
</script>

<style lang="scss">
.commodity-management {
	height: 100vh;
	background: #f3f4f6;
	.add-box {
		position: absolute;
		left: 40rpx;
		right: 40rpx;
		bottom: 200rpx;
	}
	// 顶部浮动
	.position-box {
		padding: 20rpx;
		background-color: #fff;
		.search-box {
			margin-bottom: 20rpx;
		}
	}
	// 商品列表
	.goods-box {
		padding: 20rpx;
		.goods-list {
			.goods-item {
				display: flex;
				background: #fff;
				padding: 20rpx;
				margin-bottom: 20rpx;
				.goods-img {
					width: 140rpx;
					flex-shrink: 0;
				}
				.goods-right {
					flex-grow: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.goods-title {
						width: 100%;
						display: flex;
						justify-content: space-between;
						flex-grow: 1;
						margin: 0 10rpx;
						line-height: 30rpx;
						.u-line-1{
							max-width: 250rpx;
							flex-grow: 1;
						}
						.goods-stock {
							max-width: 200rpx;
							margin-top: 6rpx;
							flex-shrink: 0;
						}
					}
					.more-btn {
						display: flex;
						flex-shrink: 0;
						align-self: center;
					}
					.goods-btn {
						width: calc(100vw - 350rpx);
						transition: width 0.24s;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						overflow: hidden;
						&.btn-close {
							transition: width 0.24s;
							width: 0;
						}
						.u-btn {
							height: 40rpx;
							margin: 0 5rpx;
						}
					}
				}
			}
		}
	}
	.share-box {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 40rpx 40rpx 0;
		.u-btn {
			width: 100%;
			height: auto;
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			margin-bottom: 40rpx;
			border-width: 0;
			&::after {
				border: none;
			}
		}
	}
}
</style>
