<template>
  <div>
    <el-button size="mini" @click="installInsecure">Install adbd Insecure to device</el-button>
  </div>
</template>

<script>
import { Command } from '@/components/server'

export default {
  mixins: [Command],
  methods: {
    /**
     * 安装Insecure
     */
    installInsecure() {
      this.execCommand({
        name: encodeURI('Install insecure'),
        command: 'install_insecure'
      })
    },

    /**
     * 安装Insecure的前置响应
     * @param data 响应数据
     */
    onPreCommandResponseInstallInsecure(data) {}
  },
  data() {
    return {
      channel: 'android'
    }
  }
}
</script>
