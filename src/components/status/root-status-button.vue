<script>
/* Root Status Button */
import { mapState, mapMutations } from 'vuex'
import BaseStatusButton from './base-status-button'
import RootInsecurePannel from './root-insecure-pannel'
import { Task, Command, onTaskResponse } from '@/components/server'

export default {
  name: 'RootStatusButton',
  extends: BaseStatusButton,
  mixins: [Task, Command],
  components: {
    'status-pop': RootInsecurePannel // 弹出时显示Insecure安装面板
  },
  computed: {
    popDisable() {
      return this.isOn || this.$store.state.androidInsecureInstalled
    },
    ...mapState({
      title: state => (state.androidRooted ? 'Rooted' : 'Unroot'),
      isOn: state => state.androidRooted,
      isOff: state => !state.androidRooted
    })
  },
  watch: {
    // 设备Unroot时检查Insecure安装情况
    isOff(val) {
      this.$debug('RootStatusButton')
    }
  },
  methods: {
    ...mapMutations({
      switchOn: 'ANDROID_ROOT_ACCESS',
      switchOff: 'ANDROID_ROOT_DENY'
    }),

    emitEvent() {
      this.$store.state.androidRooted
        ? this.$emit('android-rooted')
        : this.$emit('android-unrooted')
    },

    rootDevice() {
      this.$debug('RootStatusButton')
      this.switchOn()
      this.emitEvent()
    },

    // 设备连接断开时显示隐藏此Button
    unrootDevice() {
      this.$debug('RootStatusButton')
      this.switchOff()
      this.emitEvent()
      this.execCommand({
        name: encodeURI('Check insecure'),
        command: 'check_insecure'
      })
    },

    /**
     * 检查Root连接状态的后置响应
     * @param data 响应数据
     */
    onPostTaskResponseCheckRoot(data) {
      // this.$debug('RootStatusButton', data)
      let hasRooted = data
      if (!hasRooted && this.$store.state.androidRooted) {
        this.unrootDevice()
      } else if (hasRooted && !this.$store.state.androidRooted) {
        this.rootDevice()
      }
    },

    /**
     * 检查Insecure安装的前置响应
     * @param data 响应数据
     */
    onPreCommandResponseCheckInsecure(data) {
      this.$debug('RootStatusButton', data)
      this.$store.commit('ANDROID_INSECURE_INSTALLED', data)
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
      channel: 'android'
    }
  }
}
</script>
