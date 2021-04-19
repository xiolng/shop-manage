<template>
	<view class="feedback">
		<u-form label-width="160" label-position="top">
			<u-form-item label="意见标题:"><u-input type="text" v-model="form.ideaTitle" placeholder="请输入意见标题" border></u-input></u-form-item>
			<u-form-item label="提出人:"><u-input type="text" v-model="form.ideaBy" placeholder="请输入提出人" border></u-input></u-form-item>
			<u-form-item label="联系电话:"><u-input type="number" v-model="form.ideaTel" placeholder="请输入联系电话" border></u-input></u-form-item>
			<u-form-item label="问题截图:">
				<u-upload ref="uUpload" :action="action" :file-list="fileList" max-count="5" @on-error="changeImgErr" @on-success="changeImgSuccess" :header="header"></u-upload>
			</u-form-item>
			<u-form-item label="问题详情:"><u-input type="textarea" v-model="form.ideaContent" placeholder="请输入问题内容" border></u-input></u-form-item>
		</u-form>
		<view class="btn-box"><u-button type="primary" @click="saveForm">提交反馈</u-button></view>
		<u-top-tips ref='uTips' />
	</view>
</template>

<script>
import { BASE_URL } from '@/Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			form: {
				ideaBy: '',
				ideaContent: '',
				ideaImage: [],
				ideaTel: '',
				ideaTitle: ''
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
		saveForm() {
			let files = [];
			// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
			files = this.$refs.uUpload.lists.filter(val => {
				return val.progress == 100;
			});
			this.form.ideaImage = files.map(v => v.response.data);

			this.$u.api.saveSystemIdea(this.form).then(res => {
				if (res.data.code === '200') {
					this.$u.route({
						type: 'navigateBack',
						delta: 1
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
			console.log(data, lists, index, name);
		}
	}
};
</script>

<style lang="scss">
.feedback {
	padding: 40rpx;
	.btn-box {
		margin-top: 40rpx;
	}
}
</style>
