<template>
	<view class="assortman">
		<u-sticky>
			<view class="position-box">
				<view class="search-box">
					<u-search
						v-model="page.categoryName"
						placeholder="请输入商品分类名称"
						@clear="
							page.pageNum = 1;
							getList(true);
						"
						@custom="
							page.pageNum = 1;
							getList(true);
						"
						@search="
							page.pageNum = 1;
							getList(true);
						"
						:action-style="{ width: '100rpx', background: $u.color.primary, color: '#fff', borderRadius: '30rpx', padding: '10rpx 20rpx', overflow: 'hidden', flexShrink: 0 }"
					></u-search>
				</view>
			</view>
		</u-sticky>
		<scroll-view scroll-y style="height: 90vh;width: 100%; position: relative; overflow: hidden; overflow-y: auto;" @scrolltolower="onreachBottom">
			<view class="list-box">
				<view class="item-box" v-for="(item, index) in list" :key="index">
					<view class="item-title u-line-2">
						<u-icon :name="tags" size="26"></u-icon>
						<text class="u-line-1">{{ item.categoryName }}</text>
					</view>
					<view class="btn-box">
						<u-button
							type="primary"
							size="mini"
							shape="circle"
							@click="
								isEdit = item.productCategoryId;
								showModal = true;
								form.categoryName = item.categoryName;
								categoryIndex = index;
							"
						>
							编辑
						</u-button>
						<u-button type="error" shape="circle" size="mini" @click="deleteCategory(item, index)">删除</u-button>
					</view>
				</view>
			</view>
			<u-loadmore status="nomore" />
		</scroll-view>
		<view class="add-box">
			<u-button
				type="primary"
				shape="circle"
				@click="
					showModal = true;
					isEdit = '';
				"
			>
				新增分类
			</u-button>
		</view>
		<!-- <movable-area class="movable-box">
			
			<movable-view class="add-btn" :x="x" :y="y" direction="all" @change="btnChange" @click="showModal = true; isEdit = ''"><u-icon name="plus"></u-icon></movable-view>
		</movable-area> -->

		<u-modal
			v-model="showModal"
			:title="isEdit ? '编辑分类' : '新建分类'"
			@confirm="saveForm"
			@cancel="form.categoryName = ''"
			ref="modalRef"
			async-close
			mask-close-able
			show-cancel-button
		>
			<view class="slot-content">
				<u-field v-model="form.categoryName" :error-message="errMsg" placeholder="请输入商品分类名称" label="商品分类名称" label-width="200" required border></u-field>
			</view>
		</u-modal>
		<!-- 提示弹窗 -->
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import tags from './image/tag.svg';
export default {
	data() {
		return {
			tags,
			list: [],
			x: this.$u.sys().windowWidth - 60,
			y: this.$u.sys().windowHeight - 200,
			old: {
				x: 0,
				y: 0
			},
			page: {
				pageNum: 1,
				pageSize: 20,
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
							this.list = isAdd ? data : this.list;
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
						// const datas = data.map(v => {
						// 	v.productCategoryId = v.productCategoryId + Math.floor(Math.random() * 888);
						// 	return v;
						// });
						console.log('isAdd', isAdd);
						this.$set(this, 'list', isAdd ? data : this.list.concat(data));
						console.log('this.list', this.list);
						this.page.pageNum += 1;
						this.page.total = total;
						this.$forceUpdate();
					}
				});
		},
		// 保存商品分类
		saveForm() {
			console.log(444, this.form, this.isEdit);
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
						this.form.categoryName = '';
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
			position: relative;
			z-index: 9999;
		}
	}
	.list-box {
		padding: 20rpx;
		.item-box {
			background: #fff;
			padding: 10px;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			.item-title {
				display: flex;
				font-size: 32rpx;
				.u-icon {
					margin-right: 10rpx;
				}
			}
			.btn-box {
				display: flex;
				justify-content: flex-end;
				.u-btn {
					height: 40rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
}
</style>
