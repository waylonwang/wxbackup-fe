import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  currentPage: null, // 当前页
  serverConnected: false, // 服务端连接状态
  androidConnected: false, // 安卓设备连接状态
  androidRooted: false, // 安卓Root状态
  androidLatestSerial: '', // 安卓最后的序列号
  androidLatestModel: '', // 安卓最后的型号
  androidDeviceInfo: null, // 安卓设备信息
  androidInsecureInstalled: false // 安卓是否安装了Insecure
  // androidIMEI: null, // 安卓IMEI
  // androidUIN: null, // 安卓UIN
  // androidPassword: null, //安卓密码
  // androidUser: null, // 安卓用户
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
