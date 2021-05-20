const install = (Vue, vm) => {
	vm.$u.api = {
		/********************************
		 * 登录
		 *******************************/
		login: data => vm.$u.post(`/auth/signin`, data),
		wxCode: params => vm.$u.get(`/system/login/getOpenId`, params),
		wxLogin: data => vm.$u.post(`/system/login/signin`, data),
		getValidateCode: params => vm.$u.get(`/system/login/getValidateCode`, params),
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
		 deleteProduct: params => vm.$u.get(`/system/product/deleteProduct`, params),
		 // 按id查询商品
		 getProductById: params => vm.$u.get(`/system/product/getProductById`, params),
		 // 上架
		 isPut: params => vm.$u.get(`/system/product/isPut`, params),
		 // 下架
		 notPut: params => vm.$u.get(`/system/product/notPut`, params),
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
		 // 订单取消
		 cancelOrder: params => vm.$u.get(`/system/order/cancelOrder`, params),
		 // 订单统计
		 statisticsProduct: data => vm.$u.post(`/system/order/statisticsProduct`, data),
		 // 订单发货
		 sendProduct: data => vm.$u.post(`/system/order/sendProduct`, data),
		 // 获取订单信息
		 getOrderLogistics: params => vm.$u.get(`/system/order/getOrderLogistics`, params),
		 // 更新订单信息
		 updateOrderLogistics: data => vm.$u.post(`/system/order/updateOrderLogistics`, data),
		 // 核销
		 writeOff: data => vm.$u.post(`/system/order/writeOff`, data),
		 
		/*************************************************
		 * 商铺管理
		 *************************************************/
		 // 获取商铺信息
		 getShop: params => vm.$u.get(`/system/shop/getShop`, params),
		 // 保存商铺信息
		 saveShop: data => vm.$u.post(`/system/shop/saveShop`, data),
		 // 更新商铺信息
		 updateShop: data=> vm.$u.post(`/system/shop/updateShop`, data),
		 // 提交意见反馈
		 saveSystemIdea: data=> vm.$u.post(`/business/systemIdea/saveSystemIdea`, data),
	}
}
export default {
	install
}