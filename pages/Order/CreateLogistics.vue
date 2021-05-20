<template>
	<view class="logistics">
		<u-form :model="form" ref="uForm" label-width="auto">
			<u-form-item label="物流名称" prop="logisticsName" required><u-input v-model="form.logisticsName" /></u-form-item>
			<u-form-item label="物流单号" prop="logisticsNo" required><u-input v-model="form.logisticsNo" /></u-form-item>
		</u-form>
		<u-button type="primary" @click="submit">提交</u-button>
		<u-top-tips ref="uTips" navbar-height="0" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				logisticsName: '',
				logisticsNo: ''
			},
			rules: {
				logisticsName: [
					{
						required: true,
						message: '请输入物流名称',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				logisticsNo: [
					{
						required: true,
						message: '请输入物流单号',
						trigger: ['change', 'blur']
					}
				]
			},
			logisticsData: {},
			gategoryNum: '',
			gategorys: ['送货', '送外卖', '送餐', '发货']
		};
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad(options) {
		this.gategoryNum = uni.getStorageSync('shopGategory');
		console.log('options', options);
		this.$u.api
			.getOrderLogistics({
				orderId: options.orderId
			})
			.then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					if(data.orderLogisticsId){
						this.logisticsData.orderLogisticsId = data.orderLogisticsId
					}
					this.logisticsData.orderId = data.orderId || options.orderId;
					this.form.logisticsName = data.logisticsName;
					this.form.logisticsNo = data.logisticsNo;
				}
			});
	},
	methods: {
		submit() {
			const vm = this;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$u.api[this.logisticsData.orderLogisticsId ? 'updateOrderLogistics' : 'sendProduct']({
						...vm.logisticsData,
						...vm.form
					}).then(res => {
						if (res.data.code === '200') {
							console.log(this.gategoryNum, 'eeee', this.gategorys);
							this.$refs.uTips.show({
								title: (this.orderLogisticsId ? '编辑' : this.gategorys[this.gategoryNum]) + '成功',
								type: 'primary'
							});
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1000);
						} else {
							this.$refs.uTips.show({
								title: res.data.msg,
								type: 'error'
							});
						}
					});
				} else {
				}
			});
		}
	}
};
</script>

<style lang="less">
.logistics {
	padding: 40rpx;
	.u-btn {
		margin-top: 40rpx;
	}
}
</style>
