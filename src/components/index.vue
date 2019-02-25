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
                <div :class="['panel-wrap',`list${index}`]" >
                    <status-block :order="item" v-for="(item,i) in panel.data" :key="i"></status-block>
                    <no-data v-if="!panel.data || panel.data.length==0"></no-data>
                    <div class="load-finish f13g2" v-if="panel.data && panel.data.length!=0 && panel.loadFinish">没有数据了</div>
                </div>
            </tab-panel>
        </tab-slide>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import TabSlide from '@/gene/components/tabSlide/tab-slide.vue'
import tabPanel from '@/gene/components/tabSlide/tab-panel.vue'
import StatusBlock from './components/statusBlock/index.vue'
import NoData from './components/noData/index.vue'
import dmView from 'dmview/index'
// import { orderListData } from '@/gene/api/moduData.js';
export default {
  components: {
    TabSlide,
    tabPanel,
    StatusBlock,
    NoData
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

    scrollTop () {
      return $(document).scrollTop()
    }
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
      $('.content-item').css('height', 0)
      $('.contentItem' + index).css('height', 'auto')
      this.pos = index
      this.pageNo = 1
      this.tabData[this.pos].loadFinish = false
      this.tabData[index].data = []
      this.queryOrder()
    },
    initScroll () {
      //  for (let i = 0; i <  this.tabData.length; i++) {
      let element = this.$refs.scroll
      this.scrollElement = new BScroll(element, {
        click: true,
        scrollY: true,
        pullUpLoad: true,
        disableTouch: false,
        useTransform: true
      })
      console.log(this.scrollElement)
      //  }
    },
    windowScroll () {
      let self = this
      self.scrollLoading()
      $(this.$refs.scroll[this.pos].$el).on('scroll', function (e) {
        console.log('window')
        self.scrollLoading()
      })
      $(this.$refs.scroll[this.pos].$el).on('touchmove', function (e) {
        self.scrollLoading()
      })
    },
    scrollLoading () {
      let scrollTop = $(document).scrollTop()
      let scrollHeight = $(this.$refs.scroll[this.pos].$el).height()
      let windowHeight = screen.height
      console.log(scrollHeight)
      console.log(scrollTop)
      if (scrollHeight < windowHeight) {
        $('.content-slide-wrap').css('height', screen.height - 40)
      } else {
        $('.content-slide-wrap').css('height', $(this.$refs.scroll[this.pos].$el).height())
      }
      if (scrollTop + windowHeight - $('.tab-wrap').height() >= scrollHeight && scrollTop > 0) {
        if (this.scroll) {
          return
        }
        this.pageNo += 1
        this.queryOrder()
      }
    },
    queryOrder () {
      console.log('------queryOrder---scroll---' + this.scroll)
      if (this.tabData[this.pos].loadFinish) {
        return
      }
      this.scroll = true
      this.queryOrderList({ orderStatus: this.tabData[this.pos].status, pageNo: this.pageNo, pageSize: this.pageSize }).then(
        succ => {
          if (succ.body && succ.body.length > 0) {
            this.tabData[this.pos].data = [...this.tabData[this.pos].data, ...succ.body]
            //   this.tabData[this.pos].data = orderListData.body;
            this.scroll = false
            if (this.pageNo === 1) {
              this.windowScroll()
              this.scroll = false
            }
          }
          if (this.pageNo !== 1 && (!succ.body || succ.body.length < this.pageSize)) {
            this.tabData[this.pos].loadFinish = true
            dmView.toast('已全部加载')
          }
        },
        fail => {
          this.scroll = false
        })
    }
  }

}
</script>
