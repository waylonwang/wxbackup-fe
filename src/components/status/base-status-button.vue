<template>
  <div @click="onClick" class="status-control">
    <el-button size="small" v-popover:popover>
      <i class="el-icon-fa-circle" :class="{ 'status-on': isOn, 'status-off': isOff }"></i>
      {{ title }}
    </el-button>
    <el-popover
      ref="popover"
      placement="bottom-start"
      trigger="hover"
      :width="popWidth"
      :disabled="popDisable"
    >
      <status-pop @server-disconnecting="disconnecting" />
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'BaseStatusButton',
  data() {
    return { popWidth: 'auto' }
  },
  computed: {
    isOn: () => false,
    isOff: () => true,
    title: () => '',
    popDisable: () => false
  },
  methods: {
    disconnecting() {
      console.log('disconnecting')
      // this.killTask('check_device')
    },
    onClick: () => null
  }
}
</script>

<style scoped>
.status-control {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  cursor: pointer;
}

.status-control button {
  border: 0px;
}

.status-on {
  color: limegreen;
  font-size: 8px !important;
}

.status-off {
  color: lightgray;
  font-size: 8px !important;
}
</style>
