import {
  SET_CURRENT_PAGE,
  SERVER_CONNECT,
  SERVER_DISCONNECT,
  ANDROID_CONNECT,
  ANDROID_DISCONNECT,
  ANDROID_ROOT_ACCESS,
  ANDROID_ROOT_DENY,
  ANDROID_DEVICE_SERIAL,
  ANDROID_DEVICE_MODEL,
  ANDROID_DEVICE_INFO,
  ANDROID_INSECURE_INSTALLED
} from './mutation-types.js'

export default {
  // 设置当前页
  [SET_CURRENT_PAGE] (state, payload) {
    state.currentPage = payload
  },

  // 连接服务器
  [SERVER_CONNECT] (state) {
    state.serverConnected = true
  },

  // 断开服务器
  [SERVER_DISCONNECT] (state) {
    state.serverConnected = false
  },

  // 连接安卓设备
  [ANDROID_CONNECT] (state) {
    state.androidConnected = true
  },

  // 断开安卓设备
  [ANDROID_DISCONNECT] (state) {
    state.androidConnected = false
  },

  // 设置安卓为Root状态
  [ANDROID_ROOT_ACCESS] (state) {
    state.androidRooted = true
  },

  // 设置安卓为未Root状态
  [ANDROID_ROOT_DENY] (state) {
    state.androidRooted = false
  },

  [ANDROID_DEVICE_SERIAL] (state, payload) {
    state.androidLatestSerial = payload
  },

  [ANDROID_DEVICE_MODEL] (state, payload) {
    state.androidLatestModel = payload
  },

  [ANDROID_DEVICE_INFO] (state, payload) {
    state.androidDeviceInfo = payload
  },

  [ANDROID_INSECURE_INSTALLED] (state, payload) {
    state.androidInsecureInstalled = payload
  }
}
