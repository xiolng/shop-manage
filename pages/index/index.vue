<template>
	<view class="content">
		<!-- 管理-按钮 -->
		<view class="tag-box">
			<view class="tag-item" @click="routeAssortman">
				<image class="item-icon" src="../../static/shop/assortman.svg"></image>
				<text>商品分类管理</text>
			</view>
			<view class="tag-item" @click="routeComodity">
				<image class="item-icon" src="../../static/shop/commodityManagement.svg"></image>
				<text>商品管理</text>
			</view>
		</view>
		<!-- 管理-按钮-结束 -->
		<!-- 图表-日期选择 -->
		<view class="chart-date">
			<view class="chart-flex">
				<view class="flex-input u-flex">
					开始日期：
					<picker mode="date" :value="startTime" @change="e => (startTime = e.target.value)" style="margin-right: 10rpx;">{{ startTime }}</picker>
					结束日期：
					<picker mode="date" :value="endTime" @change="e => (endTime = e.target.value)">{{ endTime }}</picker>
				</view>
				<view class="flex-btn"><u-button type="primary" size="medium" @click="getServerData">确定</u-button></view>
			</view>
		</view>
		<!-- 图表-日期选择-结束 -->

		<view class="qiun-columns">
			<uCharts
				class="qiun-charts"
				type="column"
				canvasId="renshu2"
				:opts="opts"
				:chartData="chartData"
				@getIndex="getIndex"
				:canvas2="true"
			/>
		</view>
	</view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.vue';
export default {
	components: {
		uCharts
	},
	data() {
		return {
			arr: [],
			title: '333',
			showCalendar: false,
			scrollTop: 0,
			//覆盖默认配置，开启滚动条
			opts: {
				// enableScroll: true,
				xAxis: {
					itemCount: 4,
					scrollShow: true,
					scrollAlign: 'left'
				}
			},
			//模拟的后端返回数据，实际应用自行拼接
			chartData: {
				categories: [],
				series: [
					{
						name: '销售量(日/元)',
						data: []
					}
				]
			},
			startTime: this.$u.timeFormat(new Date(new Date() - 7 * 24 * 3600 * 1000).valueOf(), 'yyyy-mm-dd'),
			endTime: this.$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd')
		};
	},
	onShareAppMessage() {
		//#ifdef MP-QQ
		qq.showShareMenu({ showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'] });
		//#endif
	},
	onLoad() {
		this.show = true;
		//#ifdef MP-ALIPAY
		uni.getSystemInfo({
			success: function(res) {
				if (res.pixelRatio > 1) {
					//正常这里给2就行，如果pixelRatio=3性能会降低一点
					//_self.pixelRatio =res.pixelRatio;
					this.pixelRatio = 2;
				}
			}
		});
		//#endif
		this.cWidth = uni.upx2px(750);
		this.cHeight = uni.upx2px(500);
		this.getServerData();
	},
	methods: {
		getShopDetail() {
			this.$u.api.getShop().then(res => {
				console.log(res);
				uni.setStorageSync(`shopDetail`, res.data.data);
				uni.setStorageSync('shopGategory', res.data.data.shopGategory)
			});
		},
		routeComodity() {
			this.$u.route({
				url: `/pages/CommodityManagement/CommodityManagement`
			});
		},
		routeAssortman() {
			this.$u.route({
				url: `/pages/Assortman/Assortman`
			});
		},
		changeCalendar(val) {
			this.startTime = val.startDate;
			this.endTime = val.endDate;
		},
		//获取点击图表索引
		getIndex(e) {
			console.log(e);
			//TODO something
			console.log(e.charts.opts);
			//获取到索引后，可以获取该索引相关一系列数据，其中e.charts.opts中可获取相关
			console.log(e.charts.opts.categories[e.currentIndex], e.charts.opts.series[0].data[e.currentIndex]);
		},
		getServerData() {
			this.$u.api
				.statisticsSalesVolume({
					startTime: this.startTime,
					endTime: this.endTime
				})
				.then(res => {
					if(res.data.code === '200'){
						this.chartData.categories = res.data.data.map(v => v.day)
						this.chartData.series[0].data = res.data.data.map(v => v.salesVolume)
					}
				});
			// const vm = this;
			// uni.request({
			// 	url: 'https://www.ucharts.cn/data.json',
			// 	data: {},
			// 	success: function(res) {
			// 		let Column = {
			// 			categories: [],
			// 			series: []
			// 		};
			// 		Column.categories = res.data.data.ColumnB.categories;
			// 		Column.series = res.data.data.ColumnB.series.splice(0, 1);

			// 		vm.chartData = Column;
			// 	},
			// 	fail: () => {
			// 		// _self.tips = '网络错误，小程序端请检查合法域名';
			// 	}
			// });
		},
		changeData() {
			this.getServerData();
		}
	}
};
</script>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	// 管理按钮
	.tag-box {
		width: 100%;
		padding: 20rpx;
		.tag-item {
			width: 100%;
			padding: 40rpx;
			margin-bottom: 40rpx;
			border: 1px solid #007aff;
			border-radius: 30rpx;
			text-align: center;
			.item-icon {
				width: 100rpx;
				height: 100rpx;
				display: block;
				margin: 0 auto 10rpx;
				img {
					width: 100%;
				}
			}
		}
	}
	// 图表选择日期
	.chart-date {
		width: 100%;
		padding: 0 20rpx;
		.u-btn {
			padding: 0 52rpx;
		}
		.chart-flex {
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.flex-input {
				width: 100%;
				border: 1px solid $u-border-color;
				border-radius: 10rpx;
				padding: 10rpx;
				font-size: 24rpx;
				margin-right: 20rpx;
				line-height: 48rpx;
				picker{
					color: $u-type-primary;
				}
			}
			.flex-btn {
				width: 154rpx;
				display: flex;
				flex-grow: 1;
				flex-shrink: 0;
				justify-items: flex-end;
			}
		}
	}

	// 图表
	.qiun-columns {
		width: 100%;
		display: flex;
		.qiun-charts {
			width: 100%;
			display: flex;
			height: 600rpx;
		}
	}
}
</style>
