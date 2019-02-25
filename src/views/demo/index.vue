<template>
    <div class="order-list" >
        <tab-slide
        :start="0"
        :overFlowScroll="false"
        @changeSlide="changeSlide"
        >
            <tab-panel :lable="panel.text" :index="index" v-for="(panel,index) in tabData" ref="scroll" :key="index">

            </tab-panel>
        </tab-slide>
    </div>
</template>
<script>
import TabSlide from '@/components/tabSlide/tab-slide.vue'
import tabPanel from '@/components/tabSlide/tab-panel.vue'
export default {
  components: {
    TabSlide,
    tabPanel
  },
  data () {
    return {
      tabData: [
        { status: -1, text: '全部', data: [], loadFinish: false },
        { status: 0, text: 'tab1', data: [], loadFinish: false },
        { status: 1, text: 'tab2', data: [], loadFinish: false },
        { status: 2, text: 'tab3', data: [], loadFinish: false }],
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
