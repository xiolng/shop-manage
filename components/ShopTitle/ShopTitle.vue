<template>
	<view class="title-box">
			<view class="title-content">
				<view class="title-txt">店铺</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.title-box{
	width: 100vw;
	height: 100%;
	max-height: 300rpx;
	display: flex;
	.title-content{
		flex-grow: 1;
		height: 100%;
		min-height: 200rpx;
		background-size: 100%;
		background-origin: content-box;
	}
}
</style>
