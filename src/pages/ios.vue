<template>
  <div>
    <h1>iOS Assistant</h1>
    <server-status-button id="s1"></server-status-button>
  </div>
</template>

<script>
import ServerStatusButton from '@/components/status/server-status-button'
import { Task } from '@/components/server'

export default {
  name: 'iOS',
  mixins: [Task],
  components: {
    'server-status-button': ServerStatusButton
  }
}
</script>

<style scoped>
h1 {
  margin: 0px 15px;
}
</style>
