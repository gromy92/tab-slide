<template>
    <div :class="['content-item',`contentItem${index}`]" >
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'tab-panel',
  props: ['lable', 'index'],
  data () {
    return {
    }
  },
  computed: {
    currIndex () {
      return this.$parent.slideIndex
    }
  },
  mounted () {
    console.log(this.$parent.slideIndex)
    this.$parent && this.$parent.tabSlideCreated(this.lable)
  }
}
</script>
<style>
</style>
