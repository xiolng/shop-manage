<template>
	<view class="create-goods">
		<view class="form-box">
			<u-form :model="form" ref="uForm" label-width="180" label-position="top">
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}名称`" prop="productName" required>
					<u-input v-model="form.productName" placeholder="请输入名称"></u-input>
				</u-form-item>
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}封面`" prop="productCover" required>
					<u-avatar :src="`${BASE_URL}/files/${form.productCover}`" size="140" @click="uploadImage" mode="square"></u-avatar>
				</u-form-item>
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}分类`" prop="productCategoryId">
					<u-input v-model="form.categoryName" placeholder="请选择分类" type="select" @click="show = true"></u-input>
					<u-select
						v-model="show"
						:list="categoryList"
						:default-value="form.productCategoryId"
						value-name="productCategoryId"
						label-name="categoryName"
						@confirm="getCategory"
					></u-select>
				</u-form-item>
				<u-form-item label="是否上架" prop="isPut">
					<view style="display: flex; justify-content: space-between;">
						<text>{{form.isPut ? '是':'否'}}</text>
						<u-switch v-model="form.isPut"></u-switch>
					</view>
				</u-form-item>
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}价格`" prop="productPrice" required>
					<u-number-box v-model="form.productPrice" placeholder="请输入价格" :positive-integer="false" :min="0.01" input-width='120'></u-number-box>
				</u-form-item>
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}原价`" prop="originalPrice" required>
					<u-number-box v-model="form.originalPrice" placeholder="请输入原价" :positive-integer="false" :min="0.01" input-width='120'></u-number-box>
				</u-form-item>
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}库存`" prop="stock" required>
					<u-number-box v-model="form.stock" :positive-integer="false" placeholder="请输入库存" input-width='120'></u-number-box>
				</u-form-item>
				<u-form-item :label="`${goodsType == '1' ? '券码' : '商品'}简介`" prop="productIntro">
					<u-input v-model="form.productIntro" type="textarea" placeholder="请输入简介" border></u-input>
				</u-form-item>
				<u-form-item v-if="goodsType == '1'" label="有效开始日期" prop="startTime">
					<picker mode="date" :value="startTime" @change="changeStartTime">{{ startTime }}</picker>
				</u-form-item>
				<u-form-item v-if="goodsType == '1'" label="有效结束日期" prop="endTime">
					<picker mode="date" :value="endTime" @change="changeEndTime">{{ endTime }}</picker>
				</u-form-item>
				<u-form-item v-if="goodsType == '1'" label="不可用" prop="unAvailable">
					<u-input v-model="form.unAvailable" type="textarea" placeholder="请输入不可用规则" border></u-input>
				</u-form-item>
				<u-form-item v-if="goodsType == '1'" label="使用时间" prop="useTime">
					<u-input v-model="form.useTime" type="textarea" placeholder="请输入使用时间范围" border></u-input>
				</u-form-item>
				<u-form-item v-if="goodsType == '1'" label="使用范围" prop="applyRange">
					<u-input v-model="form.applyRange" type="textarea" placeholder="请输入使用范围" border></u-input>
				</u-form-item>
				<u-form-item v-if="goodsType == '1'" label="使用规则" prop="useRole">
					<u-input v-model="form.useRole" type="textarea" placeholder="请输入使用规则" border></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="btn-box"><u-button type="primary" @click="saveForm">保存商品</u-button></view>

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			show: false,
			showDate: false,
			categoryList: [],
			form: {
				categoryName: '',
				isPut: false,
				productCategoryId: '',
				productCover: '',
				productIntro: '',
				productName: '',
				productPrice: 1,
				originalPrice: 1,
				stock: 1
			},
			formRules: {
				categoryName: [{ required: true, message: '请选择商品分类', trigger: ['change'] }],
				productCategoryId: [{ required: true, message: '请选择商品分类', trigger: ['change'] }],
				productCover: [{ required: true, message: '请上传商品封面', trigger: ['change'] }],
				productName: [{ required: true, message: '请输入商品名称', trigger: ['change', 'blur'] }]
				// productPrice: [{ required: true, message: '请输入商品价格', trigger: ['change', 'blur'] }]
			},
			// 演示地址，请勿直接使用
			action: BASE_URL + '/api/file/upload',
			fileList: [],
			header: {
				Authorization: uni.getStorageSync('token')
			},
			editId: '',
			// 商品类型
			goodsType: 0,
			startTime: this.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
			endTime: this.$u.timeFormat(Date.parse(new Date()) + 600000000, 'yyyy-mm-dd')
		};
	},
	onLoad(options) {
		console.log('options', options);
		this.goodsType = options.type || 0;
		options.id && this.getGoodsDetail(options.id);
		this.editId = options.id;
		this.getProductCategory();
	},
	methods: {
		getGoodsDetail(productId) {
			let stockData = {
				startTime: '',
				endTime: '',
				useRole: '',
				applyRange: '',
				useTime: '',
				unAvailable: ''
			};
			console.log('this.goodsType', this.goodsType)
			if (this.goodsType === '1' || this.goodsType === 1) {
				this.form = Object.assign(this.form, stockData);
			}
			this.$u.api.getProductById({ productId: productId }).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					Object.keys(this.form).map(v => {
						this.$set(this.form, v, data[v]);
					});
					this.fileList = [{ url: `${BASE_URL}/files/${data.productCover}` }];
				}
				console.log('item,;', this.form);
			});
		},
		// 保存表单
		saveForm() {
			const datas = this.form;
			if (this.editId) {
				datas.productId = this.editId;
			}
			if (this.goodsType == '1') {
				datas.startTime = this.startTime;
				datas.endTime = this.endTime;
			}
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$u.api[this.editId ? 'updateProduct' : 'saveProduct']({
						productType: this.goodsType,
						...datas,
						isPut: +this.form.isPut
					}).then(res => {
						const { data, code } = res.data;
						if (code === '200') {
							this.$refs.uTips.show({
								title: '保存成功',
								type: 'primary'
							});
							let pages = getCurrentPages(); // 当前页面
							let beforePage = pages[pages.length - 2]; // 前一个页面
							console.log('beforePage', beforePage);
							console.log(pages);

							beforePage.$vm.getGoodsList(true);
							setTimeout(() => {
								this.$u.route({
									type: 'navigateBack',
									delta: 1,
									success: function() {
										beforePage.$vm.getGoodsList(true);
									}
								});
							});
						}
					});
				}
			});
		},
		uploadImage() {
			const vm = this
			uni.chooseImage({
				count: 1,
				success(res) {
					uni.downloadFile({
						url: res.tempFilePaths[0],
						success: imgData => {
							uni.uploadFile({
								name: 'file',
								url: BASE_URL + '/api/file/upload',
								header: {
									Authorization: uni.getStorageSync('token')
								},
								filePath: imgData.tempFilePath,
								success(result) {
									const { data, code, msg } = JSON.parse(result.data);
									if (code === '200') {
										vm.form.productCover = data;
									}
								}
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
					this.categoryList.map(v => {
						if (v.productCategoryId === this.form.productCategoryId) {
							this.form.categoryName = v.categoryName;
						}
					});
				}
			});
		},
		// 监听时间改变
		changeStartTime(item) {
			console.log('time', this.form);
			this.startTime = item.detail.value;
		},
		// 监听时间改变
		changeEndTime(item) {
			this.endTime = item.detail.value;
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
	padding: 20rpx 40rpx 120rpx;
	.form-box {
		margin-bottom: 20rpx;
		.u-form-item--left {
			align-items: flex-start;
		}
	}
	.btn-box {
		background: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		padding: 40rpx;
	}
}
</style>
