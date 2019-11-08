<template>
  <el-row :gutter="20" class="row-item">
    <el-col :span="10">
      <font-awesome-layers fixed-width>
        <font-awesome-icon
          icon="database"
          fixed-width
          transform="left-1 up-1"
          :color="status==='queue'?'gainsboro':'#6c757d'"
          v-show="type==='En' || type==='De'"
        />
        <font-awesome-icon icon="images" fixed-width v-show="type==='Re'" />
        <font-awesome-icon
          icon="lock"
          fixed-width
          transform="shrink-2 right-1 down-1"
          color="crimson"
          stroke="white"
          stroke-width="3rem"
          v-show="type==='En'"
        />
        <font-awesome-icon
          icon="lock-open"
          fixed-width
          transform="shrink-2 right-5 down-3"
          color="limegreen"
          stroke="white"
          stroke-width="3rem"
          v-show="type==='De'"
        />
        <font-awesome-icon
          icon="unlock"
          fixed-width
          transform="shrink-2 right-3 down-3"
          color="gainsboro"
          stroke="white"
          stroke-width="3rem"
          v-show="(type==='En' || type==='De') && status==='queue'"
        />
        <!-- <fa-icon :icon="['fa','database']" class="fa-stack-1x"></fa-icon>
        <fa-icon :icon="['fa','lock']" class="fa-stack-1x"></fa-icon>-->
        <!-- <i class="fa fw fa-images fa-stack-1x" style="display: none"></i>
        <i class="fa fw fa-lock fa-stack-1x" style="display: none"></i>
        <i class="fa fw fa-lock-open fa-stack-1x" style="display: none"></i>
        <i class="fa fw fa-unlock fa-stack-1x" style="display: none"></i>-->
      </font-awesome-layers>
      <span>{{name}}</span>
    </el-col>
    <el-col :span="8" class="item-size">
      <span>{{size}}</span>
    </el-col>
    <el-col :span="6" class="item-action">
      <el-button type="text" size="mini">
        <font-awesome-icon icon="trash" fixed-width />
      </el-button>
    </el-col>
  </el-row>
</template>>
<script>
export default {
  props: ['type', 'name', 'size', 'action', 'status']
}
</script>>

<style scoped>
.row-item {
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;
  width: fill-available;
  color: #6c757d;
  padding-left: 20px;
}
.item-size,
.item-action {
  text-align: right;
}

.fa-layers svg.svg-inline--fa[data-icon='database'] {
  left: -0.2rem;
  top: 0.1rem;
}

.fa-images {
  left: -0.1rem;
  top: 0.2rem;
}

.fa-layers svg.svg-inline--fa[data-icon='lock'] {
  left: 0.1rem;
  top: 0.3rem;
}

.fa-lock-open {
  left: 0.2rem;
  top: 0.3rem;
}

/* .fa-layers svg.svg-inline--fa[data-icon='lock'] { */
.stroke {
  color: crimson;
  stroke: white;
  stroke-width: 3rem;
}

.fa-layers svg.svg-inline--fa[data-icon='lock-open'] {
  color: limegreen;
  stroke: white;
  stroke-width: 3rem;
}

svg[data-icon='trash'] {
  color: gray;
}

svg[data-icon='trash']:hover {
  color: crimson;
}
</style>
