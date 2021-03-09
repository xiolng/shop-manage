<template>
	<view class="orders-received">
		<view class="qiun-columns">
				<uCharts
					class="qiun-charts"
					type="column"
					canvasId="receivedCanvas"
					:opts="opts"
					:chartData="chartData"
					@getIndex="getIndex"
					@complete="complete"
					@scrollLeft="scrollLeft"
					@scrollRight="scrollRight"
					canvas2
				/>
		</view>
		<u-collapse>
			<u-collapse-item ref="searchRef">
				<view slot="title">
					<u-icon name="search" color="#ff5500" class=""></u-icon>
					<text style="margin-left: 20rpx;">点击此处进行搜索/筛选查询</text>
				</view>
				<u-form label-width="160">
					<u-form-item label="商品名称"><input placeholder="请输入商品名称" v-model="searchData.productName"></input></u-form-item>
					<u-form-item label="销量"><input placeholder="请输入销量" v-model="searchData.salesVolume"></input></u-form-item>
					<u-form-item label="开始时间">
					<picker mode="date" :value="searchData.startTime" @change="e => (searchData.startTime = e.target.value)" style="margin-right: 10rpx;">{{ searchData.startTime }}</picker></u-form-item>
					<u-form-item label="结束时间"><picker mode="date" :value="searchData.endTime" @change="e => (searchData.endTime = e.target.value)" style="margin-right: 10rpx;">{{ searchData.endTime }}</picker></u-form-item></u-form-item>
				</u-form>
				
				<u-button type="primary" @click="$refs.searchRef.headClick()">搜索</u-button>
			</u-collapse-item>
		</u-collapse>

		<!-- 图表-日期选择-结束 -->

	</view>
</template>

<script>
import uCharts from '../../components/u-charts/u-charts.vue';
export default {
	components: {
		uCharts
	},
	data() {
		return {
			searchData: {
				productName: '',
				salesVolume: 0,
			startTime: this.$u.timeFormat(new Date(new Date() - 7 * 24 * 3600 * 1000).valueOf(), 'yyyy-mm-dd'),
			endTime: this.$u.timeFormat(new Date().valueOf(), 'yyyy-mm-dd')
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
				}
			},
			//模拟的后端返回数据，实际应用自行拼接
			chartData: {
				categories: ['2020-12-10', '2020-12-11', '2020-12-12', '2020-12-13', '2020-12-14', '2020-12-15', '2020-12-16', '2020-12-17', '2020-12-18'],
				series: [
					{
						name: '日新增用户量',
						data: [10, 20, 10, 30, 20, 15, 30, 40, 55]
					}
				]
			},
		};
	},
	onShareAppMessage() {
		//#ifdef MP-QQ
		qq.showShareMenu({ showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'] });
		//#endif
	},
	created() {
		//#ifdef MP-ALIPAY
		uni.getSystemInfo({
			success: function(res) {
				if (res.pixelRatio > 1) {
					//正常这里给2就行，如果pixelRatio=3性能会降低一点
					this.pixelRatio = 2;
				}
			}
		});
		//#endif
		this.cWidth = uni.upx2px(750);
		this.cHeight = uni.upx2px(500);
		this.getStatist();
		console.log('mounted', 44444);
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
		complete(e) {
			console.log(e);
			//移除监听事件，避免其他动作时触发该事件
			e.charts.delEventListener('renderComplete');
			//TODO something
			//下面展示了渲染完成后显示自定义tooltip
			//{mp:{changedTouches:[{x: 0, y: 80}]}}其中x值无需指定，y值为tooltip显示的上边距的值
			let cindex = 3; //默认显示的索引位置
			let textList = [
				{ text: '默认显示的tooltip', color: null },
				{ text: '类别1：某个值xxx', color: '#2fc25b' },
				{ text: '类别2：某个值xxx', color: '#facc14' },
				{ text: '类别3：某个值xxx', color: '#f04864' }
			];
			e.charts.showToolTip(
				{ mp: { changedTouches: [{ x: 0, y: 80 }] } },
				{
					index: cindex,
					textList: textList
				}
			);
		},
		//开启滚动条后，滚动条到最左侧触发的事件，用于动态打点
		scrollLeft(e) {
			console.log(e);
		},
		//开启滚动条后，滚动条到最右侧触发的事件，用于动态打点
		scrollRight(e) {
			console.log(e);
		},
		getStatist() {
			this.$u.api.statisticsProduct(this.searchData).then(res => {
				console.log(res);
			});

			const vm = this;
			uni.request({
				url: 'https://www.ucharts.cn/data.json',
				data: {},
				success: function(res) {
					let Column = {
						categories: [],
						series: []
					};
					Column.categories = res.data.data.ColumnB.categories;
					Column.series = res.data.data.ColumnB.series.splice(0, 1);

					vm.chartData = Column;
				},
				fail: () => {
					// _self.tips = '网络错误，小程序端请检查合法域名';
				}
			});
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
		width: 100%;
		display: flex;
		position: relative;
		overflow: hidden;
		z-index: 1;
		.qiun-charts {
			width: 100%;
			display: flex;
			height: 600rpx;
		}
	}
}
</style>
