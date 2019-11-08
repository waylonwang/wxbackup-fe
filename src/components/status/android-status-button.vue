<script>
/* Android Status Button */
import { mapState, mapMutations } from 'vuex'
import BaseStatusButton from './base-status-button'
import AndroidInfoPannel from './android-info-pannel'
import { Task, Command, onTaskResponse } from '@/components/server'

// 设备信息属性
const DEVICE_INFOS = [
  ['ro.product.manufacturer', 'ro.product.model', 'net.hostname'],
  ['Manufacturer', 'Model', 'Host Name']
]

export default {
  name: 'AndroidStatusButton',
  extends: BaseStatusButton,
  mixins: [Task, Command],
  components: {
    'status-pop': AndroidInfoPannel // 弹出时显示设备信息面板
  },
  computed: {
    latestSerial() {
      return this.$store.state.androidLatestSerial
    },
    title() {
      if (this.$store.state.androidConnected) {
        let model = this.$store.state.androidLatestModel
        if (model !== undefined && model !== null && model !== '') {
          return model + ' is connected'
        } else {
          return 'Device is connected'
        }
      } else {
        return 'Device not connected'
      }
    },
    popDisable() {
      return this.isOff
    },
    ...mapState({
      isOn: state => state.androidConnected,
      isOff: state => !state.androidConnected,
      latestSerial: state => state.androidLatestSerial
    })
  },
  watch: {
    latestSerial(val) {
      // Serial变化时更新设备信息
      this.execCommand({
        name: encodeURI('Get device properties'),
        command: 'get_device_properties'
      })
    }
  },
  methods: {
    ...mapMutations({
      switchOn: 'ANDROID_CONNECT',
      switchOff: 'ANDROID_DISCONNECT'
    }),
    emitEvent() {
      this.$store.state.androidConnected
        ? this.$emit('android-connected')
        : this.$emit('android-disconnected')
    },
    connectDevice() {
      this.$debug('AndroidStatusButton')
      this.switchOn()
      this.emitEvent()
    },
    disconnectDevice() {
      this.$debug('AndroidStatusButton')
      this.switchOff()
      this.emitEvent()
    },
    /**
     * 检查设备连接状态的前置响应
     * @param data 响应数据
     */
    onPreTaskResponseCheckDevice(data) {
      let deviceSerial = data
      if (deviceSerial !== '' && this.latestSerial !== deviceSerial) {
        this.$store.commit('ANDROID_DEVICE_SERIAL', deviceSerial)
      }
    },

    /**
     * 检查设备连接状态的后置响应
     * @param data 响应数据
     */
    onPostTaskResponseCheckDevice(data) {
      // this.$debug('AndroidStatusButton', data)
      let deviceSerial = data
      if (deviceSerial === '' && this.$store.state.androidConnected) {
        this.disconnectDevice()
      } else if (deviceSerial !== '' && !this.$store.state.androidConnected) {
        this.connectDevice()
      }
    },

    /**
     * 获取设备信息的前置响应
     * @param data 响应数据
     */
    onPreCommandResponseGetDeviceProperties(data) {
      this.$debug('AndroidStatusButton', data)
      let infos = []
      // 提取设备信息属性
      for (let key in DEVICE_INFOS[0]) {
        infos.push({
          name: DEVICE_INFOS[1][key],
          value: data[DEVICE_INFOS[0][key]]
        })
      }
      // 补充Serial
      infos.push({
        name: 'Serial Number',
        value: this.$store.state.androidLatestSerial
      })
      this.$store.commit('ANDROID_DEVICE_MODEL', data['ro.product.model'])
      this.$store.commit('ANDROID_DEVICE_INFO', infos)
    }
  },
  sockets: {
    taskResponse(data) {
      // 任务响应绑定本页方法
      onTaskResponse(this, data)
    }
  },
  data() {
    return {
      channel: 'android',
      popWidth: 300
    }
  }
}
</script>
