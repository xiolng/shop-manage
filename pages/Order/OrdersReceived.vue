<template>
	<view class="orders-received">
		<u-dropdown ref="uDropdown">
			<u-dropdown-item title="点击此处进行搜索/筛选查询">
				<view class="search-box">
					<!-- <view slot="title">
						<u-icon name="search" color="#ff5500" class=""></u-icon>
						<text style="margin-left: 20rpx;">点击此处进行搜索/筛选查询</text>
					</view> -->
					<u-form label-width="160">
						<!-- <u-form-item label="商品名称"><input placeholder="请输入商品名称" v-model="searchData.productName" /></u-form-item>
						<u-form-item label="销量"><input placeholder="请输入销量" v-model="searchData.salesVolume" /></u-form-item> -->
						<u-form-item label="开始时间">
							<picker mode="date" :value="searchData.startTime" @change="e => (searchData.startTime = e.target.value)" style="margin-right: 10rpx;">
								{{ searchData.startTime }}
							</picker>
						</u-form-item>
						<u-form-item label="结束时间">
							<picker mode="date" :value="searchData.endTime" @change="e => (searchData.endTime = e.target.value)" style="margin-right: 10rpx;">{{ searchData.endTime }}</picker>
						</u-form-item>
					</u-form>

					<u-button type="primary" @click="getStatist">搜索</u-button>
				</view>
			</u-dropdown-item>
		</u-dropdown>

		<!-- 图表-日期选择-结束 -->
		<view class="qiun-columns">
			<view class="qiun-charts">
				<qiun-data-charts
					v-if="chartData.series.length"
					type="pie"
					canvasId="receivedCanvas"
					:chartData="chartData"
					@getIndex="getIndex"
					:echartsH5="true"
					:echartsApp="true"
					:canvas2d="true"
					:inScrollView="true"
				/>
				<u-empty v-else />
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchData: {
				productName: '',
				salesVolume: 0,
				startTime: this.$u.timeFormat(new Date(new Date() - 7 * 24 * 3600 * 1000).valueOf(), 'yyyy-mm-dd'),
				endTime: this.$u.timeFormat(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).valueOf(), 'yyyy-mm-dd')
			},
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
				},
			},
			//模拟的后端返回数据，实际应用自行拼接
			chartData: {
				categories: [],
				series: [
					{
						name: '',
						data: []
					}
				]
			}
		};
	},
	onShareAppMessage() {
		//#ifdef MP-QQ
		qq.showShareMenu({ showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'] });
		//#endif
	},
	created() {
		this.getStatist();
	},
	mounted() {},
	methods: {
		setSales() {
			this.$refs.uDropdown.close();
			this.getStatist();
		},
		setProductName(val) {
			this.searchData.productName = val;
			this.$refs.uDropdown.close();
			this.getStatist();
		},
		changeCalendar(val) {
			this.searchData.startTime = val.startDate;
			this.searchData.endTime = val.endDate;
			this.$refs.uDropdown.close();
			this.getStatist();
		},
		//获取点击图表索引
		getIndex(e) {
			console.log(e);
			//TODO something
			console.log(e.charts.opts);
			//获取到索引后，可以获取该索引相关一系列数据，其中e.charts.opts中可获取相关
			console.log(e.charts.opts.categories[e.currentIndex], e.charts.opts.series[0].data[e.currentIndex]);
		},
		getStatist() {
			this.$u.api.statisticsProduct(this.searchData).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.chartData.categories = data.map(v => v.productName);
					this.chartData.series = data.map(v => {
						return {
							data: v.salesVolume || 1,
							name: v.productName + '（个）'
						};
					});
					this.$refs.uDropdown.close();
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
			if (isJSON(_self.textarea)) {
				let newdata = JSON.parse(_self.textarea);
				canvaLineA.updateData({
					series: newdata.series,
					categories: newdata.categories
				});
			} else {
				uni.showToast({
					title: '数据格式错误',
					image: '../../../static/images/alert-warning.png'
				});
			}
		}
	}
};
</script>

<style lang="scss">
.orders-received {
	height: 100%;
	background-color: #fff;
	margin: 20rpx;
	padding: 20rpx;
	box-sizing: border-box;
	.search-box {
		padding: 20rpx;
		background: #fff;
	}
	.down-box {
		min-height: 300rpx;
		padding: 40rpx;
		background-color: #fff;
		position: relative;
		z-index: 999;
		.u-btn {
			padding: 0 40rpx;
		}
	}
	// 图表
	.qiun-columns {
		width: calc(100% - 40rpx);
		position: fixed;
		top: 48rpx;
		left: 20rpx;
		right: 0;
		z-index: 1;
		box-sizing: border-box;
		text-align: center;
		padding-top: 80rpx;
		.qiun-charts {
			width: 100%;
			height: 500rpx;
			position: relative;
		}
	}
}
</style>
