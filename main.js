import Vue from 'vue'
import App from './App'

import ShopTitle from '@/components/ShopTitle/ShopTitle'

import uView from 'uview-ui';

import httpInterceprot from '@/Api/http.interceptor.js'
import httpApi from '@/Api/http.api.js'
const updateManager = uni.getUpdateManager();

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate);
});

updateManager.onUpdateReady(function (res) {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
      }
    }
  });

});

updateManager.onUpdateFailed(function (res) {
  // 新的版本下载失败
});


Vue.component('shop-title', ShopTitle)
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})

Vue.use(httpInterceprot, app)
Vue.use(httpApi, app)
app.$mount()
