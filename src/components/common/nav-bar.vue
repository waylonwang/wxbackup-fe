<template>
  <el-menu
    id="navbar"
    :default-active="$route.path"
    router
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item v-for="menu in menus" :index="menu.url" :key="menu.url">{{
      menu.name
    }}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      menus: [
        {
          url: '/',
          name: 'Home'
        },
        {
          url: '/android',
          name: 'Android'
        },
        {
          url: '/ios',
          name: 'iOS'
        },
        {
          url: '/mac',
          name: 'Mac'
        },
        {
          url: '/history',
          name: 'History'
        }
      ]
    }
  },
  methods: {
    handleSelect () {
      console.log('select handleSelect')
    }
  }
}
</script>

<style scoped></style>
