const install = (Vue, vm) => {
	vm.$u.api = {
		/********************************
		 * 登录
		 *******************************/
		login: data => vm.$u.post(`/auth/signin`, data),
		/********************************
		 * 统计管理
		 ********************************/
		// 销量统计
		statisticsSalesVolume: data => vm.$u.post(`/system/statistics/statisticsSalesVolume`, data),
		/***********************************************
		 * 商品分类管理
		 ***********************************************/
		// 商品分类列表
		pageProductCategory: data => vm.$u.post(`/system/productCategory/pageProductCategory`, data),
		// 商品分类删除
		deleteProductCategory: params => vm.$u.get(`/system/productCategory/deleteProductCategory`, params),
		// 商品分类详情
		getProductCategoryById: params => vm.$u.get(`/system/productCategory/getProductCategoryById`, params),
		// 商品分类所有商品分类
		listProductCategory: params => vm.$u.get(`/system/productCategory/listProductCategory`, params),
		// 商品分类保存
		saveProductCategory: data => vm.$u.post(`/system/productCategory/saveProductCategory`, data),
		// 商品分类更新
		updateProductCategory: data => vm.$u.post(`/system/productCategory/updateProductCategory`, data),
		/*************************************************
		 * 商品管理
		 *************************************************/
		 // 批量上架
		 batchIsPut: data => vm.$u.post(`/system/product/batchIsPut`, data),
		 // 批量下架
		 batchNotPut: data => vm.$u.post(`/system/product/batchNotPut`, data),
		 // 删除商品
		 deleteProduct: data => vm.$u.post(`/system/product/deleteProduct`, data),
		 // 按id查询商品
		 getProductById: data => vm.$u.post(`/system/product/getProductById`, data),
		 // 上架
		 isPut: data => vm.$u.post(`/system/product/isPut`, data),
		 // 下架
		 notPut: data => vm.$u.post(`/system/product/notPut`, data),
		 // 分页查询商品
		 pageProduct: data => vm.$u.post(`/system/product/pageProduct`, data),
		 // 保存商品
		 saveProduct: data => vm.$u.post(`/system/product/saveProduct`, data),
		 // 更改商品
		 updateProduct: data => vm.$u.post(`/system/product/updateProduct`, data),
		/*************************************************
		 * 订单管理
		 *************************************************/
		 // 订单分页列表
		 pageOrder: data => vm.$u.post(`/system/order/pageOrder`, data),
		 // 订单详情
		 getOrderById: params => vm.$u.get(`/system/order/getOrderById`, params),
		 // 订单统计
		 statisticsProduct: data => vm.$u.post(`/system/order/statisticsProduct`, data),
		 // 订单发货
		 sendProduct: params => vm.$u.get(`/system/order/sendProduct`, params),
		/*************************************************
		 * 商铺管理
		 *************************************************/
		 // 获取商铺信息
		 getShop: params => vm.$u.get(`/system/shop/getShop`, params),
		 // 保存商铺信息
		 saveShop: data => vm.$u.get(`/system/shop/saveShop`, data),
		 // 更新商铺信息
		 updateShop: data=> vm.$u.get(`/system/shop/updateShop`, data),
	}
}
export default {
	install
}