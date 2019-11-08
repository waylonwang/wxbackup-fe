<template>
  <div id="app">
    <el-container>
      <el-header>
        <nav-bar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <foot-bar />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import NavBar from '@/components/common/nav-bar'
import FootBar from '@/components/common/foot-bar'
import { Task } from '@/components/server'

export default {
  // test
  name: 'App',
  mixins: [Task],
  components: {
    'nav-bar': NavBar,
    'foot-bar': FootBar
  }
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
[class^='el-icon-fa'],
[class*=' el-icon-fa'] {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome !important;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
