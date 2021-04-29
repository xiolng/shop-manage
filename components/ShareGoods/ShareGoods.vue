<template>
	<view class="content">
		<!-- 图片展示由自己实现 -->
		<QSPopup ref="popup" @cancel="$emit('cancel')">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px"><image :src="posterImage || ''" mode="widthFix" class="posterImage"></image></view>
				<view class="flex_row marginTop2vh"><u-button type="primary" size="mini" @click="saveImage()">保存图片</u-button></view>
			</view>
		</QSPopup>
		<!-- 画布 -->
		<view class="hideCanvasView">
			<canvas
				class="hideCanvas"
				id="default_PosterCanvasId"
				canvas-id="default_PosterCanvasId"
				:style="{ width: (poster.width || 10) + 'px', height: (poster.height || 10) + 'px' }"
			></canvas>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import _app from '../../utils/QS-SharePoster/app.js';
import { getSharePoster } from '../../utils/QS-SharePoster/QS-SharePoster.js';
import QSPopup from '../QS-popup/QS-popup.vue';
export default {
	components: {
		QSPopup
	},
	props: {
		goodsDetail: {
			default: {}
		}
	},
	data() {
		return {
			poster: {},
			posterImage: '',
			canvasId: 'default_PosterCanvasId',
			count: 0
		};
	},
	mounted() {
		setTimeout(() => {
			this.shareFc();
		}, 1000);
	},
	methods: {
		async shareFc() {
			let _this = this;
			try {
				this.count++;
				_app.log('准备生成:' + new Date());
				const d = await getSharePoster({
					_this: _this, //若在组件中使用 必传
					canvasType: '2d',
					type: 'testShareType',
					formData: {
						//访问接口获取背景图携带自定义数据
					},
					posterCanvasId: _this.canvasId, //canvasId
					delayTimeScale: 20, //延时系数
					background: {
						height: 1000,
						width: 1000,
						backgroundColor:"#fff"
					},
					setCanvasWH({ bgObj }) {
						_this.poster = bgObj;
					},
					drawArray({ bgObj, type, bgScale, setBgObj, getBgObj }) {
						return [
							{
								type: 'image',
								id: 'productImage',
								url: BASE_URL + '/files/' + _this.goodsDetail.productCover,
								dx: 0,
								dy: 0,
								serialNum: 0,
								infoCallBack(imageInfo) {
									let width;
									let height;
									if (imageInfo.width > imageInfo.height) {
										width = imageInfo.width > 700 ? 700 : imageInfo.width;
										height = (width / imageInfo.width) * imageInfo.height;
									} else {
										height = imageInfo.height > 700 ? 700 : imageInfo.height;
										width = (height / imageInfo.height) * imageInfo.width;
									}
									if (width < 500) {
										width = 500;
										height = (width / imageInfo.width) * imageInfo.height;
									}
									let addHeight = height * 0.3;
									if (addHeight < 150) addHeight = 150;
									if (addHeight > 250) addHeight = 250;
									setBgObj({
										width,
										height: height + addHeight
									});
									return {
										dWidth: width,
										dHeight: height
									};
								}
							},
							{
								type: 'text',
								id: 'productName',
								text: _this.goodsDetail.productName,
								color: '#000',
								serialNum: 1,
								allInfoCallback({ drawArray }) {
									const productImage = drawArray.find(item => item.id === 'productImage');
									const addHeight = getBgObj().height - productImage.dHeight;
									return {
										size: getBgObj().width * 0.05,
										lineFeed: {
											maxWidth: getBgObj().width * 0.5,
											lineNum: 1
										},
										dx: getBgObj().width * 0.05,
										dy: productImage.dHeight + addHeight * 0.25
									};
								}
							},
							{
								type: 'text',
								text: '￥' + _this.goodsDetail.productPrice,
								color: '#f1505c',
								serialNum: 2,
								allInfoCallback({ drawArray }) {
									const productImage = drawArray.find(item => item.id === 'productImage');
									const addHeight = getBgObj().height - productImage.dHeight;
									return {
										size: getBgObj().width * 0.05,
										lineFeed: {
											maxWidth: getBgObj().width * 0.5,
											lineNum: 1
										},
										dx: getBgObj().width * 0.05,
										dy: productImage.dHeight + addHeight * 0.5
									};
								}
							},
							{
								type: 'text',
								text: _this.goodsDetail.productIntro,
								serialNum: 3,
								id: 'text1',
								allInfoCallback({ drawArray }) {
									const productImage = drawArray.find(item => item.id === 'productImage');
									const addHeight = getBgObj().height - productImage.dHeight;
									return {
										size: getBgObj().width * 0.05,
										lineFeed: {
											maxWidth: getBgObj().width * 0.5,
											lineNum: 1
										},
										dx: getBgObj().width * 0.05,
										dy: productImage.dHeight + addHeight * 0.75
									};
								}
							},
							// {
							// 	type: 'text',
							// 	text: _this.goodsDetail.productIntro,
							// 	serialNum: 4,
							// 	allInfoCallback({ drawArray }) {
							// 		const productImage = drawArray.find(item => item.id === 'productImage');
							// 		const text1 = drawArray.find(item => item.id === 'text1');
							// 		console.log(text1.textLength, 1111111111111111111111111);
							// 		const addHeight = getBgObj().height - productImage.dHeight;
							// 		return {
							// 			size: getBgObj().width * 0.05,
							// 			lineFeed: {
							// 				maxWidth: getBgObj().width * 0.5,
							// 				lineNum: 1
							// 			},
							// 			dx: getBgObj().width * 0.05 + text1.textLength,
							// 			dy: productImage.dHeight + addHeight * 0.75
							// 		};
							// 	}
							// },
							{
								type: 'image',
								id: 'productImage',
								url: BASE_URL + '/files/' + _this.goodsDetail.shareImageUrl,
								dx: 350,
								dy: 480,
								serialNum: 6,
								infoCallBack(imageInfo) {
									return {
										dWidth: 130,
										dHeight: 130
									};
								}
							}
						];
					}
				});
				console.log('ddddd', d)
				_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath);
				this.posterImage = d.poster.tempFilePath;
				this.$refs.popup.show();
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				console.log(JSON.stringify(e));
			}
		},
		saveImage() {
			const _this = this
			uni.saveImageToPhotosAlbum({
				filePath: this.posterImage,
				success(res) {
			console.log(444444)
					_app.showToast('保存成功');
					_this.$emit('cancel');
				},
				fail(err) {
					console.log('err', err)
				}
			});
			// #ifdef H5
			_app.showToast('保存了');
			this.$emit('cancel');
			// #endif
		},
		share() {
			// #ifdef APP-PLUS
			_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
			this.$emit('cancel');
			// #endif

			// #ifndef APP-PLUS
			_app.showToast('分享了');
			this.$emit('cancel');
			// #endif
		},
		hideQr() {
			this.$refs.popup.hide();
			this.$emit('cancel');
		}
	}
};
</script>

<style>
.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

.flex_row_c_c {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.modalView {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	outline: 0;
	transform: scale(1.2);
	perspective: 2500upx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out;
	pointer-events: none;
	backface-visibility: hidden;
	z-index: 999;
}

.modalView.show {
	opacity: 1;
	transform: scale(1);
	pointer-events: auto;
}

.flex_column {
	display: flex;
	flex-direction: column;
}

.backgroundColor-white {
	background-color: white;
}

.border_radius_10px {
	border-radius: 10px;
}

.padding1vh {
	padding: 1vh;
}

.posterImage {
	width: 60vw;
}

.flex_row {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.marginTop2vh {
	margin-top: 2vh;
}
</style>
