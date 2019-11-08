<template>
  <div>
    <el-button
      type="danger"
      size="mini"
      @click="disconnect"
      :disabled="!serverConnected"
      >Disconnect</el-button
    >
    <el-button
      type="success"
      size="mini"
      @click="reconnect"
      :disabled="serverConnected"
      >Reconnect</el-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['serverConnected'])
  },
  methods: {
    /**
     * 关闭连接
     */
    disconnect () {
      this.$socket.disconnect()
    },
    /**
     * 重新连接
     */
    reconnect () {
      this.$socket.connect()
    }
  }
}
</script>
