<template>
  <el-select
    style="display: block"
    clearable
    :placeholder="placeholderText"
    :class="{ hint_placeholder: isHint }"
    :value="selected"
    @input="dispatch"
  >
    <el-option
      v-for="item in memberList"
      :key="item"
      :label="item"
      :value="item"
      :disabled="disabledList[item]"
    />
  </el-select>
</template>
<script>
export default {
  name: 'HintSelect',
  extends: 'el-select',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['defaultPlaceholder', 'hintPlaceholder', 'value'],
  methods: {
    setMember(member, disabled) {
      this.$debug('HintSelect', member)
      this.memberList = member
      this.disabledList = disabled
      if (this.memberList.length === 0) {
        this.dispatch('')
        this.placeholderText = this.defaultPlaceholder
        this.isHint = false
      } else {
        if (this.memberList.length === 1) this.dispatch(member[0])
        this.placeholderText = this.hintPlaceholder
        this.isHint = true
      }
    },
    dispatch(e) {
      this.$emit('change', e)
      this.selected = e
    }
  },
  watch: {
    value(val) {
      this.selected = val
    }
  },
  data() {
    return {
      selected: this.value,
      memberList: [],
      disabledList: {},
      isHint: false,
      placeholderText: this.defaultPlaceholder
    }
  }
}
</script>
<style>
.hint_placeholder input::placeholder {
  color: red;
}
</style>
