<script>
/* Server Status Button */
import { mapState, mapMutations } from 'vuex'
import BaseStatusButton from './base-status-button'
import ServerConnectPannel from './server-connect-pannel'
import { Task } from '@/components/server'

export default {
  name: 'ServerStatusButton',
  extends: BaseStatusButton,
  mixins: [Task],
  components: {
    'status-pop': ServerConnectPannel // 弹出时显示连接控制面板
  },
  computed: {
    ...mapState({
      title: state =>
        state.serverConnected ? 'Server is connected' : 'Server not connected',
      isOn: state => state.serverConnected,
      isOff: state => !state.serverConnected
    })
  },
  methods: {
    ...mapMutations({
      switchOn: 'SERVER_CONNECT',
      switchOff: 'SERVER_DISCONNECT'
    }),
    emitEvent() {
      if (this.$store.state.serverConnected) {
        this.$emit('server-connected')
      } else {
        this.$emit('server-disconnected')
      }
    }
  },
  sockets: {
    connect() {
      // 重新连接时执行
      this.switchOn()
      this.emitEvent()
    },
    disconnecting() {
      this.$debug('ServerStatusButton')
    },
    disconnect() {
      // 断开连接时执行
      this.switchOff()
      this.emitEvent()
    }
  },
  created() {
    this.$debug('ServerStatusButton')
  },
  mounted() {
    this.$debug('ServerStatusButton')
    this.emitEvent()
  }
}
</script>
