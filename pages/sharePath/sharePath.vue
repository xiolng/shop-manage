<template>
	<view>
		<u-modal 
		v-model='showTop' 
		title='跳转小程序'
		content="即将跳转至商城小程序"
		@confirm="goShop"
		>
			
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showTop: true,
				shareData: {
					appId: 'wxf7b4524b1a2b008c',
					path: `/pages/shareWd/shareWd?id=''`
				}
			}
		},
		onLoad(option) {
			console.log('option', option)
			this.shareData = {
				appId: 'wxf7b4524b1a2b008c',
				path: `/pages/shareWd/shareWd?id=${option.id}`
			}
		},
		methods: {
			goShop(){
				uni.navigateToMiniProgram(this.shareData)
			}
		}
	}
</script>

<style>

</style>
