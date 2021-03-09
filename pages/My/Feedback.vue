<template>
	<view class="feedback">
		<u-form label-width="160" label-position="top">
			<u-form-item label="问题截图:">
				<u-upload :action="action" :file-list="fileList" max-count="5" @on-error="changeImgErr" @on-success="changeImgSuccess" :header="header"></u-upload>
			</u-form-item>
			<u-form-item label="问题详情:"><u-input type="textarea" placeholder="请输入问题内容" border></u-input></u-form-item>
		</u-form>
		<view class="btn-box">
			<u-button type="primary">提交反馈</u-button>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '@/Api/BASE_API.js';
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
	methods: {
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
.feedback {
	padding: 40rpx;
	.btn-box{
		margin-top: 40rpx;
	}
}
</style>
