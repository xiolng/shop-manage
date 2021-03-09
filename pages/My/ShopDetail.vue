<template>
	<view class="shop-detail">
		<u-form :form="form" label-width="180">
			<u-form-item label="商铺名称"><u-input v-model="form.shopName" placeholder="请输入商铺名称"></u-input></u-form-item>
			<u-form-item label="商铺LOGO">
				<u-upload :action="action" :file-list="fileList" max-count="1" :multiple="false" @on-error="changeImgErr" @on-success="changeImgSuccess" :header="header"></u-upload>
			</u-form-item>
			<u-form-item label="商铺电话"><u-input v-model="form.shopTel" placeholder="请输入商铺电话"></u-input></u-form-item>
			<u-form-item label="商铺地址"><u-input v-model="form.shopAddress" placeholder="请输入商铺地址"></u-input></u-form-item>
			<u-form-item label="商铺营业时间"><u-input v-model="form.businessHour" placeholder="请输入商铺营业时间"></u-input></u-form-item>
			<u-form-item label="商铺商铺描述"><u-input v-model="form.shopDetail" placeholder="请输入商铺商铺描述"></u-input></u-form-item>
		</u-form>
		<view class="save-btn">
			<u-button type="primary" @click="saveShopDetail()">提交商铺信息</u-button>
		</view>

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
	import {BASE_URL} from '@/Api/BASE_API.js'
export default {
	data() {
		return {
			BASE_URL,
			form: {
				businessHour: '',
				shopAddress: '',
				shopDetail: '',
				shopId: '',
				shopLogo: '',
				shopName: '',
				shopTel: ''
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
		this.getShopDetail();
	},
	methods: {
		getShopDetail() {
			this.$u.api.getShop().then(res => {
				Object(this.form).keys().map(v => {
					this.form[v] = res.data.data[v]
				})
				this.fileList = [{url: res.data.data.shopLogo}]
			});
		},
		saveShopDetail() {
			this.$u.api.saveShop(this.form).then(res => {
				if (res.data.code === '200') {
					this.$refs.uTips.show({
						title: '保存成功',
						type: 'primary'
					});
					setTimeout(() => {
						this.$u.route(`/pages/My/My`);
					}, 1500);
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
				this.form.shopLogo = data.data;
			}
		}
	}
};
</script>

<style lang="scss">
.shop-detail {
	padding: 40rpx;
	.save-btn{
		margin-top: 40rpx;
	}
}
</style>
