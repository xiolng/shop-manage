<template>
	<view class="create-goods">
		<view class="form-box">
			<u-form :model="form" ref="uForm" label-width="160">
				<u-form-item label="商品名称" prop="productName" required><u-input v-model="form.productName" placeholder="请输入商品名称"></u-input></u-form-item>
				<u-form-item label="商品封面" prop="productCover" required>
					<u-upload :action="action" :file-list="fileList" max-count="1" :multiple="false" @on-error="changeImgErr" @on-success="changeImgSuccess" :header="header"></u-upload>
				</u-form-item>
				<u-form-item label="商品分类" prop="productCategoryId">
					<u-input v-model="form.categoryName" placeholder="请选择商品分类" type="select" @click="show = true"></u-input>
					<u-select v-model="show" :list="categoryList" value-name="productCategoryId" label-name="categoryName" @confirm="getCategory"></u-select>
				</u-form-item>
				<u-form-item label="是否上架" prop="isPut"><u-switch v-model="form.isPut"></u-switch></u-form-item>
				<u-form-item label="商品价格" prop="productPrice" required><u-input v-model="form.productPrice" type="number" placeholder="请输入商品价格"></u-input></u-form-item>
				<u-form-item label="商品简介" prop="productIntro"><u-input v-model="form.productIntro" type="textarea" placeholder="请输入商品简介" border></u-input></u-form-item>
			</u-form>
		</view>
		<u-button type="primary" @click="saveForm">保存商品</u-button>

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			show: false,
			categoryList: [],
			form: {
				categoryName: '',
				isPut: false,
				productCategoryId: '',
				productCover: '',
				productIntro: '',
				productName: '',
				productPrice: undefined
			},
			formRules: {
				categoryName: [{ required: true, message: '请选择商品分类', trigger: ['change'] }],
				productCategoryId: [{ required: true, message: '请选择商品分类', trigger: ['change'] }],
				productCover: [{ required: true, message: '请上传商品封面', trigger: ['change'] }],
				productName: [{ required: true, message: '请输入商品名称', trigger: ['change', 'blur'] }],
				productPrice: [{ required: true, message: '请输入商品价格', trigger: ['change', 'blur'] }]
			},
			// 演示地址，请勿直接使用
			action: BASE_URL + '/api/file/upload',
			fileList: [],
			header: {
				Authorization: uni.getStorageSync('token')
			}
		};
	},
	mounted() {
		this.options && this.options.id && this.getGoodsDetail()
		this.getProductCategory();
	},
	methods: {
		getGoodsDetail() {
			this.$u.api.getProductById({ productId: this.options.id }).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					console.log(data);
				}
			});
		},
		// 保存表单
		saveForm() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$u.api
						.saveProduct({
							...this.form,
							isPut: +this.form.isPut
						})
						.then(res => {
							const { data, code } = res.data;
							if (code === '200') {
								this.$refs.uTips.show({
									title: '保存成功',
									type: 'primary'
								});
								setTimeout(() => {
									this.$u.route(`/pages/CommodityManagement/CommodityManagement`);
								});
							}
						});
				}
			});
		},
		/**
		 * 上传图片失败
		 * @param {Object} res
		 * @param {Object} index
		 * @param {Object} lists
		 * @param {Object} name
		 */
		changeImgErr(res, index, lists, name) {
			if (res.status === 403) {
				this.$refs.uTips.show({
					title: '登录超时，请重新登录',
					type: 'error'
				});
				setTimeout(() => {
					this.$u.route({
						url: '/pages/Login/Login'
					});
				}, 2000);
			}
		},
		/**
		 * 上传图片成功
		 * @param {Object} data
		 * @param {Object} index
		 * @param {Object} lists
		 * @param {Object} name
		 */
		changeImgSuccess(data, index, lists, name) {
			if (data.code === '200') {
				this.form.productCover = data.data;
			}
		},
		// 获取商品分类列表
		getProductCategory() {
			this.$u.api.listProductCategory().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.categoryList = data;
				}
			});
		},
		/**
		 * 选择商品分类
		 * @param {Object} data
		 */
		getCategory(data) {
			console.log('data', data);
			this.form.categoryName = data[0].label;
			this.form.productCategoryId = data[0].value;
			console.log(this.form);
		}
	},
	// 初始化组件
	onReady() {
		this.$refs.uForm.setRules(this.formRules);
	}
};
</script>

<style lang="scss">
.create-goods {
	padding: 20rpx 40rpx;
	.form-box {
		margin-bottom: 20rpx;
	}
}
</style>
