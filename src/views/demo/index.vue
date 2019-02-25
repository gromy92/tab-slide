<template>
    <div class="order-list" >
        <tab-slide
        :start="0"
        :overFlowScroll="false"
        :tabWidth="70"
        @changeSlide="changeSlide"
         v-loading.fullscreen="loading" loading-text="加载中..." loading-spinner="data-loading"
        >
            <tab-panel :lable="panel.text" :index="index" v-for="(panel,index) in tabData" ref="scroll" :key="index">

            </tab-panel>
        </tab-slide>
    </div>
</template>
<script>
import TabSlide from '@/components/tabSlide/tab-slide.vue'
import tabPanel from '@/components/tabSlide/tab-panel.vue'
// import { orderListData } from '@/gene/api/moduData.js';
export default {
  components: {
    TabSlide,
    tabPanel
  },
  data () {
    return {
      tabData: [
        { status: -1, text: '全部', data: [], loadFinish: false },
        { status: 0, text: '待支付', data: [], loadFinish: false },
        { status: 1, text: '待检测', data: [], loadFinish: false },
        { status: 2, text: '查报告', data: [], loadFinish: false }],
      start: 0,
      pageNo: 1,
      pageSize: 20,
      pos: 0,
      scroll: false

    }
  },
  computed: {

  },
  watch: {
    scrollTop () {
      console.log(this.scrollTop)
      this.scrollLoading()
    }
  },
  mounted () {
    this.changeSlide(this.start)
  },
  methods: {
    changeSlide (index) {

    },
    initScroll () {
    },
    windowScroll () {
      let self = this
      self.scrollLoading()
    },
    scrollLoading () {

    }
  }

}
</script>
