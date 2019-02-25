<template>
    <ul class="tab-slide-wrap">
        <li v-for="(item,index) in tabData" :class="['tab-item',slideIndex===index?'active':'']" :key="index">
            <span>{{item}}</span>
        </li>
    </ul>
</template>
<style lang="scss" scoped>
    @import './assets/index.scss';
</style>
<script>
export default{
  name: 'tab-slide',
  props: [
    'tabData'
  ]
}
</script>
