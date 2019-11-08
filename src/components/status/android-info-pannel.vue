<template>
  <div>
    <el-table :data="this.$store.state.androidDeviceInfo" :show-header="false">
      <el-table-column property="name" label="属性"></el-table-column>
      <el-table-column property="value" label="属性值"></el-table-column>
    </el-table>
  </div>
</template>
