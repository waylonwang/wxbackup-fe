<template>
  <el-row :gutter="20" class="row-header">
    <el-col :span="8">
      <font-awesome-icon :icon="['far','clock']" />
      <span>{{time}}</span>
    </el-col>
    <el-col :span="5">
      <font-awesome-icon :icon="['fas','key']" />
      <span>{{password}}</span>
    </el-col>
    <el-col :span="11">
      <font-awesome-icon :icon="['fas','user']" />
      <span>{{user}}</span>
    </el-col>
  </el-row>
</template>>
<script>
export default {
  props: ['time', 'password', 'user']
}
</script>>

<style scoped>
.row-header {
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;
  width: fill-available;
  color: #6c757d;
  padding-left: 10px;
}
</style>
