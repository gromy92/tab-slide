# tab

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

demo
html:

        <tab-slide
        :start="0"
        :overFlowScroll="false"
        :tabWidth="70"
        @changeSlide="changeSlide"
         >
            <tab-panel :lable="panel.text" :index="index" v-for="(panel,index) in tabData" ref="scroll" :key="index">

            </tab-panel>
        </tab-slide>

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
}
</script>
