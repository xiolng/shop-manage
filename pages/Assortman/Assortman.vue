<template>
	<view class="assortman">
		<u-sticky>
			<view class="search-box"><u-search placeholder="请输入商品分类名称"></u-search></view>
		</u-sticky>
		<movable-area class="movable-box">
			<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
				<view class="list-box">
					<view class="item-box" v-for="(item, index) in list" :key="index">
						<u-icon name="tags" size="40"></u-icon>
						<view class="item-title u-line-1">{{ item.categoryName }}</view>
						<view class="btn-box">
							<u-button
								type="primary"
								size="mini"
								@click="
									isEdit = item.productCategoryId;
									showModal = true;
									form.categoryName = item.categoryName;
									categoryIndex = index;
								"
							>
								编辑
							</u-button>
							<u-button type="error" size="mini" @click="deleteCategory(item, index)">删除</u-button>
						</view>
					</view>
				</view>
				<u-loadmore status="nomore" />
			</scroll-view>
			<movable-view class="add-btn" :x="x" :y="y" direction="all" @change="btnChange" @click="showModal = true; isEdit = ''"><u-icon name="plus"></u-icon></movable-view>
		</movable-area>

		<u-modal v-model="showModal" :title="isEdit ? '编辑分类' : '新建分类'" @confirm="saveForm" @cancel="form.categoryName = ''" ref="modalRef" async-close mask-close-able show-cancel-button>
			<view class="slot-content">
				<u-field v-model="form.categoryName" :error-message="errMsg" placeholder="请输入商品分类名称" label="商品分类名称" label-width="200" required border></u-field>
			</view>
		</u-modal>
		<!-- 提示弹窗 -->
		<u-top-tips ref="uTips" navbar-height="70" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			x: 10,
			y: this.$u.sys().windowHeight - 200,
			old: {
				x: 0,
				y: 0
			},
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				categoryName: ''
			},
			form: {
				categoryName: ''
			},
			isEdit: '',
			showModal: false,
			errMsg: '',
			categoryIndex: ''
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		btnChange: function(e) {
			this.old.x = e.detail.x;
			this.old.y = e.detail.y;
		},
		// 获取列表
		getList(isAdd) {
			console.log(this.page.pageNum);
			this.$u.api
				.pageProductCategory({
					...this.page
				})
				.then(res => {
					const { data, code, total } = res.data;
					if (code === '200') {
						if (data.length <= 0) {
							this.$refs.uTips.show({
								title: '已加载全部',
								type: 'warning'
							});
							this.status = 'nomore';
							return false;
						}
						/**
						 * 测试数据id重复，记得删除
						 */
						const datas = data.map(v => {
							v.productCategoryId = v.productCategoryId + Math.floor(Math.random() * 888);
							return v;
						});
						this.list = isAdd ? datas : this.list.concat(datas);
						this.page.pageNum += 1;
						this.page.total = total;
						if (this.list.length < 15) {
							this.getList();
						}
						this.$forceUpdate();
					}
				});
		},
		// 保存商品分类
		saveForm() {
			if (this.form.categoryName) {
				this.$u.api[this.isEdit ? 'updateProductCategory' : 'saveProductCategory']({
					...this.form,
					productCategoryId: this.isEdit
				}).then(res => {
					const { data, code, msg } = res.data;
					if (code === '200') {
						this.$refs.uTips.show({
							title: `${this.isEdit ? '更新' : '保存'}成功`,
							type: 'primary'
						});
						if (this.isEdit) {
							this.list[this.categoryIndex].categoryName = this.form.categoryName;
						} else {
							this.page.pageNum = 1;
							this.getList(true);
						}
						this.isEdit = '';
					} else {
						this.$refs.uTips.show({
							title: msg,
							type: 'error'
						});
					}
					this.showModal = false;
					this.isEdit = false;
				});
			} else {
				this.errMsg = '请输入商品分类名称';
				this.$refs.modalRef.clearLoading();
			}
		},
		deleteCategory(item, index) {
			this.$u.api
				.deleteProductCategory({
					productCategoryId: item.productCategoryId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.list.splice(index, 1);
						this.$refs.uTips.show({
							title: '删除成功',
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
		// 触底加载
		onreachBottom() {
			this.getList();
		}
	}
};
</script>

<style lang="scss">
.assortman {
	height: 100vh;
	.search-box {
		background-color: #fff;
		padding: 30rpx;
		border-bottom: 1px solid $u-border-color;
		box-shadow: 0rpx 7rpx 11rpx 0rpx rgba($u-border-color, 0.4);
		position: relative;
		z-index: 999;
	}
	.movable-box {
		width: 100%;
		height: calc(100vh - 200rpx);
		.add-btn {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: $u-type-primary;
			color: #fff;
		}
	}
	.list-box {
		padding: 20rpx 40rpx;
		.item-box {
			display: flex;
			padding: 20px 0;
			border-bottom: 1px solid $u-border-color;
			.item-title {
				flex-grow: 1;
				font-size: 32rpx;
				padding-left: 20rpx;
			}
			.btn-box {
				width: 210rpx;
				flex-shrink: 0;
				justify-self: flex-end;
				.u-btn {
					margin-left: 20rpx;
				}
			}
		}
	}
}
</style>
